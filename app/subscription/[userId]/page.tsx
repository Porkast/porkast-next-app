import { AppProvider } from "@/components/AppContext";
import Header from "@/components/Header";
import { formatDateTime } from "@/libs/common";
import { cache } from "react";


type SubscriptionData = {
    Id: string;
    UserId: string;
    CreaterName: string;
    Keyword: string;
    OrderByDate: number;
    CreateTime: Date;
    Lang: string;
    Status: number;
    Country: string;
    Source: string;
}

export default async function Page({ params, searchParams }: { params: { userId: string }, searchParams: { page: string } }) {
    const userId = params.userId;
    var page = searchParams.page
    if (!page) {
        page = "1"
    }

    var subscriptionList: SubscriptionData[] = []
    const resp = await getUserSubscriptionList(userId)
    subscriptionList = resp.data

    return (
        <AppProvider>
            <div>
                <Header>
                    <div className='w-full flex justify-center pt-20'>
                        <div className='w-full max-w-2xl pl-6 pr-6 mb-9'>
                            {
                                subscriptionList.map((item, index) => {
                                    return (
                                        <a href={`/subscription/${userId}/${item.Keyword}`} className="card w-full bg-base-100 shadow-xl">
                                            <div className="card-body">
                                                <h2 className="card-title">#{item.Keyword}</h2>
                                                <p>Create at: {formatDateTime(item.CreateTime?.toLocaleString())}</p>
                                            </div>
                                        </a>
                                    )
                                })
                            }
                        </div>
                    </div>
                </Header>
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