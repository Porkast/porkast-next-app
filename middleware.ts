import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'
import { verifyAuth } from './libs/auth'

const authAPIRoutes = ['/api/subscription/keyword', '/api/user/sync', '/api/listenlater/item/', '/api/playlist/']

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()

    if (authAPIRoutes.includes(req.nextUrl.pathname) && process.env.NODE_ENV == 'production') {
        const verifiedToken = await verifyAuth(req).catch((err) => {
            console.error(err.message)
        })
        if (!verifiedToken) {
            const resp: JsonResponse = {
                code: 1,
                message: 'Unauthorized',
                data: null
            }
            return new Response(JSON.stringify(resp), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        }
    }
    // Create a Supabase client configured to use cookies
    const supabase = createMiddlewareClient({ req, res })

    // Refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
    await supabase.auth.getSession()

    return res
}