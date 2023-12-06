'use client'

import { AppProvider } from "@/components/AppContext"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { CopyRSSLinkBtn } from "@/components/Share"
import { getPlaylistInfoById } from "@/libs/playlist"
import { ServerUserInfo, getTempNickname, getUserInfoFromServer } from "@/libs/user"
import { UserPlaylistDto } from "@/types/playlist"
import Link from "next/link"
import { useEffect, useState } from "react"
import XMLViewer from 'react-xml-viewer'



export default function Page({ params }: { params: { playlistId: string, userId: string } }) {

    const [userInfo, setUserInfo] = useState<ServerUserInfo>()
    const [nickname, setNickname] = useState<string>('')
    const [playlistInfo, setPlaylistInfo] = useState<UserPlaylistDto>()
    const [rssLink, setRssLink] = useState<string>('')
    const [xml, setXml] = useState<string>('<hello>World</hello>')
    const xmlViewerCustomTheme = {
        overflowBreak: true,
        width: "100%",
    };

    useEffect(() => {

        const initPageInfo = async () => {

            const userInfoResp = await getUserInfoFromServer(params.userId)
            if (!userInfoResp || userInfoResp.code != 0) {
                // TODO: show error
                return
            }
            const userInfoData = userInfoResp.data
            setUserInfo(userInfoData)
            setNickname(getTempNickname(userInfoData))

            const playlistInfoResp = await getPlaylistInfoById(params.playlistId)
            if (playlistInfoResp.code != 0) {
                // TODO: show error
                return
            }

            setPlaylistInfo(playlistInfoResp.data)

            const xmlResp = await fetch(`${process.env.API_BASE_URL}api/rss/playlist/` + params.playlistId + '/' + params.userId, {
                method: 'GET'
            })

            const xmlRespStr = await xmlResp.text()
            setXml(xmlRespStr)
            setRssLink(`${process.env.API_BASE_URL}api/rss/playlist/` + params.playlistId + '/' + params.userId)
        }

        initPageInfo()

        // get element by class id rxv-container
        const element = document.getElementsByClassName('rxv-container') as any;
        if (element) {
            // Access or manipulate the element here
            // For example, you can add a class to the element
            element[0].style.maxWidth = '42rem';
            element[0].style.width = '100%';
            element[0].style.padding = '1.5rem';

        }

    }, [params.playlistId, params.userId])

    return (
        <AppProvider>
            <Header>
                <div className="w-full flex justify-center min-h-screen mt-20">
                    <div className="w-full max-w-2xl">
                        <div className="w-full flex justify-center">
                            <div className="text-2xl font-bold">Playlist RSS Source Viewer</div>
                        </div>
                        <div className="w-full flex justify-center pl-6 pr-6 mt-9">
                            <div className="text-base ">Playlist: {playlistInfo?.PlaylistName}</div>
                        </div>
                        <div className="w-full flex justify-center pl-6 pr-6">
                            <div className="text-base">Onwer: {nickname}</div>
                        </div>
                        <div className="w-full flex justify-center pl-6 pr-6 mt-4">
                            <Link className="link link-primary" href={rssLink} target="_blank">RSS Link</Link>
                        </div>
                        <div className="w-full flex justify-center pl-6 pr-6 mt-4">
                            <CopyRSSLinkBtn rssLink={rssLink} />
                        </div>
                        <div className="w-full flex justify-center pl-6 pr-6 mt-4">
                            <div className="text-xs text-gray-500 text-center">Copy the RSS link and paste it into your preferred podcast player to subscribe this playlist</div>
                        </div>
                        <div className="w-full max-w-2xl mt-6 pl-6 pr-6">
                            <div className="w-full flex justify-center rounded-lg border border-solid border-primary h-96 overflow-scroll">
                                <XMLViewer collapsible theme={xmlViewerCustomTheme} xml={xml} />
                            </div>
                        </div>
                    </div>
                </div>
            </Header>
            <Footer />
        </AppProvider>
    )
}

