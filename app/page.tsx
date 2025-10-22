import Header from "@/components/Header";
import SearchInput from "@/components/SearchInput";

export default function Home() {

    return (
        <div>
            <Header hideSearchBtn={true} >
                <div className="mt-28">
                    <div className="w-full flex justify-center">
                        <img src="/porkast-text-logo-white.jpg" className="w-96 dark:block hidden" />
                        <img src="/porkast-text-logo-black.jpg" className="w-96 dark:hidden block" />
                    </div>
                    <div className="md:text-5xl text-2xl font-semibold flex justify-center w-full italic text-center dark:text-white text-black">
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

                <div className="mt-12 flex justify-center">
                    <div className="rounded-lg p-6 max-w-md text-center">
                        <div className="text-3xl mb-3">🚀</div>
                        <h3 className="font-semibold text-lg mb-2 dark:text-white text-black">Also Available on Telegram!</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                            Discover podcasts, manage subscriptions, and share episodes - all from Telegram.
                        </p>
                        <a
                            href="https://t.me/PorkcastBot"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                        >
                            <span>Try Telegram Bot</span>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                            </svg>
                        </a>
                    </div>
                </div>

            </Header>
        </div>
    )
}
