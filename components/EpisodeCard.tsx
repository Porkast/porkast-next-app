'use client'

type EpisodeCardProps = {
    data: {
        title?: string;
        description?: string;
        image?: string;
        link?: string;
        channelName?: string;
        authorName?: string;
        pubDate?: string;
        rssLink?: string;
    }
}

export default function EpisodeCard(props: EpisodeCardProps) {

    return (
        <div className="card bg-base-100 shadow-xl rounded-box">
            <div className="card-body">
                <h2 className="card-title">Shoes!</h2>
                <p>If a dog chews shoes whose shoes does he choose?</p>
                <div className="card-actions justify-end">
                    <button className="btn btn-primary">Buy Now</button>
                </div>
            </div>
        </div>
    )
}