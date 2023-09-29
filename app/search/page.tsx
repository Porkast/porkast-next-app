'use client'

import { Helmet } from 'react-helmet';
import EpisodeCard from "@/components/EpisodeCard"
import HorizontalPodcastListView from '@/components/HorizontalPodcastListView';
import Header from "@/components/Header"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from 'react';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function SearchPage() {

    const searhcParam = useSearchParams()
    const [searchResultData, setSearchResultData] = useState([])
    const [searchChannelResultData, setSearchChannelResultData] = useState([])
    const [searchResultCount, setSearchResultCount] = useState(0)
    const [searchResultTotalPage, setSearchResultTotalPage] = useState(1)
    const [searchResultTime, setSearchResultTime] = useState(0)
    const [showSearchChannelResult, setShowSearchChannelResult] = useState(true)
    const q = searhcParam.get('q')
    let page = searhcParam.get('page')
    if (!page) {
        page = "1"
    }
    let scope = searhcParam.get('scope')
    if (!scope) {
        scope = "item"
    }
    let sortByDate = searhcParam.get('sortByDate')
    if (!sortByDate) {
        sortByDate = "0"
    }

    let nextPage = 0
    if (parseInt(page) >= searchResultTotalPage) {
        nextPage = parseInt(page)
    } else {
        nextPage = parseInt(page) + 1
    }
    const nextPageUrl = "/search?q=" + q + "&page=" + nextPage + "&scope=" + scope + "&sortByDate=" + sortByDate

    let prePage = 0
    if (parseInt(page) > 1) {
        prePage = parseInt(page) - 1
    } else {
        prePage = parseInt(page)
    }
    const prevPageUrl = "/search?q=" + q + "&page=" + prePage + "&scope=" + scope + "&sortByDate=" + sortByDate

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`${process.env.API_BASE_URL}v1/api/search/feed/item?keyword=${q}&page=${page}&scope=${scope}&sortByDate=${sortByDate}`)
            const data = await res.json()
            setSearchResultData(data.data.items)
            setSearchResultCount(data.data.totalCount)
            setSearchResultTotalPage(data.data.totalPage)
            setSearchResultTime(data.data.tookTime)
        }

        async function searchFeedChannel() {
            const res = await fetch(`${process.env.API_BASE_URL}v1/api/search/feed/channel?keyword=${q}`)
            const data = await res.json()
            const channelResultList = data.data
            setSearchChannelResultData(channelResultList)
        }

        if (page == "1") {
            searchFeedChannel()
            setShowSearchChannelResult(true)
        } else {
            setShowSearchChannelResult(false)
        }

        fetchData()
    }, [q, page, scope, sortByDate])

    return (
        <div className="w-full">
            <Helmet>
                <title>Porkast-{q}</title>
            </Helmet>
            <Header keyword={q ? q : ""} />
            <div className="w-full flex justify-center pt-24 pl-6 pr-6">
                <div className="w-full max-w-2xl">
                    <div className='text-neutral-500 text-sm mb-6 ml-2'>{searchResultCount} results ({searchResultTime} seconds)</div>
                    {
                        showSearchChannelResult ?
                            <div className='w-full mt-4 mb-9'>
                                <HorizontalPodcastListView podcastChannelInfoList={searchChannelResultData} />
                            </div>
                            : null
                    }
                    {
                        searchResultData.map((item: any) => {
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
                                    audioLength: item.Duration
                                }} />
                            )
                        })
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
    )
}
