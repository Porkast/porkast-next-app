import { AppProvider } from "@/components/AppContext";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SubscribeListenLaterBtn from "@/components/SubscribeListenLaterButton";
import { formatDateTime } from "@/libs/common";
import { getUserInfoFromServer, getTempNickname } from "@/libs/user";
import Link from "next/link";
import { cache } from "react";


type SubscriptionData = {
    Id: string;
    UserId: string;
    CreateTime: Date;
    Status: number;
    Keyword: string;
    OrderByDate: number;
    Lang: string;
    Country: string;
    ExcludeFeedId: string;
    Source: string;
    RefId: string;
    RefName: string;
    Type: string;
    Count: number;
}

export default async function Page({ params, searchParams }: { params: { userId: string }, searchParams: { page: string } }) {
    const userId = params.userId;
    var page = searchParams.page
    if (!page) {
        page = "1"
    }

    const userInfoResp = await getUserInfoFromServer(userId)
    if (userInfoResp.code != 0) {
        // TODO: show error page
        return
    }
    const userInfo = userInfoResp.data
    const nickname = getTempNickname(userInfo)

    var subscriptionList: SubscriptionData[] = []
    const resp = await getUserSubscriptionList(userId)
    subscriptionList = resp.data

    let totalPage = 0
    let totalCount = 0
    if (subscriptionList && subscriptionList.length > 0) {
        totalPage = Math.ceil(subscriptionList[0].Count / 10)
        totalCount = subscriptionList[0].Count
    } else {
        // TODO: show error page
        return
    }

    let nextPage = 0
    if (parseInt(page) >= totalPage) {
        nextPage = parseInt(page)
    } else {
        nextPage = parseInt(page) + 1
    }
    const nextPageUrl = "/subscription/" + userId + "/" + "?page=" + nextPage

    let prePage = 0
    if (parseInt(page) > 1) {
        prePage = parseInt(page) - 1
    } else {
        prePage = parseInt(page)
    }
    const prevPageUrl = "/subscription/" + userId + "/" + "?page=" + prePage

    var isNextBtnClickable = true
    var isPreBtnClickable = true
    if (parseInt(page) >= totalPage) {
        isNextBtnClickable = false
    } else {
        isNextBtnClickable = true
    }
    if (parseInt(page) <= 1) {
        isPreBtnClickable = false
    } else {
        isPreBtnClickable = true
    }

    return (
        <AppProvider>
            <div>
                <Header>
                    <div className='w-full flex justify-center mb-9 min-h-screen pt-20'>
                        <div className='w-full max-w-2xl pl-6 pr-6 mb-9'>
                            <div className="w-full mb-10">
                                <div className="flex justify-start mt-4">
                                    <div className="avatar">
                                        <div className="w-24 h-24 rounded-xl">
                                            {
                                                userInfo.avatar ?
                                                    <img src={userInfo.avatar} />
                                                    :
                                                    <img src="/porkast-logo.png" />
                                            }
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-2xl font-bold">{nickname}'s Subscription</div>
                                        <div className="mt-4 -ml-2 flex justify-start">
                                            <SubscribeListenLaterBtn creatorId={userId} />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 text-sm text-gray-500">@{nickname} Porkast</div>
                            </div>
                            <div className='text-neutral-500 text-sm mb-6 ml-2'>{totalCount} results</div>
                            {
                                subscriptionList.map((item, index) => {
                                    return (
                                        <a key={index} href={`/subscription/${userId}/${item.Keyword}`} className="card w-full bg-base-100 shadow-xl">
                                            <div className="card-body">
                                                {
                                                    item.Keyword ? (
                                                        <h2 className="card-title">#{item.Keyword}</h2>
                                                    ) : (
                                                        <h2 className="card-title">{item.RefName}</h2>
                                                    )
                                                }
                                                <p>Create at: {formatDateTime(item.CreateTime?.toLocaleString())}</p>
                                            </div>
                                        </a>
                                    )
                                })
                            }
                            <div className="w-full flex justify-center pt-6 pb-9">
                                <div className="join">
                                    {
                                        isPreBtnClickable ? (
                                            <Link className="join-item btn btn-neutral" href={prevPageUrl}>«</Link>
                                        ) : (
                                            <button className="join-item btn btn-neutral btn-disabled">«</button>
                                        )
                                    }
                                    <button className="join-item btn btn-neutral">Page {page}</button>
                                    {
                                        isNextBtnClickable ? (
                                            <Link className="join-item btn btn-neutral" href={nextPageUrl}>»</Link>
                                        ) : (
                                            <button className="join-item btn btn-neutral btn-disabled">»</button>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </Header>
                <Footer />
            </div>
        </AppProvider>
    )
}

const getUserSubscriptionList = cache(async (userId: string): Promise<{ code: number, message: string, data: SubscriptionData[] }> => {
    const subscriptionList: SubscriptionData[] = []
    const resp = await fetch(`${process.env.API_BASE_URL}v1/api/subscription/list?userId=${userId}`)
    const respJson = await resp.json()
    if (respJson && respJson.data) {
        subscriptionList.push(...respJson.data)
    }
    return {
        code: respJson.code,
        message: respJson.message,
        data: subscriptionList
    }
})