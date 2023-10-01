
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