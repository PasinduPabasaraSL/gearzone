import Skeleton from '../common/Skeleton'

export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-card border bg-surface" aria-hidden="true">
      <Skeleton className="aspect-square w-full" rounded="rounded-none" />
      <div className="flex flex-col gap-2.5 p-4">
        <Skeleton className="h-2.5 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-28" />
        <Skeleton className="mt-1 h-5 w-24" />
        <Skeleton className="mt-3 h-11 w-full" rounded="rounded-control" />
      </div>
    </div>
  )
}
