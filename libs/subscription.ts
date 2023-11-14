import { FeedItem } from "@/types/feed_item";

export type SubscriptionData = {
    Id: string;
    UserId: string;
    CreateTime: Date;
    Status: number;
    Keyword: string;
    OrderByDate: number;
    Lang: string;
    Country: string;
    ExcludeFeedId: string;
    Source: string;
    RefId: string;
    RefName: string;
    Type: string;
    Count: number;
}

export const subscribeSearchKeyword = async (userId: string, searchKeyword: string, country: string = 'US', source: string = 'itunes', excludeFeedId: string = '', token: string): Promise<JsonResponse> => {
    var apiUrl = `${process.env.API_BASE_URL}v1/api/subscription/keyword`
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
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(params)
    })

    const respJson = await resp.json()
    return respJson
}

export const subscribeUserListenLater = async (userId: string, creatorId: string, token: string): Promise<JsonResponse> => {
    var apiUrl = `${process.env.API_BASE_URL}v1/api/subscription/listenlater`
    var params = {
        userId: userId,
        creatorId: creatorId
    }

    const resp = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(params)
    })

    const respJson = await resp.json()
    return respJson
}

export const getUserSubscriptionList = async (userId: string): Promise<{ code: number, message: string, data: SubscriptionData[] }> => {
    const subscriptionList: SubscriptionData[] = []
    const resp = await fetch(`${process.env.API_BASE_URL}v1/api/subscription/list?userId=${userId}`)
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

    var requestAPI = `${process.env.API_BASE_URL}v1/api/subscription/${userId}/${keyword}`
    if (page) {
        requestAPI = `${requestAPI}?page=${page}`
    }

    const resp = await fetch(requestAPI)
    const respJson = await resp.json()

    return {
        code: respJson.code,
        message: respJson.message,
        data: respJson.data
    }
}

