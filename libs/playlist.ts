import { FeedItem } from "@/types/feed_item";
import { UserPlaylistDto } from "@/types/playlist";

export async function addToPlayList(userId: string, channelId: string, itemId: string, playlistId: string, source: string = 'itunes'): Promise<JsonResponse> {

    const respJson = await fetch(`${process.env.API_BASE_URL}v1/api/playlist/item`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
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

    const respJson = await fetch(`${process.env.API_BASE_URL}v1/api/playlist/list/${userId}?limit=${limit}&offset=${offset}`).then(resp => resp.json()).catch(err => {
        console.log(err);
    })

    return {
        code: respJson.code,
        message: respJson.message,
        data: respJson.data
    }
}

export async function createPlaylist(userId: string, name: string, description: string = ''): Promise<JsonResponse> {
    const respJson = await fetch(`${process.env.API_BASE_URL}v1/api/playlist`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
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
    const respJson = await fetch(`${process.env.API_BASE_URL}v1/api/playlist/${playlistId}`).then(resp => resp.json()).catch(err => {
        console.log(err);
    })
    return respJson
}

export const getPlaylistItemListByUserId = async (userId: string, playlistId: string, page: number): Promise<{ code: number, message: string, data: FeedItem[] }> => {

    const limit = 10
    const offset = (page - 1) * limit
    const resp = await fetch(`${process.env.API_BASE_URL}v1/api/playlist/list/${userId}/${playlistId}?limit=${limit}&offset=${offset}`)
    const respJson = await resp.json()
    return {
        code: respJson.code,
        message: respJson.message,
        data: respJson.data
    }
}