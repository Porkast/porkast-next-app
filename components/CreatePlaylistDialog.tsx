'use client'

import { Ref, forwardRef, useEffect, useState } from "react"

type CreatePlaylistDialogProps = {

}

export type CreatePlaylistDialogRef = {
    showDialog: (userId: string) => void
}

const CreatePlaylistDialog = forwardRef<CreatePlaylistDialogRef>((props: CreatePlaylistDialogProps, ref: Ref<CreatePlaylistDialogRef>) => {

    const [isloading, setIsLoading] = useState(false)
    const [playlistName, setPlaylistName] = useState('')
    const [playlistDescription, setPlaylistDescription] = useState('')

    const onSubmitToCreatePlaylistBtnClick = () => {
        setIsLoading(true)
    }

    useEffect(() => {
        const dialog = document.getElementById("createPlaylistModal") as HTMLDialogElement;
        if (ref) {
            (ref as any).current = {
                showDialog: async function (userId: string) {
                    console.log("userId", userId)
                    if (dialog) {
                        dialog.showModal();
                    }
                }
            }
        }

    }, [])

    return (
        <>
            <dialog id="createPlaylistModal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Create Playlist</h3>
                    <div className="form-control w-full max-w-2xl mt-4">
                        <label className="label">
                            <span className="label-text">What is playlist name?</span>
                        </label>
                        <input value={playlistName} onChange={(e) => setPlaylistName(e.target.value)} type="text" placeholder="Type here" className="input input-bordered w-full max-w-2xl" />
                    </div>
                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Add some descriptioin?</span>
                        </label>
                        <textarea value={playlistDescription} onChange={(e) => setPlaylistDescription(e.target.value)} className="textarea textarea-bordered h-24" placeholder="The playlist description"></textarea>
                    </div>
                    <div className="modal-action">
                        {
                            isloading ? (
                                <>
                                    <button className="btn" onClick={onSubmitToCreatePlaylistBtnClick}><span className="loading loading-spinner loading-sm"></span> Submit</button>
                                </>
                            ) : (
                                <button className="btn" onClick={onSubmitToCreatePlaylistBtnClick}>Submit</button>
                            )
                        }
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    )
})


export default CreatePlaylistDialog;