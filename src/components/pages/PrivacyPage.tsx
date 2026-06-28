import { AnnouncementBar } from "@/components/storefront/AnnouncementBar"
import { Header } from "@/components/storefront/Header"
import { Footer } from "@/components/storefront/Footer"
import { WhatsAppFloat } from "@/components/storefront/WhatsAppFloat"

const sections = [
  {
    title: "Information We Collect",
    content: [
      "Name, phone number, email address, and delivery address when you create an account or place an order.",
      "Payment information — processed securely through our payment partners (bKash, Nagad, SSL Commerz). We never store card or wallet credentials on our own servers.",
      "Order history and browsing activity to improve your shopping experience and make product recommendations.",
      "Device information and IP address for security monitoring and fraud prevention.",
    ],
  },
  {
    title: "How We Use Your Information",
    content: [
      "Processing and delivering your orders accurately and on time.",
      "Sending order confirmations and delivery updates via SMS and WhatsApp.",
      "Improving our website, product range, and overall service quality.",
      "Sending promotional offers and newsletters — you can unsubscribe at any time from any marketing communication.",
    ],
  },
  {
    title: "Information Sharing",
    content: [
      "We share your name, delivery address, and phone number with our courier partners (Pathao, Steadfast, RedX) solely to fulfil your order.",
      "Payment information is shared with our payment processors in encrypted form only.",
      "We never sell, rent, or trade your personal data to third parties for any marketing purpose.",
    ],
  },
  {
    title: "Data Security",
    content: [
      "All transactions on FashionHub are protected with 256-bit SSL encryption.",
      "Our servers undergo regular security audits and are hosted in secure, certified data centres.",
      "Access to customer data is strictly limited to authorised FashionHub employees on a need-to-know basis.",
    ],
  },
  {
    title: "Your Rights",
    content: [
      "You may request a copy of the personal data we hold about you at any time by contacting us.",
      "You can update or correct your information from the Account Settings page.",
      "You may request deletion of your account and associated data — contact us at hello@fashionhub.com.bd.",
      "You can opt out of marketing communications at any time using the unsubscribe link in any email, or by contacting us directly.",
    ],
  },
  {
    title: "Cookies",
    content: [
      "FashionHub uses essential cookies to keep you logged in and remember your cart.",
      "We use analytics cookies (anonymised) to understand how visitors use our site so we can improve it.",
      "You can disable non-essential cookies at any time through your browser settings.",
    ],
  },
  {
    title: "Contact Us",
    content: [
      "Email: hello@fashionhub.com.bd",
      "Phone: +880 1712-345678",
      "WhatsApp: wa.me/8801712345678",
      "If you have any questions or concerns about this Privacy Policy, please don't hesitate to reach out — we'll respond within one business day.",
    ],
  },
]

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14 }}>
          How we collect, use, and protect your information
        </p>
        <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.5)" }}>
          Last updated: 28 June 2026
        </p>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-5 py-14">
        <div
          className="rounded-2xl p-8 mb-6"
          style={{ background: "#fff", border: "1px solid var(--color-border)" }}
        >
          <p
            className="text-sm leading-relaxed mb-8"
            style={{ color: "var(--color-brand-charcoal)", opacity: 0.7 }}
          >
            FashionHub (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is committed to protecting your privacy. This Privacy Policy explains
            how we collect, use, disclose, and safeguard your information when you visit fashionhub.com.bd or make
            a purchase. Please read this policy carefully.
          </p>

          {sections.map(({ title, content }, i) => (
            <div key={title}>
              {i > 0 && (
                <hr className="my-7" style={{ borderColor: "var(--color-border-light)" }} />
              )}
              <h2
                className="font-heading mb-4"
                style={{
                  fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
                  color: "var(--color-brand-charcoal)",
                }}
              >
                {i + 1}. {title}
              </h2>
              <ul className="space-y-3">
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

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
