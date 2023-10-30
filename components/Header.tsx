'use client'

import supabase, { SupabaseSessionInfo, getUserSessionInfo, isUserLoggedIn, userSignout } from "@/libs/suapbase"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type HeaderProps = {
    keyword?: string
    children?: React.ReactNode
}

export default function Header(props: HeaderProps) {

    const router = useRouter()
    const [searchInputVal, setSearchInputVal] = useState('');
    const [inputPlaceholderVal, setSearchPlaceholderVal] = useState('');
    const [headerTitle, setHeaderTitle] = useState('Porkast')
    const [isLogin, setIsLogin] = useState(false);
    const [userInfo, setUserInfo] = useState<SupabaseSessionInfo>();

    const showSearchModal = () => {
        const dialog = document.getElementById('search_modal') as HTMLDialogElement;
        if (dialog) {
            dialog.open = true;
        }
        const searchInput = document.getElementById("search_input") as HTMLInputElement;
        searchInput.focus();
    }

    const onSearchInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInputVal(e.target.value)
    }

    const onSearchButtonClicked = () => {
        const dialog = document.getElementById('search_modal') as HTMLDialogElement;
        if (dialog) {
            dialog.open = false;
        }
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

    const handleLogout = async () => {
        const isLogout = await userSignout()
        if (isLogout) {
            setIsLogin(false)
            router.push('/')
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
        supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                window.location.href = '/signin'
            }
        })
        const checkUserLogin = async () => {
            const isUserLogin = await isUserLoggedIn()
            setIsLogin(isUserLogin)
        }
        checkUserLogin()
    }, [])


    useEffect(() => {
        const getUserInfo = async () => {
            const userInfo = await getUserSessionInfo()
            setUserInfo(userInfo)
        }
        getUserInfo()
    }, [])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
    }, [searchInputVal])

    return (
        <>
            <div className="drawer md:p-9 pt-2 block">
                <input id="header-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col">
                    {/* Navbar */}
                    <div className="fixed top-4 left-4 right-4 z-40">
                        <div className="w-full navbar bg-base-200 rounded-box">
                            <div className="flex-none lg:hidden">
                                <label htmlFor="header-drawer" aria-label="open sidebar" className="btn btn-square btn-ghost">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                                </label>
                            </div>
                            <div className="flex-1 md:px-2 md:mx-2"><Link className="btn btn-xs sm:btn-sm md:btn-md btn-ghost md:text-2xl" href={"/"}>{headerTitle}</Link></div>
                            <div className="flex-none lg:hidden">
                                <button className="btn btn-xs sm:btn-sm md:btn-md btn-active btn-primary mr-4" onClick={showSearchModal}>Search</button>
                            </div>
                            <div className="flex-none hidden lg:block">
                                <ul className="menu menu-horizontal">
                                    {/* Navbar menu content here */}
                                    <li><a className="text-base btn btn-ghost">Trending</a></li>
                                    {
                                        isLogin ? (
                                            <>
                                                <li><Link href={`/listenlater/${userInfo?.userId || ''}`} className="text-base btn btn-ghost">Listen Later</Link></li>
                                                <li><a className="text-base btn btn-ghost">Playlist</a></li>
                                                <li><Link href={`/subscription/${userInfo?.userId || ''}`} className="text-base btn btn-ghost">Subscription</Link></li>
                                            </>
                                        ) : (
                                            <></>
                                        )
                                    }
                                    <li><a className="text-base btn btn-primary mr-2 ml-2" onClick={showSearchModal}>Search</a></li>
                                    {
                                        isLogin ? (
                                            <div className="dropdown dropdown-end">
                                                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                                    <button className="btn btn-square btn-ghost">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
                                                    </button>
                                                </label>
                                                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52">
                                                    {/* <li><a>Settings</a></li> */}
                                                    <li><a className="text-base btn btn-ghost">Sign Out</a></li>
                                                </ul>
                                            </div>
                                        ) : <li><Link className="text-base btn btn-ghost" href={"/signin"}>Sign In</Link></li>
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                    {/* Page content here */}
                    {props.children}
                    {/* Search Modal */}
                    <dialog id="search_modal" className="modal">
                        <div className="modal-box">
                            <div className="flex justify-end w-full">
                                <div className="relative w-full">
                                    <input id="search_input" type="text" placeholder={inputPlaceholderVal} value={searchInputVal} className="w-full px-4 py-2 rounded-lg input input-bordered" onChange={onSearchInputChanged} />
                                    <form id="search_form" method="dialog">
                                        <button id="search_button" type="submit" className="absolute right-0 top-0 mt-2 mr-4" onClick={onSearchButtonClicked}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.873-4.873"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.618 10.382a5.5 5.5 0 11-7.778 0 5.5 5.5 0 017.778 0z"></path></svg>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <form method="dialog" className="modal-backdrop">
                            <button>close</button>
                        </form>
                    </dialog>
                </div>
                <div className="drawer-side z-50">
                    <label htmlFor="header-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu p-4 w-80 min-h-full bg-base-200">
                        {/* Sidebar content here */}
                        <li><a className="text-base font-bold">Trending</a></li>
                        {
                            isLogin ? (
                                <>
                                    <li><Link href={'/listenlater/' + userInfo?.userId} className="text-base font-bold">Listen Later</Link></li>
                                    <li><a className="text-base font-bold">Playlist</a></li>
                                    <li><Link href={`/subscription/${userInfo?.userId || ''}`} className="text-base font-bold">Subscription</Link></li>
                                </>
                            ) : (
                                <></>
                            )
                        }
                        {
                            isLogin ? (
                                <li onClick={handleLogout}><a className="text-base font-bold">Sign Out</a></li>
                            ) : <li><Link className="text-base font-bold" href={"/signin"}>Sign In</Link></li>
                        }
                    </ul>
                </div>
            </div>
        </>
    )
}