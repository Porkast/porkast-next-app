import prisma from "@/libs/prisma";
import { JsonResponse } from "@/types/api";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {

    const reqBody = await request.json();
    const userId = reqBody.userId;
    const keyword = reqBody.keyword;
    const country = reqBody.country;
    const source = reqBody.source;
    const excludeFeedId = reqBody.excludeFeedId;
    const sortByDate = reqBody.sortByDate;

    if (!userId || !keyword || !country || !source) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const userSubscriptionRecord = await prisma.user_subscription.findFirst({
        where: {
            user_id: userId,
            keyword: keyword,
            source: source,
            status: 1,
        }
    })

    if (userSubscriptionRecord?.id) {
        console.log('userSubscriptionRecord', userSubscriptionRecord)
    }

    let resp: JsonResponse = {
        code: 0,
        message: 'parameter is ok',
        data: null
    }
    return NextResponse.json(resp);
}