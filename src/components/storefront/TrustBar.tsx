import { Truck, RotateCcw, Shield, Package, Headphones } from "lucide-react"

const ITEMS = [
  {
    Icon: Truck,
    label: "Free Shipping",
    sub: "On all orders above ৳2,000",
  },
  {
    Icon: RotateCcw,
    label: "Easy Returns",
    sub: "7-day hassle-free returns",
  },
  {
    Icon: Shield,
    label: "Secure Payments",
    sub: "bKash, Nagad & SSL-encrypted cards",
  },
  {
    Icon: Package,
    label: "Dhaka Delivery",
    sub: "Same-day within Dhaka Metro",
  },
  {
    Icon: Headphones,
    label: "Customer Support",
    sub: "Sun–Thu 9AM–9PM · 01XXXXXXXXX",
  },
]

export function TrustBar() {
  return (
    <div
      className="w-full"
      style={{
        background: "var(--color-brand-ivory)",
        borderTop: "1px solid var(--color-border)",
        borderBottom: "1px solid var(--color-border)",
        padding: "1.5rem 0",
      }}
    >
      {/* Mobile: 2-col grid; Desktop: single flex row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:flex md:items-center md:justify-around gap-y-6 gap-x-4 md:gap-0">
          {ITEMS.map(({ Icon, label, sub }, i) => (
            <div key={label} className="flex items-center gap-3 md:flex-1 md:justify-center">
              {/* Vertical divider — desktop only, between items */}
              {i > 0 && (
                <div
                  className="hidden md:block self-stretch w-px mx-4 flex-shrink-0"
                  style={{ background: "var(--color-border-light)" }}
                />
              )}
              <Icon
                size={28}
                className="flex-shrink-0 text-brand-rose"
                strokeWidth={1.75}
              />
              <div>
                <p
                  className="font-sans font-semibold text-brand-charcoal leading-tight"
                  style={{ fontSize: "14px" }}
                >
                  {label}
                </p>
                <p
                  className="font-sans text-brand-charcoal/55 leading-tight mt-0.5"
                  style={{ fontSize: "12px" }}
                >
                  {sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
