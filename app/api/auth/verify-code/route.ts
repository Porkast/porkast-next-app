import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { SignJWT } from "jose";
import { AUTH_COOKIE_NAME, AUTH_COOKIE_MAX_AGE } from "@/libs/auth";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, code } = body;

        if (!email || !code) {
            return NextResponse.json({ code: 1, message: 'Email and code are required', data: null }, { status: 400 });
        }

        // Verify token
        const verificationToken = await prisma.verification_token.findFirst({
            where: {
                email,
                token: code,
            },
        });

        if (!verificationToken) {
            return NextResponse.json({ code: 1, message: 'Invalid verification code', data: null }, { status: 400 });
        }

        if (verificationToken.expires_at < new Date()) {
            return NextResponse.json({ code: 1, message: 'Verification code expired', data: null }, { status: 400 });
        }

        // Delete used token
        await prisma.verification_token.delete({
            where: { id: verificationToken.id }
        });

        // Find or create user
        let user = await prisma.user_info.findFirst({
            where: { email }
        });

        if (!user) {
            const userId = crypto.randomUUID();
            user = await prisma.user_info.create({
                data: {
                    id: userId,
                    email: email,
                    nickname: email.split('@')[0],
                    reg_date: new Date(),
                    update_date: new Date()
                }
            });
        }

        // Generate JWT token
        const secret = process.env.JWT_SECRET || 'default_secret_please_change';
        const jwt = await new SignJWT({ id: user.id, email: user.email })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('30d') // 30 days validity
            .sign(new TextEncoder().encode(secret));

        const response = NextResponse.json({
            code: 0,
            message: 'Successfully verified',
            data: {
                userId: user.id,
                email: user.email,
                username: user.nickname,
                avatar: user.avatar,
                token: jwt
            }
        });

        // Set httpOnly cookie for server-side auth
        response.cookies.set(AUTH_COOKIE_NAME, jwt, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: AUTH_COOKIE_MAX_AGE,
            path: '/',
        });

        return response;
    } catch (error: any) {
        console.error('Error verifying code:', error);
        return NextResponse.json({ code: 1, message: 'Internal Server Error', data: null }, { status: 500 });
    }
}
