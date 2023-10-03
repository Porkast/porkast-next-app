'use client'

import Link from "next/link";
import { useState } from "react";


export default function Page() {

    const [showSignIn, setShowSignIn] = useState(true)
    const [showSignUp, setShowSignUp] = useState(false)
    const [showMagicLinkPage, setShowMagicLinkPage] = useState(false)


    const toSignInPage = () => {
        setShowSignIn(true)
        setShowSignUp(false)
    }

    const toSignUpPage = () => {
        setShowSignIn(false)
        setShowSignUp(true)
    }

    const toMagicLinkPage = () => {
        setShowSignIn(false)
        setShowSignUp(false)
        setShowMagicLinkPage(true)
    }

    return (
        <>
            <div className="w-full bg-transparent p-9 pt-2 fixed z-50">
                <div className="bg-base-100 shadow-xl rounded-box h-16 flex items-center">
                    <Link href="/" className="btn btn-ghost normal-case text-xl">Porkast</Link>
                </div>
            </div>
            {
                showSignIn ? <SignInPage toSignUpPage={toSignUpPage} toMagicLinkPage={toMagicLinkPage} /> : <></>
            }
            {
                showSignUp ? <SignUpPage toSignInPage={toSignInPage} /> : <></>
            }
            {
                showMagicLinkPage ? <SendMagicLinkEmailPage toSignInPage={toSignInPage} /> : <></>
            }
        </>
    )
}


type SignInPageProps = {
    toSignUpPage: () => void;
    toMagicLinkPage: () => void;
}

function SignInPage(props: SignInPageProps) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onEmailChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }

    const onPasswordChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }

    const doSignIn = () => {

    }

    return (
        <div className="w-full min-h-screen flex justify-center">
            <div className="w-full max-w-2xl mt-32">
                <div className="w-full flex justify-center mt-4">
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Email Address</span>
                        </label>
                        <input type="text" onChange={onEmailChanged} placeholder="name@example.com" className="input input-bordered w-full max-w-xs" />
                    </div>
                </div>
                <div className="w-full flex justify-center mt-4">
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Your Password</span>
                        </label>
                        <input type="password" onChange={onPasswordChanged} placeholder="Your Password" className="input input-bordered w-full max-w-xs" />
                    </div>
                </div>
                <div className="w-full flex justify-center mt-4">
                    <button onClick={doSignIn} className="btn max-w-xs w-full">Sign in</button>
                </div>
                <div className="w-full flex justify-center mt-8">
                    <a onClick={props.toMagicLinkPage} className="link text-xs">Send a magic link Email</a>
                </div>
                <div className="w-full flex justify-center mt-4">
                    <a className="link text-xs">Forget your password?</a>
                </div>
                <div className="w-full flex justify-center mt-4">
                    <a onClick={props.toSignUpPage} className="link text-xs">Don't have an account? Sign up</a>
                </div>
            </div>
        </div>
    )
}

type SignUpPageProps = {
    toSignInPage: () => void
}

 function SignUpPage(props: SignUpPageProps) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onEmailChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }

    const onPasswordChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }

    const doSignUp = () => {

    }

    return (
        <>
            <div className="w-full min-h-screen flex justify-center">
                <div className="w-full max-w-2xl mt-32">
                    <div className="w-full flex justify-center mt-4">
                        <div className="text-2xl">Create An Account</div>
                    </div>
                    <div className="w-full flex justify-center mt-4">
                        <div className="text-sm">Enter your email and password to create your account</div>
                    </div>
                    <div className="w-full flex justify-center mt-4">
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Email Address</span>
                            </label>
                            <input type="text" onChange={onEmailChanged} placeholder="name@example.com" className="input input-bordered w-full max-w-xs" />
                        </div>
                    </div>
                    <div className="w-full flex justify-center mt-4">
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Your Password</span>
                            </label>
                            <input type="password" onChange={onPasswordChanged} placeholder="Your Password" className="input input-bordered w-full max-w-xs" />
                        </div>
                    </div>
                    <div className="w-full flex justify-center mt-4">
                        <button onClick={doSignUp} className="btn max-w-xs w-full">Sign up</button>
                    </div>
                    <div className="w-full flex justify-center mt-4">
                        <a onClick={props.toSignInPage} className="link text-xs">Already have an account? Sign in</a>
                    </div>
                </div>
            </div>
        </>
    )
}

type SendMagicLinkEmailPageProps = {
    toSignInPage: () => void
}

function SendMagicLinkEmailPage(props: SendMagicLinkEmailPageProps) {

    const [email, setEmail] = useState('')

    const onEmailChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }

    const doSendLink = () => {

    }
    return (
        <>
            <div className="w-full min-h-screen flex justify-center">
                <div className="w-full max-w-2xl mt-32">
                    <div className="w-full flex justify-center mt-4">
                        <div className="text-2xl">Sign In With Link</div>
                    </div>
                    <div className="w-full flex justify-center mt-4">
                        <div className="text-sm">Enter your valid Email Addrees</div>
                    </div>
                    <div className="w-full flex justify-center mt-4">
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Email Address</span>
                            </label>
                            <input type="text" onChange={onEmailChanged} placeholder="name@example.com" className="input input-bordered w-full max-w-xs" />
                        </div>
                    </div>
                    <div className="w-full flex justify-center mt-4">
                        <button onClick={doSendLink} className="btn max-w-xs w-full">Send Magic Link</button>
                    </div>
                    <div className="w-full flex justify-center mt-4">
                        <a onClick={props.toSignInPage} className="link text-xs">Already have an account? Sign in</a>
                    </div>
                </div>
            </div>
        </>
    )
}