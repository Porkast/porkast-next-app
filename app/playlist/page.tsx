'use client'

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SkeletonListenPlaylistView } from "@/components/SkeletonView";


export default function PlaylistPage() {

    return (
        <>
            <Header>
                <div className="min-h-screen">
                    <div className="w-full flex justify-center pt-28">
                        <div>
                            <div className="text-2xl font-semibold flex justify-center w-full italic text-center dark:text-white text-black mt-4">
                                Create a Podcast Playlist
                            </div>
                            <div className="text-xl font-bold flex justify-center w-full italic text-center mt-4">
                                Save Podcast to Your<span className="text-primary">&nbsp;Playlist&nbsp;</span>
                            </div>
                            <div className="text-xl font-bold flex justify-center w-full italic text-center mt-4">
                                Just Like Music Playlist
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex justify-center pt-2">
                        <div className="w-full max-w-2xl flex justify-center ">
                            <SkeletonListenPlaylistView />
                        </div>
                    </div>
                </div>
            </Header>
            <Footer />
        </>
    )
}