'use client'

import { getUserPlaylistByUserId } from "@/libs/playlist"
import { UserPlaylistDto } from "@/types/playlist"
import { Ref, forwardRef, useEffect, useState } from "react"

export type AddToPlayListDialogProps = {

}

export type AddToPlayListDialogRef = {
    showDialog: (userId: string, itemTitle: string, feedId: string, guid: string, source: string) => void
}

const AddToPlayListDialog = forwardRef<AddToPlayListDialogRef>((props: AddToPlayListDialogProps, ref: Ref<AddToPlayListDialogRef>) => {

    const [title, setTitle] = useState('')
    const [isloading, setIsLoading] = useState(false)
    const [userPlaylists, setUserPlaylists] = useState<UserPlaylistDto[]>()
    const [selectedPlaylistId, setSelectedPlaylistId] = useState('')

    const onSelectValueChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedPlaylistId(e.target.value)
    }

    useEffect(() => {
        const dialog = document.getElementById("addToPlaylistModal") as HTMLDialogElement;
        if (ref) {
            (ref as any).current = {
                showDialog: async (userId: string, itemTitle: string, feedId: string, guid: string, source: string = 'itunes') => {
                    console.log('show modal :', itemTitle)
                    setTitle(itemTitle)
                    if (dialog) {
                        dialog.showModal();

                        const userPlaylistResp = await getUserPlaylistByUserId(userId)
                        if (userPlaylistResp) {
                            setUserPlaylists(userPlaylistResp.data)
                        }
                    }
                }
            }
        }
    }, [])

    const onSubmitToPlaylistBtnClick = () => {
        setIsLoading(true)
    }

    return (
        <>
            <dialog id="addToPlaylistModal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Add to Playlist</h3>
                    <p className="py-4">Add `{title}` to ...</p>
                    <select className="select select-sm select-bordered w-full max-w-xs" value={selectedPlaylistId} onChange={onSelectValueChanged}>
                        <option disabled selected>Select a playlist</option>
                        {
                            userPlaylists?.map((playlist) => {
                                return (
                                    <option value={playlist.Id}>{playlist.PlaylistName}</option>
                                )
                            })
                        }
                    </select>
                    <div className="w-full flex justify-start">
                        <button className="btn btn-link -ml-4 mt-6">Or Create Playlist</button>
                    </div>
                    <div className="modal-action">
                        {
                            isloading ? (
                                <>
                                    <button className="btn" onClick={onSubmitToPlaylistBtnClick}><span className="loading loading-spinner loading-sm"></span> Submit</button>
                                </>
                            ) : (
                                <button className="btn" onClick={onSubmitToPlaylistBtnClick}>Submit</button>
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

export default AddToPlayListDialog;