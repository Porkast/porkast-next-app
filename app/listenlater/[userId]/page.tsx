'use client'

import { AppProvider } from "@/components/AppContext"
import EpisodeCard from "@/components/EpisodeCard"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { SharedListenLaterBtn } from "@/components/Share"
import SubscribeListenLaterBtn from "@/components/SubscribeListenLaterButton"
import { convertMillsTimeToDuration } from "@/libs/common"
import { getListenLaterListByUserId } from "@/libs/listen_later"
import { getUserSessionInfo } from "@/libs/suapbase"
import { ServerUserInfo, getTempNickname, getUserInfoFromServer } from "@/libs/user"
import { UserListenLater } from "@/types/feed_item"
import Link from "next/link"
import { useEffect, useState } from "react"


export default function Page({ params, searchParams }: { params: { userId: string }, searchParams: { page: string } }) {

    const userId = params.userId;
    var page = searchParams.page
    if (!page) {
        page = "1"
    }

    const [itemList, setItemList] = useState<UserListenLater[]>([])
    const [totalPage, setTotalPage] = useState(0)
    const [totalCount, setTotalCount] = useState(0)
    const [userInfo, setUserInfo] = useState<ServerUserInfo>()
    const [nickname, setNickname] = useState("")
    const [isMyPage, setIsMyPage] = useState(false)
    const [nextPageUrl, setNextPageUrl] = useState("")
    const [prevPageUrl, setPrevPageUrl] = useState("")
    const [isNextBtnClickable, setIsNextBtnClickable] = useState(true)
    const [isPreBtnClickable, setIsPreBtnClickable] = useState(true)

    useEffect(() => {
        async function initPageInfo() {
            const userInfoResp = await getUserInfoFromServer(userId)
            if (userInfoResp.code != 0) {
                // TODO: show error page
                return
            }
            const userInfoData = userInfoResp.data
            const nicknameStr = getTempNickname(userInfoData)
            setUserInfo(userInfoData)
            setNickname(nicknameStr)

            const resp = await getListenLaterListByUserId(userId, parseInt(page))
            const itemDataList = resp.data
            setItemList(itemDataList)
            if (itemDataList && itemDataList.length > 0) {
                setTotalPage(Math.ceil(itemDataList[0].Count / 10))
                setTotalCount(itemDataList[0].Count)
            } else {
                // TODO: show error page
                return
            }
        }

        initPageInfo()
    }, [])

    useEffect(() => {
        const getUserInfoFromSession = async () => {
            const sessionUser = await getUserSessionInfo()
            if (userId == sessionUser.userId) {
                setIsMyPage(true)
            }
        }

        getUserInfoFromSession()
    }, [userId])


    useEffect(() => {
        let nextPage = 0
        if (parseInt(page) >= totalPage) {
            nextPage = parseInt(page)
        } else {
            nextPage = parseInt(page) + 1
        }
        setNextPageUrl("/listenlater/" + userId + "/" + "?page=" + nextPage)

        let prePage = 0
        if (parseInt(page) > 1) {
            prePage = parseInt(page) - 1
        } else {
            prePage = parseInt(page)
        }
        setPrevPageUrl("/listenlater/" + userId + "/" + "?page=" + prePage)

        if (parseInt(page) >= totalPage) {
            setIsNextBtnClickable(false)
        } else {
            setIsNextBtnClickable(true)
        }
        if (parseInt(page) <= 1) {
            setIsPreBtnClickable(false)
        } else {
            setIsNextBtnClickable(true)
        }
    }, [totalCount, totalPage])


    return (
        <AppProvider>
            <div>
                <Header title="Listen Later">
                    <div className="w-full flex justify-center mb-9 min-h-screen pt-20">
                        <div className='w-full max-w-2xl pl-6 pr-6'>
                            <div className="w-full mb-10">
                                <div className="flex justify-start mt-4">
                                    <div className="avatar">
                                        <div className="w-24 h-24 rounded-xl">
                                            {
                                                userInfo?.avatar ?
                                                    <img src={userInfo.avatar} />
                                                    :
                                                    <img src="/porkast-logo.png" />
                                            }
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-2xl font-bold">{nickname}'s Porkast Listen Later</div>
                                        {
                                            isMyPage ? (
                                                <div className="mt-4 -ml-2 flex justify-start">
                                                    <SharedListenLaterBtn creatorId={userId} />
                                                </div>
                                            ) : (
                                                <div className="mt-4 -ml-2 flex justify-start">
                                                    <SubscribeListenLaterBtn creatorId={userId} />
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                                <div className="mt-4 text-sm text-gray-500">@{nickname} Porkast</div>
                            </div>
                            <div className='text-neutral-500 text-sm mb-6 ml-2'>{totalCount} episode</div>
                            {
                                itemList.map((item, index) => {
                                    // check if item.Duration contain `:`
                                    let duration: string
                                    if (!isNaN(Number(item.Duration))) {
                                        duration = convertMillsTimeToDuration(parseInt(item.Duration))
                                    } else {
                                        duration = item.Duration
                                    }
                                    return (
                                        <EpisodeCard data={{
                                            itemId: item.GUID,
                                            channelId: item.FeedId,
                                            title: item.Title,
                                            description: item.Description,
                                            image: item.ImageUrl,
                                            link: item.Link,
                                            rssLink: item.FeedLink,
                                            channelName: item.ChannelTitle,
                                            authorName: item.Author,
                                            pubDate: item.PubDate,
                                            audioLength: duration,
                                            audioSrc: item.EnclosureUrl,
                                            hideListenLaterBtn: isMyPage,
                                            hideAddToPlaylistBtn: false
                                        }} />
                                    )
                                })
                            }

                            <div className="w-full flex justify-center pt-6 pb-9">
                                <div className="join">
                                    {
                                        isPreBtnClickable ? (
                                            <Link className="join-item btn btn-neutral" href={prevPageUrl}>«</Link>
                                        ) : (
                                            <button className="join-item btn btn-neutral btn-disabled">«</button>
                                        )
                                    }
                                    <button className="join-item btn btn-neutral">Page {page}</button>
                                    {
                                        isNextBtnClickable ? (
                                            <Link className="join-item btn btn-neutral" href={nextPageUrl}>»</Link>
                                        ) : (
                                            <button className="join-item btn btn-neutral btn-disabled">»</button>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </Header>
                <Footer />
            </div>
        </AppProvider>
    )
}
