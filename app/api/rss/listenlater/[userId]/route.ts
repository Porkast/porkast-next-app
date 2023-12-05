import { generateListenLaterRSSXml } from "@/libs/share";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {

    const resp: JsonResponse = {
        code: 0,
        message: '',
        data: null
    }

    const userId = params.userId
    if (!userId) {
        resp.code = 1
        resp.message = 'User ID is required'
        return new NextResponse(JSON.stringify(resp), {
            status: 400
        })
    }

    try {
        const rssStr = await generateListenLaterRSSXml(userId)
        return new Response(rssStr, {
            status: 200,
            headers: {
                'Content-Type': 'application/xml'
            }
        })
    } catch (error) {
        resp.code = 1
        resp.message = 'Ops! Something went wrong'
        console.log(`generate listenlater rss with userId ${userId} error : `, error)
        return new NextResponse(JSON.stringify(resp), {
            status: 500
        })
    }

    return NextResponse.json(resp)
}