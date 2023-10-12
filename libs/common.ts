
export const replaceWithBr = (text: string): string => {
    return text.replace(/\n/g, "<br/>")
}

export const addLinkTagToUrl = (text: string): string => {
    return text.replace(
        /(https?:\/\/[^\s]+)/g,
        '<a className="link" href="$1" target="_blank">$1</a>'
    )
}

export const convertMillsTimeToDuration = (mills: number): string => {
    // Check if the duration is in the thousands digits
    if (mills >= 1000 && mills < 10000) {
        // Convert to milliseconds
        mills *= 1000;
    }

    // Convert milliseconds to duration time with format 00:00:00
    const hours = Math.floor(mills / 3600000);
    const minutes = Math.floor((mills % 3600000) / 60000);
    const seconds = Math.floor(((mills % 3600000) % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}