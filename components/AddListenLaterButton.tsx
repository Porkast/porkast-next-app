'use client'

import { addToListenLater } from "@/libs/listen_later";
import { useAppContext } from "./AudioPlayerContext";
import { MsgAlertType } from "./MsgAlert";

type AddListenLaterButtonProps = {
    userId: string;
    itemId: string;
    channelId: string;
}

export default function AddListenLaterButton(props: AddListenLaterButtonProps) {

    const { userId, itemId, channelId } = props
    const appContext = useAppContext()

    const onAddListenLaterBtnClick = async () => {
        const resp = await addToListenLater(userId, itemId, channelId)
        if (resp.code === 0) {
            appContext.showMsgAlert('Added to listen later', MsgAlertType.SUCCESS)
        } else {
            appContext.showMsgAlert('Failed to add to listen later', MsgAlertType.FAILED)
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
        </>
    )
}