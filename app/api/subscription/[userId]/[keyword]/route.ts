import { queryKeywordSubscriptionFeedItemList, queryUserKeywordSubscriptionDetail } from "@/libs/db/subscription";
import { SubscriptionDataDto } from "@/types/subscription";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest, { params }: { params: { userId: string, keyword: string } }) {

    const userId = params.userId;
    const keyword = decodeURIComponent(params.keyword);
    const searchParams = request.nextUrl.searchParams
    const page = searchParams.get('page') || '1'
    const limit = 10
    const offset = (Number(page) - 1) * limit

    const resp: JsonResponse = {
        code: 0,
        message: '',
        data: null
    }

    let usInfo: SubscriptionDataDto
    try {
        usInfo = await queryUserKeywordSubscriptionDetail(userId, keyword)
    } catch (error) {
        resp.code = 1
        resp.message = "" + error
        return NextResponse.json(resp);
    }

    const feedItemList = await queryKeywordSubscriptionFeedItemList(userId, keyword, usInfo.Source, usInfo.Country, usInfo.ExcludeFeedId, offset, limit)

    resp.code = 0
    resp.message = 'ok'
    resp.data = feedItemList
    return NextResponse.json(resp);
}