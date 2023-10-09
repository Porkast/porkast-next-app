'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import supabase from '@/libs/suapbase'
import { useEffect } from 'react'

export default function AuthForm() {

    useEffect(() => {
        supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                window.location.href = '/signin'
            } else if (event === 'SIGNED_IN') {
                window.location.href = '/'
            }
        })
    })

    return (

        <div className="w-full min-h-screen flex justify-center">
            <div data-theme="light" className="w-full max-w-md pt-32 pl-6 pr-6">
                <Auth
                    supabaseClient={supabase}
                    magicLink={true}
                    appearance={{
                        theme: ThemeSupa,
                        className: {
                            input: 'text-accent-content',
                        }
                    }}
                    providers={['google', 'github']}
                    redirectTo='/'
                />
            </div>
        </div>
    )
}