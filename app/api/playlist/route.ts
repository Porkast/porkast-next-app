import { generateID, generatePlaylistId } from "@/libs/common";
import prisma from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {

    const body = await request.json()
    const userId = body.userId
    const playlistNmae = body.name
    const description = body.description

    const resp: JsonResponse = {
        code: 0,
        message: '',
        data: null
    }

    if (!userId || !playlistNmae) {
        resp.code = 1
        resp.message = 'Missing required fields'
        return NextResponse.json(resp)
    }

    try {
        await prisma.user_playlist.create({
            data: {
                id: await generatePlaylistId(playlistNmae, userId),
                user_id: userId,
                playlist_name: playlistNmae,
                description: description,
            }
        })
    } catch (error) {
        resp.code = 1
        resp.message = 'Something went wrong'
        console.log('create playlist error', error)
        return NextResponse.json(resp)
    }

    resp.code = 0
    resp.message = 'OK'
    return NextResponse.json(resp)
}