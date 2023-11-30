import prisma from "../prisma"


export async function queryUserKeywordSubscriptionList(userId:string, offset: number, limit: number): Promise<KeywordSubscription[]> {

    const resultDtos: KeywordSubscription[] = []
 
    const queryResutlList = await prisma.user_subscription.findMany({
        where: {
            user_id: userId,
            status: 1
        },
        orderBy: {
            create_time: 'desc'
        },
        skip: offset,
        take: limit
    })

    for (const queryResutl of queryResutlList) {
        resultDtos.push({
            id: queryResutl.id,
            userId: queryResutl.user_id,
            createTime: queryResutl.create_time,
            status: queryResutl.status,
            keyword: queryResutl.keyword,
            orderByDdate: queryResutl.order_by_date,
            lang: queryResutl.lang,
            country: queryResutl.country,
            excludeFeedId: queryResutl.exclude_feed_id,
            source: queryResutl.source,
            refId: queryResutl.ref_id,
            refName: queryResutl.ref_name,
            type: queryResutl.type
        })
    }

    return resultDtos
}