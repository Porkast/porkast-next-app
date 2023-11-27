import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'
import { verifyAuth } from './libs/auth'

const authAPIRoutes = ['/api/subscription/keyword']

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()

    if (authAPIRoutes.includes(req.nextUrl.pathname)) {
        const verifiedToken = await verifyAuth(req).catch((err) => {
            console.error(err.message)
        })
        if (!verifiedToken) {
            return NextResponse.json({
                code: 401,
                message: 'Unauthorized',
                data: null
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