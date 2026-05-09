import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJWT, AUTH_COOKIE_NAME } from './libs/auth'

const protectedAPIRoutes = [
    '/api/subscription/keyword',
    '/api/user/sync',
    '/api/listenlater/item/',
    '/api/playlist/',
]

export async function middleware(req: NextRequest) {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value || req.headers.get('Authorization') || undefined
    let userId: string | undefined

    // Verify token and prepare to inject user info
    if (token) {
        try {
            const payload = await verifyJWT(token)
            userId = payload.id
        } catch {
            // Token expired/invalid — ignore silently, protected routes will 401
        }
    }

    // Clone request headers to inject user info for downstream handlers
    const requestHeaders = new Headers(req.headers)
    if (userId) {
        requestHeaders.set('x-user-id', userId)
    }

    // Protected API routes — require valid auth
    if (protectedAPIRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
        if (!userId) {
            return new Response(JSON.stringify({ code: 1, message: 'Unauthorized', data: null }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            })
        }
    }

    const res = NextResponse.next({
        request: { headers: requestHeaders },
    })

    return res
}

export const config = {
    matcher: [
        '/api/subscription/:path*',
        '/api/user/:path*',
        '/api/listenlater/:path*',
        '/api/playlist/:path*',
    ],
}
