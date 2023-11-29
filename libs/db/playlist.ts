import { UserPlaylistDto } from "@/types/playlist";
import prisma from "../prisma";


export async function queryPlaylistByPlaylistId(playlistId: string): Promise<UserPlaylistDto | null> {

    const queryResult = await prisma.user_playlist.findUnique({
        where: {
            id: playlistId
        }
    })

    if (!queryResult || !queryResult.id) {
        return null
    }

    const playlistDto: UserPlaylistDto = {
        Id: queryResult.id,
        PlaylistName: queryResult.playlist_name || '',
        Description: String(queryResult.description) || '',
        UserId: queryResult.user_id || '',
        Status: queryResult.status || 0,
        CreatorId: queryResult.creator_id || '',
        OrigPlaylistId: queryResult.orig_playlist_id || '',
        RegDate: queryResult.reg_date || new Date(),
        Count: 0,
    }

    return playlistDto
}


export async function queryPlaylistTotalCount(playlistId: string): Promise<number> {

    let totalCount = 0

    totalCount = await prisma.user_playlist_item.count({
        where: {
            playlist_id: playlistId
        }
    })

    return totalCount
}