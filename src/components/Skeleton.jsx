/**
 * Skeleton Component
 * Reusable loading placeholder with shimmer animation.
 * Use instead of blank loading states for a professional feel.
 *
 * Usage:
 *   <Skeleton className="h-8 w-32" />           // custom size
 *   <SkeletonCard />                             // dashboard card
 *   <SkeletonTableRow columns={5} />             // table row
 */

export function Skeleton({ className = '' }) {
  return (
    <div
      className={`bg-surface-700/50 rounded-lg animate-shimmer bg-[length:200%_100%] 
                  bg-gradient-to-r from-surface-700/50 via-surface-700/80 to-surface-700/50 
                  ${className}`}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-2 w-full rounded-full" />
    </div>
  );
}

export function SkeletonTableRow({ columns = 5 }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}
