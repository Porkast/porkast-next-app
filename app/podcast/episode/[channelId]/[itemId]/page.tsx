import { Metadata, ResolvingMetadata } from "next"
import { cache } from "react"


export default async function Page({ params }: { params: { hannelId: string, itemId: string } }) {

    console.log("Episode Page")
    console.log(params.itemId)

    return (
        <div>Episode Page</div>
    )
}

export async function generateMetadata(
    { params }: { params: { channelId: string, itemId: string } },
    parent: ResolvingMetadata
): Promise<Metadata> {
    console.log("generateMetadata")
    const data = await getFeedItemInfoById(params.channelId, params.itemId)
    const itemInfo = data.itemInfo
    const title = itemInfo.Title + "- Porkast"

    return {
        title: title,
        description: itemInfo.TextDescription,
        authors: [itemInfo.Author],
    }
}

export const getFeedItemInfoById = cache(async (channelId: string, itemId: string) => {
    const res = await fetch(`${process.env.API_BASE_URL}v1/api/feed/channel/${channelId}/item/${itemId}`)
    const data = await res.json()
    return data.data
})