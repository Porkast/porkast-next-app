'use client'

import { addToListenLater } from "@/libs/listen_later";
import { useRef } from "react";
import { MsgAlert, MsgAlertRef } from "./MsgAlert";

type AddListenLaterButtonProps = {
    userId: string;
    itemId: string;
    channelId: string;
}

export default function AddListenLaterButton(props: AddListenLaterButtonProps) {

    const { userId, itemId, channelId } = props
    const successMsgAlertRef = useRef<MsgAlertRef>(null)

    const onAddListenLaterBtnClick = async () => {
        const resp = await addToListenLater(userId, itemId, channelId)
        if (resp.code === 0) {
            successMsgAlertRef.current?.showAlert('Added to Listen Later playlist', 'success')
        } else {
            successMsgAlertRef.current?.showAlert('Failed to add to Listen Later playlist', 'failed')
        }
    }

    return (
        <>
            <button className="btn btn-neutral btn-sm flex items-center rounded-lg" onClick={onAddListenLaterBtnClick}>
                <svg className="w-4 h-4 fill-accent-content" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" />
                    <path fill="currentColor" d="M13 7h-2v6l4.2 2.5.8-1.2-3.5-2.1z" />
                </svg>
                <span className="font-bold text-xs md:display">Listen Later</span>
            </button>
            <MsgAlert ref={successMsgAlertRef} />
        </>
    )
}