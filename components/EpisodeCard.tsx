'use client'

import parse from 'html-react-parser'
import { useAudioPlayer } from './AudioPlayerContext'

type EpisodeCardProps = {
    data: {
        itemId: string;
        channelId: string;
        title: string;
        description: string;
        image: string;
        link: string;
        rssLink: string;
        channelName: string;
        authorName: string;
        pubDate: string;
        audioLength: string;
        audioSrc: string
    }
}

export default function EpisodeCard(props: EpisodeCardProps) {

    const { data } = props
    const podcastEpisodeLink = "/podcast/" + data.channelId + "/episode/" + data.itemId
    const podcastChannelLink = "/podcast/" + data.channelId
    data.title = data.title.replace('highlightPlaceholder', 'className="text-primary"');
    data.authorName = data.authorName.replace('highlightPlaceholder', 'className="text-primary"');
    data.channelName = data.channelName.replace('highlightPlaceholder', 'className="text-primary"');
    data.description = data.description.replace('highlightPlaceholder', 'className="text-primary"');

    const { updateAudio, play, pause } = useAudioPlayer()

    const playBtnClick = () => {
        updateAudio({
            title: data.title,
            artist: data.authorName,
            cover: data.image,
            src: data.audioSrc
        })
        play()
    }

    return (
        <div className="bg-base-100 shadow-xl rounded-box mb-12 pt-9">
            <div className="ml-6 mr-6">
                {/* Header information */}
                <a href={podcastEpisodeLink} className="text-2xl font-medium mt-9">{parse(data.title)}</a>
                <div className="w-full flex justify-start mt-4">
                    <a href={podcastChannelLink} className="avatar">
                        <div className="w-24 rounded-xl">
                            <img src={data.image} />
                        </div>
                    </a>
                    <div className="ml-3">
                        <a href={podcastChannelLink} className="text-lg font-medium">{parse(data.channelName)}</a>
                        <div className="text-sm font-medium text-gray-500 mt-2">By {parse(data.authorName)}</div>
                        <div className="flex justify-start mt-4">
                            <div className="tooltip" data-tip="RSS Feed">
                                <a href={data.rssLink} target="_blank">
                                    <svg className="w-4 h-4" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4715" width="32" height="32">
                                        <path d="M128 768a128 128 0 1 0 0 256 128 128 0 0 0 0-256zM0 368v176c265.104 0 480 214.912 480 480h176c0-362.32-293.696-656-656-656zM0 0v176c468.336 0 848 379.664 848 848h176C1024 458.464 565.536 0 0 0z" p-id="4716"></path>
                                    </svg>
                                </a>
                            </div>
                            <div className="tooltip ml-4" data-tip="Source Link">
                                <a href={data.link} target="_blank">
                                    <svg className="w-5 h-5 icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3342" width="32" height="32"><path d="M574 665.4c-3.1-3.1-8.2-3.1-11.3 0L446.5 781.6c-53.8 53.8-144.6 59.5-204 0-59.5-59.5-53.8-150.2 0-204l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3l-39.8-39.8c-3.1-3.1-8.2-3.1-11.3 0L191.4 526.5c-84.6 84.6-84.6 221.5 0 306s221.5 84.6 306 0l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3L574 665.4zM832.6 191.4c-84.6-84.6-221.5-84.6-306 0L410.3 307.6c-3.1 3.1-3.1 8.2 0 11.3l39.7 39.7c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c53.8-53.8 144.6-59.5 204 0 59.5 59.5 53.8 150.2 0 204L665.3 562.6c-3.1 3.1-3.1 8.2 0 11.3l39.8 39.8c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c84.5-84.6 84.5-221.5 0-306.1z" p-id="3343"></path><path d="M610.1 372.3c-3.1-3.1-8.2-3.1-11.3 0L372.3 598.7c-3.1 3.1-3.1 8.2 0 11.3l39.6 39.6c3.1 3.1 8.2 3.1 11.3 0l226.4-226.4c3.1-3.1 3.1-8.2 0-11.3l-39.5-39.6z" p-id="3344"></path></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                {/* description */}
                <a href={podcastEpisodeLink}>
                    <div className="max-h-24 flex overflow-clip mt-6">
                        <p>{parse(data.description)}</p>
                    </div>
                </a>
                <div className="text-gray-500 mt-4">{data.pubDate}</div>
                <div className="flex justify-start items-center mt-3 pb-6">
                    {/* play icon */}
                    <button className="btn btn-circle btn-outline btn-sm" onClick={playBtnClick}>
                        <svg className="fill-current rounded-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8,5.14V19.14L19,12.14L8,5.14Z" /></svg>
                    </button>
                    <div className="text-base text-gray-500 w-20 ml-4">{data.audioLength}</div>
                    <button className="btn btn-neutral btn-sm flex items-center rounded-lg">
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" />
                            <path fill="currentColor" d="M13 7h-2v6l4.2 2.5.8-1.2-3.5-2.1z" />
                        </svg>
                        <span className="font-bold text-xs md:display">Listen Later</span>
                    </button>
                    <button className="btn btn-neutral ml-2 btn-sm flex items-center rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /><path fill="none" d="M0 0h24v24H0z" /></svg>
                        <span className="font-bold text-xs md:display">Add</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
