export type SessionInfo = {
    userId: string
    email: string
    token: string
    username?: string
    avatar?: string
}

export const isUserLoggedIn = async (): Promise<boolean> => {
    if (typeof window === 'undefined') return false;
    const cacheUserData = localStorage.getItem('user_session')
    if (cacheUserData) {
        const userInfo = JSON.parse(cacheUserData) as SessionInfo
        // Optional: Check if token is expired based on JWT payload if needed
        return !!userInfo.token
    }
    return false
}

export const userSignout = async (): Promise<boolean> => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('user_session')
        window.location.href = '/signin'
    }
    return true
}

export const updateUserSessionInfo = async () => {
    // This function used to fetch user from supabase and store in local storage.
    // In our new flow, user info is only updated from server and we store it directly during sign in or profile update.
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
