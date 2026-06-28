"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HelpCircle, Ruler, RefreshCw, Truck, CreditCard, MessageCircle } from "lucide-react"

const navLinks = [
  { href: "/faq", icon: HelpCircle, label: "FAQ" },
  { href: "/size-guide", icon: Ruler, label: "Size Guide" },
  { href: "/returns", icon: RefreshCw, label: "Returns & Exchanges" },
  { href: "/delivery", icon: Truck, label: "Delivery Information" },
  { href: "/payment", icon: CreditCard, label: "Payment Methods" },
]

export function SupportSidebar() {
  const pathname = usePathname()

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sticky top-24">
      <h3 className="font-semibold text-[#1A2B5E] mb-4 text-sm">Customer Support</h3>

      <nav className="flex flex-col gap-1">
        {navLinks.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-[#1A2B5E] text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon size={16} className={isActive ? "text-white" : "text-[#1A2B5E]"} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-6 bg-[#1A2B5E] rounded-xl p-4">
        <p className="text-white font-medium text-sm">Still need help?</p>
        <p className="text-white/70 text-xs mt-1">Chat with our team on WhatsApp</p>
        <a
          href="https://wa.me/8801712345678"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 w-full flex items-center justify-center gap-2 bg-[#D4A017] text-[#1A2B5E] text-sm font-semibold py-2 px-4 rounded-lg hover:bg-[#b8881a] transition-colors"
        >
          <MessageCircle size={15} />
          Chat Now
        </a>
      </div>
    </div>
  )
}
