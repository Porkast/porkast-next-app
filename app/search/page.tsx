import { searchPodcastEpisodeFromItunes } from '@/libs/itunes'
import { FeedItem } from '@/types/feed_item'
import SearchContent from './SearchContent'
import type { Metadata } from 'next'

type Props = {
    searchParams: Promise<{ q?: string; page?: string; entity?: string; country?: string; source?: string; excludeFeedId?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const params = await searchParams
    const q = params.q
    return {
        title: q ? `Porkast - ${q}` : 'Porkast Search',
        description: q ? `Search results for "${q}" on Porkast podcast platform` : 'Discover podcasts on Porkast',
    }
}

export default async function SearchPage({ searchParams }: Props) {
    const params = await searchParams
    const q = params.q || ''
    const page = parseInt(params.page || '1')
    const country = params.country || 'US'
    const source = params.source || 'itunes'
    const excludeFeedId = params.excludeFeedId || ''
    const entity = params.entity || 'item'

    let searchResults: FeedItem[] = []
    let totalCount = 0
    let totalPage = 1

    if (q.length > 0) {
        const limit = 10
        const offset = (page - 1) * limit
        const data = await searchPodcastEpisodeFromItunes(q, 'podcastEpisode', country, excludeFeedId, offset, limit, 200)
        searchResults = data
        if (data.length > 0) {
            totalCount = data[0].Count
            totalPage = Math.ceil(totalCount / limit)
        }
    }

    return (
        <SearchContent
            q={q}
            page={page}
            country={country}
            source={source}
            excludeFeedId={excludeFeedId}
            entity={entity}
            searchResults={searchResults}
            totalCount={totalCount}
            totalPage={totalPage}
        />
    )
}
