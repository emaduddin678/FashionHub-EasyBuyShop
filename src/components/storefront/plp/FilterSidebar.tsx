"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { BRANDS } from "@/lib/data/products"
import type { ClothingSize, Fabric } from "@/lib/data/products"

// ── Color swatch definitions ───────────────────────────────────────────────────

const COLOR_SWATCHES: { name: string; hex: string }[] = [
  { name: "Ivory",  hex: "#FDFAF6" },
  { name: "White",  hex: "#FFFFFF" },
  { name: "Black",  hex: "#1C1C1C" },
  { name: "Rose",   hex: "#C0617A" },
  { name: "Mauve",  hex: "#9B7B8A" },
  { name: "Teal",   hex: "#1F6F6F" },
  { name: "Navy",   hex: "#1E3A5F" },
  { name: "Mint",   hex: "#A8D8C8" },
  { name: "Coral",  hex: "#E8705A" },
  { name: "Sage",   hex: "#8FAE8B" },
]

// ── Props interface ────────────────────────────────────────────────────────────

export interface FilterSidebarProps {
  availableCategories: string[]
  availableSizes: ClothingSize[]
  availableColors: { name: string; hex: string }[]
  availableFabrics: Fabric[]
  priceMin: number
  priceMax: number
  selectedCategories: string[]
  onCategoryChange: (categories: string[]) => void
  selectedSizes: ClothingSize[]
  onSizeChange: (sizes: ClothingSize[]) => void
  selectedColors: string[]
  onColorChange: (colors: string[]) => void
  selectedFabrics: Fabric[]
  onFabricChange: (fabrics: Fabric[]) => void
  priceRange: [number, number]
  onPriceRangeChange: (range: [number, number]) => void
  selectedBrands: string[]
  onBrandChange: (brands: string[]) => void
  inStockOnly: boolean
  onInStockChange: (v: boolean) => void
  onClearAll: () => void
  hasActiveFilters: boolean
  productCounts: {
    categories: Record<string, number>
    brands: Record<string, number>
  }
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function AccordionSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div style={{ borderBottom: "1px solid var(--color-border-light)" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 font-sans font-semibold text-brand-charcoal text-left transition-colors hover:text-brand-rose"
        style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em" }}
      >
        {title}
        <ChevronDown
          size={14}
          className="flex-shrink-0 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", color: "var(--color-brand-rose)" }}
        />
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  )
}

function CheckRow({
  label,
  count,
  checked,
  onChange,
}: {
  label: string
  count?: number
  checked: boolean
  onChange: () => void
}) {
  return (
    <button onClick={onChange} className="flex items-center gap-2.5 w-full text-left py-1 group">
      {/* Custom checkbox */}
      <span
        className="flex-shrink-0 w-4 h-4 rounded flex items-center justify-center transition-colors"
        style={{
          border: checked ? "none" : "1.5px solid var(--color-border)",
          background: checked ? "var(--color-brand-rose)" : "transparent",
        }}
      >
        {checked && (
          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
            <path
              d="M1 3.5L3.2 6L8 1"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span
        className="flex-1 font-sans text-brand-charcoal capitalize group-hover:text-brand-rose transition-colors"
        style={{ fontSize: "13px" }}
      >
        {label}
      </span>
      {count !== undefined && (
        <span className="font-sans text-brand-charcoal/40" style={{ fontSize: "12px" }}>
          {count}
        </span>
      )}
    </button>
  )
}

function PriceRangeSlider({
  value,
  onChange,
  min,
  max,
}: {
  value: [number, number]
  onChange: (v: [number, number]) => void
  min: number
  max: number
}) {
  const [lo, hi] = value
  const range = max - min
  const leftPct = range > 0 ? ((lo - min) / range) * 100 : 0
  const rightPct = range > 0 ? 100 - ((hi - min) / range) * 100 : 0

  return (
    <div>
      <p
        className="font-sans font-semibold text-brand-charcoal mb-4"
        style={{ fontSize: "14px" }}
      >
        ৳{lo.toLocaleString()} – ৳{hi.toLocaleString()}
      </p>
      <div className="relative h-5 flex items-center mb-2">
        {/* Track */}
        <div
          className="absolute w-full h-1 rounded-full"
          style={{ background: "var(--color-border)" }}
        >
          <div
            className="absolute h-full rounded-full"
            style={{
              left: `${leftPct}%`,
              right: `${rightPct}%`,
              background: "var(--color-brand-rose)",
            }}
          />
        </div>
        {/* Min handle */}
        <input
          type="range"
          min={min}
          max={max}
          step={Math.max(1, Math.round(range / 75))}
          value={lo}
          onChange={(e) => {
            const v = Math.min(Number(e.target.value), hi - 1)
            onChange([v, hi])
          }}
          className="absolute w-full appearance-none bg-transparent pointer-events-none
            [&::-webkit-slider-thumb]:pointer-events-auto
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-runnable-track]:bg-transparent"
          style={{
            zIndex: lo > max - Math.round(range * 0.2) ? 5 : 3,
            // thumb color via inline because Tailwind arbitrary doesn't support CSS vars in thumb bg
          }}
        />
        {/* Max handle */}
        <input
          type="range"
          min={min}
          max={max}
          step={Math.max(1, Math.round(range / 75))}
          value={hi}
          onChange={(e) => {
            const v = Math.max(Number(e.target.value), lo + 1)
            onChange([lo, v])
          }}
          className="absolute w-full appearance-none bg-transparent pointer-events-none
            [&::-webkit-slider-thumb]:pointer-events-auto
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-runnable-track]:bg-transparent"
          style={{ zIndex: 4 }}
        />
      </div>
      <div
        className="flex justify-between font-sans text-brand-charcoal/45"
        style={{ fontSize: "11px" }}
      >
        <span>৳{min.toLocaleString()}</span>
        <span>৳{max.toLocaleString()}</span>
      </div>
    </div>
  )
}

// ── Main sidebar ───────────────────────────────────────────────────────────────

export function FilterSidebar({
  availableCategories,
  availableSizes,
  availableColors,
  availableFabrics,
  priceMin,
  priceMax,
  selectedCategories,
  onCategoryChange,
  selectedSizes,
  onSizeChange,
  selectedColors,
  onColorChange,
  selectedFabrics,
  onFabricChange,
  priceRange,
  onPriceRangeChange,
  selectedBrands,
  onBrandChange,
  inStockOnly,
  onInStockChange,
  onClearAll,
  hasActiveFilters,
  productCounts,
}: FilterSidebarProps) {
  const toggle = <T,>(arr: T[], item: T, setter: (a: T[]) => void) =>
    setter(arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item])

  // Merge product colors with our swatch map (prefer product hex, fall back to swatch)
  const swatchMap = Object.fromEntries(COLOR_SWATCHES.map((c) => [c.name, c.hex]))
  const mergedColors = availableColors.length > 0
    ? availableColors
    : COLOR_SWATCHES.filter((c) => swatchMap[c.name])

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "var(--color-brand-beige)",
        border: "1px solid var(--color-border-light)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid var(--color-border-light)" }}
      >
        <span
          className="font-heading font-light text-brand-charcoal"
          style={{ fontSize: "1.125rem" }}
        >
          Filters
        </span>
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="font-sans font-medium text-brand-rose hover:text-brand-mauve transition-colors"
            style={{ fontSize: "13px" }}
          >
            Clear All
          </button>
        )}
      </div>

      {/* Filter groups */}
      <div className="px-5">

        {/* Brand */}
        <AccordionSection title="Brand">
          <div className="space-y-0.5">
            {BRANDS.map((b) => (
              <CheckRow
                key={b.id}
                label={b.name}
                count={productCounts.brands[b.name] ?? 0}
                checked={selectedBrands.includes(b.name)}
                onChange={() => toggle(selectedBrands, b.name, onBrandChange)}
              />
            ))}
          </div>
        </AccordionSection>

        {/* Size */}
        {availableSizes.length > 0 && (
          <AccordionSection title="Size">
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => {
                const active = selectedSizes.includes(size)
                return (
                  <button
                    key={size}
                    onClick={() => toggle(selectedSizes, size, onSizeChange)}
                    className="font-sans font-medium rounded-full px-3 py-1.5 transition-all text-sm"
                    style={{
                      background: active ? "var(--color-brand-rose)" : "transparent",
                      color: active ? "var(--color-brand-ivory)" : "var(--color-brand-charcoal)",
                      border: active
                        ? "1.5px solid var(--color-brand-rose)"
                        : "1.5px solid var(--color-border)",
                      fontSize: "13px",
                    }}
                  >
                    {size}
                  </button>
                )
              })}
            </div>
          </AccordionSection>
        )}

        {/* Color */}
        <AccordionSection title="Color">
          <div className="flex flex-wrap gap-2.5">
            {mergedColors.map(({ name, hex }) => {
              const selected = selectedColors.includes(name)
              const isLight =
                name.toLowerCase().includes("white") || name.toLowerCase().includes("ivory")
              return (
                <button
                  key={name}
                  onClick={() => toggle(selectedColors, name, onColorChange)}
                  title={name}
                  className="relative flex-shrink-0 rounded-full transition-transform hover:scale-110"
                  style={{
                    width: "24px",
                    height: "24px",
                    backgroundColor: hex,
                    border: selected
                      ? "2px solid var(--color-brand-rose)"
                      : isLight
                      ? "1.5px solid var(--color-border)"
                      : "2px solid transparent",
                    boxShadow: selected ? "0 0 0 2px var(--color-brand-ivory), 0 0 0 4px var(--color-brand-rose)" : "none",
                  }}
                  aria-label={name}
                />
              )
            })}
          </div>
        </AccordionSection>

        {/* Fabric */}
        {availableFabrics.length > 0 && (
          <AccordionSection title="Fabric">
            <div className="space-y-0.5">
              {availableFabrics.map((fabric) => (
                <CheckRow
                  key={fabric}
                  label={fabric}
                  checked={selectedFabrics.includes(fabric)}
                  onChange={() => toggle(selectedFabrics, fabric, onFabricChange)}
                />
              ))}
            </div>
          </AccordionSection>
        )}

        {/* Price Range */}
        <AccordionSection title="Price Range">
          <PriceRangeSlider
            value={priceRange}
            onChange={onPriceRangeChange}
            min={priceMin}
            max={priceMax}
          />
        </AccordionSection>

        {/* Availability */}
        <AccordionSection title="Availability">
          <button
            onClick={() => onInStockChange(!inStockOnly)}
            className="flex items-center gap-3 w-full py-1"
          >
            {/* Toggle pill */}
            <span
              className="relative inline-flex h-5 w-9 flex-shrink-0 rounded-full transition-colors duration-200"
              style={{
                background: inStockOnly ? "var(--color-brand-rose)" : "var(--color-border)",
              }}
            >
              <span
                className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
                style={{ transform: inStockOnly ? "translateX(16px)" : "translateX(0)" }}
              />
            </span>
            <span
              className="font-sans text-brand-charcoal"
              style={{ fontSize: "13px" }}
            >
              In Stock Only
            </span>
          </button>
        </AccordionSection>

        {/* Category (only if multiple categories are in this listing) */}
        {availableCategories.length > 1 && (
          <AccordionSection title="Category" defaultOpen={false}>
            <div className="space-y-0.5">
              {availableCategories.map((cat) => (
                <CheckRow
                  key={cat}
                  label={cat.replace(/-/g, " ")}
                  count={productCounts.categories[cat] ?? 0}
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggle(selectedCategories, cat, onCategoryChange)}
                />
              ))}
            </div>
          </AccordionSection>
        )}

      </div>
    </div>
  )
}
