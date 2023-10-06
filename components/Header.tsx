'use client'

import { isUserLoggedIn } from "@/libs/suapbase"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type HeaderProps = {
    keyword?: string
}

export default function Header(props: HeaderProps) {

    const router = useRouter()
    const [searchInputVal, setSearchInputVal] = useState('');
    const [inputPlaceholderVal, setSearchPlaceholderVal] = useState('');
    const [isLogin, setIsLogin] = useState(false);
    const onSearchInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInputVal(e.target.value)
    }

    const onSearchButtonClicked = () => {
        if (searchInputVal.length == 0) {
            return
        }
        if (searchInputVal.length == 0 && inputPlaceholderVal != "Search") {
            router.push('/search?q=' + inputPlaceholderVal)
        } else if (searchInputVal.length > 0) {
            router.push('/search?q=' + searchInputVal)
        }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSearchButtonClicked()
        }
    }

    useEffect(() => {
        if (props.keyword && props.keyword.length > 0) {
            setSearchInputVal(props.keyword)
        } else {
            setSearchPlaceholderVal("Search")
        }
    }, [])

    useEffect(() => {
        const checkUserLogin = async () => {
            const isUserLogin = await isUserLoggedIn()
            setIsLogin(isUserLogin)
        }
        checkUserLogin()
    }, [])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
    }, [searchInputVal])

    return (
        <div className="w-full bg-transparent md:p-9 p-2 pt-2">
            <div className="navbar bg-base-100 shadow-xl rounded-box">
                <div className="flex">
                    <div className="dropdown dropdown-bottom">
                        <label tabIndex={0}>
                            <button className="btn btn-square btn-ghost">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                            </button>
                        </label>
                        <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                            <li className="md:hidden"><Link href={"/"}>Porkast</Link></li>
                            <li><a>Listen Later</a></li>
                            <li><a>Playlist</a></li>
                            {
                                isLogin ?
                                    <li><a>Logout</a></li>
                                    :
                                    <li><Link href={"/signin"}>Sign In</Link></li>
                            }
                        </ul>
                    </div>
                    <Link href="/" className="md:btn hidden md:btn-ghost md:normal-case md:text-xl">Porkast</Link>
                </div>
                <div className="flex justify-end w-full">
                    <div className="relative w-10/12 md:w-96">
                        <input type="text" placeholder={inputPlaceholderVal} value={searchInputVal} className="w-full px-4 py-2 rounded-lg input input-bordered" onChange={onSearchInputChanged} />
                        <button type="submit" className="absolute right-0 top-0 mt-2 mr-4" onClick={onSearchButtonClicked}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.873-4.873"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.618 10.382a5.5 5.5 0 11-7.778 0 5.5 5.5 0 017.778 0z"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}