import { getListenLaterListByUserIdServer } from "@/libs/listen_later"
import { getUserInfoByIdServer, getTempNickname } from "@/libs/user"
import { UserListenLaterDto } from "@/types/listen_later"
import { ServerUserInfo } from "@/libs/user"
import ListenLaterClient from "./ListenLaterClient"

type Props = {
    params: Promise<{ userId: string }>
    searchParams: Promise<{ page?: string }>
}

export default async function Page({ params, searchParams }: Props) {
    const { userId } = await params
    const { page: pageStr } = await searchParams
    const page = parseInt(pageStr || '1')

    let itemList: UserListenLaterDto[] = []
    let totalCount = 0
    let userInfo: ServerUserInfo | null = null
    let nickname = ""

    const userResp = await getUserInfoByIdServer(userId)
    if (userResp.code === 0 && userResp.data) {
        userInfo = userResp.data
        nickname = getTempNickname(userResp.data)
    }

    const llResp = await getListenLaterListByUserIdServer(userId, page)
    if (llResp.code === 0) {
        itemList = llResp.data
        if (itemList.length > 0) {
            totalCount = itemList[0].count
        }
    }

    const totalPage = Math.max(1, Math.ceil(totalCount / 10))

    return (
        <ListenLaterClient
            userId={userId}
            page={page}
            userInfo={userInfo}
            nickname={nickname}
            itemList={itemList}
            totalCount={totalCount}
            totalPage={totalPage}
        />
    )
}
