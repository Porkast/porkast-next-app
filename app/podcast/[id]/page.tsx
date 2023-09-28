import type { Metadata, ResolvingMetadata } from 'next'
import Header from "@/components/Header";
import { cache } from 'react';
import EpisodeCard from '@/components/EpisodeCard';
import Footer from '@/components/Footer';

export default async function Page({ params }: { params: { id: string } }) {
    const podcastId = params.id;
    const data = await getChannelInfoById(podcastId)

    return (
        <div>
            <Header keyword={""} />
            <div className='w-full flex justify-center'>
                <div className='w-full max-w-2xl pt-28 pl-6 pr-6'>
                    {/* channel info block */}
                    <div className='w-full'>
                        <div className='text-xl font-bold'>{data.Title}</div>
                        <div className="w-full flex justify-start mt-4">
                            <div className="avatar">
                                <div className="w-24 rounded-xl">
                                    <img src={data.ImageUrl} />
                                </div>
                            </div>
                            <div className="ml-3">
                                <div className="text-sm font-medium text-gray-500 mt-2">Author: {data.Author}</div>
                                <div className="flex justify-start mt-4">
                                    <a className="btn btn-neutral btn-sm flex items-center rounded-lg" href={data.FeedLink} target="_blank">
                                        <svg className="w-4 h-4 icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4715" width="32" height="32">
                                            <path d="M128 768a128 128 0 1 0 0 256 128 128 0 0 0 0-256zM0 368v176c265.104 0 480 214.912 480 480h176c0-362.32-293.696-656-656-656zM0 0v176c468.336 0 848 379.664 848 848h176C1024 458.464 565.536 0 0 0z" fill="#bfbfbf" p-id="4716"></path>
                                        </svg>
                                        RSS
                                    </a>
                                    <a className="btn btn-neutral btn-sm flex items-center rounded-lg ml-4" href={data.Link} target="_blank">
                                        <svg className="w-5 h-5 icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3342" width="32" height="32"><path d="M574 665.4c-3.1-3.1-8.2-3.1-11.3 0L446.5 781.6c-53.8 53.8-144.6 59.5-204 0-59.5-59.5-53.8-150.2 0-204l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3l-39.8-39.8c-3.1-3.1-8.2-3.1-11.3 0L191.4 526.5c-84.6 84.6-84.6 221.5 0 306s221.5 84.6 306 0l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3L574 665.4zM832.6 191.4c-84.6-84.6-221.5-84.6-306 0L410.3 307.6c-3.1 3.1-3.1 8.2 0 11.3l39.7 39.7c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c53.8-53.8 144.6-59.5 204 0 59.5 59.5 53.8 150.2 0 204L665.3 562.6c-3.1 3.1-3.1 8.2 0 11.3l39.8 39.8c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c84.5-84.6 84.5-221.5 0-306.1z" p-id="3343" fill="#bfbfbf"></path><path d="M610.1 372.3c-3.1-3.1-8.2-3.1-11.3 0L372.3 598.7c-3.1 3.1-3.1 8.2 0 11.3l39.6 39.6c3.1 3.1 8.2 3.1 11.3 0l226.4-226.4c3.1-3.1 3.1-8.2 0-11.3l-39.5-39.6z" p-id="3344" fill="#bfbfbf"></path></svg>
                                        Source Link
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="max-h-24 flex overflow-clip mt-6">
                            <p>{data.TextChannelDesc}</p>
                        </div>
                        <div className="w-full carousel carousel-center p-2 mt-4 space-x-2 bg-base-200 rounded-lg">
                            {
                                data.Categories.map((item: any) => {
                                    return (
                                        <div className="carousel-item">
                                            <button className="btn btn-xs">{item}</button>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <p className="mt-4 text-xs">{data.Copyright}</p>
                    </div>
                    {/* feed channel all item block */}
                    <div className="flex justify-start mt-6">
                        <div className="text-sm">Total {data.Count} Episodes</div>
                    </div>
                    <div className="w-full flex justify-center pt-9">
                        <div className="w-full">
                            {
                                data.Items.map((item: any) => {
                                    return (
                                        <EpisodeCard key={item.Id} data={{
                                            itemId: item.Id,
                                            channelId: item.ChannelId,
                                            title: item.HighlightTitle,
                                            description: item.TextDescription,
                                            image: item.ImageUrl,
                                            link: item.Link,
                                            rssLink: item.FeedLink,
                                            channelName: item.ChannelTitle,
                                            authorName: item.Author,
                                            pubDate: item.PubDate,
                                            audioLength: item.Duration
                                        }} />
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export async function generateMetadata(
    { params }: { params: { id: string } },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const id = params.id
    const data = await getChannelInfoById(id)
    const title = data.Title + "- Porkast"

    return {
        title: title,
        description: data.ChannelDesc,
        authors: [data.Author],
    }
}

export const getChannelInfoById = cache(async (id: string) => {
    const res = await fetch(`${process.env.API_BASE_URL}v1/api/feed/channel/${id}`)
    const data = await res.json()
    return data.data
})