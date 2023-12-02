'use client'

import { AppProvider } from "@/components/AppContext";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SkeletonListenPlaylistView } from "@/components/SkeletonView";


export default function PlaylistPage() {

    return (
        <>
            <AppProvider>
                <Header>
                    <div className="min-h-screen">
                        <div className="w-full flex justify-center pt-28">
                            <div>
                                <div className="text-2xl font-semibold flex justify-center w-full italic text-center dark:text-white text-black mt-4">
                                    Create a podcast playlist
                                </div>
                                <div className="text-xl font-bold flex justify-center w-full italic text-center mt-4">
                                    Save to your<span className="text-primary">&nbsp;Playlist&nbsp;</span> list
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex justify-center pt-9">
                            <div className="w-full max-w-2xl flex justify-center ">
                                <SkeletonListenPlaylistView />
                            </div>
                        </div>
                        <div className="text-lg font-bold flex justify-center w-full italic text-center mt-4">
                            Click the Add button, have a try
                        </div>
                    </div>
                </Header>
                <Footer />
            </AppProvider>
        </>
    )
}