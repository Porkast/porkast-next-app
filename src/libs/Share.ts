import { ShareType } from "../types/enum"

export const getSubscriptionRssUrl = (userId: string, keyword: string): string => {
    return `${window.location.origin}/api/rss/${ShareType.Subscription}/${userId}/${keyword}`
}

export const getListenLaterRssUrl = (userId: string): string => {
    return `${window.location.origin}/api/rss/${ShareType.ListenLater}/${userId}`
}

export const getPlaylistRssUrl = (playlistId: string, userId: string): string => {
    return `${window.location.origin}/api/rss/${ShareType.Playlist}/${playlistId}/${userId}`
}
