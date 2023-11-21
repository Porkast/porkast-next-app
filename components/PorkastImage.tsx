'use client'
import { useEffect, useState } from "react"


type AvatarImageProps = {
    imageUrl?: string
}

export const AvatarImage = ({ imageUrl }: AvatarImageProps) => {

    const [avatarUrl, setAvatarUrl] = useState("")

    useEffect(() => {
        if (imageUrl) {
            setAvatarUrl(imageUrl)
        }
    }, [imageUrl])

    return (
        <>
            <div className="avatar">
                <div className="w-24 h-24 rounded-xl">
                    {
                        avatarUrl ?
                            <img src={avatarUrl} />
                            :
                            <img src="/porkast-text-logo.png" />
                    }
                </div>
            </div>
        </>
    )
}