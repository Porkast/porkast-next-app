'use client'

import EpisodeCard from "@/components/EpisodeCard"
import Header from "@/components/Header"
import { useSearchParams } from "next/navigation"
import { useRef } from 'react';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { AppProvider } from '@/components/AppContext';
import { FeedItem } from '@/types/feed_item';
import AddExcludeFeedIdDialog, { AddExcludeFeedIdDialogRef } from '@/components/AddExcludeFeedIdDialog';
import SubscribeKeywrodDialog, { SubscribeKeywrodDialogRef } from '@/components/SubscribeKeywrodDialog';

enum Page {
    NextPage,
    PrePage
}

type Props = {
    q: string
    page: number
    country: string
    source: string
    excludeFeedId: string
    entity: string
    searchResults: FeedItem[]
    totalCount: number
    totalPage: number
}

export default function SearchContent({ q, page, country, source, excludeFeedId, entity, searchResults, totalCount, totalPage }: Props) {

    const addExcludeFeedIdDialogRef = useRef<AddExcludeFeedIdDialogRef>(null)
    const subscribeSearchKeywordDialogRef = useRef<SubscribeKeywrodDialogRef>(null)

    const prevPageUrl = getTargetPageUrl(q, page, totalPage, Page.PrePage, entity, country, excludeFeedId)
    const nextPageUrl = getTargetPageUrl(q, page, totalPage, Page.NextPage, entity, country, excludeFeedId)

    const isPreBtnClickable = page > 1
    const isNextBtnClickable = page < totalPage

    const showExcludeDialog = (channelTitle: string, feedId: string) => {
        addExcludeFeedIdDialogRef.current?.showModal(channelTitle, feedId)
    }

    const showSubscribeSearchKeywordDialog = () => {
        subscribeSearchKeywordDialogRef.current?.showDialog(q || '', excludeFeedId || '', country, source)
    }

    return (
        <AppProvider>
            <div className="w-full">
                <Header keyword={q || ""} title='Search'>
                    <div className="w-full flex justify-center pl-6 pr-6 pt-20">
                        <div className="w-full max-w-2xl">
                            <div className='text-neutral-500 text-sm mb-6 ml-2'>{totalCount} results</div>
                            {
                                searchResults?.map((item: FeedItem) => {
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
                            <div className='flex justify-start w-full'>
                                <button className="btn btn-primary rounded-lg ml-4" onClick={showSubscribeSearchKeywordDialog}>
                                    <span className="font-bold text-base">Subscribe {q}</span>
                                </button>
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
                    <SubscribeKeywrodDialog ref={subscribeSearchKeywordDialogRef} />
                </Header>
                <Footer />
            </div>
        </AppProvider>
    )
}

const getTargetPageUrl = (keyword: string, currentPage: number, searchResultTotalPage: number, target: Page, entity: string, country: string, excludeFeedId: string): string => {
    var targetPageNum = 0;

    if (target == Page.NextPage) {
        targetPageNum = currentPage >= searchResultTotalPage ? currentPage : currentPage + 1
    } else {
        targetPageNum = currentPage > 1 ? currentPage - 1 : currentPage
    }
    return "/search?q=" + keyword + "&page=" + targetPageNum + "&entity=" + entity + "&country=" + country + "&excludeFeedId=" + excludeFeedId
}
