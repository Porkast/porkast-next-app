import { generateFeedItemId } from "@/libs/common";
// import { searchPodcastEpisodeFromItunes } from "@/libs/itunes";
import prisma from "@/libs/prisma";
import { searchSpotifyEpisodes } from "@/libs/spotify";
import { FeedItem } from "@/types/feed_item";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {

    const resp: JsonResponse = {
        code: 0,
        message: '',
        data: null
    }
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        resp.code = 1
        resp.message = 'Unauthorized'
        return new Response(JSON.stringify(resp), {
            status: 401
        })
    }

    const allUserSubscriptionList = await prisma.user_subscription.findMany({
        where: {
            status: 1
        }
    })

    console.log('start trigger search keyword subscription update jobs, total: ' + allUserSubscriptionList.length)
    for (const userSubscription of allUserSubscriptionList) {
        const keyword = userSubscription.keyword
        const country = userSubscription.country
        const excludeFeedIds = userSubscription.exclude_feed_id
        const source = userSubscription.source
        const apiUrl = `https://zeplo.to/https://porkast.com/api/jobs/subscription/searchkeyword/update?_trace=ada8aea9-c8c8-4311-8b23-03b3d77b68ad-iow&_token=${process.env.ZEPLO_TOKEN}`
        const resp = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.CRON_SECRET}`
            },
            body: JSON.stringify({
                "keyword": keyword,
                "country": country,
                "excludeFeedIds": excludeFeedIds,
                "source": source
            })
        })
        console.log('trigger search keyword subscription update jobs, keyword: ' + keyword + ', country: ' + country + ', excludeFeedIds: ' + excludeFeedIds + ', source: ' + source)
        console.log('trigger search keyword subscription update jobs, zeplo response: ' + JSON.stringify(await resp.json()))
    }

    resp.code = 0
    resp.message = 'OK'
    return new Response(JSON.stringify(resp), {
        status: 200
    })
}


export async function POST(request: NextRequest) {

    const resp: JsonResponse = {
        code: 0,
        message: '',
        data: null
    }
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        resp.code = 1
        resp.message = 'Unauthorized'
        return new Response(JSON.stringify(resp), {
            status: 401
        })
    }

    const body = await request.json();
    const keyword = body.keyword
    const country = body.country
    const excludeFeedIds = body.excludeFeedIds
    const source = body.source
    if (!keyword) {
        resp.code = 1
        resp.message = 'Missing parameters'
        return new Response(JSON.stringify(resp), {
            status: 400
        })
    }

    // const feedItemList = await searchPodcastEpisodeFromItunes(keyword, 'podcastEpisode', country, excludeFeedIds, 0, 0, 200)
    const feedItemList = await searchSpotifyEpisodes(keyword, country, 50, 0)

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
            episodetype: item.EpisodeType,
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
