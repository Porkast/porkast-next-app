import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SkeletonListenLaterEpisodeView } from "@/components/SkeletonView";



export default function ListenLaterPage() {


    return (
        <>
            <Header>
                <div className="min-h-screen">
                    <div className="w-full flex justify-center pt-28">
                        <div>
                            <div className="text-2xl font-semibold flex justify-center w-full italic text-center dark:text-white text-black">
                                Explore podcast
                            </div>
                            <div className="text-2xl font-semibold flex justify-center w-full italic text-center dark:text-white text-black mt-4">
                                Click the listen later button
                            </div>
                            <div className="text-xl font-bold flex justify-center w-full italic text-center mt-4">
                                Save to your<span className="text-primary">&nbsp;listen later&nbsp;</span> list
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex justify-center pt-9">
                        <div className="w-full max-w-2xl flex justify-center ">
                            <SkeletonListenLaterEpisodeView />
                        </div>
                    </div>
                </div>
            </Header>
            <Footer />
        </>
    )
}