import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {

    const resp: JsonResponse = {
        code: 0,
        message: '',
        data: null
    }

    const body = await request.json()
    const userId = body.userId
    const channelId = body.channelId
    const itemId = body.itemId
    const source = body.source || 'itunes'
    if (!userId || !channelId || !itemId) {
        resp.code = 1
        resp.message = 'Missing required fields'
        return NextResponse.json(resp)
    }


    const apiUrl = `https://zeplo.to/https://porkast.com/api/listenlater/item?_retry=3|FIXED|10&_token=${process.env.ZEPLO_TOKEN}`
    const zeploRsp = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.CRON_SECRET}`
        },
        body: JSON.stringify({
            "userId": userId,
            "channelId": channelId,
            "itemId": itemId,
            "source": source
        })
    })

    if (zeploRsp.status != 200) {
        resp.code = 1
        resp.message = 'Something went wrong'
        console.log('trigger zeplo queue to add listen later errpr, zeplo response: ' + JSON.stringify(await zeploRsp.json()))
        return new Response(JSON.stringify(resp), {
            status: 500
        })
        
    }

    resp.code = 0
    resp.message = 'OK'
    return new Response(JSON.stringify(resp), {
        status: 200
    })
}