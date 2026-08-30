import type { JsonResponse } from "../types/api";
import { API_URL } from "./Constants";

export async function createRSSShareCode(
    userId: string,
    feedType: string,
    feedRef: string,
): Promise<string | null> {
    try {
        const resp: JsonResponse = await fetch(`${API_URL}/rss/share-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: userId,
                feedType: feedType,
                feedRef: feedRef,
            }),
        }).then((resp) => resp.json());
        if (resp && resp.code === 0 && resp.data && resp.data.code) {
            return resp.data.code;
        }
    } catch (err) {
        console.error('Failed to create RSS share code', err);
    }
    return null;
}

export function shareCodeURL(code: string): string {
    const host = API_URL.endsWith('/api') ? API_URL.slice(0, -4) : API_URL;
    return `${host}/r/${code}`;
}
