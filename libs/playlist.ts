
export async function addToPlayList(channelId: string, itemId: string, playlistId: string, userId: string): Promise<JsonResponse> {

    const respJson = await fetch(`${process.env.API_BASE_URL}v1/api/playlist/item`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            channelId: channelId,
            itemId: itemId,
            playlistId: playlistId,
            userId: userId
        })
    }).then(resp => resp.json()).catch(err => {
        console.log(err);
    });

    return respJson;
}

export async function getUserPlaylistByUserId(userId: string): Promise<JsonResponse> {

    const respJson = await fetch(`${process.env.API_BASE_URL}v1/api/playlist/list/${userId}`).then(resp => resp.json()).catch(err => {
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