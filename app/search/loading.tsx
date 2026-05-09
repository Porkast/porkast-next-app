export default function Loading() {
    return (
        <div className="w-full flex justify-center min-h-screen pt-20">
            <div className="w-full max-w-2xl pl-6 pr-6">
                <div className="skeleton h-4 w-24 mb-6 ml-2"></div>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="card w-full bg-base-200 shadow mb-6">
                        <div className="card-body">
                            <div className="flex gap-4">
                                <div className="skeleton w-20 h-20 rounded-lg shrink-0"></div>
                                <div className="flex-1 space-y-3">
                                    <div className="skeleton h-5 w-3/4"></div>
                                    <div className="skeleton h-4 w-1/2"></div>
                                    <div className="skeleton h-4 w-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
