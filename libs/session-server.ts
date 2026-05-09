import { cookies } from 'next/headers'
import { verifyJWT, type UserJwtPayload } from './auth'
import type { ServerSession } from './session'

export async function getServerSession(): Promise<ServerSession | null> {
    try {
        const cookieStore = cookies()
        const token = cookieStore.get('porkast_auth_token')?.value
        if (!token) return null
        const payload: UserJwtPayload = await verifyJWT(token)
        return { userId: payload.id, email: payload.email }
    } catch {
        return null
    }
}
