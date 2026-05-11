'use client'

import { useEffect, useRef, useState } from "react"
import EpisodeCard from "@/components/EpisodeCard"
import { FeedItem } from "@/types/feed_item"
import { getUserAllSubscriptionItems } from "@/libs/subscription"

type Props = {
    userId: string
    initialItems: FeedItem[]
    initialTotalCount: number
}

export default function SubscriptionFeedList({ userId, initialItems, initialTotalCount }: Props) {

    const [items, setItems] = useState<FeedItem[]>(initialItems)
    const [hasMore, setHasMore] = useState(initialItems.length === 10)
    const [loading, setLoading] = useState(false)

    const sentinelRef = useRef<HTMLDivElement>(null)
    const offsetRef = useRef(initialItems.length)
    const loadingRef = useRef(false)
    const hasMoreRef = useRef(initialItems.length === 10)

    useEffect(() => {
        loadingRef.current = loading
    }, [loading])

    useEffect(() => {
        hasMoreRef.current = hasMore
    }, [hasMore])

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMoreRef.current && !loadingRef.current) {
                loadMore()
            }
        }, { threshold: 0.1 })

        const sentinel = sentinelRef.current
        if (sentinel) {
            observer.observe(sentinel)
        }

        return () => {
            observer.disconnect()
        }
    }, [])

    const loadMore = async () => {
        setLoading(true)
        loadingRef.current = true
        const resp = await getUserAllSubscriptionItems(userId, offsetRef.current, 10)
        if (resp.code === 0 && resp.data.length > 0) {
            setItems(prev => [...prev, ...resp.data])
            offsetRef.current += resp.data.length
            if (resp.data.length < 10) {
                setHasMore(false)
                hasMoreRef.current = false
            }
        } else {
            setHasMore(false)
            hasMoreRef.current = false
        }
        setLoading(false)
    }

    if (initialTotalCount === 0) {
        return null
    }

    return (
        <div className="mt-12">
            <div className="text-neutral-500 text-sm mb-6 ml-2">{initialTotalCount} episodes</div>
            {
                items.map((item, index) => {
                    return (
                        <EpisodeCard key={item.GUID + '-' + index} data={{
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
                            audioLength: item.Duration,
                            audioSrc: item.EnclosureUrl
                        }} />
                    )
                })
            }
            {
                loading && (
                    <div className="flex justify-center py-6">
                        <span className="loading loading-spinner loading-md"></span>
                    </div>
                )
            }
            <div ref={sentinelRef} className="h-4" />
            {
                !hasMore && items.length > 0 && (
                    <div className="text-center text-neutral-500 text-sm py-6">No more episodes</div>
                )
            }
        </div>
    )
}
