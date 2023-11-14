import { UserListenLater } from "@/types/feed_item";
import { getUserSessionInfo } from "./suapbase";

export async function addToListenLater(channelId: string, itemId: string, userId: string, source: string): Promise<JsonResponse> {

    const userInfo = await getUserSessionInfo()
    const respJson = await fetch(`${process.env.API_BASE_URL}v1/api/listenlater/item`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userInfo?.token
        },
        body: JSON.stringify({
            channelId: channelId,
            itemId: itemId,
            userId: userId,
            source: source
        })
    }).then(resp => resp.json()).catch(err => {
        console.log(err);
    });

    return respJson;
}

export const getListenLaterListByUserId = async (userId: string, page: number): Promise<{ code: number, message: string, data: UserListenLater[] }> => {

    const limit = 10
    const offset = (page - 1) * limit
    const resp = await fetch(`${process.env.API_BASE_URL}v1/api/listenlater/list?userId=${userId}&limit=${limit}&offset=${offset}`)
    const respJson = await resp.json()
    return {
        code: respJson.code,
        message: respJson.message,
        data: respJson.data
    }
}