export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-slate-700 ${className}`} />
}

// Mimics the shape of a typical card-style row (icon + two-line text + a
// value on the right) used by PriceCard, GearUpgradeCard, ActivityRanking, etc.
export function CardRowSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-600 bg-slate-800 p-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-6 shrink-0" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-4 w-16" />
    </div>
  )
}

export function CardRowSkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <CardRowSkeleton key={i} />
      ))}
    </div>
  )
}
