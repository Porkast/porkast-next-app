'use client'

import parse from 'html-react-parser'

type ShowNotesViewerProps = {
    data: {
        description: string
    }
}

export default function ShowNotesViewer(props: ShowNotesViewerProps) {

    return (
        <>
            <div className="text-base-content">
                {parse(props.data.description)}               
            </div>
        </>
    )
}