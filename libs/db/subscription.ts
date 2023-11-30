import { SubscriptionDataDto } from "@/types/subscription"
import prisma from "../prisma"


export async function queryUserKeywordSubscriptionList(userId: string, offset: number, limit: number): Promise<SubscriptionDataDto[]> {

    const resultDtos: SubscriptionDataDto[] = []
 
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

    const totalCount = await prisma.user_subscription.count({
        where: {
            user_id: userId,
            status: 1
        }
    })

    for (const queryResutl of queryResutlList) {
        resultDtos.push({
            Id: queryResutl.id,
            UserId: queryResutl.user_id || '',
            CreateTime: queryResutl.create_time || new Date(),
            Status: queryResutl.status || 0,
            Keyword: queryResutl.keyword || '',
            OrderByDate: queryResutl.order_by_date || 0,
            Lang: queryResutl.lang || '',
            Country: queryResutl.country || '',
            ExcludeFeedId: queryResutl.exclude_feed_id || '',
            Source: queryResutl.source || '',
            RefId: queryResutl.ref_id || '',
            RefName: queryResutl.ref_name || '',
            Type: queryResutl.type || '',
            Count: totalCount
        })
    }

    return resultDtos
}