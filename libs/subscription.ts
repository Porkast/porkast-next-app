import { FeedItem } from "@/types/feed_item";
import { getUserSessionInfo } from "./suapbase";
import { SubscriptionDataDto } from "@/types/subscription";


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

