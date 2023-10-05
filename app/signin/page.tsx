'use client'

import { Auth, MagicLink } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import supabase from '@/libs/suapbase'

export default function AuthForm() {

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

                />
            </div>
        </div>
    )
}