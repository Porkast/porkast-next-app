import { getUserInfoByIdServer, getTempNickname } from "@/libs/user"
import { ServerUserInfo } from "@/libs/user"
import ShareListenLaterClient from "./ShareListenLaterClient"

type Props = {
    params: Promise<{ userId: string }>
}

export default async function Page({ params }: Props) {
    const { userId } = await params

    let userInfo: ServerUserInfo | null = null
    let nickname = ""
    let xml = '<hello>World</hello>'
    const rssLink = `${process.env.API_BASE_URL}api/rss/listenlater/${userId}`

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
        <ShareListenLaterClient
            nickname={nickname}
            rssLink={rssLink}
            xml={xml}
        />
    )
}
