import { queryPlaylistByPlaylistId, queryPlaylistTotalCount } from "@/libs/db/playlist";
import prisma from "@/libs/prisma";
import { ServerUserInfo } from "@/libs/user";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest, { params }: { params: { playlistId: string } }) {

    const playlistId = params.playlistId
    const resp: JsonResponse = {
        code: 0,
        message: '',
        data: null
    }

    const playlistInfoDto = await queryPlaylistByPlaylistId(playlistId)
    if (!playlistInfoDto) {
        resp.code = 1
        resp.message = 'Playlist not found'
        return NextResponse.json(resp)
    }

    const playListTotalCount = await queryPlaylistTotalCount(playlistId)
    playlistInfoDto.Count = playListTotalCount

    let creatorId = ''
    if (!playlistInfoDto.CreatorId) {
        creatorId = playlistInfoDto.UserId
    }
    const creatorInfo = await prisma.user_info.findUnique({
        where: {
            id: playlistInfoDto.CreatorId
        }
    })

    if (!creatorInfo) {
        resp.code = 1
        resp.message = 'Creator not found'
        return NextResponse.json(resp)
    }

    const serverUserInfo: ServerUserInfo = {
        id: creatorInfo.id,
        nickname: creatorInfo.nickname || '',
        email: creatorInfo.email || '',
        phone: creatorInfo.phone || '',
        regDate: creatorInfo.reg_date || new Date(),
        updateDate: creatorInfo.update_date || new Date(),
        avatar: creatorInfo.avatar || ''
    }

    playlistInfoDto.UserInfo = serverUserInfo

    resp.code = 0
    resp.message = 'OK'
    resp.data = playlistInfoDto
    return NextResponse.json(resp)
}