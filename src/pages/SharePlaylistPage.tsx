import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { AppProvider } from '../component/AppContext'
import Footer from '../component/Footer'
import Header from '../component/Header'
import { CopyRSSLinkBtn } from '../component/Share'
import { API_URL } from '../libs/Constants'
import { getPlaylistInfoById } from '../libs/Playlist'
import { createRSSShareCode, shareCodeURL } from '../libs/ShareCode'
import { getUserInfoFromServer } from '../libs/User'
import Loading from '../component/Loading'
import XMLViewer from 'react-xml-viewer'

export default function SharePlaylistPage() {
    const { playlistId, userName } = useParams()
    const userRef = userName || ''
    const [loading, setLoading] = useState(true)
    const [playlistName, setPlaylistName] = useState('')
    const [nickname, setNickname] = useState('')
    const [xml, setXml] = useState('<hello>World</hello>')
    const [shareLink, setShareLink] = useState<string | null>(null)
    const rssLink = `${API_URL}/rss/playlist/${playlistId}/${userRef}`

    useEffect(() => {
        if (!playlistId || !userRef) return
        const fetchShareCode = async () => {
            const code = await createRSSShareCode(userRef, 'playlist', playlistId)
            if (code) setShareLink(shareCodeURL(code))
        }
        fetchShareCode()
    }, [playlistId, userRef])

    useEffect(() => {
        if (!playlistId || !userRef) return
        const fetchData = async () => {
            const plResp = await getPlaylistInfoById(playlistId)
            if (plResp.code === 0 && plResp.data) {
                setPlaylistName(plResp.data.PlaylistName)
            }
            const userResp = await getUserInfoFromServer(userRef)
            if (userResp.code === 0 && userResp.data) {
                setNickname(userResp.data.nickname || userResp.data.email?.split('@')[0] || '')
            }
            try {
                const xmlResp = await fetch(rssLink)
                setXml(await xmlResp.text())
            } catch { /* keep default xml */ }
            setLoading(false)
        }
        fetchData()
    }, [playlistId, userRef])

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
    }, [loading])

    if (loading) return <Loading />

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
                                <CopyRSSLinkBtn rssLink={shareLink ?? rssLink} />
                            </div>
                            <div className="w-full flex justify-center pl-6 pr-6 mt-3">
                                <Link
                                    to={`/guide/apple-podcast?url=${encodeURIComponent(shareLink ?? rssLink)}&type=playlist&title=${encodeURIComponent(playlistName || `${nickname}'s Playlist`)}`}
                                    className="btn btn-outline btn-primary btn-sm rounded-full gap-2"
                                >
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="2" />
                                        <path d="M12 2a10 10 0 0 0-7.07 17.07l1.42-1.42A8 8 0 1 1 12 20v2a10 10 0 0 0 0-20z" />
                                    </svg>
                                    How to subscribe in Apple Podcasts? (Tutorial)
                                </Link>
                            </div>
                            <div className="w-full flex justify-center pl-6 pr-6 mt-3">
                                <div className="text-xs text-gray-500 text-center">Copy the RSS link and paste it into Apple Podcasts or your preferred podcast player to subscribe</div>
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
