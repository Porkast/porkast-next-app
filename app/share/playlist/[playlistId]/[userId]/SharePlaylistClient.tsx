'use client'

import { AppProvider } from "@/components/AppContext"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { CopyRSSLinkBtn } from "@/components/Share"
import Link from "next/link"
import { useEffect } from "react"
import XMLViewer from 'react-xml-viewer'

type Props = {
    playlistName: string
    nickname: string
    rssLink: string
    xml: string
}

export default function SharePlaylistClient({ playlistName, nickname, rssLink, xml }: Props) {
    const xmlViewerCustomTheme = {
        overflowBreak: true,
        width: "100%",
    }

    useEffect(() => {
        const element = document.getElementsByClassName('rxv-container') as any
        if (element && element[0]) {
            element[0].style.maxWidth = '42rem'
            element[0].style.width = '100%'
            element[0].style.padding = '1.5rem'
        }
    }, [])

    return (
        <AppProvider>
            <Header>
                <div className="w-full flex justify-center min-h-screen mt-20">
                    <div className="w-full max-w-2xl">
                        <div className="w-full flex justify-center">
                            <div className="text-2xl font-bold">Playlist RSS Source Viewer</div>
                        </div>
                        <div className="w-full flex justify-center pl-6 pr-6 mt-9">
                            <div className="text-base ">Playlist: {playlistName}</div>
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
