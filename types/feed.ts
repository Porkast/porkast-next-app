import { Feed, Item } from "podcast";

export interface RSS {
    version: string;
    encoding: string;
    rss: {
        xmlnsItunes: string;
        xmlnsAtom: string;
        xmlnsRdf: string;
        xmlnsContent: string;
        version: string;
        channel: {
            title: string;
            description: string;
            'itunes:category': {
                "$": {
                    text: string
                }
            };
            language: string;
            explicit: string;
            atomLink: {
                href: string;
                type: string;
                rel: string;
            };
            link: string;
            copyright: string;
            'itunes:author': string;
            'itunes:owner': string;
            'itunes:image': {
                '$': {
                    href: string
                }
            };
            type: string;
            item: {
                title: string;
                enclosure: {
                    '$': {
                        url: string;
                        type: string;
                        length: string;
                    }
                };
                guid: {
                    '$': {
                        isPermaLink: string
                    }
                    '_': string
                };
                pubDate: string;
                description: string;
                link: string;
                contentEncoded: string;
                'itunes:duration': string;
                'itunes:image': {
                    '$': {
                        href: string
                    }
                };
            }[];
        };
    };
}


export interface PodcastFeed extends Feed {
    itunes: {
        title: string
        author: string
        summary: string
        owner: {
            name: string
            email: string
        }
        image: string
        type: string
        categories: string[]
    }
    items: PodcastItem
}

export interface PodcastItem extends Item {
    itunes: {
        duration: string
        image: string
        author: string
        title: string
        episode: string
        season: string
        summary: string
    }
}