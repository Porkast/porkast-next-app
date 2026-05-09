import { verifyJWT, type UserJwtPayload } from './auth'

export type SessionInfo = {
    userId: string
    email: string
    token: string
    username?: string
    avatar?: string
}

export type ServerSession = {
    userId: string
    email: string
}

// ──────────────────────────────────────────────
// Client-side functions (localStorage for UI display, real auth is cookie-based)
// ──────────────────────────────────────────────

export const isUserLoggedIn = async (): Promise<boolean> => {
    if (typeof window === 'undefined') return false;
    const cacheUserData = localStorage.getItem('user_session')
    if (cacheUserData) {
        const userInfo = JSON.parse(cacheUserData) as SessionInfo
        return !!userInfo.userId
    }
    return false
}

export const userSignout = async (): Promise<boolean> => {
    if (typeof window !== 'undefined') {
        await fetch('/api/auth/signout', { method: 'POST' })
        localStorage.removeItem('user_session')
        window.location.href = '/signin'
    }
    return true
}

export const updateUserSessionInfo = async () => {
    console.log('updateUserSessionInfo is now a no-op as session is managed via JWT')
}

export const getUserSessionInfo = async (): Promise<SessionInfo> => {
    if (typeof window !== 'undefined') {
        const cacheUserData = localStorage.getItem('user_session')
        if (cacheUserData) {
            return JSON.parse(cacheUserData) as SessionInfo
        }
    }
    return {
        userId: '',
        email: '',
        token: '',
    }
}
