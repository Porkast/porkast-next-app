import { getUserKeywordSubscriptionItemListServer } from "@/libs/subscription"
import { getUserInfoByIdServer, getTempNickname } from "@/libs/user"
import { FeedItem } from "@/types/feed_item"
import { ServerUserInfo } from "@/libs/user"
import SubscriptionKeywordClient from "./SubscriptionKeywordClient"

type Props = {
    params: Promise<{ userId: string; keyword: string }>
    searchParams: Promise<{ page?: string }>
}

export default async function Page({ params, searchParams }: Props) {
    const { userId, keyword } = await params
    const { page: pageStr } = await searchParams
    const page = parseInt(pageStr || '1')
    const decodedKeyword = decodeURIComponent(keyword)

    let itemList: FeedItem[] = []
    let totalCount = 0
    let userInfo: ServerUserInfo | null = null
    let nickname = ""

    const userResp = await getUserInfoByIdServer(userId)
    if (userResp.code === 0 && userResp.data) {
        userInfo = userResp.data
        nickname = getTempNickname(userResp.data)
    }

    const subResp = await getUserKeywordSubscriptionItemListServer(userId, keyword, page)
    if (subResp.code === 0) {
        itemList = subResp.data
        if (itemList.length > 0) {
            totalCount = itemList[0].Count
        }
    }

    const totalPage = Math.max(1, Math.ceil(totalCount / 10))

    return (
        <SubscriptionKeywordClient
            userId={userId}
            keyword={keyword}
            decodedKeyword={decodedKeyword}
            page={page}
            userInfo={userInfo}
            nickname={nickname}
            itemList={itemList}
            totalCount={totalCount}
            totalPage={totalPage}
        />
    )
}
