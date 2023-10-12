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