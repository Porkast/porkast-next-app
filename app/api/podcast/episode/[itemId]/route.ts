import { NextRequest, NextResponse } from "next/server";
import { JsonResponse } from "@/types/api";
import { getSpotifyEpisodeDetail } from "@/libs/spotify";

export async function GET(request: NextRequest, { params }: { params: { itemId: string } }) {
    try {
        const { itemId } = params;

        // Get market from query params (optional, default 'US')
        const searchParams = request.nextUrl.searchParams;
        const market = searchParams.get('market') || 'US';

        // Get episode detail from Spotify
        const episodeDetail = await getSpotifyEpisodeDetail(itemId, market);

        const resp: JsonResponse = {
            code: 0,
            message: '',
            data: episodeDetail
        };
        return NextResponse.json(resp);
    } catch (error) {
        console.error('Error getting podcast episode detail:', error);

        const resp: JsonResponse = {
            code: 1,
            message: error instanceof Error ? error.message : 'Unknown error occurred',
            data: null
        };
        return NextResponse.json(resp, { status: 500 });
    }
}
