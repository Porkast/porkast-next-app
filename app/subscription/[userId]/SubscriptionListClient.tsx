'use client'

import { AppProvider } from "@/components/AppContext"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { AvatarImage } from "@/components/PorkastImage"
import UnsubscribeKeywordButton from "@/components/UnsubscribeKeywordButton"
import { formatDateTime } from "@/libs/common"
import { ServerUserInfo } from "@/libs/user"
import { SubscriptionDataDto } from "@/types/subscription"
import { FeedItem } from "@/types/feed_item"
import Link from "next/link"
import SubscriptionFeedList from "./SubscriptionFeedList"

type Props = {
    userId: string
    page: number
    userInfo: ServerUserInfo | null
    nickname: string
    subscriptionList: SubscriptionDataDto[]
    totalCount: number
    totalPage: number
    initialFeedItems: FeedItem[]
    feedTotalCount: number
    keywordsUsed: number
    keywordsLimit: number | null
    tier: string
}

function formatTier(tier: string): string {
    switch (tier) {
        case 'unlimited': return 'Unlimited'
        case 'pro': return 'Pro'
        default: return 'Free'
    }
}

export default function SubscriptionListClient({ userId, page, userInfo, nickname, subscriptionList, totalCount, totalPage, initialFeedItems, feedTotalCount, keywordsUsed, keywordsLimit, tier }: Props) {
    const prevPage = page > 1 ? page - 1 : 1
    const nextPage = page < totalPage ? page + 1 : page

    return (
        <AppProvider>
            <div>
                <Header title="Subscription">
                    <div className='w-full flex justify-center mb-9 min-h-screen pt-20'>
                        <div className='w-full max-w-2xl pl-6 pr-6 mb-9'>
                            <div className="w-full mb-10">
                                <div className="flex justify-center mt-4">
                                    <div className="w-full">
                                        <div className="flex justify-center">
                                            <AvatarImage className="w-28" imageUrl={userInfo?.avatar} displayName={nickname} />
                                        </div>
                                        <div className="flex justify-center mt-4">
                                            <div className="md:text-2xl text-xl font-bold">{nickname}{`'s Subscription`}</div>
                                        </div>
                                        <div className="flex justify-center mt-4">
                                            <div className="mt-4 text-sm text-gray-500">{nickname}@Porkast</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-center mt-3">
                                    <div className="badge badge-primary badge-lg gap-1">
                                        <span className="font-semibold">{formatTier(tier)}</span>
                                        <span className="opacity-50">·</span>
                                        <span>Keywords:</span>
                                        <span className="font-semibold">{keywordsUsed}</span>
                                        <span>/</span>
                                        <span className="font-semibold">{keywordsLimit === null ? '∞' : keywordsLimit}</span>
                                    </div>
                                </div>
                            </div>
                            <div className='text-neutral-500 text-sm mb-6 ml-2'>{totalCount} results</div>
                            {
                                subscriptionList?.map((item, index) => {
                                    const encodeKeyword = encodeURIComponent(item.Keyword)
                                    return (
                                        <div key={index} className="card w-full bg-base-100 shadow-xl mb-6">
                                            <div className="card-body">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        {
                                                            item.Keyword ? (
                                                                <h2 className="card-title">
                                                                    <a href={`/subscription/${userId}/${encodeKeyword}`} className="hover:text-primary">
                                                                        #{item.Keyword}
                                                                    </a>
                                                                </h2>
                                                            ) : (
                                                                <h2 className="card-title">{item.RefName}</h2>
                                                            )
                                                        }
                                                        <div className="md:flex block md:justify-start mt-2">
                                                            {
                                                                item.UpdateTime != null ? (
                                                                    <div className="mr-4 md:mb-0 mb-4">Update at: {formatDateTime(item.UpdateTime.toLocaleString())}</div>
                                                                ) : (
                                                                    <div>Create at: {formatDateTime(item.CreateTime?.toLocaleString())}</div>
                                                                )
                                                            }
                                                            {
                                                                item.TotalCount == 0 ? (
                                                                    <div></div>
                                                                ) : (
                                                                    <p>Episodes: {item.TotalCount}</p>
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="card-actions justify-end">
                                                        {
                                                            item.Keyword && (
                                                                <UnsubscribeKeywordButton userId={userId} keyword={item.Keyword} />
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <div className="w-full flex justify-center pt-6 pb-9">
                                <div className="join">
                                    {
                                        page > 1 ? (
                                            <Link className="join-item btn btn-neutral" href={`/subscription/${userId}/?page=${prevPage}`}>«</Link>
                                        ) : (
                                            <button className="join-item btn btn-neutral btn-disabled">«</button>
                                        )
                                    }
                                    <button className="join-item btn btn-neutral">Page {page}</button>
                                    {
                                        page < totalPage ? (
                                            <Link className="join-item btn btn-neutral" href={`/subscription/${userId}/?page=${nextPage}`}>»</Link>
                                        ) : (
                                            <button className="join-item btn btn-neutral btn-disabled">»</button>
                                        )
                                    }
                                </div>
                            </div>
                            <SubscriptionFeedList
                                userId={userId}
                                initialItems={initialFeedItems}
                                initialTotalCount={feedTotalCount}
                            />
                        </div>
                    </div>
                </Header>
                <Footer />
            </div>
        </AppProvider>
    )
}
