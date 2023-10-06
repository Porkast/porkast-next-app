import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { Metadata, ResolvingMetadata } from "next"
import { cache } from "react"
import parse from 'html-react-parser'
import AudioPlayButton from "@/components/AudioPlayButton"
import { AppProvider } from "@/components/AppContext"
import AddListenLaterButton from "@/components/AddListenLaterButton"
import AddToPlaylistButton from "@/components/AddToPlaylistButton"


export default async function Page({ params }: { params: { channelId: string, itemId: string } }) {

    const data = await getFeedItemInfoById(params.channelId, params.itemId)
    const itemInfo = data.itemInfo
    const channelInfo = data.channelInfo
    const podcastChannelLink = "/podcast/" + itemInfo.ChannelId
    const formatDescription = itemInfo.Description.replace(/color:[^;]*;/g, '');

    const playerParams: AudioPlayerParams = {
        title: itemInfo.Title,
        artist: itemInfo.Author,
        cover: itemInfo.ImageUrl,
        src: itemInfo.EnclosureUrl
    }

    return (
        <AppProvider>
            <Header />
            <div className="w-full flex justify-center mb-9 min-h-screen">
                <div className='w-full max-w-2xl pl-6 pr-6'>
                    {/* item header info block */}
                    <div className='w-full'>
                        <div className='text-xl font-bold'>{itemInfo.Title}</div>
                        <div className="w-full flex justify-start mt-4">
                            <div className="avatar">
                                <div className="w-24 rounded-xl">
                                    <img src={itemInfo.ImageUrl} />
                                </div>
                            </div>
                            <div className="ml-3">
                                <a href={podcastChannelLink} className="text-base font-bold mt-2">{channelInfo.Title}</a>
                                <div className="text-sm font-medium text-gray-500 mt-2">By {channelInfo.Author}</div>
                                <div className="flex justify-start mt-4">
                                    <a className="btn btn-neutral btn-sm flex items-center rounded-lg md:text-base text-xs" href={itemInfo.FeedLink} target="_blank">
                                        <svg className="md:w-4 md:h-4 w-3 h-3 icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4715" width="32" height="32">
                                            <path d="M128 768a128 128 0 1 0 0 256 128 128 0 0 0 0-256zM0 368v176c265.104 0 480 214.912 480 480h176c0-362.32-293.696-656-656-656zM0 0v176c468.336 0 848 379.664 848 848h176C1024 458.464 565.536 0 0 0z" fill="#bfbfbf" p-id="4716"></path>
                                        </svg>
                                        RSS
                                    </a>
                                    <a className="btn btn-neutral btn-sm flex items-center rounded-lg ml-4 md:text-base text-xs" href={itemInfo.Link} target="_blank">
                                        <svg className="md:w-5 md:h-5 w-4 h-4 icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3342" width="32" height="32"><path d="M574 665.4c-3.1-3.1-8.2-3.1-11.3 0L446.5 781.6c-53.8 53.8-144.6 59.5-204 0-59.5-59.5-53.8-150.2 0-204l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3l-39.8-39.8c-3.1-3.1-8.2-3.1-11.3 0L191.4 526.5c-84.6 84.6-84.6 221.5 0 306s221.5 84.6 306 0l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3L574 665.4zM832.6 191.4c-84.6-84.6-221.5-84.6-306 0L410.3 307.6c-3.1 3.1-3.1 8.2 0 11.3l39.7 39.7c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c53.8-53.8 144.6-59.5 204 0 59.5 59.5 53.8 150.2 0 204L665.3 562.6c-3.1 3.1-3.1 8.2 0 11.3l39.8 39.8c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c84.5-84.6 84.5-221.5 0-306.1z" p-id="3343" fill="#bfbfbf"></path><path d="M610.1 372.3c-3.1-3.1-8.2-3.1-11.3 0L372.3 598.7c-3.1 3.1-3.1 8.2 0 11.3l39.6 39.6c3.1 3.1 8.2 3.1 11.3 0l226.4-226.4c3.1-3.1 3.1-8.2 0-11.3l-39.5-39.6z" p-id="3344" fill="#bfbfbf"></path></svg>
                                        Source Link
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 text-gray-500">{itemInfo.PubDate}</div>
                        <div className="flex justify-start items-center mt-3 pb-6">
                            {/* play icon */}
                            <AudioPlayButton data={playerParams} />
                            <div className="text-base text-gray-500 w-20 ml-4">{itemInfo.Duration}</div>
                            <AddListenLaterButton userId={''} itemId={data.itemId} channelId={data.channelId} />
                            <AddToPlaylistButton userId={''} itemId={data.itemId} channelId={data.channelId} playlistId={''} />
                        </div>
                        <p className="mt-4 text-xs">{channelInfo.Copyright}</p>
                        <div className="card w-full bg-base-100 shadow-xl overflow-auto mt-9">
                            <div className="card-body">
                                <h2 className="card-title mb-9">Show Notes</h2>
                                <div className="text-base-content">
                                    {parse(formatDescription)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </AppProvider>
    )
}

export async function generateMetadata(
    { params }: { params: { channelId: string, itemId: string } },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const data = await getFeedItemInfoById(params.channelId, params.itemId)
    const itemInfo = data.itemInfo
    const title = itemInfo.Title + "- Porkast"

    return {
        title: title,
        description: itemInfo.TextDescription,
        authors: [itemInfo.Author],
    }
}

export const getFeedItemInfoById = cache(async (channelId: string, itemId: string) => {
    const res = await fetch(`${process.env.API_BASE_URL}v1/api/feed/channel/${channelId}/item/${itemId}`)
    const data = await res.json()
    return data.data
})