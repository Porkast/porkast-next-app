'use client'

import parse from 'html-react-parser'
import { AppProvider } from "@/components/AppContext"
import Header from "@/components/Header"
import { formatDateTime } from "@/libs/common"
import { getUserPlaylistByUserId } from "@/libs/playlist"
import { ServerUserInfo, getTempNickname, getUserInfoFromServer } from "@/libs/user"
import { UserPlaylistDto } from "@/types/playlist"
import Link from "next/link"
import { EditPlaylistInfoBtn } from '@/components/EditPlaylistInfo'
import Footer from '@/components/Footer'
import { useEffect, useState } from 'react'
import { AvatarImage } from '@/components/PorkastImage'

export default function PlaylistPage({ params, searchParams }: { params: { userId: string }, searchParams: { page: string } }) {

    const userId = params.userId;
    const page = searchParams.page || "1"
    const [userInfo, setUserInfo] = useState<ServerUserInfo>()
    const [nickname, setNickname] = useState("")
    const [playlists, setPlaylists] = useState<UserPlaylistDto[]>([])
    const [totalPage, setTotalPage] = useState(0)
    const [totalCount, setTotalCount] = useState(0)
    const [nextPageUrl, setNextPageUrl] = useState("")
    const [prevPageUrl, setPrevPageUrl] = useState("")
    const [isNextBtnClickable, setIsNextBtnClickable] = useState(true)
    const [isPreBtnClickable, setIsPreBtnClickable] = useState(true)

    useEffect(() => {
        async function initPageInfo() {
            const userInfoResp = await getUserInfoFromServer(userId)
            if (userInfoResp.code != 0) {
                return
            }
            const userInfoData = userInfoResp.data
            const nicknameStr = getTempNickname(userInfoData)
            setUserInfo(userInfoData)
            setNickname(nicknameStr)

            const resp = await getUserPlaylistByUserId(userId, parseInt(page))
            const playListsData = resp.data
            setPlaylists(playListsData)
            if (playListsData && playListsData.length > 0) {
                setTotalPage(Math.ceil(playListsData[0].Count / 10))
                setTotalCount(playListsData[0].Count)
            }
        }

        initPageInfo()
    }, [userId, page])

    useEffect(() => {
        let nextPage = 0
        if (parseInt(page) >= totalPage) {
            nextPage = parseInt(page)
        } else {
            nextPage = parseInt(page) + 1
        }
        setNextPageUrl("/playlist/" + userId + "/" + "?page=" + nextPage)

        let prePage = 0
        if (parseInt(page) > 1) {
            prePage = parseInt(page) - 1
        } else {
            prePage = parseInt(page)
        }
        setPrevPageUrl("/playlist/" + userId + "/" + "?page=" + prePage)

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
        <>
            <AppProvider>
                <div>
                    <Header title='Playlist'>
                        <div className="w-full flex justify-center mb-9 min-h-screen pt-20">
                            <div className='w-full max-w-2xl pl-6 pr-6'>
                                <div className="w-full mb-10">
                                    <div className="flex justify-start mt-4">
                                        <AvatarImage className='w-28' imageUrl={userInfo?.avatar} />
                                        <div className="ml-3">
                                            <div className="md:text-2xl text-xl font-bold">{nickname}{`'s Porkast Playlist`}</div>
                                            <div className="mt-4 -ml-2 flex justify-start">
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-sm text-gray-500">@{nickname} Porkast</div>
                                </div>
                                <div className='text-neutral-500 text-sm mb-6 ml-2'>{totalCount} playlist</div>
                                {
                                    playlists?.map((item, index) => {
                                        return (
                                            <div key={index} className="card w-full bg-base-100 shadow-xl">
                                                <div className="card-body">
                                                    <h2 className="card-title w-full flex justify-start">
                                                        <div className='w-4/5 flex justify-start'>
                                                            <a href={`/playlist/${userId}/${item.Id}`}>{item.PlaylistName}</a>
                                                        </div>
                                                        <div className='w-1/5 flex justify-end'>
                                                            <EditPlaylistInfoBtn CreatorId={userId} PlaylistId={item.Id} />
                                                        </div>
                                                    </h2>
                                                    <div className="max-h-24 flex overflow-clip mt-2 text-sm neutral-content">
                                                        <a href={`/playlist/${userId}/${item.Id}`}>
                                                            <p>{parse(item.Description)}</p>
                                                        </a>
                                                    </div>
                                                    <p className='mt-4'>Create at: {formatDateTime(item.RegDate?.toLocaleString())}</p>
                                                </div>
                                            </div>
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
        </>
    )
}