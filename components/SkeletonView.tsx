'use clien'

import AddListenLaterButton from "./AddListenLaterButton"
import { useAppContext } from "./AppContext"


export const SkeletonListenLaterEpisodeView = () => {


    return (
        <div className="bg-base-100 shadow-xl rounded-box mb-12 pt-9">
            <div className="ml-6 mr-6">
                {/* Header information */}
                <div className="skeleton w-56 h-8 mt-9"></div>
                <div className="w-full flex justify-start mt-4">
                    <div>
                        <div className="skeleton avatar w-28 h-28">
                            <div className="rounded-lg">
                            </div>
                        </div>
                    </div>
                    <div className="ml-3">
                        <div className='md:flex md:justify-start items-center'>
                            <div className="skeleton mr-2 w-56 h-8"></div>
                        </div>
                        <div className="flex justify-start mt-4 ml-2">
                            <div className="tooltip" data-tip="RSS Feed">
                                <div >
                                    <svg className="w-4 h-4 fill-base-content" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4715" width="32" height="32">
                                        <path d="M128 768a128 128 0 1 0 0 256 128 128 0 0 0 0-256zM0 368v176c265.104 0 480 214.912 480 480h176c0-362.32-293.696-656-656-656zM0 0v176c468.336 0 848 379.664 848 848h176C1024 458.464 565.536 0 0 0z" p-id="4716"></path>
                                    </svg>
                                </div>
                            </div>
                            <div className="tooltip ml-4" data-tip="Source Link">
                                <div>
                                    <svg className="w-5 h-5 fill-base-content" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3342" width="32" height="32"><path d="M574 665.4c-3.1-3.1-8.2-3.1-11.3 0L446.5 781.6c-53.8 53.8-144.6 59.5-204 0-59.5-59.5-53.8-150.2 0-204l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3l-39.8-39.8c-3.1-3.1-8.2-3.1-11.3 0L191.4 526.5c-84.6 84.6-84.6 221.5 0 306s221.5 84.6 306 0l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3L574 665.4zM832.6 191.4c-84.6-84.6-221.5-84.6-306 0L410.3 307.6c-3.1 3.1-3.1 8.2 0 11.3l39.7 39.7c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c53.8-53.8 144.6-59.5 204 0 59.5 59.5 53.8 150.2 0 204L665.3 562.6c-3.1 3.1-3.1 8.2 0 11.3l39.8 39.8c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c84.5-84.6 84.5-221.5 0-306.1z" p-id="3343"></path><path d="M610.1 372.3c-3.1-3.1-8.2-3.1-11.3 0L372.3 598.7c-3.1 3.1-3.1 8.2 0 11.3l39.6 39.6c3.1 3.1 8.2 3.1 11.3 0l226.4-226.4c3.1-3.1 3.1-8.2 0-11.3l-39.5-39.6z" p-id="3344"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* description */}
                <div>
                    <div className="max-h-24 text-sm flex overflow-clip mt-6">
                        <p className="skeleton w-72 h-8"></p>
                    </div>
                </div>
                <div className="text-gray-500 mt-4">1970-01-01</div>
                <div className="md:flex md:justify-start items-center mt-3 pb-6">
                    {/* play icon */}
                    <div className='flex justify-start items-center'>
                        <>
                            <button className="skeleton btn btn-circle btn-sm">
                            </button>
                        </>
                        <div className="text-base text-gray-500 w-20 ml-4">00:00:00</div>
                    </div>
                    <div className='flex justify-start mt-4 md:mt-0 items-center'>
                        <AddListenLaterButton itemId={''} channelId={''} />
                        <button className="skeleton w-16 btn btn-neutral mr-2 btn-sm flex items-center rounded-lg">
                        </button>
                    </div>
                </div>
            </div>
        </div >
    )
}


export const SkeletonListenPlaylistView = () => {

    const appContext = useAppContext();

    const onAddBtnClick = async () => {
        appContext.addToPlayListFunction('', 'Podcast', '', '', "itunes")
    }

    return (
        <div className="bg-base-100 shadow-xl rounded-box mb-12 pt-9">
            <div className="ml-6 mr-6">
                {/* Header information */}
                <div className="skeleton w-56 h-8 mt-9"></div>
                <div className="w-full flex justify-start mt-4">
                    <div>
                        <div className="skeleton avatar w-28 h-28">
                            <div className="rounded-lg">
                            </div>
                        </div>
                    </div>
                    <div className="ml-3">
                        <div className='md:flex md:justify-start items-center'>
                            <div className="skeleton mr-2 w-56 h-8"></div>
                        </div>
                        <div className="flex justify-start mt-4 ml-2">
                            <div className="tooltip" data-tip="RSS Feed">
                                <div >
                                    <svg className="w-4 h-4 fill-base-content" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4715" width="32" height="32">
                                        <path d="M128 768a128 128 0 1 0 0 256 128 128 0 0 0 0-256zM0 368v176c265.104 0 480 214.912 480 480h176c0-362.32-293.696-656-656-656zM0 0v176c468.336 0 848 379.664 848 848h176C1024 458.464 565.536 0 0 0z" p-id="4716"></path>
                                    </svg>
                                </div>
                            </div>
                            <div className="tooltip ml-4" data-tip="Source Link">
                                <div>
                                    <svg className="w-5 h-5 fill-base-content" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3342" width="32" height="32"><path d="M574 665.4c-3.1-3.1-8.2-3.1-11.3 0L446.5 781.6c-53.8 53.8-144.6 59.5-204 0-59.5-59.5-53.8-150.2 0-204l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3l-39.8-39.8c-3.1-3.1-8.2-3.1-11.3 0L191.4 526.5c-84.6 84.6-84.6 221.5 0 306s221.5 84.6 306 0l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3L574 665.4zM832.6 191.4c-84.6-84.6-221.5-84.6-306 0L410.3 307.6c-3.1 3.1-3.1 8.2 0 11.3l39.7 39.7c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c53.8-53.8 144.6-59.5 204 0 59.5 59.5 53.8 150.2 0 204L665.3 562.6c-3.1 3.1-3.1 8.2 0 11.3l39.8 39.8c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c84.5-84.6 84.5-221.5 0-306.1z" p-id="3343"></path><path d="M610.1 372.3c-3.1-3.1-8.2-3.1-11.3 0L372.3 598.7c-3.1 3.1-3.1 8.2 0 11.3l39.6 39.6c3.1 3.1 8.2 3.1 11.3 0l226.4-226.4c3.1-3.1 3.1-8.2 0-11.3l-39.5-39.6z" p-id="3344"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* description */}
                <div>
                    <div className="max-h-24 text-sm flex overflow-clip mt-6">
                        <p className="skeleton w-72 h-8"></p>
                    </div>
                </div>
                <div className="text-gray-500 mt-4">1970-01-01</div>
                <div className="md:flex md:justify-start items-center mt-3 pb-6">
                    {/* play icon */}
                    <div className='flex justify-start items-center'>
                        <>
                            <button className="skeleton btn btn-circle btn-sm">
                            </button>
                        </>
                        <div className="text-base text-gray-500 w-20 ml-4">00:00:00</div>
                    </div>
                    <div className='flex justify-start mt-4 md:mt-0 items-center'>
                        <button className="skeleton w-32 btn btn-neutral btn-sm flex items-center rounded-lg mr-2">
                        </button>
                        <button className="btn btn-neutral mr-2 btn-sm flex items-center rounded-lg" onClick={onAddBtnClick}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /><path fill="none" d="M0 0h24v24H0z" /></svg>
                            <span className="font-bold text-xs md:display">Add</span>
                        </button>
                    </div>
                </div>
            </div>
        </div >
    )
}


export const SkeletonSearchEpisodeView = () => {


    return (
        <div className="bg-base-100 shadow-xl rounded-box mb-4">
            <div className="ml-6 mr-6">
                {/* Header information */}
                <div className="skeleton w-56 h-4 mt-9"></div>
                <div className="w-full flex justify-start mt-4">
                    <div>
                        <div className="skeleton avatar w-16 h-16">
                            <div className="rounded-lg">
                            </div>
                        </div>
                    </div>
                    <div className="ml-3">
                        <div className='md:flex md:justify-start items-center'>
                            <div className="skeleton mr-2 w-56 h-4"></div>
                        </div>
                        <div className="flex justify-start mt-4 ml-2">
                            <div className="tooltip" data-tip="RSS Feed">
                                <div >
                                    <svg className="w-4 h-4 fill-base-content" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4715" width="16" height="16">
                                        <path d="M128 768a128 128 0 1 0 0 256 128 128 0 0 0 0-256zM0 368v176c265.104 0 480 214.912 480 480h176c0-362.32-293.696-656-656-656zM0 0v176c468.336 0 848 379.664 848 848h176C1024 458.464 565.536 0 0 0z" p-id="4716"></path>
                                    </svg>
                                </div>
                            </div>
                            <div className="tooltip ml-4" data-tip="Source Link">
                                <div>
                                    <svg className="w-5 h-5 fill-base-content" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3342" width="16" height="16"><path d="M574 665.4c-3.1-3.1-8.2-3.1-11.3 0L446.5 781.6c-53.8 53.8-144.6 59.5-204 0-59.5-59.5-53.8-150.2 0-204l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3l-39.8-39.8c-3.1-3.1-8.2-3.1-11.3 0L191.4 526.5c-84.6 84.6-84.6 221.5 0 306s221.5 84.6 306 0l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3L574 665.4zM832.6 191.4c-84.6-84.6-221.5-84.6-306 0L410.3 307.6c-3.1 3.1-3.1 8.2 0 11.3l39.7 39.7c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c53.8-53.8 144.6-59.5 204 0 59.5 59.5 53.8 150.2 0 204L665.3 562.6c-3.1 3.1-3.1 8.2 0 11.3l39.8 39.8c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c84.5-84.6 84.5-221.5 0-306.1z" p-id="3343"></path><path d="M610.1 372.3c-3.1-3.1-8.2-3.1-11.3 0L372.3 598.7c-3.1 3.1-3.1 8.2 0 11.3l39.6 39.6c3.1 3.1 8.2 3.1 11.3 0l226.4-226.4c3.1-3.1 3.1-8.2 0-11.3l-39.5-39.6z" p-id="3344"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* description */}
                <div>
                    <div className="max-h-24 text-sm flex overflow-clip mt-2">
                        {/* <p className="skeleton w-72 h-4"></p> */}
                    </div>
                </div>
                <div className="text-gray-500 mt-2 text-xs">1970-01-01</div>
                <div className="md:flex md:justify-start items-center mt-3 pb-6">
                    {/* play icon */}
                    <div className='flex justify-start items-center'>
                        <>
                            <button className="btn btn-circle btn-outline btn-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="fill-current rounded-full ml-1"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                            </button>
                        </>
                        <div className="text-xs text-gray-500 w-16 ml-4">00:00:00</div>
                    </div>
                    <div className='flex justify-start mt-2 md:mt-0 items-center'>
                        <button className="skeleton w-32 btn btn-neutral btn-sm flex items-center rounded-lg mr-2">
                        </button>
                        <button className="skeleton w-16 btn btn-neutral mr-2 btn-sm flex items-center rounded-lg">
                        </button>
                    </div>
                </div>
            </div>
        </div >
    )
}
