export function PageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stat Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6 animate-pulse"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg"></div>
              <div className="w-16 h-4 bg-white/20 rounded"></div>
            </div>
            <div className="w-24 h-3 bg-white/20 rounded mb-2"></div>
            <div className="w-32 h-6 bg-white/20 rounded"></div>
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="w-48 h-6 bg-white/20 rounded animate-pulse"></div>
          <div className="flex gap-3">
            <div className="w-24 h-10 bg-white/20 rounded animate-pulse"></div>
            <div className="w-24 h-10 bg-white/20 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Table Header Skeleton */}
        <div className="flex gap-4 mb-4 pb-4 border-b border-white/10">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex-1 h-4 bg-white/20 rounded animate-pulse"></div>
          ))}
        </div>

        {/* Table Rows Skeleton */}
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex gap-4">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="flex-1 h-4 bg-white/10 rounded animate-pulse"></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
