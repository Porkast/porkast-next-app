const TIER_KEYWORDS_LIMIT: Record<string, number | null> = {
    free: 5,
    pro: 20,
    unlimited: null,
}

export interface MembershipStatusResult {
    tier: string
    productId: string | null
    expiresDate: string | null
    isActive: boolean
    willRenew: boolean
    keywordsLimit: number | null
    keywordsUsed: number
}

export async function getUserMembershipStatus(userId: string): Promise<MembershipStatusResult> {
    try {
        const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://porkast-svc.guoshaotech.workers.dev/api'}/membership/status?userId=${userId}`)
        const respJson = await resp.json()

        if (respJson.code === 0 && respJson.data) {
            return {
                tier: respJson.data.tier || 'free',
                productId: respJson.data.productId || null,
                expiresDate: respJson.data.expiresDate || null,
                isActive: respJson.data.isActive || false,
                willRenew: respJson.data.willRenew || false,
                keywordsLimit: TIER_KEYWORDS_LIMIT[respJson.data.tier] ?? null,
                keywordsUsed: respJson.data.keywordsUsed || 0,
            }
        }

        const keywordsUsed = respJson.data?.keywordsUsed || 0
        return {
            tier: 'free',
            productId: null,
            expiresDate: null,
            isActive: false,
            willRenew: false,
            keywordsLimit: TIER_KEYWORDS_LIMIT['free'],
            keywordsUsed,
        }
    } catch {
        return {
            tier: 'free',
            productId: null,
            expiresDate: null,
            isActive: false,
            willRenew: false,
            keywordsLimit: TIER_KEYWORDS_LIMIT['free'],
            keywordsUsed: 0,
        }
    }
}
