import { UserListenLaterDto } from "@/types/listen_later";
import { getUserSessionInfo } from "./session";
import { queryUserListenLaterList, queryUserListenLaterTotalCount } from "./db/listen_later";
import { formatDateTime } from "./common";

// ─── Client-side ───

export async function addToListenLater(channelId: string, itemId: string, userId: string, source: string): Promise<JsonResponse> {

    const userInfo = await getUserSessionInfo()
    const respJson = await fetch(`${process.env.API_BASE_URL}api/listenlater/item/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': userInfo?.token
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

export const getListenLaterListByUserId = async (userId: string, page: number): Promise<{ code: number, message: string, data: UserListenLaterDto[] }> => {

    const limit = 10
    const offset = (page - 1) * limit
    const resp = await fetch(`${process.env.API_BASE_URL}api/listenlater/list?userId=${userId}&limit=${limit}&offset=${offset}`, {
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

export async function getListenLaterListByUserIdServer(userId: string, page: number): Promise<{ code: number, message: string, data: UserListenLaterDto[] }> {
    try {
        const limit = 10
        const offset = (page - 1) * limit
        const queryListData = await queryUserListenLaterList(userId, limit, offset)
        const totalCount = await queryUserListenLaterTotalCount(userId)

        for (const dto of queryListData) {
            dto.count = totalCount
            dto.pub_date = formatDateTime(dto.pub_date)
            dto.input_date = formatDateTime(dto.input_date)
            dto.reg_date = formatDateTime(dto.reg_date)
        }

        return { code: 0, message: 'OK', data: queryListData }
    } catch (err) {
        console.error('getListenLaterListByUserIdServer error:', err)
        return { code: 1, message: String(err), data: [] }
    }
}