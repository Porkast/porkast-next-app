'use client'

import parse from 'html-react-parser'
import { useEffect, useState } from 'react'
import { useAppContext } from './AppContext'

type ShowNotesViewerProps = {
    data: {
        description: string
    }
}

export default function ShowNotesViewer(props: ShowNotesViewerProps) {

    const [shownots, setShownotes] = useState<string>(props.data.description);
    const appContext = useAppContext();

    function seekAudio(time: string) {
        // convert time with format 00:00:00 to seconds
        const timeParts = time.split(':');
        const timeInSeconds = (+timeParts[0]) * 60 * 60 + (+timeParts[1]) * 60 + (+timeParts[2]);
        appContext.seek(timeInSeconds);
    }

    function formatItemShownotes(shownots: string): string {
        let matches: RegExpMatchArray[] | null;
        let err: Error | null = null;

        matches = Array.from(shownots.matchAll(/((\d\d):([0-5][0-9]):([0-5]\d))|([0-5][0-9]):([0-5]\d)/g));
        if (matches === null) {
            console.debug(err);
            return shownots;
        }

        let formatShownotes = shownots;
        for (const match of matches) {
            const matchItem = match[0];
            formatShownotes = formatShownotes.replace(matchItem, `<a href='#t=${matchItem}' class='underline hover:cursor-pointer'>${matchItem}</a>`);
        }

        return formatShownotes;
    }

    useEffect(() => {
        setShownotes(formatItemShownotes(props.data.description));
    }, [shownots])

    useEffect(() => {

        const handleHashChange = () => {
            const hash = window.location.hash
            seekAudio(hash.replace('#t=', ''))
        }

        window.addEventListener('hashchange', handleHashChange)

    }, [])

    return (
        <>
            <div className="text-base-content">
                {parse(shownots)}
            </div>
        </>
    )
}