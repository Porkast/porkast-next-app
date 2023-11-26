'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import supabase from '@/libs/suapbase'
import { useEffect } from 'react'
import { ServerUserInfo, syncToServer } from '@/libs/user'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function AuthForm() {

    useEffect(() => {
        supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                window.location.href = '/signin'
            } else if (event === 'SIGNED_IN') {
                const userInfo = session?.user
                const serverUserInfo: ServerUserInfo = {
                    id: userInfo?.id as string,
                    email: userInfo?.email as string,
                }
                syncToServer(serverUserInfo)
                window.location.href = '/'
            }
        })
    })

    return (
        <>
            <Header hideSearchBtn={true} >
                <div className="w-full flex justify-center min-h-screen mt-20">
                    <div className="w-full max-w-md pt-32 pl-6 pr-6">
                        <Auth
                            theme="dark"
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