import { searchSpotifyEpisodes } from "@/libs/spotify"
import { NextRequest, NextResponse } from "next/server"


export async function GET(request: NextRequest) {

    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get('q')
    const country = searchParams.get('country')
    const offset = Number(searchParams.get('offset')) || 0
    const limit = Number(searchParams.get('limit')) || 10
    const data = await searchSpotifyEpisodes(q || '', country || 'US', limit, offset)
    const resp: JsonResponse = {
        code: 0,
        message: '',
        data: data
    }
    return NextResponse.json(resp)
}