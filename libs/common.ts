import { v5 as uuidv5 } from 'uuid';
import { v4 as uuidv4 } from 'uuid';
import { JsonResponse } from '@/types/api';
import { FeedItem } from '@/types/feed_item';


export const replaceWithBr = (text: string): string => {
    return text.replace(/\n/g, "<br/>")
}

export const addLinkTagToUrl = (text: string): string => {
    return text.replace(
        /(https?:\/\/[^\s]+)/g,
        '<a className="link" href="$1" target="_blank">$1</a>'
    )
}

export const removeTextColorStyles = (html: string): string => {
    const updatedHtml = html.replace(/color:[^;]*;/g, '');
    return updatedHtml;
}

export const convertMillsTimeToDuration = (mills: number): string => {
    // Check if the duration is in the thousands digits
    if (mills >= 1000 && mills < 10000) {
        // Convert to milliseconds
        mills *= 1000;
    }

    // Convert milliseconds to duration time with format 00:00:00
    const hours = Math.floor(mills / 3600000);
    const minutes = Math.floor((mills % 3600000) / 60000);
    const seconds = Math.floor(((mills % 3600000) % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export const formatDateTime = (dateTime: string): string => {
    const date = new Date(dateTime)
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')
}

export const parseHtmlStrinText = (htmlString: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const textContent = doc.body.textContent;
    return textContent ?? '';
}

export const generateFeedItemId = async (feedUrl: string, title: string): Promise<string> => {
    const uniqueId = uuidv5(feedUrl + title, uuidv5.DNS);
    return uniqueId
}

export const generateID = async (): Promise<string> => {
    const uniqueId = uuidv4();
    return uniqueId
}

export const generatePlaylistId = async (name: string, userId: string): Promise<string> => {
    const uniqueId = uuidv5(name + userId, uuidv5.DNS);
    return uniqueId
}

export const generatePlaylistItemId = async (playlistId: string, itemId: string): Promise<string> => {
    const uniqueId = uuidv5(playlistId + itemId, uuidv5.DNS);
    return uniqueId
}

/**
 * Search for podcast episodes using the internal API
 * @param q Search query string
 * @param country Country code (default: 'US')
 * @param offset Pagination offset (default: 0)
 * @param limit Maximum number of results (default: 10)
 * @returns Promise<FeedItem[]> Array of podcast episodes
 */
export const searchEpisodes = async (q: string, country: string = 'US', offset: number = 0, limit: number = 10
): Promise<FeedItem[]> => {
    try {
        const params = new URLSearchParams({
            q,
            country,
            offset: offset.toString(),
            limit: limit.toString(),
        });

        const response = await fetch(`/api/search/episode?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonResponse: JsonResponse = await response.json();

        if (jsonResponse.code !== 0) {
            throw new Error(`API error: ${jsonResponse.message || 'Unknown error'}`);
        }

        return jsonResponse.data as FeedItem[];
    } catch (error) {
        console.error('Error searching episodes:', error);
        throw error;
    }
}

/**
 * Get detailed information for a specific podcast episode using the internal API
 * @param episodeId Spotify episode ID
 * @param market Market code (default: 'US')
 * @returns Promise<FeedItem> Detailed episode information
 */
export const getEpisodeDetail = async (episodeId: string, market: string = 'US'
): Promise<FeedItem> => {
    try {
        const params = new URLSearchParams({
            market,
        });

        const response = await fetch(`/api/podcast/episode/${episodeId}?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonResponse: JsonResponse = await response.json();

        if (jsonResponse.code !== 0) {
            throw new Error(`API error: ${jsonResponse.message || 'Unknown error'}`);
        }

        return jsonResponse.data as FeedItem;
    } catch (error) {
        console.error('Error getting episode detail:', error);
        throw error;
    }
}
