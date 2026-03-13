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
            const resp = {
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

    return res
}