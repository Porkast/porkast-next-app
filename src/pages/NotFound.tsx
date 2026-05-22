import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
            <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
            <p className="text-xl text-base-content/60 mb-8">Page not found</p>
            <Link to="/" className="btn btn-primary">
                Go Home
            </Link>
        </div>
    )
}
