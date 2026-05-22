import { Ref, forwardRef, useEffect, useState } from "react"

export type AddExcludeFeedIdDialogRef = {
    showModal: (channelTitle: string, feedId: string) => void
}

const AddExcludeFeedIdDialog = forwardRef<AddExcludeFeedIdDialogRef>((_props, ref: Ref<AddExcludeFeedIdDialogRef>) => {

    const [channelTitle, setChannelTitle] = useState<string>("");
    const [feedId, setFeedId] = useState<string>("");

    const addExcludeFeedId = () => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('excludeFeedId')) {
            const excludeFeedId = urlParams.get('excludeFeedId');
            if (excludeFeedId) {
                var newExcludeId = excludeFeedId + ',' + feedId;
                urlParams.set('excludeFeedId', newExcludeId);
            } else {
                urlParams.set('excludeFeedId', feedId);
            }
        } else {
            urlParams.set('excludeFeedId', feedId);
        }
        window.location.href = window.location.origin + '/search?' + urlParams.toString();
    }

    useEffect(() => {
        const dialog = document.getElementById('exclude_feed_id_modal') as HTMLDialogElement;
        if (ref) {
            (ref as any).current = {
                showModal: (channelTitle: string, feedId: string) => {
                    if (dialog) {
                        dialog.showModal();
                        setChannelTitle(channelTitle);
                        setFeedId(feedId);
                    }
                }
            }
        }

    }, [])

    return (
        <>
            <dialog id="exclude_feed_id_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Exclude Channel</h3>
                    <p className="py-4">Are you sure you want to exclude channel `{channelTitle}` from search result?</p>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn" onClick={addExcludeFeedId}>Yay</button>
                        </form>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    )
})

AddExcludeFeedIdDialog.displayName = 'AddExcludeFeedIdDialog';

export default AddExcludeFeedIdDialog;
