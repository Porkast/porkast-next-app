import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_please_change'
export const AUTH_COOKIE_NAME = 'porkast_auth_token'
export const AUTH_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 // 30 days

export interface UserJwtPayload {
    id: string
    email: string
    iat: number
    exp: number
}

export class AuthError extends Error { }

/** Verifies a raw JWT token string and returns its decoded payload. */
export async function verifyJWT(token: string): Promise<UserJwtPayload> {
    const verified = await jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET)
    )
    return verified.payload as unknown as UserJwtPayload
}

/** Verifies JWT from the Authorization header (backward compat for client fetch calls). */
export async function verifyAuth(req: NextRequest): Promise<UserJwtPayload> {
    const token = req.headers.get('Authorization')
    if (!token) throw new AuthError('Missing user token')
    return verifyJWT(token)
}
