'use client'

import parse from 'html-react-parser'
import { AppProvider } from "@/components/AppContext"
import Header from "@/components/Header"
import { formatDateTime } from "@/libs/common"
import { ServerUserInfo } from "@/libs/user"
import { UserPlaylistDto } from "@/types/playlist"
import Link from "next/link"
import { EditPlaylistInfoBtn } from '@/components/EditPlaylistInfo'
import Footer from '@/components/Footer'
import { AvatarImage } from '@/components/PorkastImage'

type Props = {
    userId: string
    page: number
    userInfo: ServerUserInfo | null
    nickname: string
    playlists: UserPlaylistDto[]
    totalCount: number
    totalPage: number
}

export default function PlaylistListClient({ userId, page, userInfo, nickname, playlists, totalCount, totalPage }: Props) {
    const prevPage = page > 1 ? page - 1 : 1
    const nextPage = page < totalPage ? page + 1 : page

    return (
        <>
            <AppProvider>
                <div>
                    <Header title='Playlist'>
                        <div className="w-full flex justify-center mb-9 min-h-screen pt-20">
                            <div className='w-full max-w-2xl pl-6 pr-6'>
                                <div className="flex justify-center mt-4">
                                    <div className="w-full">
                                        <div className="flex justify-center">
                                            <AvatarImage className="w-28" imageUrl={userInfo?.avatar} displayName={nickname} />
                                        </div>
                                        <div className="flex justify-center mt-4">
                                            <div className="md:text-2xl text-xl font-bold">{nickname}{`'s Porkast Playlist`}</div>
                                        </div>
                                        <div className="flex justify-center mt-4">
                                            <div className="mt-4 text-sm text-gray-500">{nickname}@Porkast</div>
                                        </div>
                                    </div>
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
                                            page > 1 ? (
                                                <Link className="join-item btn btn-neutral" href={`/playlist/${userId}/?page=${prevPage}`}>«</Link>
                                            ) : (
                                                <button className="join-item btn btn-neutral btn-disabled">«</button>
                                            )
                                        }
                                        <button className="join-item btn btn-neutral">Page {page}</button>
                                        {
                                            page < totalPage ? (
                                                <Link className="join-item btn btn-neutral" href={`/playlist/${userId}/?page=${nextPage}`}>»</Link>
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
