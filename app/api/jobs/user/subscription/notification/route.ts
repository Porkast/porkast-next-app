import { queryUserLatestKeywordSubscriptionFeedItemList } from "@/libs/db/subscription";
import { NotificationParams, sendSubscriptionUpdateEmail } from "@/libs/email";
import prisma from "@/libs/prisma";
import { getNickname } from "@/libs/user";
import { NextRequest } from "next/server";


export async function GET(request: NextRequest) {

    const resp: JsonResponse = {
        code: 0,
        message: '',
        data: null
    }

    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        resp.code = 1
        resp.message = 'Unauthorized'
        return new Response(JSON.stringify(resp), {
            status: 401
        })
    }

    const allUserSubscriptionList = await prisma.user_subscription.findMany({
        where: {
            status: 1
        }
    })
    console.log('start trigger user subscription update jobs, total count : ' + allUserSubscriptionList.length)

    for (const userSubscription of allUserSubscriptionList) {
        const keyword = userSubscription.keyword
        const country = userSubscription.country
        const excludeFeedIds = userSubscription.exclude_feed_id
        const source = userSubscription.source
        const apiUrl = `https://zeplo.to/https://porkast.com/api/jobs/user/subscription/notification?_trace=ada8aea9-c8c8-4311-8b23-03b3d77b68ad-iow&_token=${process.env.ZEPLO_TOKEN}`
        const resp = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.CRON_SECRET}`
            },
            body: JSON.stringify({
                "keyword": keyword,
                "country": country,
                "excludeFeedIds": excludeFeedIds,
                "source": source,
                "userId": userSubscription.user_id
            })
        })
        console.log('trigger user subscription notification jobs, keyword: ' + keyword + ', country: ' + country + ', excludeFeedIds: ' + excludeFeedIds + ', source: ' + source, 'userId: ' + userSubscription.user_id)
        console.log('trigger user subscription notification jobs, zeplo response: ' + JSON.stringify(await resp.json()))
    }

    resp.code = 0
    resp.message = 'OK'
    return new Response(JSON.stringify(resp), {
        status: 200
    })
}


export async function POST(request: NextRequest) {

    const resp: JsonResponse = {
        code: 0,
        message: '',
        data: null
    }
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        resp.code = 1
        resp.message = 'Unauthorized'
        return new Response(JSON.stringify(resp), {
            status: 401
        })
    }

    const body = await request.json();
    const keyword = body.keyword
    const country = body.country
    const excludeFeedIds = body.excludeFeedIds
    const source = body.source
    const userId = body.userId
    if (!keyword || !userId) {
        resp.code = 1
        resp.message = 'Missing parameters, keyword and userId is required'
        return new Response(JSON.stringify(resp), {
            status: 400
        })
    }

    const [usEnrity, userInfo] = await Promise.all([
        prisma.user_subscription.findFirst({
            where: {
                keyword: keyword,
                country: country,
                exclude_feed_id: excludeFeedIds,
                source: source,
                user_id: userId
            }
        }),

        prisma.user_info.findFirst({
            where: {
                id: userId
            }
        })
    ])

    if (!usEnrity) {
        resp.code = 1
        resp.message = 'User subscription not found'
        return new Response(JSON.stringify(resp), {
            status: 400
        })
    }

    if (!userInfo) {
        resp.code = 1
        resp.message = 'User info not found'
        return new Response(JSON.stringify(resp), {
            status: 400
        })
    }

    const ksList = await queryUserLatestKeywordSubscriptionFeedItemList(userInfo.id, keyword, source, country, excludeFeedIds, String(usEnrity.latest_id), 0, 10)
    const totalCount = await prisma.keyword_subscription.count({
        where: {
            keyword: keyword,
            source: source,
            country: country,
            exclude_feed_id: excludeFeedIds,
            id: {
                gt: usEnrity.latest_id || 0
            }
        }
    })

    const userEmail = userInfo.email
    if (totalCount > 0 && ksList && ksList.length > 0 && userEmail) {
        const link = `https://porkast.com/subscription/${userInfo.id}/${keyword}`
        const emailParams: NotificationParams = {
            keyword: keyword,
            nickname: getNickname(userEmail, userInfo.nickname || ''),
            updateCount: totalCount,
            titleList: ksList.map(ks => ks.Title),
            link: link,
            to: userEmail,
            subject: "#" + keyword + " has new podcasts update"
        }
        try {

            const sendNotificationEmail = async (latestId: number) => {
                if (latestId != 0) {
                    await sendSubscriptionUpdateEmail(emailParams)
                }
            }

            const [_, latestItem] = await Promise.all([
                sendNotificationEmail(usEnrity.latest_id || 0),
                prisma.keyword_subscription.findFirst({
                    where: {
                        keyword: keyword,
                        source: source,
                        country: country,
                        exclude_feed_id: excludeFeedIds
                    },
                    orderBy: {
                        id: 'desc'
                    },
                    skip: 0,
                    take: 1
                })

            ])
            await prisma.user_subscription.update({
                where: {
                    id: usEnrity.id
                },
                data: {
                    latest_id: latestItem?.id
                }
            })
        } catch (error) {
            console.log('Failed to send subscription update email to ' + userEmail, " with params " + JSON.stringify(emailParams))
            resp.code = 1
            resp.message = 'Failed to send subscription update email with error: ' + error
            return new Response(JSON.stringify(resp), {
                status: 500
            })
        }

    }

    resp.code = 0
    resp.message = 'OK'
    return new Response(JSON.stringify(resp), {
        status: 200
    })
}