'use client'

import { Helmet } from 'react-helmet';
import EpisodeCard from "@/components/EpisodeCard"
import Header from "@/components/Header"
import { useSearchParams } from "next/navigation"

export default function SearchPage() {

    const searhcParam = useSearchParams()
    const q = searhcParam.get('q')
    const page = searhcParam.get('page')
    const scope = searhcParam.get('scope')
    const sortByDate = searhcParam.get('sortByDate')

    return (
        <div className="w-full">
            <Helmet>
                <title>Porkast - {q}</title>
            </Helmet>
            <Header keyword={q ? q : ""} />
            <div className="w-full flex justify-center pt-24 pl-6 pr-6">
                <div className="w-full max-w-2xl">
                    <EpisodeCard data={{}}/>
                </div>
            </div>

        </div>
    )
}
