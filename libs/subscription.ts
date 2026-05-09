import { FeedItem } from "@/types/feed_item";
import { getUserSessionInfo } from "./session";
import { SubscriptionDataDto } from "@/types/subscription";
import { queryUserKeywordSubscriptionList, queryUserKeywordSubscriptionDetail, queryKeywordSubscriptionFeedItemList } from "./db/subscription";

// ─── Client-side (keep for interactive operations) ───

export const subscribeSearchKeyword = async (userId: string, searchKeyword: string, country: string = 'US', source: string = 'itunes', excludeFeedId: string = '', token: string): Promise<JsonResponse> => {
    var apiUrl = `${process.env.API_BASE_URL}api/subscription/keyword`
    var params = {
        userId: userId,
        keyword: searchKeyword,
        country: country,
        source: source,
        excludeFeedId: excludeFeedId
    }

    const resp = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify(params)
    })

    const respJson = await resp.json()
    return respJson
}

export const subscribeUserListenLater = async (userId: string, creatorId: string, token: string): Promise<JsonResponse> => {
    var apiUrl = `${process.env.API_BASE_URL}api/subscription/listenlater`
    var params = {
        userId: userId,
        creatorId: creatorId
    }

    const resp = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify(params)
    })

    const respJson = await resp.json()
    return respJson
}

export const getUserSubscriptionList = async (userId: string): Promise<{ code: number, message: string, data: SubscriptionDataDto[] }> => {
    const subscriptionList: SubscriptionDataDto[] = []
    const resp = await fetch(`${process.env.API_BASE_URL}api/subscription/list?userId=${userId}`)
    const respJson = await resp.json()
    if (respJson && respJson.data) {
        subscriptionList.push(...respJson.data)
    }
    return {
        code: respJson.code,
        message: respJson.message,
        data: subscriptionList
    }
}

export const getUserKeywordSubscriptionItemList = async (userId: string, keyword: string, page: string): Promise<{ code: number, message: string, data: FeedItem[] }> => {

    var requestAPI = `${process.env.API_BASE_URL}api/subscription/${userId}/${keyword}`
    if (page) {
        requestAPI = `${requestAPI}?page=${page}`
    }

    const resp = await fetch(requestAPI, {
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

export const unsubscribeKeyword = async (userId: string, keyword: string): Promise<JsonResponse> => {
    var apiUrl = `${process.env.API_BASE_URL}api/subscription/${userId}/${encodeURIComponent(keyword)}`
    
    const resp = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': (await getUserSessionInfo()).token
        }
    })

    const respJson = await resp.json()
    return respJson
}

// ─── Server-side (direct Prisma, no network hop) ───

export async function getUserSubscriptionListServer(userId: string): Promise<{ code: number, message: string, data: SubscriptionDataDto[] }> {
    try {
        const data = await queryUserKeywordSubscriptionList(userId, 0, 100)
        return { code: 0, message: 'OK', data }
    } catch (err) {
        console.error('getUserSubscriptionListServer error:', err)
        return { code: 1, message: String(err), data: [] }
    }
}

export async function getUserKeywordSubscriptionItemListServer(userId: string, keyword: string, page: number): Promise<{ code: number, message: string, data: FeedItem[] }> {
    try {
        const limit = 10
        const offset = (page - 1) * limit
        const usInfo = await queryUserKeywordSubscriptionDetail(userId, keyword)
        const data = await queryKeywordSubscriptionFeedItemList(userId, keyword, usInfo.Source, usInfo.Country, usInfo.ExcludeFeedId, offset, limit)
        return { code: 0, message: 'ok', data }
    } catch (err) {
        console.error('getUserKeywordSubscriptionItemListServer error:', err)
        return { code: 1, message: String(err), data: [] }
    }
}

