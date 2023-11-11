
export type UserPlaylistDto = {
    Id: string;
    PlaylistName: string;
    Description: Uint8Array;
    UserId: string;
    RegDate: Date | null;
    Status: number;
    CreatorId: string;
    OrigPlaylistId: string;
}