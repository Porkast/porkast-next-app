import { getUserPlaylistByUserIdServer } from "@/libs/playlist"
import { getUserInfoByIdServer, getTempNickname } from "@/libs/user"
import { UserPlaylistDto } from "@/types/playlist"
import { ServerUserInfo } from "@/libs/user"
import PlaylistListClient from "./PlaylistListClient"

type Props = {
    params: Promise<{ userId: string }>
    searchParams: Promise<{ page?: string }>
}

export default async function PlaylistPage({ params, searchParams }: Props) {
    const { userId } = await params
    const { page: pageStr } = await searchParams
    const page = parseInt(pageStr || '1')

    let playlists: UserPlaylistDto[] = []
    let totalCount = 0
    let userInfo: ServerUserInfo | null = null
    let nickname = ""

    const userResp = await getUserInfoByIdServer(userId)
    if (userResp.code === 0 && userResp.data) {
        userInfo = userResp.data
        nickname = getTempNickname(userResp.data)
    }

    const plResp = await getUserPlaylistByUserIdServer(userId, page)
    if (plResp.code === 0) {
        playlists = plResp.data
        if (playlists.length > 0) {
            totalCount = playlists[0].Count
        }
    }

    const totalPage = Math.max(1, Math.ceil(totalCount / 10))

    return (
        <PlaylistListClient
            userId={userId}
            page={page}
            userInfo={userInfo}
            nickname={nickname}
            playlists={playlists}
            totalCount={totalCount}
            totalPage={totalPage}
        />
    )
}
