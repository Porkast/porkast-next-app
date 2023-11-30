import { queryUserKeywordSubscriptionList } from "@/libs/db/subscription";
import { SubscriptionDataDto } from "@/types/subscription";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {

    const resp: JsonResponse = {
        code: 0,
        message: '',
        data: null
    }
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const limit = searchParams.get('limit') || 10
    const offset = searchParams.get('offset') || 0

    if (!userId) {
        resp.code = 1
        resp.message = 'User ID is required'
        return NextResponse.json(resp)
    }

    let queryListData: SubscriptionDataDto[] = await queryUserKeywordSubscriptionList(userId, Number(offset), Number(limit))

    resp.code = 0
    resp.message = 'OK'
    resp.data = queryListData
    return NextResponse.json(resp)
}