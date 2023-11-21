import Header from "@/components/Header";
import SearchInput from "@/components/SearchInput";
import { Metadata } from "next";

export default function Home() {

    return (
        <div>
            <Header hideSearchBtn={true} >
                <div className="mt-28">
                    <div className="lg:text-7xl text-6xl font-semibold flex justify-center w-full italic text-center">
                        Discover, Subscribe, Share
                    </div>
                    <div className="lg:text-6xl text-5xl text-primary font-bold flex justify-center w-full italic text-center mt-9">
                        Your Personalized Podcast
                    </div>
                </div>

                <div className="mt-16">
                    <div className="w-full flex justify-center mt-9 pl-6 pr-6">
                        <SearchInput placeholder="Start from search" />
                    </div>
                </div>

            </Header>
        </div>
    )
}

export async function generateMetadata(): Promise<Metadata> {
    const title = "Porkast | Discover, Subscribe, Share Your Personalized Podcast"
    const description = "You can Subscribe search keyword, build your own podcast playlist by yourself, and share the playlist as RSS feed."

    return {
        title: title,
        description: description,
    }
}
