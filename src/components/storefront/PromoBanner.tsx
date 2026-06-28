import Link from "next/link"
import Image from "next/image"

const BANNERS = [
  {
    image: "/images/promo/festive-edit.jpg",
    overlay: "rgba(45,45,45,0.45)",
    eyebrow: "FESTIVE SEASON",
    title: "Festive Edit '25",
    sub: "Embroidered & embellished pieces for every celebration.",
    cta: "Shop Now",
    href: "/eid-special",
  },
  {
    image: "/images/promo/lawn-season.jpg",
    overlay: "rgba(45,45,45,0.45)",
    eyebrow: "SUMMER LAWN",
    title: "Up to 30% Off Lawn",
    sub: "Sapphire, Gul Ahmed & Sana Safinaz — fresh arrivals, hot prices.",
    cta: "Shop Now",
    href: "/category/lawn-suit",
  },
] as const

export function PromoBanner() {
  return (
    <section
      className="w-full py-10"
      style={{ background: "var(--color-brand-ivory)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {BANNERS.map((banner) => (
            <Link
              key={banner.href}
              href={banner.href}
              className="group relative block overflow-hidden"
              style={{ borderRadius: "var(--radius-card)", height: "clamp(260px, 30vw, 340px)" }}
            >
              {/* Background image */}
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />

              {/* Flat overlay */}
              <div
                className="absolute inset-0"
                style={{ background: banner.overlay }}
              />

              {/* Text */}
              <div className="absolute inset-0 flex flex-col justify-end p-7 sm:p-9">
                <p
                  className="font-sans uppercase tracking-widest text-brand-rose mb-2"
                  style={{ fontSize: "11px" }}
                >
                  {banner.eyebrow}
                </p>
                <h3
                  className="font-heading font-light text-brand-ivory leading-tight mb-2"
                  style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.125rem)" }}
                >
                  {banner.title}
                </h3>
                <p
                  className="font-sans text-brand-ivory/80 mb-5"
                  style={{ fontSize: "14px" }}
                >
                  {banner.sub}
                </p>
                <span className="self-start font-sans font-semibold text-sm px-6 py-2.5 rounded-full bg-brand-rose text-brand-ivory hover:bg-brand-mauve transition-colors duration-200">
                  {banner.cta}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
