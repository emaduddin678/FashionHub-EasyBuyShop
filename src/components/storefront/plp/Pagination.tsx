"use client"

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalResults: number
  onPageChange: (page: number) => void
}

function getPages(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | "...")[] = [1]
  if (current > 3) pages.push("...")
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (current < total - 2) pages.push("...")
  pages.push(total)
  return pages
}

export function Pagination({
  currentPage,
  totalPages,
  totalResults,
  onPageChange,
}: PaginationProps) {
  const pages = getPages(currentPage, totalPages)
  const hasMore = currentPage < totalPages
  const shownSoFar = Math.min(currentPage * 12, totalResults)

  return (
    <div className="flex flex-col items-center gap-6 py-10">
      {/* Numbered pagination */}
      <div className="flex items-center gap-1.5">
        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="font-sans font-medium px-4 py-2 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            fontSize: "13px",
            border: "1.5px solid var(--color-border)",
            background: "var(--color-brand-beige)",
            color: "var(--color-brand-charcoal)",
          }}
        >
          ← Prev
        </button>

        {pages.map((page, idx) =>
          page === "..." ? (
            <span
              key={`dot-${idx}`}
              className="w-9 h-9 flex items-center justify-center font-sans text-brand-charcoal/40"
              style={{ fontSize: "13px" }}
            >
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className="w-9 h-9 rounded-full font-sans font-semibold transition-colors"
              style={{
                fontSize: "13px",
                background:
                  currentPage === page
                    ? "var(--color-brand-rose)"
                    : "var(--color-brand-beige)",
                color:
                  currentPage === page
                    ? "var(--color-brand-ivory)"
                    : "var(--color-brand-charcoal)",
                border:
                  currentPage === page
                    ? "1.5px solid var(--color-brand-rose)"
                    : "1.5px solid var(--color-border)",
              }}
            >
              {page}
            </button>
          ),
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="font-sans font-medium px-4 py-2 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            fontSize: "13px",
            border: "1.5px solid var(--color-border)",
            background: "var(--color-brand-beige)",
            color: "var(--color-brand-charcoal)",
          }}
        >
          Next →
        </button>
      </div>

      {/* Load More — secondary soft CTA */}
      {hasMore && (
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage + 1)}
            className="font-sans font-semibold rounded-full px-8 py-3 transition-colors"
            style={{
              fontSize: "14px",
              background: "transparent",
              border: "1.5px solid var(--color-border)",
              color: "var(--color-brand-charcoal)",
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-brand-rose)"
              ;(e.currentTarget as HTMLButtonElement).style.color = "var(--color-brand-rose)"
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-border)"
              ;(e.currentTarget as HTMLButtonElement).style.color = "var(--color-brand-charcoal)"
            }}
          >
            Load More
          </button>
          <p className="font-sans text-brand-charcoal/40" style={{ fontSize: "12px" }}>
            Showing {shownSoFar} of {totalResults} pieces
          </p>
        </div>
      )}
    </div>
  )
}
