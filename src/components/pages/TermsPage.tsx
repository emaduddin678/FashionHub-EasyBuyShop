"use client"

import { useEffect, useState } from "react"
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar"
import { Header } from "@/components/storefront/Header"
import { Footer } from "@/components/storefront/Footer"
import { WhatsAppFloat } from "@/components/storefront/WhatsAppFloat"

const sections = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    content: [
      "By accessing or using FashionHub (fashionhub.com.bd), you agree to be bound by these Terms of Service.",
      "If you do not agree with any part of these terms, you may not use our website or services.",
      "We reserve the right to update these terms at any time. Continued use of the site after any changes constitutes your acceptance of the revised terms.",
    ],
  },
  {
    id: "products",
    title: "Products and Pricing",
    content: [
      "All prices are listed in Bangladeshi Taka (BDT) and include applicable taxes.",
      "Prices are subject to change without prior notice. The price shown at the time of your order confirmation is final.",
      "We make every effort to display accurate product information, but we do not warrant that descriptions, images, or pricing are entirely error-free.",
      "We reserve the right to cancel orders where pricing errors have occurred, with a full refund issued.",
    ],
  },
  {
    id: "orders",
    title: "Order Process",
    content: [
      "An order is confirmed once you receive an order confirmation SMS or email from FashionHub.",
      "Orders may be cancelled within 1 hour of placement. After that, cancellation may not be possible if processing has already begun.",
      "For cancellations, contact us immediately on WhatsApp at +880 1712-345678 with your Order ID.",
      "We reserve the right to refuse or cancel any order at our discretion, with a full refund issued in such cases.",
    ],
  },
  {
    id: "payment",
    title: "Payment Terms",
    content: [
      "We accept bKash, Nagad, Visa, Mastercard, and Cash on Delivery (COD).",
      "All digital payments are processed through secure, SSL-encrypted payment gateways.",
      "For failed payments where a deduction occurred, the amount is automatically reversed within 3–5 business days by your bank or mobile financial service.",
      "COD orders must be paid in full in cash upon delivery. COD carries a ৳20 handling fee.",
    ],
  },
  {
    id: "delivery",
    title: "Delivery Terms",
    content: [
      "Standard delivery takes 3–5 business days across Bangladesh. Express and same-day options are available for select zones.",
      "Delivery timeframes are estimates and may vary due to circumstances beyond our control, including public holidays, hartals, and weather events.",
      "Risk of loss or damage transfers to the customer upon delivery. Please inspect your order upon receipt.",
      "FashionHub is not liable for delays caused by courier partners once the order has been dispatched.",
    ],
  },
  {
    id: "returns",
    title: "Returns Policy",
    content: [
      "Products may be returned within 7 days of delivery, provided they are unworn, unused, with all original tags attached and in original packaging.",
      "Items marked as Final Sale, custom or personalised items, and intimates are not eligible for return.",
      "Free return pickups are arranged from your delivery address. Contact us on WhatsApp to initiate a return.",
      "Refunds are processed within 5–7 business days of receiving and inspecting the returned item.",
    ],
  },
  {
    id: "ip",
    title: "Intellectual Property",
    content: [
      "All content on this website — including text, images, logos, and design — is the property of FashionHub or its licensors.",
      "You may not reproduce, distribute, or create derivative works from our content without express written permission.",
      "Product images and brand trademarks of third-party brands remain the property of their respective owners.",
    ],
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    content: [
      "FashionHub shall not be liable for any indirect, incidental, or consequential damages arising from your use of our website or products.",
      "Our total liability in any matter shall not exceed the amount paid by you for the specific order giving rise to the claim.",
      "We do not warrant that the website will be uninterrupted, error-free, or free from viruses or other harmful components.",
    ],
  },
  {
    id: "law",
    title: "Governing Law",
    content: [
      "These Terms of Service are governed by and construed in accordance with the laws of Bangladesh.",
      "Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of Dhaka, Bangladesh.",
      "Nothing in these terms affects your statutory rights as a consumer under Bangladeshi consumer protection law.",
    ],
  },
  {
    id: "contact",
    title: "Contact Us",
    content: [
      "Email: hello@fashionhub.com.bd",
      "Phone: +880 1712-345678",
      "WhatsApp: wa.me/8801712345678",
      "For any questions about these Terms of Service, please contact our support team and we'll respond within one business day.",
    ],
  },
]

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState("acceptance")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: "-20% 0px -70% 0px" }
    )
    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="min-h-screen font-sans" style={{ background: "var(--color-brand-ivory)" }}>
      <AnnouncementBar />
      <Header />

      {/* Hero */}
      <div className="py-14 text-center px-5" style={{ background: "var(--color-brand-rose)" }}>
        <h1
          className="font-heading text-white mb-2"
          style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", letterSpacing: "-0.01em" }}
        >
          Terms of Service
        </h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14 }}>
          Please read these terms carefully before using our services.
        </p>
        <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.5)" }}>
          Last updated: 28 June 2026
        </p>
      </div>

      {/* Content + sticky TOC */}
      <div className="max-w-5xl mx-auto px-5 py-14">
        <div className="flex gap-8 items-start">

          {/* Sticky TOC */}
          <aside className="hidden lg:block w-52 shrink-0 sticky top-24">
            <div
              className="rounded-xl p-4"
              style={{ background: "#fff", border: "1px solid var(--color-border)" }}
            >
              <p
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: "var(--color-brand-charcoal)", opacity: 0.45 }}
              >
                Contents
              </p>
              <nav className="flex flex-col gap-0.5">
                {sections.map(({ id, title }, i) => (
                  <button
                    key={id}
                    onClick={() => scrollTo(id)}
                    className="text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors leading-snug"
                    style={{
                      background: activeSection === id ? "var(--color-brand-rose)" : "transparent",
                      color: activeSection === id ? "#fff" : "var(--color-brand-charcoal)",
                      opacity: activeSection === id ? 1 : 0.6,
                      fontWeight: activeSection === id ? 600 : 400,
                    }}
                  >
                    <span
                      className="font-bold mr-1"
                      style={{ color: activeSection === id ? "rgba(255,255,255,0.7)" : "var(--color-brand-rose)" }}
                    >
                      {i + 1}.
                    </span>
                    {title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div
              className="rounded-2xl p-8"
              style={{ background: "#fff", border: "1px solid var(--color-border)" }}
            >
              <p
                className="text-sm leading-relaxed mb-8"
                style={{ color: "var(--color-brand-charcoal)", opacity: 0.7 }}
              >
                Welcome to FashionHub. By accessing our website and placing orders, you agree to the following
                terms and conditions. These terms apply to all users of the site, including browsers, vendors,
                customers, and content contributors.
              </p>

              {sections.map(({ id, title, content }, i) => (
                <div key={id} id={id} className="scroll-mt-28">
                  {i > 0 && (
                    <hr className="my-7" style={{ borderColor: "var(--color-border-light)" }} />
                  )}
                  <h2
                    className="font-heading mb-4 flex items-center gap-3"
                    style={{
                      fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
                      color: "var(--color-brand-charcoal)",
                    }}
                  >
                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{
                        background: "var(--color-brand-rose)",
                        color: "#fff",
                      }}
                    >
                      {i + 1}
                    </span>
                    {title}
                  </h2>
                  <ul className="space-y-3 pl-10">
                    {content.map((para, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-3 text-sm leading-relaxed"
                        style={{ color: "var(--color-brand-charcoal)", opacity: 0.72 }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                          style={{ background: "var(--color-brand-rose)" }}
                        />
                        {para}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
