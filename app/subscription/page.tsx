import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SkeletonSearchEpisodeView } from "@/components/SkeletonView";



export default function SubscriptionPage() {


    return (
        <>
            <Header>
                <div className="min-h-screen">
                    <div className="w-full flex justify-center pt-28">
                        <div>
                            <div className="md:text-2xl text-base font-semibold flex justify-center w-full italic text-center dark:text-white text-black">
                                Search Podcast and<span className="text-primary">&nbsp;Subscribe&nbsp;</span>Search List
                            </div>
                            <div className="md:text-xl text-base font-bold flex justify-center w-full italic text-center mt-4">
                                You will be notified of any updates to the search results.
                            </div>
                        </div>
                    </div>
                    <div className="join w-full justify-center mt-9">
                        <input className="max-w-2xl input input-sm input-bordered join-item" placeholder="Elon Musk" />
                        <div className="indicator">
                            <button className="btn btn-sm btn-primary join-item" >Search</button>
                        </div>
                    </div>
                    <div className="w-full flex justify-center pt-2">
                        <div className="w-full max-w-2xl flex justify-center">
                            <SkeletonSearchEpisodeView />
                        </div>
                    </div>
                    <div className="w-full flex justify-center pt-2">
                        <div className="w-full max-w-2xl flex justify-center">
                            <SkeletonSearchEpisodeView />
                        </div>
                    </div>
                    <div className="w-full flex justify-center pt-2 mb-9">
                        <div className="w-96 flex justify-start">
                            <button className="btn btn-sm btn-primary rounded-lg ml-4 w-56">
                                <span className="font-bold text-sm">Subscribe `Elon Musk`</span>
                            </button>
                        </div>
                    </div>
                    <div className="w-full flex justify-center pt-2 pb-4 pl-4 pr-4">
                        <div className="md:text-xl text-base font-bold flex justify-center w-full italic text-center mt-4">
                            Once new podcasts about Elon Musk is released, you will be notified.
                        </div>
                    </div>
                </div>
                <Footer />
            </Header>
        </>
    )
}