"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Package } from "lucide-react"

const mockOrders = [
  {
    id: "FBD-1782447580375",
    date: "2026-06-26",
    status: "being_packed",
    items: 1,
    total: 799,
    paymentMethod: "bKash",
    products: [{ name: "Outdoor Slide", size: 38, image: "" }],
  },
  {
    id: "FBD-1782334521001",
    date: "2026-06-20",
    status: "delivered",
    items: 2,
    total: 4298,
    paymentMethod: "COD",
    products: [
      { name: "Air Runner X1", size: 42, image: "" },
      { name: "Canvas Classic", size: 41, image: "" },
    ],
  },
  {
    id: "FBD-1782201234567",
    date: "2026-06-10",
    status: "delivered",
    items: 1,
    total: 2499,
    paymentMethod: "Nagad",
    products: [{ name: "Derby Formal", size: 43, image: "" }],
  },
  {
    id: "FBD-1782100987654",
    date: "2026-05-28",
    status: "cancelled",
    items: 1,
    total: 1899,
    paymentMethod: "bKash",
    products: [{ name: "Loafer Pro", size: 40, image: "" }],
  },
]

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  being_packed: { label: "Being Packed", color: "bg-amber-100 text-amber-700" },
  shipped: { label: "Shipped", color: "bg-blue-100 text-blue-700" },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-600" },
}

type FilterTab = "all" | "active" | "delivered" | "cancelled"

const ACTIVE_STATUSES = ["being_packed", "shipped"]

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function matchesFilter(status: string, filter: FilterTab) {
  if (filter === "all") return true
  if (filter === "active") return ACTIVE_STATUSES.includes(status)
  if (filter === "delivered") return status === "delivered"
  if (filter === "cancelled") return status === "cancelled"
  return true
}

export default function OrderHistory() {
  const [filter, setFilter] = useState<FilterTab>("all")
  const [search, setSearch] = useState("")

  const filterTabs: { id: FilterTab; label: string }[] = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "delivered", label: "Delivered" },
    { id: "cancelled", label: "Cancelled" },
  ]

  const filtered = mockOrders.filter((order) => {
    if (!matchesFilter(order.status, filter)) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        order.id.toLowerCase().includes(q) ||
        order.products.some((p) => p.name.toLowerCase().includes(q))
      )
    }
    return true
  })

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-bold text-xl text-[#1A2B5E]">My Orders</h2>
        <div className="flex gap-1 border-b border-gray-200">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`text-sm px-3 pb-2 border-b-2 transition-colors -mb-px ${
                filter === tab.id
                  ? "text-[#1A2B5E] border-[#1A2B5E] font-semibold"
                  : "text-gray-500 border-transparent hover:text-[#1A2B5E]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search row */}
      <div className="relative mt-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Order ID or product name"
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2B5E]/20 focus:border-[#1A2B5E]"
        />
      </div>

      {/* Order cards */}
      <div className="mt-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Package size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No orders found</p>
            <Link
              href="/products"
              className="inline-block mt-3 text-sm bg-[#1A2B5E] text-white px-5 py-2 rounded-lg hover:bg-[#0d1733] transition-colors"
            >
              Start Shopping →
            </Link>
          </div>
        ) : (
          filtered.map((order) => {
            const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.being_packed
            const isActive = ACTIVE_STATUSES.includes(order.status)
            const isDelivered = order.status === "delivered"
            const isCancelled = order.status === "cancelled"

            return (
              <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
                {/* Top row */}
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-medium text-[#1A2B5E]">{order.id}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.date)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                    {!isCancelled && (
                      <Link
                        href={`/track?orderId=${order.id}`}
                        className="text-sm text-[#D4A017] font-medium hover:underline"
                      >
                        Track Order →
                      </Link>
                    )}
                  </div>
                </div>

                {/* Products */}
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                  {order.products.map((product, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <img
                        src="https://placehold.co/48x48/f5f5f5/cccccc?text=Shoe"
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1A2B5E] truncate">{product.name}</p>
                        <p className="text-xs text-gray-500">Size: {product.size}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom row */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Paid via {order.paymentMethod}</p>
                    <p className="text-sm font-semibold text-[#1A2B5E] mt-0.5">
                      Total: ৳{order.total.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {isDelivered && (
                      <>
                        <button className="text-sm border border-gray-300 text-gray-600 px-3 py-1.5 rounded-lg hover:border-[#1A2B5E] hover:text-[#1A2B5E] transition-colors">
                          🔄 Return/Exchange
                        </button>
                        <button className="text-sm border border-[#D4A017] text-[#D4A017] px-3 py-1.5 rounded-lg hover:bg-[#D4A017]/10 transition-colors">
                          ⭐ Write Review
                        </button>
                      </>
                    )}
                    {isActive && (
                      <Link
                        href={`/track?orderId=${order.id}`}
                        className="text-sm bg-[#1A2B5E] text-white px-4 py-1.5 rounded-lg hover:bg-[#0d1733] transition-colors"
                      >
                        📍 Track Order
                      </Link>
                    )}
                    {isCancelled && (
                      <button className="text-sm bg-[#1A2B5E] text-white px-4 py-1.5 rounded-lg hover:bg-[#0d1733] transition-colors">
                        🛒 Reorder
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
