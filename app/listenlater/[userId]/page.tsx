import { AppProvider } from "@/components/AppContext"
import EpisodeCard from "@/components/EpisodeCard"
import Header from "@/components/Header"
import { convertMillsTimeToDuration } from "@/libs/common"
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
    const prevPageUrl = "/listenlater/" + userId + "/"  + "?page=" + prePage


    return (
        <AppProvider>
            <div>
                <Header>
                    <div className="w-full flex justify-center mb-9 min-h-screen pt-20">
                        <div className='w-full max-w-2xl pl-6 pr-6'>
                            <div className='text-neutral-500 text-sm mb-6 ml-2'>{totalCount} results</div>
                            {
                                itemList.map((item, index) => {
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
                                            audioLength: convertMillsTimeToDuration(parseInt(item.Duration)),
                                            audioSrc: item.EnclosureUrl,
                                            hideListenLaterBtn: true
                                        }} />
                                    )
                                })
                            }

                            <div className="w-full flex justify-center pt-6 pb-9">
                                <div className="join">
                                    <Link className="join-item btn btn-neutral" href={prevPageUrl}>«</Link>
                                    <button className="join-item btn btn-neutral">Page {page}</button>
                                    <Link className="join-item btn btn-neutral" href={nextPageUrl}>»</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </Header>
            </div>
        </AppProvider>
    )
}

export async function generateMetadata(
    { params }: { params: { channelId: string } },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const description = ""
    const title = ""
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