import { queryPlaylistItemsByPlaylistId } from "@/libs/db/playlist";
import prisma from "@/libs/prisma";
import { ServerUserInfo } from "@/libs/user";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest, { params }: { params: { userId: string, playlistId: string } }) {

    const resp: JsonResponse = {
        code: 0,
        message: '',
        data: null
    }
    const userId = params.userId
    const playlistId = params.playlistId

    if (!userId || !playlistId) {
        resp.code = 1
        resp.message = 'Missing required fields'
        return NextResponse.json(resp)
    }

    const playlistInfoResult = await prisma.user_playlist.findFirst({
        where: {
            id: playlistId
        }
    })

    if (!playlistInfoResult || playlistInfoResult.user_id !== userId) {
        resp.code = 1
        resp.message = 'Playlist not found'
        return NextResponse.json(resp)
    }

    const userInfoResult = await prisma.user_info.findFirst({
        where: {
            id: playlistInfoResult?.user_id
        }
    })

    if (!userInfoResult) {
        resp.code = 1
        resp.message = 'User not found'
        return NextResponse.json(resp)
    }

    const userInfo: ServerUserInfo = {
        id: userInfoResult?.id,
        username: userInfoResult?.username || '',
        nickname: userInfoResult?.nickname || '',
        email: userInfoResult?.email || '',
        phone: userInfoResult?.phone || '',
        regDate: userInfoResult?.reg_date || new Date(),
        updateDate: userInfoResult.update_date || new Date(),
        avatar: userInfoResult?.avatar || '',
    }

    const playlist = await queryPlaylistItemsByPlaylistId(playlistId)

    resp.code = 0
    resp.message = 'success'
    resp.data = {
        "userInfo": userInfo,
        "playlist": playlist
    }
    return NextResponse.json(resp)
}