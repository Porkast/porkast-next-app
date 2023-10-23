
import { Database } from '@/types/supabase'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type SupabaseJsonResponse = {
    code: number
    message: string
    data: any
}

export type SupabaseSessionInfo = {
    userId: string
    email: string
    token: string
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
    if (session) {
        return {
            userId: session.user.id,
            email: session.user.email as string,
            token: session.access_token,
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
