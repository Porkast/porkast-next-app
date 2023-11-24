'use client'

import { Ref, forwardRef, useEffect, useState } from "react"
import { useAppContext } from "./AppContext"
import { MsgAlertType } from "./MsgAlert"
import { getUserSessionInfo } from "@/libs/suapbase"
import { subscribeSearchKeyword } from "@/libs/subscription"


type SubscribeSearchKeywordButtonProps = {
    keyword: string
    country?: string
    source?: string
    excludeFeedId?: string
}

export type SubscribeSearchKeywordButtonRef = {
    updateSearchKeyword: (keyword: string) => void
}

const SubscribeSearchKeywordButton = forwardRef((props: SubscribeSearchKeywordButtonProps, ref: Ref<SubscribeSearchKeywordButtonRef>) => {

    const [searchKeyword, setSearchKeyword] = useState('')
    const [userId, setUserId] = useState('')
    const [isLoading, setIsLoading] = useState(false)
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
        if (isLoading) {
            return
        }
        setIsLoading(true)
        const userInfo = await getUserSessionInfo()
        const respJson = await subscribeSearchKeyword(userId, searchKeyword, props.country, props.source, props.excludeFeedId, userInfo?.token).finally(() => {
            setIsLoading(false)
        })
        if (respJson.code === 0) {
            appContext.showMsgAlert('Subscribed Success', MsgAlertType.SUCCESS)
        } else {
            appContext.showMsgAlert(respJson.message, MsgAlertType.FAILED)
        }
        setIsLoading(false)
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

        if (ref) {
            (ref as any).current = {
                updateSearchKeyword: (keyword: string) => {
                    setSearchKeyword(keyword)
                }
            }
        }

    }, [])

    return (
        <>
            <button className="btn btn-primary rounded-lg ml-4" onClick={onSubscribeByKeywordBtnClick}>
                {
                    isLoading ? (
                        <span className="font-bold text-base flex items-center">Subscribe <span className="loading loading-spinner loading-sm ml-4"></span></span>
                    ) : (
                        <span className="font-bold text-base">Subscribe {searchKeyword}</span>
                    )
                }
            </button>
        </>
    )
})

SubscribeSearchKeywordButton.displayName = 'SubscribeSearchKeywordButton';

export default SubscribeSearchKeywordButton;