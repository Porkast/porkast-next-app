import AddListenLaterButton from "@/components/AddListenLaterButton"
import AddToPlaylistButton from "@/components/AddToPlaylistButton"
import { AppProvider } from "@/components/AppContext"
import EpisodeCard from "@/components/EpisodeCard"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import ShowNotesViewer from "@/components/ShowNotesViewer"
import { convertMillsTimeToDuration } from "@/libs/common"
import { getPlaylistItemListByUserId } from "@/libs/playlist"
import { ResolvingMetadata, Metadata } from "next"
import Link from "next/link"


export default async function PlaylistPage({ params, searchParams }: { params: { userId: string, playlistId: string }, searchParams: { page: string } }) {

    const userId = params.userId
    const playlistId = params.playlistId
    const page = searchParams.page || "1"
    const data = await getPlaylistItemListByUserId(params.userId, params.playlistId, parseInt(page))
    if (data.code != 0) {
        // TODO: show error page
        return
    }

    const itemList = data.data
    let totalCount = 0
    var totalPage = 0
    if (itemList && itemList.length > 0) {
        totalCount = itemList[0].Count
        totalPage = Math.ceil(itemList[0].Count / 10)
    } else {
        return
    }

    let nextPage = 0
    if (parseInt(page) >= totalPage) {
        nextPage = parseInt(page)
    } else {
        nextPage = parseInt(page) + 1
    }
    const nextPageUrl = "/playlist/" + userId + "/" + playlistId + "?page=" + nextPage

    let prePage = 0
    if (parseInt(page) > 1) {
        prePage = parseInt(page) - 1
    } else {
        prePage = parseInt(page)
    }
    const prevPageUrl = "/playlist/" + userId + "/" + playlistId + "?page=" + prePage

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
                                                audioLength: convertMillsTimeToDuration(parseInt(item.Duration)),
                                                audioSrc: item.EnclosureUrl
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
                        <Footer />
                    </Header>
                </div>
            </AppProvider>
        </>
    )
}

export async function generateMetadata(
    { params, searchParams }: { params: { userId: string, playlistId: string }, searchParams: { page: string } },
    parent: ResolvingMetadata
): Promise<Metadata> {


    return {
        title: "Playlist",
    }
}
