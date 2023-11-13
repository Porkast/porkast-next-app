import { AppProvider } from "@/components/AppContext"
import EpisodeCard from "@/components/EpisodeCard"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import SubscribeListenLaterBtn from "@/components/SubscribeListenLaterButton"
import { convertMillsTimeToDuration } from "@/libs/common"
import { getTempNickname, getUserInfoFromServer } from "@/libs/user"
import { UserListenLater } from "@/types/feed_item"
import { Metadata, ResolvingMetadata } from "next"
import { Author } from "next/dist/lib/metadata/types/metadata-types"
import Link from "next/link"


export default async function Page({ params, searchParams }: { params: { userId: string }, searchParams: { page: string } }) {

    const userId = params.userId;
    var totalCount = 0
    var page = searchParams.page
    if (!page) {
        page = "1"
    }

    var totalPage = 0
    var itemList: UserListenLater[] = []
    const resp = await getListenLaterListByUserId(userId, parseInt(page))
    itemList = resp.data
    if (itemList && itemList.length > 0) {
        totalPage = Math.ceil(itemList[0].Count / 10)
        totalCount = itemList[0].Count
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
    const nextPageUrl = "/listenlater/" + userId + "/" + "?page=" + nextPage

    let prePage = 0
    if (parseInt(page) > 1) {
        prePage = parseInt(page) - 1
    } else {
        prePage = parseInt(page)
    }
    const prevPageUrl = "/listenlater/" + userId + "/" + "?page=" + prePage

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

    const userInfoResp = await getUserInfoFromServer(userId)
    if (userInfoResp.code != 0) {
        // TODO: show error page
        return
    }
    const userInfo = userInfoResp.data
    const nickname = getTempNickname(userInfo)

    return (
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
                                        <div className="text-2xl font-bold">{nickname}'s Porkast Listen Later</div>
                                        <div className="mt-4 -ml-2 flex justify-start">
                                            <SubscribeListenLaterBtn creatorId={userId} />
                                        </div>
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
                                            hideListenLaterBtn: true,
                                            hideAddToPlaylistBtn: true
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

export async function generateMetadata(
    { params, searchParams }: { params: { userId: string }, searchParams: { page: string } },
    parent: ResolvingMetadata
): Promise<Metadata> {

    const serverUserInfo = await getUserInfoFromServer(params.userId)
    const description = ""
    const nickname = getTempNickname(serverUserInfo.data)
    const title = nickname + "'s Listen Later | Porkast"
    const authorList: Author[] = []
    authorList.push({
        name: "",
        url: ""
    })
    return {
        title: title,
        description: description,
        authors: authorList,
    }
}

const getListenLaterListByUserId = async (userId: string, page: number): Promise<{ code: number, message: string, data: UserListenLater[] }> => {

    const limit = 10
    const offset = (page - 1) * limit
    const resp = await fetch(`${process.env.API_BASE_URL}v1/api/listenlater/list?userId=${userId}&limit=${limit}&offset=${offset}`)
    const respJson = await resp.json()
    return {
        code: respJson.code,
        message: respJson.message,
        data: respJson.data
    }
}