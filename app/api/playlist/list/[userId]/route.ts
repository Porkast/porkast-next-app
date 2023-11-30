import { queryUserPlaylistListByUserId } from "@/libs/db/playlist";
import { NextRequest, NextResponse } from "next/server";


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

    if (!userId) {
        resp.code = 1
        resp.message = 'Missing required fields'
        return NextResponse.json(resp)
    }

    const resultDtos = await queryUserPlaylistListByUserId(userId, offset, limit)

    resp.code = 0
    resp.message = 'Ok'
    resp.data = resultDtos

    return NextResponse.json(resp)
}