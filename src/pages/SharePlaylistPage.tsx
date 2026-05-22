import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { AppProvider } from '../component/AppContext'
import Footer from '../component/Footer'
import Header from '../component/Header'
import { CopyRSSLinkBtn } from '../component/Share'
import { API_URL } from '../libs/Constants'
import { getPlaylistInfoById } from '../libs/Playlist'
import Loading from '../component/Loading'
import XMLViewer from 'react-xml-viewer'

export default function SharePlaylistPage() {
    const { playlistId, userId } = useParams()
    const [loading, setLoading] = useState(true)
    const [playlistName, setPlaylistName] = useState('')
    const [nickname, setNickname] = useState('')
    const [xml, setXml] = useState('<hello>World</hello>')
    const rssLink = `${API_URL}/rss/playlist/${playlistId}/${userId}`

    useEffect(() => {
        if (!playlistId || !userId) return
        const fetchData = async () => {
            const plResp = await getPlaylistInfoById(playlistId)
            if (plResp.code === 0 && plResp.data) {
                setPlaylistName(plResp.data.PlaylistName)
            }
            try {
                const xmlResp = await fetch(rssLink)
                setXml(await xmlResp.text())
            } catch { /* keep default xml */ }
            setLoading(false)
        }
        fetchData()
    }, [playlistId, userId])

    if (loading) return <Loading />

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
        <>
            <AppProvider>
                <Header>
                    <div className="w-full flex justify-center min-h-screen">
                        <div className="w-full max-w-2xl">
                            <div className="w-full flex justify-center">
                                <div className="text-2xl font-bold">{playlistName} - RSS Source Viewer</div>
                            </div>
                            <div className="w-full flex justify-center pl-6 pr-6 pt-9">
                                <div className="text-base">{nickname}{`'s Porkast Playlist`}</div>
                            </div>
                            <div className="w-full flex justify-center pl-6 pr-6 mt-4">
                                <a className="link link-primary" href={rssLink} target="_blank" rel="noopener noreferrer">RSS Link</a>
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
        </>
    )
}
