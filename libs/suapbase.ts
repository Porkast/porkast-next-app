
import { Database } from '@/types/supabase'
import { User, createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type SupabaseJsonResponse = {
    code: number
    message: string
    data: any
}

export type SupabaseSessionInfo = {
    userId: string
    email: string
    token: string
    username?: string
    avatar?: string
}

const supabase = createClientComponentClient<Database>()

export const isUserLoggedIn = async (): Promise<boolean> => {
    const { data: { session }, } = await supabase.auth.getSession()
    return session ? true : false
}

export const userSignout = async (): Promise<boolean> => {
    const { error } = await supabase.auth.signOut()
    if (error) {
        console.log(error)
        return false
    } else {
        return true
    }
}

export const getUserSessionInfo = async (): Promise<SupabaseSessionInfo> => {
    const { data: { session } } = await supabase.auth.getSession()
    let username: string = ''
    let avatar: string = ''
    const cacheSupabaseUserData = localStorage.getItem('supabase_user')
    let supabaseUserData: User
    if (!cacheSupabaseUserData) {
        console.log('no cache supabase user')
        const { data: { user } } = await supabase.auth.getUser()
        supabaseUserData = user as User
        localStorage.setItem('supabase_user', JSON.stringify(supabaseUserData))
    } else {
        console.log('cache supabase user')
        supabaseUserData = JSON.parse(cacheSupabaseUserData)
    }
    if (session?.user.app_metadata.provider === 'google') {
        username = supabaseUserData?.identities?.[0]?.identity_data?.name
        avatar = supabaseUserData?.identities?.[0]?.identity_data?.avatar_url
    }
    if (session) {
        return {
            userId: session.user.id,
            email: session.user.email as string,
            token: session.access_token,
            username: username,
            avatar: avatar
        }
    } else {
        return {
            userId: '',
            email: '',
            token: '',
        }
    }
}

export const sendResetPasswordEmail = async (email: string): Promise<SupabaseJsonResponse> => {
    const resp = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
    })

    if (resp.error) {
        return {
            code: 1,
            message: resp.error.message,
            data: null,
        }
    }

    return {
        code: 0,
        message: 'Email sent',
        data: null,
    }
}

export const updatePassword = async (newPassword: string): Promise<SupabaseJsonResponse> => {
    const response = await supabase.auth.updateUser({
        password: newPassword,
    })

    if (response.error) {
        console.log(response.error)
        return {
            code: 1,
            message: response.error.message,
            data: null,
        }
    } else {
        return {
            code: 0,
            message: 'Password updated successfully',
            data: null,
        }
    }
}

export default supabase
