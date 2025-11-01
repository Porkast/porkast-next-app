'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import { unsubscribeKeyword } from "@/libs/subscription";

type UnsubscribeKeywordButtonProps = {
    userId: string;
    keyword: string;
}

export default function UnsubscribeKeywordButton(props: UnsubscribeKeywordButtonProps) {

    const { userId, keyword } = props
    const [isUnsubscribing, setIsUnsubscribing] = useState(false)
    const router = useRouter()

    const onUnsubscribeBtnClick = async () => {
        if (!confirm(`Are you sure you want to unsubscribe from "${decodeURIComponent(keyword)}"?`)) {
            return
        }

        setIsUnsubscribing(true)
        try {
            const result = await unsubscribeKeyword(userId, decodeURIComponent(keyword))

            if (result.code === 0) {
                // Redirect to subscription list page after successful unsubscribe
                router.push(`/subscription/${userId}`)
            } else {
                alert(result.message || 'Failed to unsubscribe. Please try again.')
            }
        } catch (error) {
            console.error('Error unsubscribing:', error)
            alert('An error occurred while unsubscribing. Please try again.')
        } finally {
            setIsUnsubscribing(false)
        }
    }

    return (
        <>
            <button 
                className={`btn btn-error ml-2 btn-sm flex items-center rounded-lg ${isUnsubscribing ? 'loading' : ''}`} 
                onClick={onUnsubscribeBtnClick}
                disabled={isUnsubscribing}
            >
                {isUnsubscribing ? (
                    <>
                        <span className="loading loading-spinner"></span>
                        <span className="font-bold text-xs">Unsubscribing...</span>
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4">
                            <path fill="currentColor" d="M19 13H5v-2h14v2z" />
                            <path fill="none" d="M0 0h24v24H0z" />
                        </svg>
                        <span className="font-bold text-xs">Unsubscribe</span>
                    </>
                )}
            </button>
        </>
    )
}