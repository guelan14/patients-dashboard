import { useEffect, useRef, useCallback } from 'react'

interface UseInfiniteScrollProps {
  onLoadMore: () => void
  hasMore: boolean
  loading: boolean
}

export function useInfiniteScroll({ onLoadMore, hasMore, loading }: UseInfiniteScrollProps) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const triggerRef = useRef<HTMLDivElement | null>(null)

  const observe = useCallback(() => {
    if (!hasMore || loading) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (triggerRef.current) {
      observerRef.current.observe(triggerRef.current)
    }
  }, [hasMore, loading, onLoadMore])

  useEffect(() => {
    observe()
    return () => observerRef.current?.disconnect()
  }, [observe])

  return { triggerRef }
}