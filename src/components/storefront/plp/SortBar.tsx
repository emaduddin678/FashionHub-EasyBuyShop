"use client"

import { SlidersHorizontal, ChevronDown } from "lucide-react"

const SORT_OPTIONS = [
  { value: "popular",    label: "Most Popular" },
  { value: "newest",     label: "Newest" },
  { value: "price-asc",  label: "Price: Low–High" },
  { value: "price-desc", label: "Price: High–Low" },
  { value: "sale",       label: "On Sale" },
]

interface SortBarProps {
  sortBy: string
  onSortChange: (sort: string) => void
  filteredCount: number
  activeFilterCount: number
  onOpenFilters: () => void
}

export function SortBar({
  sortBy,
  onSortChange,
  filteredCount,
  activeFilterCount,
  onOpenFilters,
}: SortBarProps) {
  return (
    <div
      className="flex items-center justify-between rounded-xl px-4 py-3"
      style={{
        background: "var(--color-brand-beige)",
        border: "1px solid var(--color-border-light)",
      }}
    >
      {/* Left — mobile filter button (hidden lg+) + count */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenFilters}
          className="lg:hidden flex items-center gap-2 font-sans font-semibold rounded-full px-3 py-1.5 transition-colors relative"
          style={{
            fontSize: "13px",
            background: activeFilterCount > 0 ? "var(--color-brand-rose)" : "var(--color-brand-charcoal)",
            color: "var(--color-brand-ivory)",
          }}
          aria-label="Open filters"
        >
          <SlidersHorizontal size={14} />
          Filters
          {activeFilterCount > 0 && (
            <span
              className="w-4 h-4 rounded-full flex items-center justify-center font-bold"
              style={{
                fontSize: "10px",
                background: "var(--color-brand-ivory)",
                color: "var(--color-brand-rose)",
              }}
            >
              {activeFilterCount}
            </span>
          )}
        </button>

        <p className="font-sans text-brand-charcoal/60" style={{ fontSize: "13px" }}>
          <span
            className="font-semibold"
            style={{ color: "var(--color-brand-charcoal)" }}
          >
            {filteredCount.toLocaleString()}
          </span>{" "}
          pieces found
        </p>
      </div>

      {/* Right — sort dropdown */}
      <div className="flex items-center gap-2">
        <span
          className="font-sans text-brand-charcoal/50 hidden sm:block"
          style={{ fontSize: "13px" }}
        >
          Sort:
        </span>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="appearance-none font-sans font-medium rounded-full pl-3 pr-7 py-1.5 outline-none cursor-pointer transition-colors"
            style={{
              fontSize: "13px",
              background: "var(--color-brand-ivory)",
              border: "1.5px solid var(--color-border)",
              color: "var(--color-brand-charcoal)",
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={12}
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
            style={{ color: "var(--color-brand-charcoal)" }}
          />
        </div>
      </div>
    </div>
  )
}
