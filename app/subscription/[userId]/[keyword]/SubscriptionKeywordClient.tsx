'use client'

import { AppProvider } from "@/components/AppContext"
import EpisodeCard from "@/components/EpisodeCard"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { AvatarImage } from "@/components/PorkastImage"
import { ShareSearchSubscriptionBtn } from "@/components/Share"
import SubscribeListenLaterBtn from "@/components/SubscribeListenLaterButton"
import UnsubscribeKeywordButton from "@/components/UnsubscribeKeywordButton"
import { getUserSessionInfo } from "@/libs/session"
import { ServerUserInfo } from "@/libs/user"
import { FeedItem } from "@/types/feed_item"
import Link from "next/link"
import { useEffect, useState } from "react"

type Props = {
    userId: string
    keyword: string
    decodedKeyword: string
    page: number
    userInfo: ServerUserInfo | null
    nickname: string
    itemList: FeedItem[]
    totalCount: number
    totalPage: number
}

export default function SubscriptionKeywordClient({ userId, keyword, decodedKeyword, page, userInfo, nickname, itemList, totalCount, totalPage }: Props) {
    const [isMyPage, setIsMyPage] = useState(false)
    const prevPage = page > 1 ? page - 1 : 1
    const nextPage = page < totalPage ? page + 1 : page

    useEffect(() => {
        const checkMyPage = async () => {
            const sessionUser = await getUserSessionInfo()
            if (userId === sessionUser.userId) {
                setIsMyPage(true)
            }
        }
        checkMyPage()
    }, [userId])

    return (
        <AppProvider>
            <div>
                <Header title="Subscription">
                    <div className="w-full flex justify-center mb-9 min-h-screen pt-20">
                        <div className='w-full max-w-2xl pl-6 pr-6'>
                            <div className="w-full mb-10">
                                <div className="flex justify-start mt-4">
                                    <AvatarImage className="w-28" imageUrl={userInfo?.avatar} />
                                    <div className="ml-3">
                                        <div className="md:text-2xl text-xl font-bold">#{decodedKeyword}</div>
                                        <div className="text-sm font-medium text-gray-500 mt-2">Search keyword #{decodedKeyword} subscription</div>
                                        {
                                            isMyPage ? (
                                                <div className="mt-4 -ml-2 flex justify-start">
                                                    <ShareSearchSubscriptionBtn userId={userId} keyword={keyword} />
                                                    <UnsubscribeKeywordButton userId={userId} keyword={keyword} />
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
                                            authorName: item.Author,
                                            pubDate: item.PubDate,
                                            audioLength: item.Duration,
                                            audioSrc: item.EnclosureUrl
                                        }} />
                                    )
                                })
                            }
                            <div className="w-full flex justify-center pt-6 pb-9">
                                <div className="join">
                                    {
                                        page > 1 ? (
                                            <Link className="join-item btn btn-neutral" href={`/subscription/${userId}/${keyword}?page=${prevPage}`}>«</Link>
                                        ) : (
                                            <button className="join-item btn btn-neutral btn-disabled">«</button>
                                        )
                                    }
                                    <button className="join-item btn btn-neutral">Page {page}</button>
                                    {
                                        page < totalPage ? (
                                            <Link className="join-item btn btn-neutral" href={`/subscription/${userId}/${keyword}?page=${nextPage}`}>»</Link>
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
