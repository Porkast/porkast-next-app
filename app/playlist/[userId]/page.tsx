import parse from 'html-react-parser'
import { AppProvider } from "@/components/AppContext"
import Header from "@/components/Header"
import SubscribeListenLaterBtn from "@/components/SubscribeListenLaterButton"
import { formatDateTime } from "@/libs/common"
import { getUserPlaylistByUserId } from "@/libs/playlist"
import { getTempNickname, getUserInfoFromServer } from "@/libs/user"
import { UserPlaylistDto } from "@/types/playlist"
import Link from "next/link"
import { EditPlaylistInfoBtn } from '@/components/EditPlaylistInfo'

export default async function PlaylistPage({ params, searchParams }: { params: { userId: string }, searchParams: { page: string } }) {

    const userId = params.userId;
    const page = searchParams.page || "1"
    const userInfoResp = await getUserInfoFromServer(userId)
    if (userInfoResp.code != 0) {
        // TODO: show error page
        return
    }
    const userInfo = userInfoResp.data
    const nickname = getTempNickname(userInfo)

    let playLists: UserPlaylistDto[] = []
    let totalPage = 0
    let totalCount = 0
    const resp = await getUserPlaylistByUserId(userId, parseInt(page))
    playLists = resp.data
    if (playLists && playLists.length > 0) {
        totalPage = Math.ceil(playLists[0].Count / 10)
        totalCount = playLists[0].Count
    } else {
        // TODO: show error page
        return
    }

    let nextPage = 0
    if (parseInt(page) >= totalPage) {
        nextPage = parseInt(page)
    } else {
        nextPage = parseInt(page) + 1
    }
    const nextPageUrl = "/playlist/" + userId + "/" + "?page=" + nextPage

    let prePage = 0
    if (parseInt(page) > 1) {
        prePage = parseInt(page) - 1
    } else {
        prePage = parseInt(page)
    }
    const prevPageUrl = "/playlist/" + userId + "/" + "?page=" + prePage

    var isNextBtnClickable = true
    var isPreBtnClickable = true
    if (parseInt(page) >= totalPage) {
        isNextBtnClickable = false
    } else {
        isNextBtnClickable = true
    }
    if (parseInt(page) <= 1) {
        isPreBtnClickable = false
    } else {
        isPreBtnClickable = true
    }

    return (
        <>
            <AppProvider>
                <div>
                    <Header>
                        <div className="w-full flex justify-center mb-9 min-h-screen pt-20">
                            <div className='w-full max-w-2xl pl-6 pr-6'>
                                <div className="w-full mb-10">
                                    <div className="flex justify-start mt-4">
                                        <div className="avatar">
                                            <div className="w-24 h-24 rounded-xl">
                                                {
                                                    userInfo.avatar ?
                                                        <img src={userInfo.avatar} />
                                                        :
                                                        <img src="/porkast-logo.png" />
                                                }
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-2xl font-bold">{nickname}'s Porkast Playlist</div>
                                            <div className="mt-4 -ml-2 flex justify-start">
                                                <SubscribeListenLaterBtn creatorId={userId} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-sm text-gray-500">@{nickname} Porkast</div>
                                </div>
                                <div className='text-neutral-500 text-sm mb-6 ml-2'>{totalCount} playlist</div>
                                {
                                    playLists.map((item, index) => {
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
                                                    <div className="max-h-24 flex overflow-clip mt-6">
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
                </div>
            </AppProvider>
        </>
    )
}