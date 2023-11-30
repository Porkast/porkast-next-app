'use client'

import { AppProvider } from "@/components/AppContext"
import EpisodeCard from "@/components/EpisodeCard"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { AvatarImage } from "@/components/PorkastImage"
import { SharedListenLaterBtn } from "@/components/Share"
import SubscribeListenLaterBtn from "@/components/SubscribeListenLaterButton"
import { getPlaylistInfoById, getPlaylistItemListByUserId } from "@/libs/playlist"
import { getUserSessionInfo } from "@/libs/suapbase"
import { ServerUserInfo, getTempNickname, getUserInfoFromServer } from "@/libs/user"
import { FeedItem } from "@/types/feed_item"
import { UserPlaylistDto } from "@/types/playlist"
import Link from "next/link"
import { useEffect, useState } from "react"


export default function PlaylistPage({ params, searchParams }: { params: { userId: string, playlistId: string }, searchParams: { page: string } }) {

    const userId = params.userId
    const playlistId = params.playlistId
    const page = searchParams.page || "1"
    const [userInfo, setUserInfo] = useState<ServerUserInfo>()
    const [nickname, setNickname] = useState("")
    const [isMyPage, setIsMyPage] = useState(false)
    const [playlistInfo, setPlaylistInfo] = useState<UserPlaylistDto>()
    const [itemList, setItemList] = useState<FeedItem[]>([])
    const [totalPage, setTotalPage] = useState(0)
    const [totalCount, setTotalCount] = useState(0)
    const [nextPageUrl, setNextPageUrl] = useState("")
    const [prevPageUrl, setPrevPageUrl] = useState("")
    const [isNextBtnClickable, setIsNextBtnClickable] = useState(true)
    const [isPreBtnClickable, setIsPreBtnClickable] = useState(true)


    useEffect(() => {
        async function initPageInfo() {

            const data = await getPlaylistItemListByUserId(params.userId, params.playlistId, parseInt(page))
            if (data.code != 0) {
                return
            }
            const itemDataList = data.data.playlist
            const userInfoData = data.data.userInfo
            const nicknameStr = getTempNickname(userInfoData)
            setUserInfo(userInfoData)
            setNickname(nicknameStr)
            setItemList(itemDataList)
            if (itemDataList && itemDataList.length > 0) {
                setTotalCount(itemDataList[0].Count)
                setTotalPage(Math.ceil(itemDataList[0].Count / 10))
            } else {
                return
            }

            const playlistInfoResp = await getPlaylistInfoById(playlistId)
            if (playlistInfoResp.code != 0) {
                // TODO: show error page
                return
            }
            setPlaylistInfo(playlistInfoResp.data)
        }

        initPageInfo()

    }, [page])

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
        setNextPageUrl("/playlist/" + userId + "/" + playlistId + "?page=" + nextPage)

        let prePage = 0
        if (parseInt(page) > 1) {
            prePage = parseInt(page) - 1
        } else {
            prePage = parseInt(page)
        }
        setPrevPageUrl("/playlist/" + userId + "/" + playlistId + "?page=" + prePage)

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
    }, [totalCount, totalPage, page])

    return (
        <>
            <AppProvider>
                <div>
                    <Header title="Playlist">
                        <div className="w-full flex justify-center mb-9 min-h-screen pt-20">
                            <div className='w-full max-w-2xl pl-6 pr-6'>
                                <div className="w-full mb-10">
                                    <div className="flex justify-start mt-4">
                                        <AvatarImage className="w-28" imageUrl={userInfo?.avatar} />
                                        <div className="ml-3">
                                            <div className="md:text-2xl text-xl font-bold">{playlistInfo?.PlaylistName}</div>
                                            <div className="text-sm font-medium text-gray-500 mt-2">By {nickname}</div>
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
                                    <div className="mt-4 text-sm text-gray-500">{nickname}@Porkast</div>
                                </div>
                                <div className='text-neutral-500 text-sm mb-6 ml-2'>{totalCount} results</div>
                                        
                                {
                                    itemList && itemList.length > 0 ? (
                                        itemList.map((item, index) => {
                                            return (
                                                <EpisodeCard key={index} data={{
                                                    itemId: item.GUID,
                                                    channelId: item.FeedId,
                                                    title: item.Title,
                                                    description: item.Description,
                                                    image: item.ImageUrl,
                                                    link: item.Link,
                                                    rssLink: item.FeedLink,
                                                    channelName: item.ChannelTitle,
                                                    // authorName: item.Author,
                                                    authorName: "",
                                                    pubDate: item.PubDate,
                                                    audioLength: item.Duration,
                                                    audioSrc: item.EnclosureUrl,
                                                    hideAddToPlaylistBtn: isMyPage,
                                                    hideListenLaterBtn: isMyPage
                                                }} />
                                            )
                                        })
                                    ) : (
                                        <></>
                                    )
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
        </>
    )
}