"use client"

import { useState } from "react"

const FAQS = [
  {
    q: "How long does standard delivery take?",
    a: "Standard delivery takes 3-5 business days across Bangladesh. Express delivery is next business day for Dhaka, Chattogram, and Sylhet.",
  },
  {
    q: "Can I change my delivery address?",
    a: "You can change your delivery address within 1 hour of placing the order by contacting us on WhatsApp at +880 1712-345678.",
  },
  {
    q: "What if I'm not home during delivery?",
    a: "Our delivery agent will call you before arriving. If you're unavailable, they will attempt delivery again the next business day.",
  },
  {
    q: "How do I return or exchange my order?",
    a: "We offer free returns within 7 days of delivery. Visit our Returns & Exchanges page or contact us on WhatsApp to initiate a return.",
  },
  {
    q: "When will I receive my COD (Cash on Delivery) order?",
    a: "COD orders take 1-2 extra business days as they require additional verification. Please keep the exact amount ready at the time of delivery.",
  },
  {
    q: "My order shows delivered but I haven't received it?",
    a: "Please contact us immediately on WhatsApp with your Order ID. We will investigate and resolve within 24 hours.",
  },
]

export function TrackingFAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="bg-[#F8F9FA] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-bold text-xl text-[#1A2B5E] text-center mb-8">
          Frequently Asked Questions
        </h2>

        <div className="space-y-2">
          {FAQS.map((faq, i) => {
            const isOpen = open === i
            return (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between text-left px-5 py-4 gap-4"
                >
                  <span className="font-medium text-sm text-[#1A2B5E]">{faq.q}</span>
                  <span className="text-[#D4A017] font-bold text-lg flex-shrink-0 leading-none">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
