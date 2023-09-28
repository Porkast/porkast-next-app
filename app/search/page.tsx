'use client'

import { Helmet } from 'react-helmet';
import EpisodeCard from "@/components/EpisodeCard"
import Header from "@/components/Header"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from 'react';
import Footer from '@/components/Footer';

export default function SearchPage() {

    const searhcParam = useSearchParams()
    const [searchResultData, setSearchResultData] = useState([])
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

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`${process.env.API_BASE_URL}v1/api/search/feed/item?keyword=${q}&page=${page}&scope=${scope}&sortByDate=${sortByDate}`)
            const data = await res.json()
            console.log(data)
            setSearchResultData(data.data)
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
                    {
                        searchResultData.map((item: any) => {
                            return (
                                <EpisodeCard  key={item.Id} data={{
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
            <Footer />
        </div>
    )
}
