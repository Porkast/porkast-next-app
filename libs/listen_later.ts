
export async function addToListenLater(channelId: string, itemId: string, userId: string): Promise<JsonResponse> {

    const respJson = await fetch(`${process.env.API_BASE_URL}v1/api/listenlater/item`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            channelId: channelId,
            itemId: itemId,
            userId: userId
        })
    }).then(resp => resp.json()).catch(err => {
        console.log(err);
    });

    return respJson;
}