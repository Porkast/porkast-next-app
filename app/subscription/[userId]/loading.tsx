export default function Loading() {
    return (
        <div className="w-full flex justify-center min-h-screen pt-20">
            <div className="w-full max-w-2xl pl-6 pr-6">
                <div className="flex flex-col items-center mb-10 gap-4">
                    <div className="skeleton w-28 h-28 rounded-full"></div>
                    <div className="skeleton h-6 w-48"></div>
                    <div className="skeleton h-4 w-32"></div>
                </div>
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="card w-full bg-base-200 shadow mb-6">
                        <div className="card-body">
                            <div className="space-y-3">
                                <div className="skeleton h-6 w-2/3"></div>
                                <div className="skeleton h-4 w-1/3"></div>
                                <div className="skeleton h-4 w-1/4"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
