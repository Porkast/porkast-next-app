export default function Loading() {
    return (
        <div className="w-full flex justify-center min-h-screen pt-20">
            <div className="w-full max-w-2xl pl-6 pr-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="card w-full bg-base-200 shadow mb-6">
                        <div className="card-body">
                            <div className="flex gap-4">
                                <div className="skeleton w-24 h-24 rounded-lg shrink-0"></div>
                                <div className="flex-1 space-y-3">
                                    <div className="skeleton h-5 w-3/4"></div>
                                    <div className="skeleton h-4 w-1/2"></div>
                                    <div className="skeleton h-4 w-full"></div>
                                    <div className="skeleton h-4 w-2/3"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
