
export const replaceWithBr = (text: string): string => {
    return text.replace(/\n/g, "<br/>")
}

export const addLinkTagToUrl = (text: string): string => {
    return text.replace(
        /(https?:\/\/[^\s]+)/g,
        '<a className="link" href="$1" target="_blank">$1</a>'
    )
}