import { getUserSubscriptionListServer } from "@/libs/subscription"
import { getUserInfoByIdServer, getTempNickname } from "@/libs/user"
import { SubscriptionDataDto } from "@/types/subscription"
import { ServerUserInfo } from "@/libs/user"
import SubscriptionListClient from "./SubscriptionListClient"

type Props = {
    params: Promise<{ userId: string }>
    searchParams: Promise<{ page?: string }>
}

export default async function Page({ params, searchParams }: Props) {
    const { userId } = await params
    const { page: pageStr } = await searchParams
    const page = parseInt(pageStr || '1')

    let subscriptionList: SubscriptionDataDto[] = []
    let totalCount = 0
    let userInfo: ServerUserInfo | null = null
    let nickname = ""

    const userResp = await getUserInfoByIdServer(userId)
    if (userResp.code === 0 && userResp.data) {
        userInfo = userResp.data
        nickname = getTempNickname(userResp.data)
    }

    const subResp = await getUserSubscriptionListServer(userId)
    if (subResp.code === 0) {
        subscriptionList = subResp.data
        if (subscriptionList.length > 0) {
            totalCount = subscriptionList[0].Count
        }
    }

    const totalPage = Math.max(1, Math.ceil(totalCount / 10))

    return (
        <SubscriptionListClient
            userId={userId}
            page={page}
            userInfo={userInfo}
            nickname={nickname}
            subscriptionList={subscriptionList}
            totalCount={totalCount}
            totalPage={totalPage}
        />
    )
}
