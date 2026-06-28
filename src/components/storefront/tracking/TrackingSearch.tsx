"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

interface TrackingSearchProps {
  initialOrderId?: string
  onSearch: (orderId: string, phone: string) => void
  loading: boolean
  error: boolean
}

export function TrackingSearch({ initialOrderId = "", onSearch, loading, error }: TrackingSearchProps) {
  const [orderId, setOrderId] = useState(initialOrderId)
  const [phone, setPhone] = useState("")

  useEffect(() => {
    setOrderId(initialOrderId)
  }, [initialOrderId])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (orderId.trim()) {
      onSearch(orderId.trim(), phone.trim())
    }
  }

  return (
    <div className="max-w-2xl mx-auto -mt-8 relative z-10 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            {/* Order ID */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Order ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. FBD-1782447580375"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A2B5E]/30 focus:border-[#1A2B5E] transition"
              />
              <p className="text-xs text-gray-400 mt-1.5">Find your Order ID in the confirmation email or SMS</p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1XXX-XXXXXX"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A2B5E]/30 focus:border-[#1A2B5E] transition"
              />
              <p className="text-xs text-gray-400 mt-1.5">The phone number used during checkout</p>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !orderId.trim()}
            className="w-full bg-[#1A2B5E] hover:bg-[#0d1733] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Searching...
              </>
            ) : (
              "🔍 Track My Order"
            )}
          </button>
        </form>

        {/* Demo note */}
        <div className="mt-4 bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">
            💡 Demo: Use order ID from your last order, or try <span className="font-medium">FBD-DEMO123</span> with any phone number
          </p>
        </div>

        {/* Error state */}
        {error && (
          <div className="mt-4 bg-[#FEF2F2] border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700 font-medium mb-2">
              ❌ Order not found. Please check your Order ID and phone number. Contact us on WhatsApp if you need help.
            </p>
            <a
              href="https://wa.me/8801712345678"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
            >
              Chat on WhatsApp →
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
