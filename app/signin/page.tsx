'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import supabase, { getUserSessionInfo } from '@/libs/suapbase'
import { useEffect } from 'react'
import { ServerUserInfo, syncToServer } from '@/libs/user'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function AuthForm() {

    useEffect(() => {

        const onAuthChange = async () => {
            supabase.auth.onAuthStateChange(async (event, session) => {
                if (event === 'SIGNED_OUT') {
                    window.location.href = '/signin'
                } else if (event === 'SIGNED_IN') {
                    const userInfo = await getUserSessionInfo()
                    const serverUserInfo: ServerUserInfo = {
                        id: userInfo?.userId,
                        email: userInfo?.email,
                        username: userInfo?.username,
                        avatar: userInfo?.avatar,
                        token: userInfo?.token
                    }
                    syncToServer(serverUserInfo)
                    window.location.href = '/'
                }
            })
        }

        onAuthChange()
    })

    return (
        <>
            <Header hideSearchBtn={true} >
                <div className="w-full flex justify-center min-h-screen mt-20">
                    <div className="w-full max-w-md pt-32 pl-6 pr-6">
                        <Auth
                            supabaseClient={supabase}
                            magicLink={true}
                            appearance={{
                                theme: ThemeSupa,
                                className: {
                                    input: 'text-accent-content',
                                },
                                variables: {
                                    default: {
                                        colors: {
                                            brand: '#404040',
                                            brandAccent: '#52525b'
                                        }
                                    }
                                }
                            }}
                            providers={['google']}
                            redirectTo='/'
                        />
                    </div>
                </div>
            </Header>
            <Footer />
        </>
    )
}