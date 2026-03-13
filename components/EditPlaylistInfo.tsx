'use client'

import { getUserSessionInfo } from "@/libs/session"
import { useEffect, useState } from "react"

type EditPlaylistInfoBtnProps = {
    CreatorId: string
    PlaylistId: string
}

export const EditPlaylistInfoBtn = (props: EditPlaylistInfoBtnProps) => {

    const [isEditable, setIsEditable] = useState(false)

    useEffect(() => {

        async function checkUser() {
            const userInfo = await getUserSessionInfo()
            if (!userInfo || userInfo.userId !== props.CreatorId) {
                setIsEditable(false)
            } else {
                setIsEditable(true)
            }
        }

        checkUser()

    }, [])


    return (
        <label tabIndex={0} className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-square btn-ghost m-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg></label>
            {
                isEditable ? (
                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li><a>Edit playlist info</a></li>
                    </ul>
                ) : (
                    <></>
                )
            }
        </label>
    )
}