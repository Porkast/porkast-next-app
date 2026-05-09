import { getUserInfoByIdServer, getTempNickname } from "@/libs/user"
import { ServerUserInfo } from "@/libs/user"
import ShareSubscriptionClient from "./ShareSubscriptionClient"

type Props = {
    params: Promise<{ userId: string; keyword: string }>
}

export default async function Page({ params }: Props) {
    const { userId, keyword } = await params
    const decodedKeyword = decodeURIComponent(keyword)

    let userInfo: ServerUserInfo | null = null
    let nickname = ""
    let xml = '<hello>World</hello>'
    const rssLink = `${process.env.API_BASE_URL}api/rss/subscription/${userId}/${keyword}`

    const userResp = await getUserInfoByIdServer(userId)
    if (userResp.code === 0 && userResp.data) {
        userInfo = userResp.data
        nickname = getTempNickname(userResp.data)
    }

    try {
        const xmlResp = await fetch(rssLink)
        xml = await xmlResp.text()
    } catch { /* keep default xml */ }

    return (
        <ShareSubscriptionClient
            keyword={decodedKeyword}
            nickname={nickname}
            rssLink={rssLink}
            xml={xml}
        />
    )
}
