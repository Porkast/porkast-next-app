import { SubscriptionDataDto } from "@/types/subscription"
import prisma from "../prisma"
import { FeedItem, FeedItemDto } from "@/types/feed_item"
import { Prisma } from "@prisma/client"
import { formatDateTime } from "../common"


export async function queryUserKeywordSubscriptionDetail(userId: string, keyword: string): Promise<SubscriptionDataDto> {

    const queryResult = await prisma.user_subscription.findFirst({
        where: {
            user_id: userId,
            keyword: keyword
        }
    })

    if (!queryResult) {
        throw new Error("Subscription not found")
    }

    const resultDto: SubscriptionDataDto = {
        Id: queryResult?.id || "",
        UserId: queryResult?.user_id || "",
        CreateTime: queryResult?.create_time || new Date(),
        Status: queryResult?.status || 0,
        Keyword: queryResult?.keyword || "",
        OrderByDate: queryResult?.order_by_date || 0,
        Lang: queryResult?.lang || "",
        Country: queryResult?.country || "",
        ExcludeFeedId: queryResult?.exclude_feed_id || "",
        Source: queryResult?.source || "",
        RefId: queryResult?.ref_id || "",
        RefName: queryResult?.ref_name || "",
        Type: queryResult?.type || "",
        Count: 0
    }

    return resultDto
}

export async function queryUserKeywordSubscriptionList(userId: string, offset: number, limit: number): Promise<SubscriptionDataDto[]> {

    const resultDtos: SubscriptionDataDto[] = []

    const queryResutlList = await prisma.user_subscription.findMany({
        where: {
            user_id: userId,
            status: 1
        },
        orderBy: {
            latest_id: 'desc'
        },
        skip: offset,
        take: limit
    })

    const totalCount = await prisma.user_subscription.count({
        where: {
            user_id: userId,
            status: 1
        }
    })

    for (const queryResutl of queryResutlList) {
        resultDtos.push({
            Id: queryResutl.id,
            UserId: queryResutl.user_id || '',
            CreateTime: queryResutl.create_time || new Date(),
            Status: queryResutl.status || 0,
            Keyword: queryResutl.keyword || '',
            OrderByDate: queryResutl.order_by_date || 0,
            Lang: queryResutl.lang || '',
            Country: queryResutl.country || '',
            ExcludeFeedId: queryResutl.exclude_feed_id || '',
            Source: queryResutl.source || '',
            RefId: queryResutl.ref_id || '',
            RefName: queryResutl.ref_name || '',
            Type: queryResutl.type || '',
            Count: totalCount,
            UpdateTime: queryResutl.update_time,
            TotalCount: queryResutl.total_count || 0
        })
    }

    return resultDtos
}


export async function queryKeywordSubscriptionFeedItemList(userId: string, keyword: string, source: string, country: string, excludeFeedId: string, offset: number, limit: number): Promise<FeedItem[]> {

    const resultList: FeedItem[] = []


    const queryResultList = await prisma.$queryRaw<FeedItemDto[]>(
        Prisma.sql`
        SELECT fi.*,ks.source,ks.exclude_feed_id,ks.country 
        FROM feed_item fi 
        INNER JOIN keyword_subscription ks ON (fi.id = ks.feed_item_id) 
        INNER JOIN user_subscription usk ON (usk.keyword = ks.keyword and usk.country = ks.country and usk.exclude_feed_id = ks.exclude_feed_id and usk.source = ks.source) 
        WHERE usk.user_id = ${userId} and usk.keyword = ${keyword} and usk.source = ${source} and usk.country = ${country} and usk.exclude_feed_id = ${excludeFeedId} and usk.status = 1 
        ORDER BY fi.pub_date DESC 
        LIMIT ${limit}
        OFFSET ${offset}
        `
    )

    const totalCount = await prisma.keyword_subscription.count({
        where: {
            keyword: keyword,
            source: source,
            country: country,
            exclude_feed_id: excludeFeedId,
        }
    })

    for (const queryResult of queryResultList) {
        resultList.push({
            Id: queryResult.id,
            FeedId: queryResult.feed_id,
            GUID: queryResult.guid || '',
            ChannelId: queryResult.channel_id,
            Title: queryResult.title || '',
            HighlightTitle: queryResult.title || '',
            Link: queryResult.link || '',
            PubDate: formatDateTime(queryResult.pub_date?.toString() || new Date().toString()),
            Author: queryResult.author || '',
            InputDate: queryResult.input_date || new Date(),
            ImageUrl: queryResult.image_url || '',
            EnclosureUrl: queryResult.enclosure_url || '',
            EnclosureLength: queryResult.enclosure_length || '0',
            EnclosureType: queryResult.enclosure_type || '',
            Description: String(queryResult.description) || '',
            Source: queryResult.source || '',
            Country: queryResult.country || '',
            ExcludeFeedId: queryResult.exclude_feed_id || '',
            Duration: queryResult.duration || '',
            Episode: queryResult.episode || '',
            Explicit: queryResult.explicit || '',
            Season: queryResult.season || '',
            EpisodeType: queryResult.enclosure_type || '',
            TextDescription: '',
            ChannelImageUrl: '',
            ChannelTitle: queryResult.channel_title || '',
            HighlightChannelTitle: "",
            FeedLink: queryResult.feed_link || '',
            Count: totalCount,
            TookTime: 0,
            HasThumbnail: true
        })
    }

    return resultList
}

export async function queryUserLatestKeywordSubscriptionFeedItemList(userId: string, keyword: string, source: string, country: string, excludeFeedId: string, latestId: string, offset: number, limit: number): Promise<FeedItem[]> {

    const resultList: FeedItem[] = []


    const queryResultList = await prisma.$queryRaw<FeedItemDto[]>(
        Prisma.sql`
        SELECT fi.*,ks.source,ks.exclude_feed_id,ks.country 
        FROM feed_item fi 
        INNER JOIN keyword_subscription ks ON (fi.id = ks.feed_item_id) 
        INNER JOIN user_subscription usk ON (usk.keyword = ks.keyword and usk.country = ks.country and usk.exclude_feed_id = ks.exclude_feed_id and usk.source = ks.source) 
        WHERE usk.user_id = ${userId} and usk.keyword = ${keyword} and usk.source = ${source} and usk.country = ${country} and usk.exclude_feed_id = ${excludeFeedId} and ks.id > ${latestId} and usk.status = 1 
        ORDER BY fi.pub_date DESC 
        LIMIT ${limit}
        OFFSET ${offset}
        `
    )

    const totalCount = await prisma.keyword_subscription.count({
        where: {
            keyword: keyword,
            source: source,
            country: country,
            exclude_feed_id: excludeFeedId,
        }
    })

    for (const queryResult of queryResultList) {
        resultList.push({
            Id: queryResult.id,
            FeedId: queryResult.feed_id,
            GUID: queryResult.guid || '',
            ChannelId: queryResult.channel_id,
            Title: queryResult.title || '',
            HighlightTitle: queryResult.title || '',
            Link: queryResult.link || '',
            PubDate: formatDateTime(queryResult.pub_date?.toString() || new Date().toString()),
            Author: queryResult.author || '',
            InputDate: queryResult.input_date || new Date(),
            ImageUrl: queryResult.image_url || '',
            EnclosureUrl: queryResult.enclosure_url || '',
            EnclosureLength: queryResult.enclosure_length || '0',
            EnclosureType: queryResult.enclosure_type || '',
            Description: String(queryResult.description) || '',
            Source: queryResult.source || '',
            Country: queryResult.country || '',
            ExcludeFeedId: queryResult.exclude_feed_id || '',
            Duration: queryResult.duration || '',
            Episode: queryResult.episode || '',
            Explicit: queryResult.explicit || '',
            Season: queryResult.season || '',
            EpisodeType: queryResult.enclosure_type || '',
            TextDescription: '',
            ChannelImageUrl: '',
            ChannelTitle: queryResult.channel_title || '',
            HighlightChannelTitle: "",
            FeedLink: queryResult.feed_link || '',
            Count: totalCount,
            TookTime: 0,
            HasThumbnail: true
        })
    }

    return resultList
}