import { generateSubscriptionRSS } from "@/libs/share"
import { NextRequest, NextResponse } from "next/server"


export async function GET(request: NextRequest, { params }: { params: { keyword: string, userId: string } }) {

    const resp: JsonResponse = {
        code: 0,
        message: '',
        data: null
    }

    const userId = params.userId
    const keyword = params.keyword
    if (!userId) {
        resp.code = 1
        resp.message = 'User ID is required'
        return new NextResponse(JSON.stringify(resp), {
            status: 400
        })
    }

    try {
        const rssStr = await generateSubscriptionRSS(userId, keyword)
        return new Response(rssStr, {
            status: 200,
            headers: {
                'Content-Type': 'application/xml'
            }
        })
    } catch (error) {
        resp.code = 1
        resp.message = 'Ops! Something went wrong'
        console.log(`generate playlist rss with playlistId ${keyword} and userId ${userId} error : `, error)
        return new NextResponse(JSON.stringify(resp), {
            status: 500
        })
    }

    return NextResponse.json(resp)
}