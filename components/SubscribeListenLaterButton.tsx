'use client'

import { useAppContext } from "./AppContext";
import { addToPlayList } from "@/libs/playlist";
import { MsgAlertType } from "./MsgAlert";
import { useEffect, useState } from "react";
import { getUserSessionInfo } from "@/libs/suapbase";
import { subscribeUserListenLater } from "@/libs/subscription";

type SubscribeListenLaterBtnProps = {
    creatorId: string;
}


export default function SubscribeListenLaterBtn(props: SubscribeListenLaterBtnProps) {

    const { creatorId } = props
    const [currentUserId, setCurrentUserId] = useState('')
    const appContext = useAppContext()

    const onSubscribeListenlaterBtnClick = async () => {
        if (creatorId == currentUserId) {
            appContext.showMsgAlert('This is your Listen Later', MsgAlertType.WARN)
            return
        }
        const userInfo = await getUserSessionInfo()
        const resp = await subscribeUserListenLater(currentUserId, creatorId, userInfo?.token)
        if (resp.code === 0) {
            appContext.showMsgAlert('Subscribed Success', MsgAlertType.SUCCESS)
        } else {
            appContext.showMsgAlert('Subscribed Failed : ' + resp.message, MsgAlertType.FAILED)
        }
    }

    useEffect(() => {
        const getUserInfo = async () => {
            const usefInfo = await getUserSessionInfo()
            setCurrentUserId(usefInfo.userId)
        }
        getUserInfo()
    }, [creatorId])

    return (
        <>
            <button className="btn btn-neutral ml-2 btn-sm flex items-center rounded-lg" onClick={onSubscribeListenlaterBtnClick}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /><path fill="none" d="M0 0h24v24H0z" /></svg>
                <span className="font-bold text-xs md:display">Subscribe</span>
            </button>
        </>
    )
}