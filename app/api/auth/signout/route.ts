import { NextResponse } from 'next/server'
import { AUTH_COOKIE_NAME } from '@/libs/auth'

export async function POST() {
    const response = NextResponse.json({ code: 0, message: 'Signed out', data: null })
    response.cookies.delete(AUTH_COOKIE_NAME)
    return response
}
