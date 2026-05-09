import { FeedItem } from "@/types/feed_item";
import { UserPlaylistDto } from "@/types/playlist";
import { getUserSessionInfo } from "./session";
import { ServerUserInfo } from "./user";
import { queryUserPlaylistListByUserId, queryPlaylistByPlaylistId, queryPlaylistTotalCount, queryPlaylistItemsByPlaylistId } from "./db/playlist";
import prisma from "./prisma";

// ─── Client-side ───

export async function addToPlayList(userId: string, channelId: string, itemId: string, playlistId: string, source: string = 'itunes'): Promise<JsonResponse> {

    const respJson = await fetch(`${process.env.API_BASE_URL}api/playlist/item`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': (await getUserSessionInfo()).token
        },
        body: JSON.stringify({
            channelId: channelId,
            guid: itemId,
            playlistId: playlistId,
            userId: userId,
            source: source
        })
    }).then(resp => resp.json()).catch(err => {
        console.log(err);
    });

    return respJson;
}

export async function getUserPlaylistByUserId(userId: string, page: number = 1): Promise<JsonResponse> {

    const limit = 10
    const offset = (page - 1) * limit

    const respJson = await fetch(`${process.env.API_BASE_URL}api/playlist/list/${userId}?limit=${limit}&offset=${offset}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': (await getUserSessionInfo()).token
        }
    }).then(resp => resp.json()).catch(err => {
        console.log(err);
    })

    return {
        code: respJson.code,
        message: respJson.message,
        data: respJson.data
    }
}

export async function createPlaylist(userId: string, name: string, description: string = ''): Promise<JsonResponse> {
    const respJson = await fetch(`${process.env.API_BASE_URL}api/playlist`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': (await getUserSessionInfo()).token
        },
        body: JSON.stringify({
            userId: userId,
            name: name,
            description: description
        })
    }).then(resp => resp.json()).catch(err => {
        console.log(err);
    })
    return respJson
}

export async function getPlaylistInfoById(playlistId: string): Promise<{ code: number, message: string, data: UserPlaylistDto }> {
    const respJson = await fetch(`${process.env.API_BASE_URL}api/playlist/${playlistId}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': (await getUserSessionInfo()).token
        }
    }).then(resp => resp.json()).catch(err => {
        console.log(err);
    })
    return respJson
}

export const getPlaylistItemListByUserId = async (userId: string, playlistId: string, page: number): Promise<{ code: number, message: string, data: { userInfo: ServerUserInfo, playlist: FeedItem[] } }> => {

    const limit = 10
    const offset = (page - 1) * limit
    const resp = await fetch(`${process.env.API_BASE_URL}api/playlist/list/${userId}/${playlistId}?limit=${limit}&offset=${offset}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': (await getUserSessionInfo()).token
        }
    })
    const respJson = await resp.json()
    return {
        code: respJson.code,
        message: respJson.message,
        data: respJson.data
    }
}

// ─── Server-side (direct Prisma, no network hop) ───

export async function getUserPlaylistByUserIdServer(userId: string, page: number = 1): Promise<{ code: number, message: string, data: UserPlaylistDto[] }> {
    try {
        const limit = 10
        const offset = (page - 1) * limit
        const data = await queryUserPlaylistListByUserId(userId, offset, limit)
        return { code: 0, message: 'Ok', data }
    } catch (err) {
        console.error('getUserPlaylistByUserIdServer error:', err)
        return { code: 1, message: String(err), data: [] }
    }
}

export async function getPlaylistInfoByIdServer(playlistId: string): Promise<{ code: number, message: string, data: UserPlaylistDto | null }> {
    try {
        const playlistInfoDto = await queryPlaylistByPlaylistId(playlistId)
        if (!playlistInfoDto) return { code: 1, message: 'Playlist not found', data: null }

        const totalCount = await queryPlaylistTotalCount(playlistId)
        playlistInfoDto.Count = totalCount

        const creatorId = playlistInfoDto.CreatorId || playlistInfoDto.UserId
        const creatorInfo = await prisma.user_info.findUnique({ where: { id: creatorId } })
        if (creatorInfo) {
            playlistInfoDto.UserInfo = {
                id: creatorInfo.id,
                nickname: creatorInfo.nickname || '',
                email: creatorInfo.email || '',
                phone: creatorInfo.phone || '',
                regDate: creatorInfo.reg_date || new Date(),
                updateDate: creatorInfo.update_date || new Date(),
                avatar: creatorInfo.avatar || '',
            }
        }

        return { code: 0, message: 'OK', data: playlistInfoDto }
    } catch (err) {
        console.error('getPlaylistInfoByIdServer error:', err)
        return { code: 1, message: String(err), data: null }
    }
}

export async function getPlaylistItemListByUserIdServer(userId: string, playlistId: string): Promise<{ code: number, message: string, data: { userInfo: ServerUserInfo, playlist: FeedItem[] } | null }> {
    try {
        const playlistInfo = await prisma.user_playlist.findFirst({ where: { id: playlistId } })
        if (!playlistInfo || playlistInfo.user_id !== userId) return { code: 1, message: 'Playlist not found', data: null }

        const userInfoResult = await prisma.user_info.findFirst({ where: { id: playlistInfo.user_id } })
        if (!userInfoResult) return { code: 1, message: 'User not found', data: null }

        const userInfo: ServerUserInfo = {
            id: userInfoResult.id,
            username: userInfoResult.username || '',
            nickname: userInfoResult.nickname || '',
            email: userInfoResult.email || '',
            phone: userInfoResult.phone || '',
            regDate: userInfoResult.reg_date || new Date(),
            updateDate: userInfoResult.update_date || new Date(),
            avatar: userInfoResult.avatar || '',
        }

        const playlist = await queryPlaylistItemsByPlaylistId(playlistId)
        return { code: 0, message: 'success', data: { userInfo, playlist: playlist as unknown as FeedItem[] } }
    } catch (err) {
        console.error('getPlaylistItemListByUserIdServer error:', err)
        return { code: 1, message: String(err), data: null }
    }
}