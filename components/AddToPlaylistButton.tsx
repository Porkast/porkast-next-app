'use client'

import { addToPlayList } from "@/libs/playlist";
import { MsgAlertRef, MsgAlert } from "./MsgAlert";

type AddToPlaylistButtonProps = {
    userId: string;
    itemId: string;
    channelId: string;
    playlistId: string;
}

import { useRef } from "react";

export default function AddToPlaylistButton(props: AddToPlaylistButtonProps) {

    const { userId, itemId, channelId, playlistId } = props
    const successMsgAlertRef = useRef<MsgAlertRef>(null)

    const onAddToPlaylistBtnClick = async () => {
        const resp = await addToPlayList(userId, itemId, channelId, playlistId)
        if (resp.code === 0) {
            successMsgAlertRef.current?.showAlert('Added to playlist', 'success')
        } else {
            successMsgAlertRef.current?.showAlert('Failed to add to playlist', 'failed')
        }
    }

    return (
        <>
            <button className="btn btn-neutral ml-2 btn-sm flex items-center rounded-lg" onClick={onAddToPlaylistBtnClick}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /><path fill="none" d="M0 0h24v24H0z" /></svg>
                <span className="font-bold text-xs md:display">Add</span>
            </button>
            <MsgAlert ref={successMsgAlertRef} />
        </>
    )
}