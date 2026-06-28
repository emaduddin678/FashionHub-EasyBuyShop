import { AnnouncementBar } from "@/components/storefront/AnnouncementBar"
import { Header } from "@/components/storefront/Header"
import { Footer } from "@/components/storefront/Footer"
import { WhatsAppFloat } from "@/components/storefront/WhatsAppFloat"
import { ShieldCheck, Smile, Leaf, Users } from "lucide-react"
import Link from "next/link"

const stats = [
  { value: "25+",    label: "Brands" },
  { value: "5,000+", label: "Customers" },
  { value: "64",     label: "Districts Served" },
  { value: "Free",   label: "Returns" },
]

const values = [
  {
    icon: ShieldCheck,
    title: "Authenticity Guaranteed",
    desc: "Every product is sourced directly from authorised brand distributors. Zero replicas, zero compromises.",
  },
  {
    icon: Smile,
    title: "Customer First",
    desc: "From free returns to WhatsApp support 7 days a week, every decision we make starts with your satisfaction.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    desc: "We partner with brands committed to responsible manufacturing and reducing environmental impact.",
  },
  {
    icon: Users,
    title: "Built for Bangladesh",
    desc: "Our pricing, payment options, and delivery network are designed around the everyday lives of Bangladeshi women.",
  },
]

const brands = ["Aarong", "Yellow", "Khas", "Sapphire", "Sana Safinaz", "Gul Ahmed"]

const team = [
  { name: "Karim Hossain",  role: "Founder & CEO",            initials: "KH" },
  { name: "Nusrat Jahan",   role: "Head of Operations",       initials: "NJ" },
  { name: "Rafiqul Islam",  role: "Head of Technology",       initials: "RI" },
  { name: "Tahmina Begum",  role: "Customer Experience Lead", initials: "TB" },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen font-sans" style={{ background: "var(--color-brand-ivory)" }}>
      <AnnouncementBar />
      <Header />

      {/* Hero */}
      <div
        className="py-20 text-center px-5"
        style={{ background: "var(--color-brand-rose)" }}
      >
        <h1
          className="font-heading text-white mb-3"
          style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)", letterSpacing: "-0.01em" }}
        >
          Bangladesh&apos;s Multi-Brand Fashion Destination
        </h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 16 }}>
          Started in Dhaka in 2022. Grown to 25+ brands, 5,000+ customers, every corner of the country.
        </p>
      </div>

      {/* Stats bar */}
      <div style={{ background: "var(--color-brand-beige)", borderBottom: "1px solid var(--color-border-light)" }}>
        <div className="max-w-3xl mx-auto px-5 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <p
                  className="font-heading"
                  style={{
                    fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                    color: "var(--color-brand-rose)",
                    lineHeight: 1.1,
                  }}
                >
                  {value}
                </p>
                <p
                  className="text-sm mt-1"
                  style={{ color: "var(--color-brand-charcoal)", opacity: 0.6 }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Brand story */}
      <div className="max-w-3xl mx-auto px-5 py-16">
        <div className="mb-4">
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--color-brand-rose)" }}
          >
            Our Story
          </span>
        </div>
        <h2
          className="font-heading mb-6"
          style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "var(--color-brand-charcoal)" }}
        >
          One platform for Bangladesh&apos;s best fashion
        </h2>
        <div className="space-y-4 text-sm leading-relaxed" style={{ color: "var(--color-brand-charcoal)", opacity: 0.75 }}>
          <p>
            FashionHub started in Dhaka in 2022 as a curated platform bringing together the best of Bangladesh&apos;s
            local labels and Pakistan&apos;s most sought-after lawn collections under one roof. What began as a simple idea —
            why should a woman in Sylhet or Rajshahi have to search a dozen websites to find Aarong alongside
            Sapphire? — has grown into one of the country&apos;s most trusted multi-brand fashion destinations.
          </p>
          <p>
            We partner with Bangladesh&apos;s most beloved labels — Aarong, Yellow, Khas — as well as premium Pakistani
            collections from Sapphire, Sana Safinaz, and Gul Ahmed. Every item on our platform is 100% authentic,
            backed by the brand&apos;s official quality guarantee. Our zero-tolerance policy on counterfeits has earned us
            the trust of both customers and brand partners.
          </p>
          <p>
            Our mission is to make quality fashion accessible to every Bangladeshi woman — with the right sizes, the
            right payment options (bKash, Nagad, COD), and a delivery network that reaches all 64 districts.
          </p>
        </div>

        {/* Mission statement */}
        <div
          className="mt-8 rounded-2xl p-7"
          style={{
            background: "var(--color-brand-beige)",
            border: "1.5px solid var(--color-border-light)",
          }}
        >
          <p
            className="font-heading italic text-center"
            style={{
              fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
              color: "var(--color-brand-charcoal)",
              opacity: 0.85,
            }}
          >
            &ldquo;Fashion is self-expression. We&apos;re here to make sure every woman in Bangladesh has access
            to quality pieces that let her dress exactly how she wants.&rdquo;
          </p>
          <p
            className="text-center text-sm mt-3"
            style={{ color: "var(--color-brand-charcoal)", opacity: 0.5 }}
          >
            — Karim Hossain, Founder
          </p>
        </div>
      </div>

      {/* Values */}
      <div style={{ background: "var(--color-brand-beige)", borderTop: "1px solid var(--color-border-light)", borderBottom: "1px solid var(--color-border-light)" }}>
        <div className="max-w-3xl mx-auto px-5 py-16">
          <div className="text-center mb-10">
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--color-brand-rose)" }}
            >
              What We Stand For
            </span>
            <h2
              className="font-heading mt-2"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "var(--color-brand-charcoal)" }}
            >
              Our values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-start gap-4 p-5 rounded-xl"
                style={{ background: "#fff", border: "1px solid var(--color-border)" }}
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "var(--color-brand-rose)" }}
                >
                  <Icon size={20} color="#fff" />
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1" style={{ color: "var(--color-brand-charcoal)" }}>
                    {title}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-brand-charcoal)", opacity: 0.65 }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Brand partners */}
      <div className="max-w-3xl mx-auto px-5 py-16">
        <div className="text-center mb-8">
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--color-brand-rose)" }}
          >
            Our Partners
          </span>
          <h2
            className="font-heading mt-2"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "var(--color-brand-charcoal)" }}
          >
            25+ brands, one destination
          </h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {brands.map((brand) => (
            <div
              key={brand}
              className="rounded-xl py-4 px-3 text-center"
              style={{
                background: "var(--color-brand-beige)",
                border: "1px solid var(--color-border-light)",
              }}
            >
              <p
                className="text-xs font-semibold"
                style={{ color: "var(--color-brand-charcoal)", opacity: 0.8 }}
              >
                {brand}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div style={{ background: "var(--color-brand-charcoal)" }}>
        <div className="max-w-3xl mx-auto px-5 py-16">
          <div className="text-center mb-10">
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--color-brand-rose)" }}
            >
              The Team
            </span>
            <h2
              className="font-heading mt-2 text-white"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}
            >
              Meet the people behind FashionHub
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {team.map(({ name, role, initials }) => (
              <div key={name} className="text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ background: "var(--color-brand-rose)" }}
                >
                  <span className="font-heading text-white text-lg">{initials}</span>
                </div>
                <p className="text-white font-medium text-sm">{name}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact + CTA */}
      <div className="max-w-3xl mx-auto px-5 py-16 text-center">
        <h2
          className="font-heading mb-3"
          style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "var(--color-brand-charcoal)" }}
        >
          Get in touch
        </h2>
        <p className="text-sm mb-2" style={{ color: "var(--color-brand-charcoal)", opacity: 0.6 }}>
          hello@fashionhub.com.bd &nbsp;·&nbsp; +880 1712-345678
        </p>
        <p className="text-sm mb-8" style={{ color: "var(--color-brand-charcoal)", opacity: 0.6 }}>
          Mirpur, Dhaka, Bangladesh
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/shop"
            className="inline-block px-8 py-3.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ background: "var(--color-brand-rose)", color: "#fff" }}
          >
            Shop Now →
          </Link>
          <Link
            href="/faq"
            className="inline-block px-8 py-3.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-70"
            style={{
              background: "transparent",
              color: "var(--color-brand-charcoal)",
              border: "1.5px solid var(--color-border)",
            }}
          >
            Read FAQ
          </Link>
        </div>
      </div>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
