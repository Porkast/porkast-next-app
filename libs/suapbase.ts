
import { Database } from '@/types/supabase'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// const supabaseUrl = 'https://qojpygjnxacuxdrtzdtz.supabase.co'
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClientComponentClient<Database>()


export const isUserLoggedIn = async (): Promise<boolean> => {
    const { data: { session }, } = await supabase.auth.getSession()
    return session ? true : false
}



export default supabase
