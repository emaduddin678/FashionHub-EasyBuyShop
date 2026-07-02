import type { CSSProperties } from "react"
import { cn } from "@/lib/utils"

/** A pulsing rectangle. Compose with a className to match the aspect ratio of whatever it replaces. */
export function Skeleton({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <div
      className={cn("animate-pulse rounded", className)}
      style={{ background: "var(--color-brand-beige)", ...style }}
    />
  )
}

export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col bg-white overflow-hidden"
          style={{ borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-card)" }}
        >
          <Skeleton className="w-full rounded-none" style={{ aspectRatio: "3 / 4" }} />
          <div className="p-4 space-y-3">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}
