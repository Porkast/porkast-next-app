import { generateFeedItemId as generateFeedId } from "@/libs/common";
import { searchPodcastEpisodeFromItunes } from "@/libs/itunes";
import prisma from "@/libs/prisma";
import { FeedItem } from "@/types/feed_item";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {

    const reqBody = await request.json();
    const keyword = reqBody.keyword;
    const country = reqBody.country || 'US';
    const source = reqBody.source || 'itunes';
    const excludeFeedId = reqBody.excludeFeedId || '';
    const sortByDate = reqBody.sortByDate;
    let resp: JsonResponse = {
        code: 0,
        message: '',
        data: null
    }

    try {
        doSearchSubscription(keyword, country, source, excludeFeedId)
    } catch (error) {
        resp.code = 1
        resp.message = "Subscribe failed: " + error
        return NextResponse.json(resp);
    }

    resp.code = 0
    resp.message = 'done'
    return NextResponse.json(resp);
}


export async function doSearchSubscription(keyword: string, country: string, source: string, excludeFeedId: string) {
    let searchResultItemList: FeedItem[] = [];
    if (source == 'itunes' || source == '') {
        const searchResult = await searchPodcastEpisodeFromItunes(keyword, 'podcastEpisode', country, excludeFeedId, 0, 0, 200)
        searchResultItemList.push(...searchResult);
    } else {
        // TODO: implement other sources
    }

    let ksManyInput: Prisma.keyword_subscriptionCreateManyInput[] = [];
    for (const item of searchResultItemList) {
        const itemId = await generateFeedId(item.FeedLink, item.Title)
        const channelId = await generateFeedId(item.FeedLink, item.ChannelTitle)
        let ksItem: Prisma.keyword_subscriptionCreateManyInput = {
            keyword: keyword,
            feed_channel_id: String(channelId),
            feed_item_id: String(itemId),
            create_time: new Date(),
            country: country,
            source: source,
            exclude_feed_id: excludeFeedId
        }

        ksManyInput.push(ksItem);
    }

    let itemManyInput: Prisma.feed_itemCreateManyInput[] = [];
    for (const item of searchResultItemList) {
        const itemId = await generateFeedId(item.FeedLink, item.Title)
        const channelId = await generateFeedId(item.FeedLink, item.ChannelTitle)
        let itemInput: Prisma.feed_itemCreateManyInput = {
            id: itemId,
            feed_id: String(item.FeedId),
            channel_id: channelId,
            feed_link: item.FeedLink,
            channel_title: item.ChannelTitle,
            guid: item.GUID,
            title: item.Title,
            link: item.Link,
            pub_date: new Date(item.PubDate),
            author: item.Author,
            input_date: new Date(),
            image_url: item.ImageUrl,
            enclosure_url: item.EnclosureUrl,
            enclosure_length: String(item.EnclosureLength),
            enclosure_type: item.EnclosureType,
            duration: item.Duration,
            episode: item.Episode,
            explicit: item.Explicit,
            season: item.Season,
            episodeType: item.EpisodeType,
            source: item.Source,
            description: Buffer.from(item.Description),
        }

        itemManyInput.push(itemInput);
    }


    try {
        await prisma.keyword_subscription.createMany({
            data: ksManyInput,
            skipDuplicates: true
        })
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2002') {
                console.log(
                    'There is a unique constraint violation, a new record cannot be created with prisma for keyword_subscription, ignore it',
                )
            }
        } else {
            throw e
        }
    }
    try {
        await prisma.feed_item.createMany({
            data: itemManyInput,
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
            throw e
        }
    }

}