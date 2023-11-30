import { UserPlaylistDto, UserPlaylistItemDto } from "@/types/playlist";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";
import { formatDateTime } from "../common";


type UserPlaylistEntity = {
    id: string
    playlist_name: string | ''
    description: Buffer | ''
    user_id: string | ''
    reg_date: Date | null
    status: number | 0
    creator_id: string | ''
    orig_playlist_id: string | ''
    count: string | '0'
}

type UserPLaylistItemEntity = {
    id: string
    channel_id: string
    guid: string | null
    title: string | null
    link?: string | null
    pub_date?: Date | string | null
    author?: string | null
    input_date?: Date | string | null
    image_url?: string | null
    enclosure_url?: string | null
    enclosure_type?: string | null
    enclosure_length?: string | null
    duration?: string | null
    episode?: string | null
    explicit?: string | null
    season?: string | null
    episodeType?: string | null
    description?: Buffer | null
    channel_title?: string | null
    feed_id: string
    feed_link: string | null
    source?: string | null
    country?: string | null
    reg_date?: Date | string | null
    status?: number | 0
    playlist_id?: string | ''
}

export async function queryPlaylistByPlaylistId(playlistId: string): Promise<UserPlaylistDto | null> {

    const queryResult = await prisma.user_playlist.findUnique({
        where: {
            id: playlistId
        }
    })

    if (!queryResult || !queryResult.id) {
        return null
    }

    const playlistDto: UserPlaylistDto = {
        Id: queryResult.id,
        PlaylistName: queryResult.playlist_name || '',
        Description: String(queryResult.description) || '',
        UserId: queryResult.user_id || '',
        Status: queryResult.status || 0,
        CreatorId: queryResult.creator_id || '',
        OrigPlaylistId: queryResult.orig_playlist_id || '',
        RegDate: queryResult.reg_date || new Date(),
        Count: 0,
    }

    return playlistDto
}


export async function queryPlaylistTotalCount(playlistId: string): Promise<number> {

    let totalCount = 0

    totalCount = await prisma.user_playlist_item.count({
        where: {
            playlist_id: playlistId
        }
    })

    return totalCount
}

export async function queryUserPlaylistListByUserId(userId: string, offset: number, limit: number): Promise<UserPlaylistDto[]> {
    const resultDtos: UserPlaylistDto[] = []
    const queryResult: UserPlaylistEntity[] = await prisma.$queryRaw<UserPlaylistEntity[]>(
        Prisma.sql`
            SELECT up.* ,COUNT(upi.id) as count 
            FROM user_playlist up 
            LEFT JOIN user_playlist_item upi ON upi.playlist_id = up.id
            WHERE up.user_id = ${userId} AND up.status = 1
            GROUP BY up.id, up.creator_id, up.reg_date, up.orig_playlist_id, up.playlist_name, up.status, up.user_id
            ORDER BY up.reg_date DESC
            LIMIT ${limit}
            OFFSET ${offset};
        `,
    )

    for (let result of queryResult) {
        resultDtos.push({
            Id: result.id,
            PlaylistName: result.playlist_name || '',
            Description: String(result.description) || '',
            UserId: result.user_id || '',
            Status: result.status || 0,
            CreatorId: result.creator_id || '',
            OrigPlaylistId: result.orig_playlist_id || '',
            RegDate: result.reg_date || new Date(),
            Count: parseInt(result.count)
        })
    }

    return resultDtos
}


export async function queryPlaylistItemsByPlaylistId(playlistId: string): Promise<UserPlaylistItemDto[]> {

    const resultList: UserPlaylistItemDto[] = []

    const queryResult = await prisma.$queryRaw<UserPLaylistItemEntity[]>(
        Prisma.sql`
            SELECT fi.*, upi.reg_date, upi.playlist_id 
            FROM user_playlist_item upi
            JOIN feed_item fi ON upi.item_id = fi.id
            WHERE upi.playlist_id = ${playlistId} and upi.status = 1
            ORDER BY upi.reg_date DESC
            LIMIT 10
            OFFSET 0;
        `
    )

    for (let result of queryResult) {
        resultList.push({
            Id: result.id,
            FeedId: result.feed_id,
            GUID: result.guid || '',
            ChannelId: result.channel_id,
            Title: result.title || '',
            HighlightTitle: result.title || '',
            Link: result.link || '',
            PubDate: formatDateTime(result.pub_date?.toString() || new Date().toString()),
            Author: result.author || '',
            InputDate: formatDateTime(result.input_date?.toString() || new Date().toString()),
            ImageUrl: result.image_url || '',
            EnclosureUrl: result.enclosure_url || '',
            EnclosureType: result.enclosure_type || '',
            EnclosureLength: result.enclosure_length || '',
            Duration: result.duration || '',
            Episode: result.episode || '',
            Explicit: result.explicit || '',
            Season: result.season || '',
            EpisodeType: result.episodeType || '',
            Description: String(result.description),
            TextDescription: String(result.description),
            ChannelImageUrl: "",
            ChannelTitle: result.channel_title || '',
            HighlightChannelTitle: "",
            FeedLink: result.feed_link || '',
            Count: 0,
            Source: result.source || '',
            ExcludeFeedId: '',
            Country: result.country || '',
            TookTime: 0,
            HasThumbnail: true,
            RegDate: formatDateTime(result.reg_date?.toString() || new Date().toString()),
            Status: result.status || 0,
            PlaylistId: result.playlist_id || '',
        })
    }

    return resultList
}