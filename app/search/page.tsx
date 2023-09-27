'use client'

import Header from "@/components/Header"
import { useSearchParams } from "next/navigation"

export default function SearchPage() {

    const searhcParam = useSearchParams()
    const q = searhcParam.get('q')
    const page = searhcParam.get('page')
    const scope = searhcParam.get('scope')
    const sortByDate = searhcParam.get('sortByDate')

    return (
        <div>
            <Header keyword={q ? q : ""} />
        </div>
    )
}
