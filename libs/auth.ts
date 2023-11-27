import type { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const supabaseJWTSecret = "hwfkEIMPtn0gREZUEcV2ZeksWcI/IClvR8TesHgRWkQbnTKTS+VnA0nvczDCjnZDIx5DCJYgxYrzrUy0OrWoSw=="

interface UserJwtPayload {
    jti: string
    iat: number
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
            new TextEncoder().encode(supabaseJWTSecret)
        )
        console.log('verified', verified)
        return verified.payload as UserJwtPayload
    } catch (err) {
        throw new AuthError('Your token has expired.')
    }

}
