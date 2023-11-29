import { generateFeedItemId, generatePlaylistItemId } from "@/libs/common";
import { queryPlaylistByPlaylistId } from "@/libs/db/playlist";
import { getPodcastEpisodeInfo } from "@/libs/itunes";
import prisma from "@/libs/prisma";
import { FeedItem } from "@/types/feed_item";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {

    const body = await request.json()
    const playlistId = body.playlistId
    const channelId = body.channelId
    const guid = body.guid
    const source = body.source || 'itunes'

    const resp: JsonResponse = {
        code: 0,
        message: '',
        data: null
    }

    if (!playlistId || !channelId || !guid) {
        resp.code = 1
        resp.message = 'Missing required fields'
        return NextResponse.json(resp)
    }

    const playlistInfo = await queryPlaylistByPlaylistId(playlistId)
    if (!playlistInfo) {
        resp.code = 1
        resp.message = 'Playlist not found'
        return NextResponse.json(resp)
    }

    let itemInfoResp;
    if (source == 'itunes') {
        itemInfoResp = await getPodcastEpisodeInfo(channelId, guid)
    }

    if (!itemInfoResp) {
        resp.code = 1
        resp.message = 'Podcast Episode not found'
        return NextResponse.json(resp)
    }

    let feedItem: FeedItem = itemInfoResp.episode
    feedItem.Id = await generateFeedItemId(feedItem.FeedLink, feedItem.Title)
    feedItem.ChannelId = await generateFeedItemId(feedItem.FeedLink, feedItem.ChannelTitle)

    const playListeItemId = await generatePlaylistItemId(playlistId, feedItem.Id)
    const playlistItemQueryResult = await prisma.user_playlist_item.findUnique({
        where: {
            id: playListeItemId
        }
    })

    if (playlistItemQueryResult) {
        resp.code = 1
        resp.message = 'Already exists'
        return NextResponse.json(resp)
    } else {
        try {
            await prisma.user_playlist_item.create({
                data: {
                    id: playListeItemId,
                    playlist_id: playlistId,
                    item_id: feedItem.Id,
                    channel_id: feedItem.ChannelId,
                    reg_date: new Date(),
                    status: 1
                }
            })
        } catch (error) {
            resp.code = 1
            resp.message = 'Something went wrong'
            return NextResponse.json(resp)
        }
    }

    resp.code = 0
    resp.message = 'Done'
    return NextResponse.json(resp)
}