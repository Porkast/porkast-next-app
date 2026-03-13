import type { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_please_change'

interface UserJwtPayload {
    id: string
    email: string
    iat: number
    exp: number
}

export class AuthError extends Error { }

/**
 * Verifies the user's JWT token and returns its payload if it's valid.
 */
export async function verifyAuth(req: NextRequest): Promise<UserJwtPayload> {
    const token = req.headers.get('Authorization')

    if (!token) throw new AuthError('Missing user token')
    try {
        const verified = await jwtVerify(
            token,
            new TextEncoder().encode(JWT_SECRET)
        )
        console.log('verified', verified)
        return verified.payload as unknown as UserJwtPayload
    } catch (err) {
        throw new AuthError('Your token has expired.')
    }
}
