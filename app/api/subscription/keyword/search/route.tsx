import { doSearchSubscription } from "@/libs/db/subscription";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {

    const reqBody = await request.json();
    const keyword = reqBody.keyword;
    const country = reqBody.country || 'US';
    // const source = reqBody.source || 'itunes';
    const source = reqBody.source || 'spotify';
    const excludeFeedId = reqBody.excludeFeedId || '';
    const sortByDate = reqBody.sortByDate;
    let resp: JsonResponse = {
        code: 0,
        message: '',
        data: null
    }

    try {
        doSearchSubscription(keyword, country, source, excludeFeedId)
    } catch (error) {
        resp.code = 1
        resp.message = "Subscribe failed: " + error
        return NextResponse.json(resp);
    }

    resp.code = 0
    resp.message = 'done'
    return NextResponse.json(resp);
}
