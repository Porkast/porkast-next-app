import { getPlaylistInfoByIdServer, getPlaylistItemListByUserIdServer } from "@/libs/playlist"
import { getTempNickname } from "@/libs/user"
import { FeedItem } from "@/types/feed_item"
import { UserPlaylistDto } from "@/types/playlist"
import { ServerUserInfo } from "@/libs/user"
import PlaylistDetailClient from "./PlaylistDetailClient"

type Props = {
    params: Promise<{ userId: string; playlistId: string }>
    searchParams: Promise<{ page?: string }>
}

export default async function PlaylistPage({ params, searchParams }: Props) {
    const { userId, playlistId } = await params
    const { page: pageStr } = await searchParams
    const page = parseInt(pageStr || '1')

    let itemList: FeedItem[] = []
    let userInfo: ServerUserInfo | null = null
    let nickname = ""
    let playlistInfo: UserPlaylistDto | null = null
    let totalCount = 0

    const itemResp = await getPlaylistItemListByUserIdServer(userId, playlistId)
    if (itemResp.code === 0 && itemResp.data) {
        itemList = itemResp.data.playlist
        userInfo = itemResp.data.userInfo
        nickname = getTempNickname(itemResp.data.userInfo)
        if (itemList.length > 0) {
            totalCount = itemList[0].Count
        }
    }

    const plResp = await getPlaylistInfoByIdServer(playlistId)
    if (plResp.code === 0 && plResp.data) {
        playlistInfo = plResp.data
    }

    const totalPage = Math.max(1, Math.ceil(totalCount / 10))

    return (
        <PlaylistDetailClient
            userId={userId}
            playlistId={playlistId}
            page={page}
            userInfo={userInfo}
            nickname={nickname}
            playlistInfo={playlistInfo}
            itemList={itemList}
            totalCount={totalCount}
            totalPage={totalPage}
        />
    )
}
