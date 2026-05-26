export function ProductCardSkeleton() {
  return (
    <article aria-hidden="true">
      <div className="w-full aspect-[3/4] bg-surface-container animate-pulse rounded mb-3" />
      <div className="flex flex-col gap-2">
        <div className="h-3 w-16 bg-surface-container animate-pulse rounded" />
        <div className="h-4 w-full bg-surface-container animate-pulse rounded" />
        <div className="h-4 w-12 bg-surface-container animate-pulse rounded" />
      </div>
    </article>
  )
}
