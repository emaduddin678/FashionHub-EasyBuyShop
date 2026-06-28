"use client"

import { cn } from "@/lib/utils"
import type { ClothingSize } from "@/lib/data/products"

interface SizeSelectorProps {
  sizes: ClothingSize[]
  unavailableSizes?: ClothingSize[]
  selectedSize: ClothingSize | null
  onSizeChange: (size: ClothingSize) => void
  error?: boolean
}

export function SizeSelector({
  sizes,
  unavailableSizes = [],
  selectedSize,
  onSizeChange,
  error,
}: SizeSelectorProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className={cn("text-sm font-medium", error ? "text-red-500" : "text-gray-700")}>
          Select Size
        </span>
        <a
          href="#size-guide"
          className="text-sm font-medium text-brand-rose hover:underline"
        >
          Size Guide →
        </a>
      </div>

      {error && (
        <p className="text-xs text-red-500 mb-1.5">Please select a size to continue</p>
      )}

      <div
        className={cn(
          "flex flex-wrap gap-2 p-2 rounded-xl transition-colors",
          error ? "border-2 border-red-400 bg-red-50" : "border border-gray-100",
        )}
      >
        {sizes.map((size) => {
          const unavailable = unavailableSizes.includes(size)
          const selected = selectedSize === size
          return (
            <button
              key={size}
              disabled={unavailable}
              onClick={() => !unavailable && onSizeChange(size)}
              className={cn(
                "px-4 py-2 rounded-md border text-sm font-medium transition-all",
                unavailable
                  ? "border-gray-100 bg-gray-50 text-gray-300 line-through cursor-not-allowed"
                  : selected
                  ? "border-brand-rose bg-brand-rose text-white shadow-sm"
                  : "border-gray-200 bg-white text-gray-700 hover:border-brand-rose hover:bg-[#FBF3F5]",
              )}
            >
              {size}
            </button>
          )
        })}
      </div>
    </div>
  )
}
