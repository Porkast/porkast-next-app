'use client'

import { Helmet } from 'react-helmet';
import EpisodeCard from "@/components/EpisodeCard"
import Header from "@/components/Header"
import { useSearchParams } from "next/navigation"
import { useEffect, useState, useRef } from 'react';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { AppProvider } from '@/components/AppContext';
import { FeedItem } from '@/types/feed_item';
import { searchPodcastEpisodeFromItunes } from '@/libs/itunes';
import Loading from '@/components/Loading';
import SubscribeSearchKeywordButton, { SubscribeSearchKeywordButtonRef } from '@/components/SubscribeSearchKeywordButton';
import AddExcludeFeedIdDialog, { AddExcludeFeedIdDialogRef } from '@/components/AddExcludeFeedIdDialog';

enum Page {
    NextPage,
    PrePage
}

export default function SearchPage() {

    const searhcParam = useSearchParams()
    const [searchResultData, setSearchResultData] = useState<FeedItem[]>([])
    const [searchResultCount, setSearchResultCount] = useState(0)
    const [searchResultTotalPage, setSearchResultTotalPage] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [isNextBtnClickable, setIsNextBtnClickable] = useState(true)
    const [isPreBtnClickable, setIsPreBtnClickable] = useState(true)
    const addExcludeFeedIdDialogRef = useRef<AddExcludeFeedIdDialogRef>(null)
    const subBtnRef = useRef<SubscribeSearchKeywordButtonRef>(null)
    const q = searhcParam.get('q')
    const excludeFeedId = searhcParam.get('excludeFeedId')
    const searchTotalCount = 200
    const limit = 10

    let page = searhcParam.get('page') || '1'
    let entity = searhcParam.get('scope')
    if (!entity) {
        entity = "item"
    }
    let country = searhcParam.get('country')
    if (!country) {
        country = "US"
    }
    let source = searhcParam.get('source')
    if (!source) {
        source = "itunes"
    }

    const prevPageUrl = getTargetPageUrl(q || '', parseInt(page), searchResultTotalPage, Page.PrePage)
    const nextPageUrl = getTargetPageUrl(q || '', parseInt(page), searchResultTotalPage, Page.NextPage)

    const showExcludeDialog = (channelTitle: string, feedId: string) => {
        addExcludeFeedIdDialogRef.current?.showModal(channelTitle, feedId)
    }

    useEffect(() => {
        const fetchData = (async () => {
            setIsLoading(true)
            const offest = (parseInt(page || '1') - 1) * limit
            const data = await searchPodcastEpisodeFromItunes(q || '', 'podcastEpisode', country || 'US', excludeFeedId || '', offest, limit, searchTotalCount)
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
            subBtnRef.current?.updateSearchKeyword(q || '')
        })

        if (!q || q.length == 0) {
            return
        }

        fetchData()
    }, [q, page, entity, country])


    useEffect(() => {
        if (parseInt(page) >= searchResultTotalPage) {
            setIsNextBtnClickable(false)
        } else {
            setIsNextBtnClickable(true)
        }
        if (parseInt(page) <= 1) {
            setIsPreBtnClickable(false)
        } else {
            setIsPreBtnClickable(true)
        }
    }, [page, searchResultCount])

    return (
        <AppProvider>
            <div className="w-full">
                <Helmet>
                    <title>Porkast-{q}</title>
                </Helmet>
                <Header keyword={q ? q : ""} title='Search'>
                    <div className="w-full flex justify-center pl-6 pr-6 pt-20">
                        <div className="w-full max-w-2xl">
                            <div className='text-neutral-500 text-sm mb-6 ml-2'>{searchResultCount} results</div>
                            {
                                isLoading ? (
                                    <Loading />
                                ) : (
                                    <>
                                        {
                                            searchResultData?.map((item: FeedItem) => {
                                                return (
                                                    <EpisodeCard key={item.Id} data={{
                                                        itemId: item.GUID,
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
                                                        audioSrc: item.EnclosureUrl,
                                                        showExcludeBtn: true
                                                    }}
                                                        onExcludeModalBtnClick={showExcludeDialog}
                                                    />
                                                )
                                            })
                                        }
                                    </>
                                )
                            }
                            <div className='flex justify-start w-full'>
                                <SubscribeSearchKeywordButton ref={subBtnRef} keyword={q || ''} excludeFeedId={excludeFeedId || ''} country={country} source={source || ''} />
                            </div>
                        </div>
                    </div>
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
                    <AddExcludeFeedIdDialog ref={addExcludeFeedIdDialogRef} />
                </Header>
                <Footer />
            </div>
        </AppProvider>
    )
}

const getTargetPageUrl = (keyword: string, currentPage: number, searchResultTotalPage: number, target: Page): string => {
    const urlParams = new URLSearchParams(window.location.search);
    var targetPageUrl = '';
    var targetPageNum = 0;
    var entity = urlParams.get('entity') ? urlParams.get('entity') : 'item';
    var country = urlParams.get('country') ? urlParams.get('country') : 'US';
    var excludeFeedId = urlParams.get('excludeFeedId') ? urlParams.get('excludeFeedId') : '';

    if (target == Page.NextPage) {
        targetPageNum = currentPage >= searchResultTotalPage ? currentPage : currentPage + 1
    } else {
        targetPageNum = currentPage > 1 ? currentPage - 1 : currentPage
    }
    targetPageUrl = "/search?q=" + keyword + "&page=" + targetPageNum + "&entity=" + entity + "&country=" + country + "&excludeFeedId=" + excludeFeedId

    return targetPageUrl
}
