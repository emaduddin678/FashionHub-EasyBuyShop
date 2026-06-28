import Link from "next/link"
import Image from "next/image"
import { CATEGORIES } from "@/lib/data/products"

const CATEGORY_IMAGES: Record<string, string> = {
  kurta:     "/images/cats/kurta.jpg",
  "lawn-suit": "/images/cats/lawn-suit.jpg",
  saree:     "/images/cats/saree.jpg",
  dress:     "/images/cats/dress.jpg",
  pant:      "/images/cats/pant.jpg",
  accessory: "/images/cats/accessory.jpg",
}

export function CategorySection() {
  return (
    <section
      className="w-full"
      style={{
        background: "var(--color-brand-beige)",
        paddingTop: "var(--space-section)",
        paddingBottom: "var(--space-section)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-10">
          <p
            className="font-sans uppercase tracking-widest text-brand-charcoal/50 mb-2"
            style={{ fontSize: "11px" }}
          >
            CURATED FOR YOU
          </p>
          <h2
            className="font-heading font-light text-brand-charcoal"
            style={{ fontSize: "clamp(2rem, 4vw, 2.625rem)", lineHeight: 1.15 }}
          >
            Browse by Categories
          </h2>
        </div>

        {/* Grid — 2 cols mobile, 2 cols tablet, 3 cols desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group relative overflow-hidden block"
              style={{
                aspectRatio: "4 / 5",
                borderRadius: "var(--radius-card)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              {/* Image */}
              <Image
                src={CATEGORY_IMAGES[cat.id] ?? `/images/cats/${cat.id}.jpg`}
                alt={cat.label}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />

              {/* Bottom gradient overlay */}
              <div
                className="absolute inset-x-0 bottom-0 transition-opacity duration-300"
                style={{
                  height: "40%",
                  background: "linear-gradient(to top, rgba(45,45,45,0.72) 0%, transparent 100%)",
                  opacity: 1,
                }}
              />
              {/* Slightly darker on hover */}
              <div
                className="absolute inset-x-0 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  height: "50%",
                  background: "linear-gradient(to top, rgba(45,45,45,0.88) 0%, transparent 100%)",
                }}
              />

              {/* Text */}
              <div className="absolute bottom-0 left-0 p-4 sm:p-5">
                <p
                  className="font-heading text-brand-ivory leading-tight"
                  style={{ fontSize: "clamp(1.1rem, 2vw, 1.375rem)" }}
                >
                  {cat.label}
                </p>
                <p
                  className="font-sans text-brand-ivory/70 mt-0.5"
                  style={{ fontSize: "12px" }}
                >
                  {cat.productCount} pieces
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Show More */}
        <div className="flex justify-center mt-10">
          <Link
            href="/categories"
            className="font-sans font-semibold text-sm px-8 py-3 rounded-full border border-brand-charcoal text-brand-charcoal hover:bg-brand-rose hover:border-brand-rose hover:text-brand-ivory transition-colors duration-200"
          >
            Show More
          </Link>
        </div>

      </div>
    </section>
  )
}
