'use client'

import { Ref, forwardRef, useEffect, useState } from "react";


export type MsgAlertType = 'success' | 'failed'

export type MsgAlertRef = {
    showAlert: (msg: string, msgType: MsgAlertType) => void;
};

type MsgAlertProps = {
}


export const MsgAlert = forwardRef<MsgAlertRef, MsgAlertProps>((props, ref: Ref<MsgAlertRef>) => {

    const [show, setShow] = useState(false)
    const [msg, setMsg] = useState('')
    const [msgType, setMsgType] = useState<MsgAlertType>('success')

    useEffect(() => {
        if (ref) {
            (ref as any).current = {
                showAlert: (msg: string, msgType: MsgAlertType) => {
                    setMsg(msg)
                    setShow(true)
                    setMsgType(msgType)
                    setTimeout(() => {
                        setShow(false)
                    }, 3000)
                }
            }
        }
    }, [])

    return (
        <div className=" fixed top-0 left-0 right-0 z-50" style={{ visibility: show ? "visible" : "hidden" }}>
            {
                msgType === 'success' ?
                    <SuccessMsgAlert msg={msg} />
                    :
                    <FailedMsgAlert msg={msg} />
            }
        </div>
    )
})

const SuccessMsgAlert = ({ msg }: { msg: string }) => {

    return (
        <>
            <div className="alert alert-success">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>{msg}</span>
            </div>
        </>
    )
}

const FailedMsgAlert = ({ msg }: { msg: string }) => {

    return (
        <>
            <div className="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>{msg}</span>
            </div>
        </>
    )
}