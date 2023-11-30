import { generateFeedItemId, generateID } from "@/libs/common";
import { createOrUpdateFeedItem } from "@/libs/db/feed_item";
import { getPodcastEpisodeInfo } from "@/libs/itunes";
import prisma from "@/libs/prisma";
import { FeedItem } from "@/types/feed_item";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {

    const body = await request.json()
    const resp: JsonResponse = {
        code: 0,
        message: '',
        data: null
    }

    const userId = body.userId
    const channelId = body.channelId
    const itemId = body.itemId
    const source = body.source || 'itunes'
    if (!userId || !channelId || !itemId) {
        resp.code = 1
        resp.message = 'Missing required fields'
        return NextResponse.json(resp)
    }

    let itemInfoResp;
    if (source == 'itunes') {
        itemInfoResp = await getPodcastEpisodeInfo(channelId, itemId)
    }

    if (!itemInfoResp) {
        resp.code = 1
        resp.message = 'Podcast Episode not found'
        return NextResponse.json(resp)
    }

    let feedItem: FeedItem = itemInfoResp.episode
    feedItem.Id = await generateFeedItemId(feedItem.FeedLink, feedItem.Title)
    feedItem.ChannelId = await generateFeedItemId(feedItem.FeedLink, feedItem.ChannelTitle)

    await createOrUpdateFeedItem(feedItem)

    const queryData = await prisma.user_listen_later.findFirst({
        where: {
            user_id: userId,
            channel_id: feedItem.ChannelId,
            item_id: feedItem.Id,
        },
    })

    if (queryData) {
        resp.code = 1
        resp.message = 'Already added'
        return NextResponse.json(resp)
    }


    const userListenLaterRecord = await prisma.user_listen_later.create({
        data: {
            id: await generateID(),
            user_id: userId,
            channel_id: feedItem.ChannelId,
            item_id: feedItem.Id,
            reg_date: new Date(),
            status: 1,
        }
    })


    resp.code = 0
    resp.message = 'OK'
    resp.data = userListenLaterRecord
    return NextResponse.json(resp)
}
