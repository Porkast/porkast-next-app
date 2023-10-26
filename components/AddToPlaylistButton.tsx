'use client'

import { useAppContext } from "./AppContext";
import { addToPlayList } from "@/libs/playlist";
import { MsgAlertType } from "./MsgAlert";
import { useEffect, useState } from "react";
import { getUserSessionInfo } from "@/libs/suapbase";

type AddToPlaylistButtonProps = {
    userId?: string;
    itemId: string;
    channelId: string;
    playlistId: string;
}


export default function AddToPlaylistButton(props: AddToPlaylistButtonProps) {

    const { userId, itemId, channelId, playlistId } = props
    const [currentUserId, setCurrentUserId] = useState('')
    const appContext = useAppContext()

    const onAddToPlaylistBtnClick = async () => {
        const resp = await addToPlayList(userId || '', itemId, channelId, playlistId)
        if (resp.code === 0) {
            appContext.showMsgAlert('Added to playlist', MsgAlertType.SUCCESS)
        } else {
            appContext.showMsgAlert('Failed to add to playlist', MsgAlertType.FAILED)
        }
    }

    useEffect(() => {
        const getUserInfo = async () => {
            const usefInfo = await getUserSessionInfo()
            if (userId) {
                setCurrentUserId(userId)
            } else {
                setCurrentUserId(usefInfo.userId)
            }
        }
        getUserInfo()
    }, [userId, itemId, channelId])

    return (
        <>
            <button className="btn btn-neutral ml-2 btn-sm flex items-center rounded-lg" onClick={onAddToPlaylistBtnClick}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /><path fill="none" d="M0 0h24v24H0z" /></svg>
                <span className="font-bold text-xs md:display">Add</span>
            </button>
        </>
    )
}