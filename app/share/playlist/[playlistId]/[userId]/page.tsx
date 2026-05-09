import { getUserInfoByIdServer, getTempNickname } from "@/libs/user"
import { getPlaylistInfoByIdServer } from "@/libs/playlist"
import { ServerUserInfo } from "@/libs/user"
import { UserPlaylistDto } from "@/types/playlist"
import SharePlaylistClient from "./SharePlaylistClient"

type Props = {
    params: Promise<{ playlistId: string; userId: string }>
}

export default async function Page({ params }: Props) {
    const { playlistId, userId } = await params

    let userInfo: ServerUserInfo | null = null
    let nickname = ""
    let playlistInfo: UserPlaylistDto | null = null
    let xml = '<hello>World</hello>'
    const rssLink = `${process.env.API_BASE_URL}api/rss/playlist/${playlistId}/${userId}`

    const userResp = await getUserInfoByIdServer(userId)
    if (userResp.code === 0 && userResp.data) {
        userInfo = userResp.data
        nickname = getTempNickname(userResp.data)
    }

    const plResp = await getPlaylistInfoByIdServer(playlistId)
    if (plResp.code === 0 && plResp.data) {
        playlistInfo = plResp.data
    }

    try {
        const xmlResp = await fetch(rssLink)
        xml = await xmlResp.text()
    } catch { /* keep default xml */ }

    return (
        <SharePlaylistClient
            playlistName={playlistInfo?.PlaylistName || ''}
            nickname={nickname}
            rssLink={rssLink}
            xml={xml}
        />
    )
}
