import { FeedItem } from "@/types/feed_item";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";


export const createOrUpdateFeedItem = async (feedItem: FeedItem) => {

    const queryData = await prisma.feed_item.findUnique({
        where: {
            id: feedItem.Id
        }
    })


    if (queryData) {
        let itemInfoUpdate: Prisma.feed_itemCreateInput;
        itemInfoUpdate = {
            id: feedItem.Id,
            feed_id: String(feedItem.FeedId),
            channel_id: feedItem.ChannelId,
            feed_link: feedItem.FeedLink,
            channel_title: feedItem.ChannelTitle,
            guid: feedItem.GUID,
            title: feedItem.Title,
            link: feedItem.Link,
            pub_date: new Date(feedItem.PubDate),
            author: feedItem.Author,
            image_url: feedItem.ImageUrl,
            enclosure_url: feedItem.EnclosureUrl,
            enclosure_length: String(feedItem.EnclosureLength),
            enclosure_type: feedItem.EnclosureType,
            duration: feedItem.Duration,
            episode: feedItem.Episode,
            explicit: feedItem.Explicit,
            season: feedItem.Season,
            episodeType: feedItem.EpisodeType,
            source: feedItem.Source,
            description: Buffer.from(feedItem.Description),
        }
        await prisma.feed_item.update({
            where: {
                id: feedItem.Id
            },
            data: itemInfoUpdate
        })
    } else {
        let itemInfoCreate: Prisma.feed_itemCreateInput;
        itemInfoCreate = {
            id: feedItem.Id,
            feed_id: String(feedItem.FeedId),
            channel_id: feedItem.ChannelId,
            feed_link: feedItem.FeedLink,
            channel_title: feedItem.ChannelTitle,
            guid: feedItem.GUID,
            title: feedItem.Title,
            link: feedItem.Link,
            pub_date: new Date(feedItem.PubDate),
            author: feedItem.Author,
            input_date: new Date(),
            image_url: feedItem.ImageUrl,
            enclosure_url: feedItem.EnclosureUrl,
            enclosure_length: String(feedItem.EnclosureLength),
            enclosure_type: feedItem.EnclosureType,
            duration: feedItem.Duration,
            episode: feedItem.Episode,
            explicit: feedItem.Explicit,
            season: feedItem.Season,
            episodeType: feedItem.EpisodeType,
        }
        await prisma.feed_item.create({
            data: itemInfoCreate
        })
    }
}