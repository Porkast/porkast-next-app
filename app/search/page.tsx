'use client'

import { Helmet } from 'react-helmet';
import EpisodeCard from "@/components/EpisodeCard"
import HorizontalPodcastListView from '@/components/HorizontalPodcastListView';
import Header from "@/components/Header"
import { useSearchParams } from "next/navigation"
import { cache, useEffect, useState } from 'react';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { AppProvider } from '@/components/AppContext';
import { FeedItem } from '@/types/feed_item';
import { FeedChannel } from '@/types/feed_channel';
import { searchPodcastEpisodeFromItunes } from '@/libs/itunes';
import Loading from '@/components/Loading';


export default function SearchPage() {

    const searhcParam = useSearchParams()
    const [searchResultData, setSearchResultData] = useState<FeedItem[]>([])
    const [searchChannelResultData, setSearchChannelResultData] = useState<FeedChannel[]>([])
    const [searchResultCount, setSearchResultCount] = useState(0)
    const [searchResultTotalPage, setSearchResultTotalPage] = useState(1)
    const [showSearchChannelResult, setShowSearchChannelResult] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const q = searhcParam.get('q')
    const searchTotalCount = 200
    const limit = 10

    let page = searhcParam.get('page')
    if (!page) {
        page = "1"
    }
    let entity = searhcParam.get('scope')
    if (!entity) {
        entity = "item"
    }
    let country = searhcParam.get('country')
    if (!country) {
        country = "US"
    }

    let nextPage = 0
    if (parseInt(page) >= searchResultTotalPage) {
        nextPage = parseInt(page)
    } else {
        nextPage = parseInt(page) + 1
    }
    const nextPageUrl = "/search?q=" + q + "&page=" + nextPage + "&entity=" + entity + "&country=" + country

    let prePage = 0
    if (parseInt(page) > 1) {
        prePage = parseInt(page) - 1
    } else {
        prePage = parseInt(page)
    }
    const prevPageUrl = "/search?q=" + q + "&page=" + prePage + "&entity=" + entity + "&country=" + country

    useEffect(() => {
        const fetchData = cache(async () => {
            setIsLoading(true)
            const offest = (parseInt(page || '1') - 1) * limit
            const data = await searchPodcastEpisodeFromItunes(q || '', 'podcastEpisode', country || 'US', offest, limit, searchTotalCount)
            setIsLoading(false)
            setSearchResultData(data)
            if (data.length > 0) {
                const totalCount = data[0].Count
                setSearchResultCount(totalCount)
                const totalPage = Math.ceil(totalCount / limit)
                setSearchResultTotalPage(totalPage)
            } else {
                setSearchResultCount(0)
            }
        })

        const searchFeedChannel = cache(async () => {
            const res = await fetch(`${process.env.API_BASE_URL}v1 / api / search / feed / channel ? keyword = ${q}`)
            const data = await res.json()
            const channelResultList = data.data
            setSearchChannelResultData(channelResultList)
        })

        if (!q || q.length == 0) {
            return
        }

        fetchData()
    }, [q, page, entity, country])

    return (
        <AppProvider>
            <div className="w-full">
                <Helmet>
                    <title>Porkast-{q}</title>
                </Helmet>
                <Header keyword={q ? q : ""} />
                <div className="w-full flex justify-center pl-6 pr-6">
                    <div className="w-full max-w-2xl">
                        <div className='text-neutral-500 text-sm mb-6 ml-2'>{searchResultCount} results</div>
                        {
                            showSearchChannelResult ?
                                <div className='w-full mt-4 mb-9'>
                                    <HorizontalPodcastListView podcastChannelInfoList={searchChannelResultData} />
                                </div>
                                : null
                        }
                        {
                            isLoading ? (
                                <Loading />
                            ) : (
                                <>
                                    {
                                        searchResultData?.map((item: any) => {
                                            return (
                                                <EpisodeCard key={item.Id} data={{
                                                    itemId: item.Id,
                                                    channelId: item.ChannelId,
                                                    title: item.HighlightTitle,
                                                    description: item.TextDescription,
                                                    image: item.ImageUrl,
                                                    link: item.Link,
                                                    rssLink: item.FeedLink,
                                                    channelName: item.HighlightChannelTitle,
                                                    authorName: item.Author,
                                                    pubDate: item.PubDate,
                                                    audioLength: item.Duration,
                                                    audioSrc: item.EnclosureUrl
                                                }} />
                                            )
                                        })
                                    }
                                </>
                            )
                        }
                    </div>
                </div>
                <div className="w-full flex justify-center pt-6 pb-9">
                    <div className="join">
                        <Link className="join-item btn btn-neutral" href={prevPageUrl}>«</Link>
                        <button className="join-item btn btn-neutral">Page {page}</button>
                        <Link className="join-item btn btn-neutral" href={nextPageUrl}>»</Link>
                    </div>
                </div>
                <Footer />
            </div>
        </AppProvider>
    )
}
