"use client"

import Link from "next/link"
import { Package, Truck, Heart, Gift, MapPin, UserCog } from "lucide-react"
import { useAppSelector } from "@/lib/store/hooks"
import type { AccountTab } from "./AccountSidebar"

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
]

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  being_packed: { label: "Being Packed", color: "bg-amber-100 text-amber-700" },
  shipped: { label: "Shipped", color: "bg-blue-100 text-blue-700" },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-600" },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

interface AccountOverviewProps {
  onTabChange: (tab: AccountTab) => void
}

export default function AccountOverview({ onTabChange }: AccountOverviewProps) {
  const wishlistCount = useAppSelector((s) => s.wishlist.items.length)

  return (
    <div>
      {/* Welcome row */}
      <div>
        <h2 className="text-2xl font-bold text-[#1A2B5E]">Welcome back, Rahim! 👋</h2>
        <p className="text-gray-500 text-sm mt-1">Here&apos;s what&apos;s happening with your account.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <Package size={20} className="text-[#1A2B5E] mx-auto mb-2" />
          <p className="text-3xl font-bold text-[#1A2B5E]">4</p>
          <p className="text-xs text-gray-500 mt-1">Total Orders</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <Truck size={20} className="text-amber-500 mx-auto mb-2" />
          <p className="text-3xl font-bold text-amber-500">1</p>
          <p className="text-xs text-gray-500 mt-1">Active Orders</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <Heart size={20} className="text-[#D4A017] mx-auto mb-2" />
          <p className="text-3xl font-bold text-[#D4A017]">{wishlistCount}</p>
          <p className="text-xs text-gray-500 mt-1">Wishlist Items</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <Gift size={20} className="text-green-600 mx-auto mb-2" />
          <p className="text-3xl font-bold text-green-600">1,250</p>
          <p className="text-xs text-gray-500 mt-1">Loyalty Points</p>
        </div>
      </div>

      {/* Recent orders */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-[#1A2B5E]">Recent Orders</h3>
          <button
            onClick={() => onTabChange("orders")}
            className="text-sm text-[#D4A017] font-medium hover:underline"
          >
            View All →
          </button>
        </div>

        {mockOrders.map((order) => {
          const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.being_packed
          return (
            <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-4 mb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src="https://placehold.co/48x48/f5f5f5/cccccc?text=Shoe"
                    alt="product"
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                  <div>
                    <p className="text-sm font-medium text-[#1A2B5E]">{order.id}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.date)}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {order.items} item{order.items > 1 ? "s" : ""} · ৳{order.total.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${status.color}`}>
                    {status.label}
                  </span>
                  {order.status !== "cancelled" && (
                    <Link
                      href={`/track?orderId=${order.id}`}
                      className="text-sm text-[#D4A017] font-medium hover:underline"
                    >
                      Track →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Loyalty points mini card */}
      <div className="mt-6 bg-[#1A2B5E] rounded-xl p-5 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-white/70 text-sm flex items-center gap-2">
              <Gift size={16} /> Your Loyalty Points
            </p>
            <p className="text-3xl font-bold text-white mt-1">1,250 points</p>
            <p className="text-white/70 text-sm mt-1">Worth ৳125 in rewards</p>
          </div>
          <div className="flex-shrink-0 text-right">
            <span className="inline-block bg-[#D4A017] text-[#1A2B5E] text-xs font-semibold px-3 py-1 rounded-full">
              🥇 Gold Member
            </span>
            <p className="text-xs text-white/70 mt-3">750 points to Platinum</p>
            <div className="w-32 h-2 bg-white/30 rounded-full mt-1.5">
              <div className="h-2 bg-[#D4A017] rounded-full" style={{ width: "62.5%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        {[
          { Icon: Package, label: "Track Order", tab: "orders" as AccountTab },
          { Icon: MapPin, label: "Manage Addresses", tab: "addresses" as AccountTab },
          { Icon: UserCog, label: "Edit Profile", tab: "settings" as AccountTab },
        ].map(({ Icon, label, tab }) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:border-[#1A2B5E] hover:shadow-sm transition-all cursor-pointer"
          >
            <Icon size={32} className="text-[#1A2B5E] mx-auto mb-2" />
            <p className="text-sm font-medium text-[#1A2B5E]">{label}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
