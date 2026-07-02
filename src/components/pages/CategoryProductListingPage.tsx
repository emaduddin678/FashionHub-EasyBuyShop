"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SlidersHorizontal, X } from "lucide-react"
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar"
import { Header } from "@/components/storefront/Header"
import { Footer } from "@/components/storefront/Footer"
import { WhatsAppFloat } from "@/components/storefront/WhatsAppFloat"
import { ProductCard } from "@/components/storefront/ProductCard"
import { FilterSidebar, type FilterSidebarProps } from "@/components/storefront/plp/FilterSidebar"
import { SortBar } from "@/components/storefront/plp/SortBar"
import { ActiveFilterTags } from "@/components/storefront/plp/ActiveFilterTags"
import { Pagination } from "@/components/storefront/plp/Pagination"
import {
  type Product,
  type ClothingSize,
  type Fabric,
  CATEGORIES,
} from "@/lib/data/products"

const ITEMS_PER_PAGE = 12

const SIZE_ORDER: ClothingSize[] = ["XS", "S", "M", "L", "XL", "XXL"]

const PAGE_META: Record<string, { title: string; crumb: string; description: string }> = {
  ...Object.fromEntries(
    CATEGORIES.map((c) => [
      c.id,
      {
        title: c.label,
        crumb: c.label,
        description: `Handpicked ${c.label.toLowerCase()} for the modern South Asian woman.`,
      },
    ]),
  ),
  sale: {
    title: "Sale — Up to 40% Off",
    crumb: "Sale",
    description: "Our best pieces at their best prices.",
  },
  "new-arrivals": {
    title: "New Arrivals",
    crumb: "New Arrivals",
    description: "Fresh from the looms — explore our latest collections.",
  },
}

// ── Category Banner ────────────────────────────────────────────────────────────

function CategoryBanner({ title, count, description }: { title: string; count: number; description: string }) {
  return (
    <div
      className="w-full relative overflow-hidden flex items-center"
      style={{
        background: "linear-gradient(135deg, var(--color-brand-beige) 0%, var(--color-brand-ivory) 100%)",
        height: "clamp(160px, 20vw, 220px)",
      }}
    >
      {/* Decorative botanical SVG */}
      <svg
        className="absolute right-0 top-0 h-full opacity-30 pointer-events-none select-none"
        viewBox="0 0 300 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <ellipse cx="240" cy="110" rx="90" ry="120" fill="none" stroke="var(--color-brand-rose)" strokeWidth="1" />
        <ellipse cx="240" cy="110" rx="60" ry="90" fill="none" stroke="var(--color-brand-rose)" strokeWidth="0.75" />
        <ellipse cx="240" cy="110" rx="30" ry="55" fill="none" stroke="var(--color-brand-mauve)" strokeWidth="0.5" />
        <path d="M150 110 Q195 60 240 110 Q195 160 150 110Z" fill="var(--color-brand-rose)" fillOpacity="0.08" stroke="var(--color-brand-rose)" strokeWidth="0.75" />
        <path d="M170 80 Q210 50 250 80" stroke="var(--color-brand-rose)" strokeWidth="0.75" fill="none" />
        <path d="M160 140 Q210 170 260 140" stroke="var(--color-brand-rose)" strokeWidth="0.75" fill="none" />
        <circle cx="240" cy="110" r="6" fill="var(--color-brand-rose)" fillOpacity="0.3" />
        <circle cx="240" cy="110" r="2" fill="var(--color-brand-rose)" fillOpacity="0.6" />
        <path d="M195 65 Q210 45 225 65" stroke="var(--color-brand-mauve)" strokeWidth="0.6" fill="none" />
        <path d="M195 155 Q210 175 225 155" stroke="var(--color-brand-mauve)" strokeWidth="0.6" fill="none" />
      </svg>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center w-full">
        <h1
          className="font-heading font-light text-brand-charcoal leading-none mb-2"
          style={{ fontSize: "clamp(2.25rem, 5vw, 3rem)" }}
        >
          {title}
        </h1>
        <p className="font-sans text-brand-charcoal/60" style={{ fontSize: "14px" }}>
          {count.toLocaleString()} pieces · {description}
        </p>
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function CategoryProductListingPage({
  category,
  initialProducts,
}: {
  category: string
  initialProducts: Product[]
}) {
  if (!PAGE_META[category]) notFound()

  const meta = PAGE_META[category]
  const baseProducts = initialProducts

  // Derived available filter options
  const availableCategories = useMemo(
    () => Array.from(new Set(baseProducts.map((p) => p.category))).sort(),
    [baseProducts],
  )
  const availableSizes = useMemo(
    () =>
      Array.from(new Set(baseProducts.flatMap((p) => p.sizes))).sort(
        (a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b),
      ),
    [baseProducts],
  )
  const availableColors = useMemo(
    () =>
      Array.from(
        new Map(baseProducts.flatMap((p) => p.colors).map((c) => [c.name, c])).values(),
      ),
    [baseProducts],
  )
  const availableFabrics = useMemo(
    () => Array.from(new Set(baseProducts.map((p) => p.fabric))).sort() as Fabric[],
    [baseProducts],
  )
  const priceMin = useMemo(
    () => (baseProducts.length ? Math.floor(Math.min(...baseProducts.map((p) => p.price)) / 100) * 100 : 0),
    [baseProducts],
  )
  const priceMax = useMemo(
    () =>
      baseProducts.length ? Math.ceil(Math.max(...baseProducts.map((p) => p.price)) / 100) * 100 : 10000,
    [baseProducts],
  )

  // Filter state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<ClothingSize[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedFabrics, setSelectedFabrics] = useState<Fabric[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([priceMin, priceMax])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sortBy, setSortBy] = useState("popular")
  const [currentPage, setCurrentPage] = useState(1)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Body scroll lock for mobile drawer
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.body.style.overflow = drawerOpen ? "hidden" : ""
      return () => { document.body.style.overflow = "" }
    }
  }, [drawerOpen])

  const filteredProducts = useMemo(() => {
    return baseProducts
      .filter((p) => selectedCategories.length === 0 || selectedCategories.includes(p.category))
      .filter((p) => selectedSizes.length === 0 || p.sizes.some((s) => selectedSizes.includes(s)))
      .filter((p) => selectedColors.length === 0 || p.colors.some((c) => selectedColors.includes(c.name)))
      .filter((p) => selectedFabrics.length === 0 || selectedFabrics.includes(p.fabric))
      .filter((p) => selectedBrands.length === 0 || selectedBrands.includes(p.brand))
      .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
      .filter((p) => !inStockOnly || p.inStock)
  }, [
    baseProducts,
    selectedCategories,
    selectedSizes,
    selectedColors,
    selectedFabrics,
    selectedBrands,
    priceRange,
    inStockOnly,
  ])

  const sortedProducts = useMemo(() => {
    const copy = [...filteredProducts]
    if (sortBy === "price-asc") return copy.sort((a, b) => a.price - b.price)
    if (sortBy === "price-desc") return copy.sort((a, b) => b.price - a.price)
    if (sortBy === "newest") return copy.sort((a, b) => b.id - a.id)
    if (sortBy === "sale") return copy.filter((p) => p.badge === "sale").concat(copy.filter((p) => p.badge !== "sale"))
    return copy.sort((a, b) => b.reviewCount - a.reviewCount)
  }, [filteredProducts, sortBy])

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE)
  const safePage = Math.min(currentPage, totalPages || 1)
  const paginatedProducts = sortedProducts.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  )

  const activeFilterCount =
    selectedCategories.length +
    selectedSizes.length +
    selectedColors.length +
    selectedFabrics.length +
    selectedBrands.length +
    (priceRange[0] !== priceMin || priceRange[1] !== priceMax ? 1 : 0) +
    (inStockOnly ? 1 : 0)

  const hasActiveFilters = activeFilterCount > 0

  const clearAll = () => {
    setSelectedCategories([])
    setSelectedSizes([])
    setSelectedColors([])
    setSelectedFabrics([])
    setSelectedBrands([])
    setPriceRange([priceMin, priceMax])
    setInStockOnly(false)
    setCurrentPage(1)
  }

  const handleFilterChange = (fn: () => void) => {
    fn()
    setCurrentPage(1)
  }

  const categoryCounts = useMemo(() => {
    const c: Record<string, number> = {}
    baseProducts.forEach((p) => { c[p.category] = (c[p.category] ?? 0) + 1 })
    return c
  }, [baseProducts])

  const brandCounts = useMemo(() => {
    const c: Record<string, number> = {}
    baseProducts.forEach((p) => { c[p.brand] = (c[p.brand] ?? 0) + 1 })
    return c
  }, [baseProducts])

  const filterProps: FilterSidebarProps = {
    availableCategories,
    availableSizes,
    availableColors,
    availableFabrics,
    priceMin,
    priceMax,
    selectedCategories,
    onCategoryChange: (cats) => handleFilterChange(() => setSelectedCategories(cats)),
    selectedSizes,
    onSizeChange: (sizes) => handleFilterChange(() => setSelectedSizes(sizes)),
    selectedColors,
    onColorChange: (colors) => handleFilterChange(() => setSelectedColors(colors)),
    selectedFabrics,
    onFabricChange: (fabrics) => handleFilterChange(() => setSelectedFabrics(fabrics)),
    priceRange,
    onPriceRangeChange: (range) => handleFilterChange(() => setPriceRange(range)),
    selectedBrands,
    onBrandChange: (brands) => handleFilterChange(() => setSelectedBrands(brands)),
    inStockOnly,
    onInStockChange: (v) => handleFilterChange(() => setInStockOnly(v)),
    onClearAll: clearAll,
    hasActiveFilters,
    productCounts: { categories: categoryCounts, brands: brandCounts },
  }

  return (
    <div className="min-h-screen font-sans" style={{ background: "var(--color-brand-ivory)" }}>
      <AnnouncementBar />
      <Header />

      {/* Category banner */}
      <CategoryBanner
        title={meta.title}
        count={baseProducts.length}
        description={meta.description}
      />

      {/* Breadcrumb */}
      <div
        className="w-full"
        style={{
          background: "var(--color-brand-beige)",
          borderBottom: "1px solid var(--color-border-light)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 font-sans" style={{ fontSize: "13px" }}>
            <Link
              href="/"
              className="text-brand-charcoal/60 hover:text-brand-rose transition-colors"
            >
              Home
            </Link>
            <span className="text-brand-charcoal/30">›</span>
            <span className="text-brand-charcoal">{meta.crumb}</span>
          </nav>
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8 items-start">

          {/* Desktop sidebar — sticky 260px */}
          <aside className="hidden lg:block w-[260px] flex-shrink-0 sticky top-[88px]">
            <FilterSidebar {...filterProps} />
          </aside>

          {/* Content column */}
          <div className="flex-1 min-w-0">

            {/* Sort bar (includes mobile filter button) */}
            <SortBar
              sortBy={sortBy}
              onSortChange={(v) => { setSortBy(v); setCurrentPage(1) }}
              filteredCount={sortedProducts.length}
              activeFilterCount={activeFilterCount}
              onOpenFilters={() => setDrawerOpen(true)}
            />

            {/* Active filter tags */}
            {hasActiveFilters && (
              <div className="mt-3">
                <ActiveFilterTags
                  selectedCategories={selectedCategories}
                  onRemoveCategory={(cat) =>
                    handleFilterChange(() => setSelectedCategories((prev) => prev.filter((c) => c !== cat)))
                  }
                  selectedSizes={selectedSizes}
                  onRemoveSize={(size) =>
                    handleFilterChange(() => setSelectedSizes((prev) => prev.filter((s) => s !== size)))
                  }
                  selectedColors={selectedColors}
                  onRemoveColor={(color) =>
                    handleFilterChange(() => setSelectedColors((prev) => prev.filter((c) => c !== color)))
                  }
                  selectedFabrics={selectedFabrics}
                  onRemoveFabric={(fabric) =>
                    handleFilterChange(() => setSelectedFabrics((prev) => prev.filter((f) => f !== fabric)))
                  }
                  priceRange={priceRange}
                  defaultPriceRange={[priceMin, priceMax]}
                  onPriceReset={() => handleFilterChange(() => setPriceRange([priceMin, priceMax]))}
                  selectedBrands={selectedBrands}
                  onRemoveBrand={(brand) =>
                    handleFilterChange(() => setSelectedBrands((prev) => prev.filter((b) => b !== brand)))
                  }
                  inStockOnly={inStockOnly}
                  onInStockReset={() => handleFilterChange(() => setInStockOnly(false))}
                  onClearAll={clearAll}
                />
              </div>
            )}

            {/* Empty state */}
            {paginatedProducts.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-24 text-center rounded-2xl mt-4"
                style={{
                  background: "var(--color-brand-beige)",
                  border: "1px solid var(--color-border-light)",
                }}
              >
                <svg
                  width="56"
                  height="56"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="mb-4"
                  style={{ color: "var(--color-brand-rose)", opacity: 0.4 }}
                >
                  <path
                    d="M7 22H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 11c-2.21 0-4 1.79-4 4v3h8v-3c0-2.21-1.79-4-4-4z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="7" r="2" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <h3
                  className="font-heading font-light text-brand-charcoal mb-2"
                  style={{ fontSize: "1.5rem" }}
                >
                  No pieces found
                </h3>
                <p
                  className="font-sans text-brand-charcoal/55 mb-6"
                  style={{ fontSize: "14px" }}
                >
                  Try adjusting or clearing your filters.
                </p>
                <button
                  onClick={clearAll}
                  className="font-sans font-semibold text-sm px-6 py-3 rounded-full text-brand-ivory transition-colors"
                  style={{ background: "var(--color-brand-rose)" }}
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                {/* Product grid: 2-col mobile / 3-col desktop */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-4">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={safePage}
                    totalPages={totalPages}
                    totalResults={sortedProducts.length}
                    onPageChange={(page) => {
                      setCurrentPage(page)
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer — bottom sheet */}
      <div
        className={`fixed inset-0 z-[200] lg:hidden transition-all duration-300 ${
          drawerOpen ? "visible" : "invisible pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            drawerOpen ? "opacity-100" : "opacity-0"
          }`}
          style={{ background: "rgba(45,42,38,0.55)" }}
          onClick={() => setDrawerOpen(false)}
        />

        {/* Sheet — slides up from bottom */}
        <div
          className={`absolute left-0 right-0 bottom-0 rounded-t-2xl overflow-hidden flex flex-col transition-transform duration-300 ${
            drawerOpen ? "translate-y-0" : "translate-y-full"
          }`}
          style={{
            background: "var(--color-brand-ivory)",
            maxHeight: "90dvh",
          }}
        >
          {/* Handle + header */}
          <div
            className="flex-shrink-0 px-5 py-4 flex items-center justify-between"
            style={{ borderBottom: "1px solid var(--color-border-light)" }}
          >
            <div className="w-10 h-1 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-3"
              style={{ background: "var(--color-border)" }} />
            <span
              className="font-heading font-light text-brand-charcoal"
              style={{ fontSize: "1.25rem" }}
            >
              Filters
            </span>
            <button
              onClick={() => setDrawerOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full text-brand-charcoal/60 hover:text-brand-charcoal transition-colors"
              style={{ background: "var(--color-brand-beige)" }}
              aria-label="Close filters"
            >
              <X size={16} />
            </button>
          </div>

          {/* Scrollable filter body */}
          <div className="flex-1 overflow-y-auto p-5">
            <FilterSidebar {...filterProps} />
          </div>

          {/* Apply button */}
          <div
            className="flex-shrink-0 p-4"
            style={{ borderTop: "1px solid var(--color-border-light)" }}
          >
            <button
              onClick={() => setDrawerOpen(false)}
              className="w-full py-3.5 rounded-full font-sans font-semibold text-brand-ivory transition-colors"
              style={{ background: "var(--color-brand-rose)", fontSize: "14px" }}
            >
              Show {sortedProducts.length} Results
            </button>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
