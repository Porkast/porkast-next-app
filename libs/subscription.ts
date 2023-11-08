

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