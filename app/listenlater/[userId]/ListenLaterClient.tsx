'use client'

import { AppProvider } from "@/components/AppContext"
import EpisodeCard from "@/components/EpisodeCard"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { AvatarImage } from "@/components/PorkastImage"
import { SharedListenLaterBtn } from "@/components/Share"
import { convertMillsTimeToDuration } from "@/libs/common"
import { getUserSessionInfo } from "@/libs/session"
import { ServerUserInfo } from "@/libs/user"
import { UserListenLaterDto } from "@/types/listen_later"
import Link from "next/link"
import { useEffect, useState } from "react"

type Props = {
    userId: string
    page: number
    userInfo: ServerUserInfo | null
    nickname: string
    itemList: UserListenLaterDto[]
    totalCount: number
    totalPage: number
}

export default function ListenLaterClient({ userId, page, userInfo, nickname, itemList, totalCount, totalPage }: Props) {
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
                <Header title="Listen Later">
                    <div className="w-full flex justify-center mb-9 min-h-screen pt-20">
                        <div className='w-full max-w-2xl pl-6 pr-6'>
                            <div className="w-full flex justify-center mb-10">
                                <div className="mt-4">
                                    <div className="flex justify-center">
                                        <AvatarImage className="w-28" imageUrl={userInfo?.avatar} displayName={nickname} />
                                    </div>
                                    <div className="mt-4 flex justify-center">
                                        <div className="md:text-2xl text-xl font-bold">{nickname}{`'s Porkast Listen Later`}</div>
                                    </div>
                                    <div className="mt-4 -ml-2 flex justify-center">
                                        <SharedListenLaterBtn creatorId={userId} />
                                    </div>
                                    <div className="flex justify-center">
                                        <div className="mt-4 text-sm text-gray-500">{nickname}@Porkast</div>
                                    </div>
                                </div>
                            </div>
                            <div className='text-neutral-500 text-sm mb-6 ml-2'>{totalCount} episode</div>
                            {
                                itemList && itemList.length > 0 ? (
                                    itemList.map((item, index) => {
                                        let duration: string
                                        if (!isNaN(Number(item.duration))) {
                                            duration = convertMillsTimeToDuration(parseInt(item.duration))
                                        } else {
                                            duration = item.duration
                                        }
                                        return (
                                            <EpisodeCard key={index} data={{
                                                itemId: item.guid,
                                                channelId: item.feed_id,
                                                title: item.title,
                                                description: item.description,
                                                image: item.image_url,
                                                link: item.link,
                                                rssLink: item.feed_link,
                                                channelName: item.channel_title,
                                                authorName: item.author,
                                                pubDate: item.pub_date,
                                                audioLength: duration,
                                                audioSrc: item.enclosure_url,
                                                hideListenLaterBtn: isMyPage,
                                                hideAddToPlaylistBtn: false
                                            }} />
                                        )
                                    })
                                ) : null
                            }
                            <div className="w-full flex justify-center pt-6 pb-9">
                                <div className="join">
                                    {
                                        page > 1 ? (
                                            <Link className="join-item btn btn-neutral" href={`/listenlater/${userId}/?page=${prevPage}`}>«</Link>
                                        ) : (
                                            <button className="join-item btn btn-neutral btn-disabled">«</button>
                                        )
                                    }
                                    <button className="join-item btn btn-neutral">Page {page}</button>
                                    {
                                        page < totalPage ? (
                                            <Link className="join-item btn btn-neutral" href={`/listenlater/${userId}/?page=${nextPage}`}>»</Link>
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
