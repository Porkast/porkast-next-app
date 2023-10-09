
import { Database } from '@/types/supabase'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type SupabaseJsonResponse = {
    code: number
    message: string
    data: any
}

type SupabaseSessionInfo = {
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

export const getUserSessionInfo = async (): Promise<SupabaseSessionInfo | null> => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
        return {
            email: session.user.email as string,
            token: session.access_token,
        }
    } else {
        return null
    }
}

export const sendResetPasswordEmail = async (email: string, redirectLink?: string) => {
    // genrate 6 digit capcha code 
    const generateCaptchaCode = (): string => {
      const captchaCode = Math.floor(100000 + Math.random() * 900000).toString();
      return captchaCode;
    };

    const captchaCode = generateCaptchaCode();
    await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectLink,
        captchaToken: captchaCode
    })
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
