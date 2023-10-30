export type FeedItem = {
    Id: string;
    FeedId: string;
    GUID: string;
    ChannelId: string;
    Title: string;
    HighlightTitle: string;
    Link: string;
    PubDate: string;
    Author: string;
    InputDate: Date;
    ImageUrl: string;
    EnclosureUrl: string;
    EnclosureType: string;
    EnclosureLength: string;
    Duration: string;
    Episode: string;
    Explicit: string;
    Season: string;
    EpisodeType: string;
    Description: string;
    TextDescription: string;
    ChannelImageUrl: string;
    ChannelTitle: string;
    HighlightChannelTitle: string;
    FeedLink: string;
    Count: number;
    Source: string
    ExcludeFeedId: string
    Country: string
    TookTime: number;
    HasThumbnail: boolean;
}

export type UserListenLater = {
    Id: string;
    GUID: string;
    ChannelId: string;
    FeedId: string;
    Title: string;
    HighlightTitle: string;
    Link: string;
    PubDate: string;
    Author: string;
    InputDate: Date | null;
    ImageUrl: string;
    EnclosureUrl: string;
    EnclosureType: string;
    EnclosureLength: string;
    Duration: string;
    Episode: string;
    Explicit: string;
    Season: string;
    EpisodeType: string;
    Description: string;
    TextDescription: string;
    ChannelImageUrl: string;
    ChannelTitle: string;
    HighlightChannelTitle: string;
    FeedLink: string;
    Count: number;
    TookTime: number;
    HasThumbnail: boolean;
    Source: string;
    ExcludeFeedId: string;
    Country: string;
    RegDate: string;
}