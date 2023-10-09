
import { Database } from '@/types/supabase'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient<Database>()


export const isUserLoggedIn = async (): Promise<boolean> => {
    const { data: { session }, } = await supabase.auth.getSession()
    return session ? true : false
}

export const userSignout = async () : Promise<boolean> => {
    const { error } = await supabase.auth.signOut()
    if (error) {
        console.log(error)
        return false
    } else {
        return true
    }
}

export default supabase
