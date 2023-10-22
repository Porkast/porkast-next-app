'use client'

import { useEffect, useState } from "react"
import { useAppContext } from "./AppContext"
import { MsgAlertType } from "./MsgAlert"
import { getUserSessionInfo } from "@/libs/suapbase"


type SubscribeSearchKeywordButtonProps = {
    keyword: string
    country?: string
    source?: string
    excludeFeedId?: string
}

export default function SubscribeSearchKeywordButton(props: SubscribeSearchKeywordButtonProps) {

    const [searchKeyword, setSearchKeyword] = useState('')
    const [userId, setUserId] = useState('')
    const appContext = useAppContext()

    useEffect(() => {
        const getUserInfo = async () => {
            const userInfo = await getUserSessionInfo()
            if (userInfo) {
                setUserId(userInfo.userId)
            }
        }
        getUserInfo()
    }, [])

    const subscribeByKeyword = async () => {
        var apiUrl = `${process.env.API_BASE_URL}v1/api/subscription/keyword`
        var params = {
            userId: userId,
            keyword: props.keyword,
            country: props.country,
            source: props.source || 'itunes',
            excludeFeedId: props.excludeFeedId
        }

        const userInfo = await getUserSessionInfo()

        const resp = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userInfo?.token
            },
            body: JSON.stringify(params)
        })

        const respJson = await resp.json()
        console.log(respJson)
        if (respJson.code === 0) {
            appContext.showMsgAlert('Subscribed Success', MsgAlertType.SUCCESS)
        } else {
            appContext.showMsgAlert(respJson.message, MsgAlertType.FAILED)
        }

    }

    const onSubscribeByKeywordBtnClick = () => {
        if (userId == '') {
            appContext.showMsgAlert('Please login first', MsgAlertType.FAILED)
            return
        }
        subscribeByKeyword()
    }

    useEffect(() => {
        setSearchKeyword(props.keyword)

    }, [])

    return (
        <>
            <button className="btn btn-primary rounded-lg ml-4" onClick={onSubscribeByKeywordBtnClick}>
                <span className="font-bold text-base">Subscribe {searchKeyword}</span>
            </button>
        </>
    )
}