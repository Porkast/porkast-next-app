import { generateFeedItemId } from "@/libs/common";
import { searchPodcastEpisodeFromItunes } from "@/libs/itunes";
import prisma from "@/libs/prisma";
import { FeedItem } from "@/types/feed_item";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";


export async function GET(request: NextRequest) {

    const resp: JsonResponse = {
        code: 0,
        message: '',
        data: null
    }
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        resp.code = 1
        resp.message = 'Unauthorized'
        return new Response(JSON.stringify(resp), {
            status: 401
        })
    }

    const searchParams = request.nextUrl.searchParams
    const keyword = searchParams.get('keyword')
    const country = searchParams.get('country') || 'US'
    const excludeFeedIds = searchParams.get('excludeFeedIds') || ''
    const source = searchParams.get('source') || 'itunes'

    if (!keyword) {
        resp.code = 1
        resp.message = 'Missing parameters'
        return new Response(JSON.stringify(resp), {
            status: 400
        })
    }

    const feedItemList = await searchPodcastEpisodeFromItunes(keyword, 'podcastEpisode', country, excludeFeedIds, 0, 0, 200)

    if (!feedItemList || feedItemList.length === 0) {
        resp.code = 1
        resp.message = 'No results from itunes, with parameters \n' + JSON.stringify({ keyword, country, excludeFeedIds, source })
        return new Response(JSON.stringify(resp), {
            status: 200
        })
    }


    const model = await buildFeedItemAndKeywordInputList(keyword, country, excludeFeedIds, source, feedItemList)

    try {
        await prisma.keyword_subscription.createMany({
            data: model.keywordSubscriptionList,
            skipDuplicates: true
        })
    } catch (error) {

    }

    try {
        await prisma.feed_item.createMany({
            data: model.feedItemList,
            skipDuplicates: true
        })
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2002') {
                console.log(
                    'There is a unique constraint violation, a new record cannot be created with prisma for feed_item, ignore it',
                )
            }
        } else {
            console.error(e)
            resp.code = 1
            resp.message = 'Insert search feed item list failed ' + e
            return new Response(JSON.stringify(resp), {
                status: 500
            })
        }
    }

    resp.code = 0
    resp.message = 'Success'
    return new Response(JSON.stringify(resp), {
        status: 200
    })
}

const buildFeedItemAndKeywordInputList = async (keyword: string, country: string, excludeFeedIds: string, source: string, feedItemList: FeedItem[]): Promise<{ feedItemList: Prisma.feed_itemCreateManyInput[], keywordSubscriptionList: Prisma.keyword_subscriptionCreateManyInput[] }> => {
    const feedItemCreateInputList: Prisma.feed_itemCreateManyInput[] = []
    const keywordSubscriptionInputList: Prisma.keyword_subscriptionCreateManyInput[] = []


    for (const item of feedItemList) {
        const itemId = await generateFeedItemId(item.FeedLink, item.Title)
        const channelId = await generateFeedItemId(item.FeedLink, item.ChannelTitle)
        const feedItemInput: Prisma.feed_itemCreateManyInput = {
            id: itemId,
            channel_id: channelId,
            feed_id: String(item.FeedId),
            guid: item.GUID,
            title: item.Title,
            link: item.Link,
            pub_date: new Date(item.PubDate),
            author: item.Author,
            input_date: new Date(),
            image_url: item.ImageUrl,
            enclosure_url: item.EnclosureUrl,
            enclosure_type: item.EnclosureType,
            enclosure_length: String(item.EnclosureLength),
            duration: item.Duration,
            episode: item.Episode,
            episodeType: item.EpisodeType,
            explicit: item.Explicit,
            season: item.Season,
            description: Buffer.from(item.Description),
            channel_title: item.ChannelTitle,
            feed_link: item.FeedLink,
            source: item.Source,
        }

        const keywordSubscriptionInput: Prisma.keyword_subscriptionCreateInput = {
            keyword: keyword,
            feed_channel_id: channelId,
            feed_item_id: itemId,
            create_time: new Date(),
            country: country,
            source: source,
            exclude_feed_id: excludeFeedIds
        }

        feedItemCreateInputList.push(feedItemInput)
        keywordSubscriptionInputList.push(keywordSubscriptionInput)
    }
    return {
        feedItemList: feedItemCreateInputList,
        keywordSubscriptionList: keywordSubscriptionInputList
    }
}
