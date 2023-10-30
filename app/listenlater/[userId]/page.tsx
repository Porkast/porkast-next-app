import { FeedItem } from "@/types/feed_item"
import { Metadata, ResolvingMetadata } from "next"
import { Author } from "next/dist/lib/metadata/types/metadata-types"


export default function Page({ params }: { params: { userId: string } }) {

    return (
        <>
        </>
    )
}

export async function generateMetadata(
    { params }: { params: { channelId: string } },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const description = ""
    const title = ""
    const authorList: Author[] = []
    authorList.push({
        name: "",
        url: ""
    })
    return {
        title: title,
        description: description,
        authors: authorList,
    }
}

const getListenLaterListByUserId = async (userId: string, limit: number, offset: number): Promise<{ code: number, message: string, data: FeedItem[] }> => {
    
    const resp = await fetch(`${process.env.API_BASE_URL}v1/api/listenlater/list?userId=${userId}&limit=${limit}&offset=${offset}`)
    const respJson = await resp.json()
    return {
        code: respJson.code,
        message: respJson.message,
        data: respJson.data
    }
}