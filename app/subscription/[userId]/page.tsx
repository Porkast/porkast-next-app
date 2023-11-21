'use client'

import { AppProvider } from "@/components/AppContext";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { AvatarImage } from "@/components/PorkastImage";
import { formatDateTime } from "@/libs/common";
import { SubscriptionData, getUserSubscriptionList } from "@/libs/subscription";
import { getUserInfoFromServer, getTempNickname, ServerUserInfo } from "@/libs/user";
import Link from "next/link";
import { useEffect, useState } from "react";



export default function Page({ params, searchParams }: { params: { userId: string }, searchParams: { page: string } }) {
    const userId = params.userId;
    var page = searchParams.page
    if (!page) {
        page = "1"
    }

    const [subscriptionList, setSubscriptionList] = useState<SubscriptionData[]>([])
    const [totalPage, setTotalPage] = useState(0)
    const [totalCount, setTotalCount] = useState(0)
    const [userInfo, setUserInfo] = useState<ServerUserInfo>()
    const [nickname, setNickname] = useState("")
    const [nextPageUrl, setNextPageUrl] = useState("")
    const [prevPageUrl, setPrevPageUrl] = useState("")
    const [isNextBtnClickable, setIsNextBtnClickable] = useState(true)
    const [isPreBtnClickable, setIsPreBtnClickable] = useState(true)


    useEffect(() => {
        async function initPageInfo() {
            const userInfoResp = await getUserInfoFromServer(userId)
            if (userInfoResp.code != 0) {
                return
            }
            const userInfoData = userInfoResp.data
            const nicknameStr = getTempNickname(userInfoData)
            setUserInfo(userInfoData)
            setNickname(nicknameStr)

            var subscriptionDataList: SubscriptionData[] = []
            const resp = await getUserSubscriptionList(userId)
            subscriptionDataList = resp.data
            setSubscriptionList(subscriptionDataList)
            if (subscriptionDataList && subscriptionDataList.length > 0) {
                setTotalPage(Math.ceil(subscriptionDataList[0].Count / 10))
                setTotalCount(subscriptionDataList[0].Count)
            } else {
                return
            }
        }

        initPageInfo()
    }, [])

    useEffect(() => {
        let nextPage = 0
        if (parseInt(page) >= totalPage) {
            nextPage = parseInt(page)
        } else {
            nextPage = parseInt(page) + 1
        }
        setNextPageUrl("/subscription/" + userId + "/" + "?page=" + nextPage)

        let prePage = 0
        if (parseInt(page) > 1) {
            prePage = parseInt(page) - 1
        } else {
            prePage = parseInt(page)
        }
        setPrevPageUrl("/subscription/" + userId + "/" + "?page=" + prePage)

        if (parseInt(page) >= totalPage) {
            setIsNextBtnClickable(false)
        } else {
            setIsNextBtnClickable(true)
        }
        if (parseInt(page) <= 1) {
            setIsPreBtnClickable(false)
        } else {
            setIsNextBtnClickable(true)
        }
    }, [totalCount, totalPage])

    return (
        <AppProvider>
            <div>
                <Header title="Subscription">
                    <div className='w-full flex justify-center mb-9 min-h-screen pt-20'>
                        <div className='w-full max-w-2xl pl-6 pr-6 mb-9'>
                            <div className="w-full mb-10">
                                <div className="flex justify-start mt-4">
                                    <div className="w-24">
                                        <AvatarImage imageUrl={userInfo?.avatar} />
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-2xl font-bold">{nickname}{`'s Subscription`}</div>
                                    </div>
                                </div>
                                <div className="mt-4 text-sm text-gray-500">@{nickname} Porkast</div>
                            </div>
                            <div className='text-neutral-500 text-sm mb-6 ml-2'>{totalCount} results</div>
                            {
                                subscriptionList?.map((item, index) => {
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

