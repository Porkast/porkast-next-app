import prisma from "./prisma"

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

export async function getUserMembershipStatus(
  userId: string
): Promise<MembershipStatusResult> {
  const membership = await prisma.user_membership.findFirst({
    where: {
      user_id: userId,
      is_active: true,
      expires_date: { gt: new Date() },
    },
    orderBy: { expires_date: "desc" },
  })

  const keywordsUsed = await prisma.user_subscription.count({
    where: { user_id: userId, status: 1 },
  })

  if (membership) {
    const tier = membership.tier
    return {
      tier,
      productId: membership.product_id,
      expiresDate: membership.expires_date?.toISOString() ?? null,
      isActive: true,
      willRenew: membership.will_renew,
      keywordsLimit: TIER_KEYWORDS_LIMIT[tier] ?? null,
      keywordsUsed,
    }
  }

  return {
    tier: "free",
    productId: null,
    expiresDate: null,
    isActive: false,
    willRenew: false,
    keywordsLimit: TIER_KEYWORDS_LIMIT["free"],
    keywordsUsed,
  }
}

export async function checkKeywordLimit(
  userId: string
): Promise<{ allowed: boolean; limit: number | null; used: number }> {
  const status = await getUserMembershipStatus(userId)
  const limit = status.keywordsLimit
  const used = status.keywordsUsed
  if (limit === null) {
    return { allowed: true, limit: null, used }
  }
  return { allowed: used < limit, limit, used }
}
