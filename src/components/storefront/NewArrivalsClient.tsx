"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ProductCard } from "./ProductCard"
import type { Product, ProductCategory } from "@/lib/data/products"

type Tab = "All" | "Kurtas" | "Lawn Suits" | "Sarees" | "Dresses"

const TABS: { label: Tab; category?: ProductCategory }[] = [
  { label: "All" },
  { label: "Kurtas",     category: "kurta" },
  { label: "Lawn Suits", category: "lawn-suit" },
  { label: "Sarees",     category: "saree" },
  { label: "Dresses",    category: "dress" },
]

interface Props {
  products: Product[]
}

export function NewArrivalsClient({ products }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("All")

  const tabDef = TABS.find((t) => t.label === activeTab)
  const filtered = tabDef?.category
    ? products.filter((p) => p.category === tabDef.category)
    : products

  return (
    <>
      {/* Tab pills */}
      <div className="flex flex-wrap gap-2 mb-7">
        {TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={cn(
              "font-sans font-medium text-sm px-5 py-2 rounded-full transition-colors duration-200",
              activeTab === tab.label
                ? "bg-brand-rose text-brand-ivory"
                : "bg-brand-beige text-brand-charcoal hover:bg-brand-rose/20",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Product grid */}
      {filtered.length === 0 ? (
        <p className="font-sans text-brand-charcoal/40 text-sm text-center py-16">
          No new arrivals in this category yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  )
}
