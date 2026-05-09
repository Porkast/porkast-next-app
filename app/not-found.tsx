import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="w-full flex justify-center min-h-screen pt-20">
            <div className="w-full max-w-md text-center mt-32">
                <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
                <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
                <p className="text-neutral-500 mb-8">The page you are looking for does not exist or has been moved.</p>
                <Link href="/" className="btn btn-primary">Go Home</Link>
            </div>
        </div>
    )
}
