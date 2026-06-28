"use client"

import type { ClothingSize, Fabric } from "@/lib/data/products"

interface ActiveFilterTagsProps {
  selectedCategories: string[]
  onRemoveCategory: (cat: string) => void
  selectedSizes: ClothingSize[]
  onRemoveSize: (size: ClothingSize) => void
  selectedColors: string[]
  onRemoveColor: (color: string) => void
  selectedFabrics: Fabric[]
  onRemoveFabric: (fabric: Fabric) => void
  priceRange: [number, number]
  defaultPriceRange: [number, number]
  onPriceReset: () => void
  selectedBrands: string[]
  onRemoveBrand: (brand: string) => void
  inStockOnly: boolean
  onInStockReset: () => void
  onClearAll: () => void
}

function Pill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-sans font-medium"
      style={{
        fontSize: "12px",
        background: "var(--color-brand-beige)",
        border: "1.5px solid var(--color-border)",
        color: "var(--color-brand-charcoal)",
      }}
    >
      {label}
      <button
        onClick={onRemove}
        className="transition-colors hover:text-brand-rose leading-none"
        style={{ fontSize: "14px", lineHeight: 1 }}
        aria-label={`Remove ${label} filter`}
      >
        ×
      </button>
    </span>
  )
}

export function ActiveFilterTags({
  selectedCategories,
  onRemoveCategory,
  selectedSizes,
  onRemoveSize,
  selectedColors,
  onRemoveColor,
  selectedFabrics,
  onRemoveFabric,
  priceRange,
  defaultPriceRange,
  onPriceReset,
  selectedBrands,
  onRemoveBrand,
  inStockOnly,
  onInStockReset,
  onClearAll,
}: ActiveFilterTagsProps) {
  const priceChanged =
    priceRange[0] !== defaultPriceRange[0] || priceRange[1] !== defaultPriceRange[1]

  return (
    <div className="flex flex-wrap items-center gap-2">
      {selectedBrands.map((brand) => (
        <Pill key={brand} label={brand} onRemove={() => onRemoveBrand(brand)} />
      ))}
      {selectedSizes.map((size) => (
        <Pill key={size} label={`Size: ${size}`} onRemove={() => onRemoveSize(size)} />
      ))}
      {selectedColors.map((color) => (
        <Pill key={color} label={color} onRemove={() => onRemoveColor(color)} />
      ))}
      {selectedFabrics.map((fabric) => (
        <Pill key={fabric} label={fabric} onRemove={() => onRemoveFabric(fabric)} />
      ))}
      {priceChanged && (
        <Pill
          label={`৳${priceRange[0].toLocaleString()} – ৳${priceRange[1].toLocaleString()}`}
          onRemove={onPriceReset}
        />
      )}
      {selectedCategories.map((cat) => (
        <Pill
          key={cat}
          label={cat.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          onRemove={() => onRemoveCategory(cat)}
        />
      ))}
      {inStockOnly && (
        <Pill label="In Stock Only" onRemove={onInStockReset} />
      )}

      <button
        onClick={onClearAll}
        className="font-sans font-medium transition-colors hover:text-brand-mauve"
        style={{ fontSize: "13px", color: "var(--color-brand-rose)" }}
      >
        Clear All
      </button>
    </div>
  )
}
