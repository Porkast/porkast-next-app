import { queryUserPlaylistListByUserId } from "@/libs/db/playlist";
import prisma from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";
import { useId } from "react";


export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {

    const userId = params.userId
    const searchParams = request.nextUrl.searchParams
    const offset = Number(searchParams.get('offset')) || 0
    const limit = Number(searchParams.get('limit')) || 10
    const resp: JsonResponse = {
        code: 0,
        message: '',
        data: null
    }

    if (!useId) {
        resp.code = 1
        resp.message = 'Missing required fields'
        return NextResponse.json(resp)
    }

    const playlistList = await prisma.user_playlist.findMany({
        where: {
            user_id: userId
        }
    })

    if (!playlistList) {
        resp.code = 1
        resp.message = 'Playlist not found'
        return NextResponse.json(resp)
    }

    const resultDtos = await queryUserPlaylistListByUserId(userId, offset, limit)

    resp.code = 0
    resp.message = 'Ok'
    resp.data = resultDtos

    return NextResponse.json(resp)
}