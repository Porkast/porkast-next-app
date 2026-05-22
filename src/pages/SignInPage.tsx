import { useState } from 'react'
import { syncToServer } from '../libs/User'
import type { ServerUserInfo } from '../libs/User'
import Header from '../component/Header'
import Footer from '../component/Footer'
import { setUserSessionInfo } from '../libs/User'
import { API_URL } from '../libs/Constants'

export default function SignInPage() {
    const [email, setEmail] = useState('')
    const [code, setCode] = useState('')
    const [step, setStep] = useState<'email' | 'code'>('email')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ text: '', type: '' })

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage({ text: '', type: '' })

        try {
            const res = await fetch(`${API_URL}/auth/email-otp/request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })
            const data = await res.json()

            if (data.code === 0) {
                setStep('code')
                setMessage({ text: 'Verification code sent to your email', type: 'success' })
            } else {
                setMessage({ text: data.message || 'Failed to send code', type: 'error' })
            }
        } catch {
            setMessage({ text: 'An error occurred. Please try again.', type: 'error' })
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage({ text: '', type: '' })

        try {
            const res = await fetch(`${API_URL}/auth/email-otp/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code })
            })
            const data = await res.json()

            if (data.code === 0) {
                const userData = data.data
                const sessionInfo = {
                    userId: userData.user.userId,
                    email: userData.user.email,
                    token: userData.session.token,
                    username: userData.user.nickname || userData.user.nickname,
                    avatar: userData.user.avatar,
                }
                setUserSessionInfo(sessionInfo)

                const serverUserInfo: ServerUserInfo = {
                    id: userData.user.userId,
                    email: userData.user.email,
                    nickname: userData.user.nickname,
                    avatar: userData.user.avatar,
                    token: userData.session.token
                }
                syncToServer(serverUserInfo)
                window.location.href = '/'
            } else {
                setMessage({ text: data.message || 'Invalid code', type: 'error' })
            }
        } catch {
            setMessage({ text: 'An error occurred. Please try again.', type: 'error' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Header hideSearchBtn={true} >
                <div className="w-full flex justify-center min-h-screen">
                    <div className="w-full max-w-md pt-32 pl-6 pr-6">
                        <div className="bg-base-200 p-8 rounded-xl shadow-lg">
                            <h2 className="text-2xl font-bold mb-6 text-center text-base-content">
                                {step === 'email' ? 'Sign In / Register' : 'Enter Verification Code'}
                            </h2>
                            
                            {message.text && (
                                <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                    {message.text}
                                </div>
                            )}

                            {step === 'email' ? (
                                <form onSubmit={handleSendCode} className="space-y-4">
                                    <div>
                                        <label className="label">
                                            <span className="label-text">Email</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            className="input input-bordered w-full bg-base-100"
                                            required
                                        />
                                    </div>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary w-full"
                                        disabled={loading || !email}
                                    >
                                        {loading ? <span className="loading loading-spinner"></span> : 'Send Code'}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyCode} className="space-y-4">
                                    <div>
                                        <label className="label">
                                            <span className="label-text">6-digit Code</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                            placeholder="000000"
                                            className="input input-bordered w-full bg-base-100"
                                            maxLength={6}
                                            required
                                        />
                                    </div>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary w-full"
                                        disabled={loading || code.length !== 6}
                                    >
                                        {loading ? <span className="loading loading-spinner"></span> : 'Verify Code'}
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setStep('email')
                                            setCode('')
                                            setMessage({ text: '', type: '' })
                                        }}
                                        className="btn btn-ghost w-full"
                                        disabled={loading}
                                    >
                                        Back to Email
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </Header>
            <Footer />
        </>
    )
}
