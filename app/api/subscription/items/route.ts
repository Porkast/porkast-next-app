import { queryUserAllSubscriptionFeedItemList } from "@/libs/db/subscription";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

    const resp: JsonResponse = {
        code: 0,
        message: '',
        data: null
    }
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const limit = Number(searchParams.get('limit') || 10)
    const offset = Number(searchParams.get('offset') || 0)

    if (!userId) {
        resp.code = 1
        resp.message = 'User ID is required'
        return NextResponse.json(resp)
    }

    const { items } = await queryUserAllSubscriptionFeedItemList(userId, offset, limit)

    resp.code = 0
    resp.message = 'OK'
    resp.data = items
    return NextResponse.json(resp)
}
