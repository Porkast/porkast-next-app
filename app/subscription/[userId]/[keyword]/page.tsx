import { AppProvider } from "@/components/AppContext";
import EpisodeCard from "@/components/EpisodeCard";
import Header from "@/components/Header";
import { convertMillsTimeToDuration } from "@/libs/common";
import { FeedItem } from "@/types/feed_item";
import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { cache } from "react";


export default async function Page({ params, searchParams }: { params: { userId: string, keyword: string }, searchParams: { page: string } }) {

    const userId = params.userId;
    const keyword = params.keyword
    var totalCount = 0
    var page = searchParams.page
    if (!page) {
        page = "1"
    }

    var totalPage = 0

    var itemList: FeedItem[] = []
    const resp = await getUserKeywordSubscriptionItemList(userId, keyword, page)
    itemList = resp.data
    if (itemList.length > 0) {
        totalPage = Math.ceil(itemList[0].Count / 10)
        totalCount = itemList[0].Count
    }

    let nextPage = 0
    if (parseInt(page) >= totalPage) {
        nextPage = parseInt(page)
    } else {
        nextPage = parseInt(page) + 1
    }
    const nextPageUrl = "/subscription/" + userId + "/" + keyword + "?page=" + nextPage

    let prePage = 0
    if (parseInt(page) > 1) {
        prePage = parseInt(page) - 1
    } else {
        prePage = parseInt(page)
    }
    const prevPageUrl = "/subscription/" + userId + "/" + keyword + "?page=" + prePage

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
                                            authorName: item.ChannelTitle,
                                            pubDate: item.PubDate,
                                            audioLength: convertMillsTimeToDuration(parseInt(item.Duration)),
                                            audioSrc: item.EnclosureUrl
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

const getUserKeywordSubscriptionItemList = cache(async (userId: string, keyword: string, page: string): Promise<{ code: number, message: string, data: FeedItem[] }> => {

    var requestAPI = `${process.env.API_BASE_URL}v1/api/subscription/${userId}/${keyword}`
    if (page) {
        requestAPI = `${requestAPI}?page=${page}`
    }

    const resp = await fetch(requestAPI)
    const respJson = await resp.json()

    return {
        code: respJson.code,
        message: respJson.message,
        data: respJson.data
    }
})

export async function generateMetadata(
    { params, searchParams }: { params: { userId: string, keyword: string }, searchParams: { page: string } },
    parent: ResolvingMetadata
): Promise<Metadata> {

    const title = 'Porkast-#' + decodeURIComponent(params.keyword)

    return {
        title: title,
        description: "",
    }
}
