import { Card } from '../ui/Card/Card'

export function SkeletonCard() {
  return (
    <Card className="animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/4" />
        </div>
        <div className="w-5 h-5 bg-gray-200 rounded" />
      </div>
    </Card>
  )
}