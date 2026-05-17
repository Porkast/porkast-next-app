import { checkKeywordLimit } from "@/libs/membership";
import { doSearchSubscription } from "@/libs/db/subscription";
import prisma from "@/libs/prisma";
import { JsonResponse } from "@/types/api";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';


export async function POST(request: NextRequest) {

    const reqBody = await request.json();
    const userId = reqBody.userId;
    const keyword = reqBody.keyword;
    const country = reqBody.country || 'US';
    const source = reqBody.source || 'itunes';
    const excludeFeedId = reqBody.excludeFeedId || '';
    const sortByDate = reqBody.sortByDate;


    if (!userId || !keyword || !country || !source) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    let resp: JsonResponse = {
        code: 0,
        message: '',
        data: null
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
        resp.code = 1
        resp.message = 'Already subscribed'
        return NextResponse.json(resp);
    }

    const { allowed, limit, used } = await checkKeywordLimit(userId)

    if (!allowed) {
        resp.code = 1
        resp.message = `You have reached the limit of search keyword subscriptions. Please download the iOS client and subscribe to a membership plan to increase the limit.`
        return NextResponse.json(resp);
    }

    try {
        await prisma.user_subscription.create({
            data: {
                id: uuidv4(),
                user_id: userId,
                keyword: keyword,
                country: country,
                source: source,
                exclude_feed_id: excludeFeedId,
                order_by_date: parseInt(sortByDate),
                status: 1,
                create_time: new Date(),
                type: 'searchKeyword'
            }
        })
    } catch (error) {

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code == 'P2002') {
                resp.code = 1
                resp.message = 'Already subscribed'
                return NextResponse.json(resp);
            }
            resp.code = 1
            resp.message = error.message
            return NextResponse.json(resp);
        }

        resp.code = 1
        resp.message = 'Error occurred'
        return NextResponse.json(resp);
    }

    // TODO: send the Subscription to Queue
    try {
        await doSearchSubscription(keyword, country, source, excludeFeedId)
    } catch (error) {
        console.log(error)
        resp.code = 1
        resp.message = "Something went wrong, please try again later"
        return NextResponse.json(resp);
    }

    resp.code = 0
    resp.message = 'done'
    return NextResponse.json(resp);
}