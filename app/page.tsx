import Header from "@/components/Header";
import SearchInput from "@/components/SearchInput";

export default function Home() {

    return (
        <div>
            <Header hideSearchBtn={true} >
                <div className="mt-28">
                    <div className="md:text-5xl text-2xl font-semibold flex justify-center w-full italic text-center">
                        Discover, Subscribe, Share
                    </div>
                    <div className="md:text-4xl text-xl text-primary font-bold flex justify-center w-full italic text-center mt-9">
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
