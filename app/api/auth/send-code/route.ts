import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { sendVerificationEmail } from "@/libs/email";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            return NextResponse.json({ code: 1, message: 'Invalid email address', data: null }, { status: 400 });
        }

        // Generate a 6-digit random code
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Calculate expiration time (10 minutes from now)
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        // Delete existing tokens for this email to prevent spam and confusion
        await prisma.verification_token.deleteMany({
            where: { email }
        });

        // Insert new token
        await prisma.verification_token.create({
            data: {
                email,
                token: code,
                expires_at: expiresAt
            }
        });

        // Send email
        await sendVerificationEmail(email, code);

        return NextResponse.json({ code: 0, message: 'Verification code sent', data: null });
    } catch (error: any) {
        console.error('Error sending code:', error);
        return NextResponse.json({ code: 1, message: 'Internal Server Error', data: null }, { status: 500 });
    }
}
