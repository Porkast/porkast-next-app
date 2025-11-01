import { queryKeywordSubscriptionFeedItemList, queryUserKeywordSubscriptionDetail, disableUserKeywordSubscription } from "@/libs/db/subscription";
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

export async function DELETE(request: NextRequest, { params }: { params: { userId: string, keyword: string } }) {
    const userId = params.userId;
    const keyword = decodeURIComponent(params.keyword);

    const resp: JsonResponse = {
        code: 0,
        message: '',
        data: null
    }

    try {
        const success = await disableUserKeywordSubscription(userId, keyword);
        if (success) {
            resp.code = 0;
            resp.message = 'Subscription successfully disabled';
        } else {
            resp.code = 1;
            resp.message = 'No active subscription found for this keyword';
        }
    } catch (error) {
        console.error('Error disabling user keyword subscription:', error);
        resp.code = 1;
        resp.message = 'Failed to disable subscription: ' + error;
    }

    return NextResponse.json(resp);
}