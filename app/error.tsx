'use client'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <div className="w-full flex justify-center min-h-screen pt-20">
            <div className="w-full max-w-md text-center mt-32">
                <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
                <p className="text-neutral-500 mb-6">{error.message || 'An unexpected error occurred'}</p>
                <button className="btn btn-primary" onClick={() => reset()}>
                    Try again
                </button>
            </div>
        </div>
    )
}
