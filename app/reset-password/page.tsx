'use client'

import { MsgAlert, MsgAlertRef, MsgAlertType } from "@/components/MsgAlert"
import { isUserLoggedIn, updatePassword, userSignout } from "@/libs/suapbase"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

export default function ResetPasswordPage() {

    const router = useRouter()
    const msgAlertRef = useRef<MsgAlertRef>(null)
    const [isValidResetPasswordLink, setIsValidResetPasswordLink] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const onPasswordChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }

    const onConfirmPasswordChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value)
    }

    useEffect(() => {
        async function checkValidResetPasswordCondiftion() {
            const isUserLogin = await isUserLoggedIn()
            if (isUserLogin) {
                setIsValidResetPasswordLink(true)
            }
        }

        checkValidResetPasswordCondiftion()

    }, [])

    const checkPassword = (password: string) => {
        // Password must at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.
        if (password.length < 8) {
            return false
        } else if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
            return false
        }
        return true
    }

    const doResetPassword = async () => {
        if (!checkPassword(password)) {
            msgAlertRef.current?.showAlert('Password must at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.', MsgAlertType.FAILED)
            return
        } else if (password !== confirmPassword) {
            msgAlertRef.current?.showAlert('Passwords do not match.', MsgAlertType.FAILED)
            return
        }
        const resp = await updatePassword(password)
        if (resp.code === 0) {
            // update password successfully, sign out and redirect to login page 
            msgAlertRef.current?.showAlert('Password updated successfully', MsgAlertType.SUCCESS)
            await userSignout()
            router.push('/signin')
        } else {
            // update password failed
            msgAlertRef.current?.showAlert(resp.message, MsgAlertType.FAILED)
        }
    }

    return (
        <>
            <div className="w-full min-h-screen flex justify-center">
                {
                    isValidResetPasswordLink ?
                        (
                            <div className="w-full max-w-md pt-32 pl-6 pr-6">
                                <div className="w-full flex justify-center text-xl">
                                    Please reset your password.
                                </div>
                                <div className="form-control w-full mt-9">
                                    <label className="label">
                                        <span className="label-text font-bold accent-content">Password</span>
                                    </label>
                                    <input onChange={onPasswordChanged} type="password" placeholder="Input password" className="input input-bordered w-full accent-content" />
                                </div>
                                <div className="text-neutral-content mt-4">
                                    Password must at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.
                                </div>
                                <div className="form-control w-full mt-4">
                                    <label className="label">
                                        <span className="label-text font-bold">Confirm Password</span>
                                    </label>
                                    <input onChange={onConfirmPasswordChanged} type="password" placeholder="Repeat password" className="input input-bordered w-full accent-content" />
                                </div>
                                <button onClick={() => doResetPassword()} className="btn w-full mt-9">Submit</button>
                            </div>
                        ) : (
                            <div className="w-full max-w-md pt-32 pl-6 pr-6">
                                <div className="w-full flex justify-center text-xl">
                                    Please Login First
                                </div>
                            </div>
                        )
                }
            </div>
            <MsgAlert ref={msgAlertRef} />
        </>
    )
}