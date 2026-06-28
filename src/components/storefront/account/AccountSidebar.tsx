"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  Package,
  Heart,
  MapPin,
  Settings,
  Gift,
  LogOut,
} from "lucide-react"

export type AccountTab = "overview" | "orders" | "wishlist" | "addresses" | "settings" | "loyalty"

interface AccountSidebarProps {
  activeTab: AccountTab
  onTabChange: (tab: AccountTab) => void
}

const navItems: { id: AccountTab | "wishlist"; label: string; icon: React.ComponentType<{ size?: number; className?: string }> ; isLink?: boolean; href?: string }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "orders", label: "My Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart, isLink: true, href: "/wishlist" },
  { id: "addresses", label: "Address Book", icon: MapPin },
  { id: "settings", label: "Account Settings", icon: Settings },
  { id: "loyalty", label: "Loyalty Points", icon: Gift },
]

export default function AccountSidebar({ activeTab, onTabChange }: AccountSidebarProps) {
  const router = useRouter()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  function handleLogout() {
    setShowLogoutConfirm(false)
    router.push("/")
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden sticky top-24">
      {/* Profile header */}
      <div className="bg-[#1A2B5E] p-6 text-center">
        <div className="w-[72px] h-[72px] rounded-full bg-[#D4A017] flex items-center justify-center mx-auto">
          <span className="text-2xl font-bold text-white">RU</span>
        </div>
        <p className="text-white font-semibold mt-3">Rahim Uddin</p>
        <p className="text-white/70 text-sm mt-0.5">rahim@example.com</p>
        <span className="inline-block bg-[#D4A017] text-[#1A2B5E] text-xs font-semibold px-3 py-1 rounded-full mt-2">
          🥇 Gold Member
        </span>
      </div>

      {/* Nav items */}
      <nav className="p-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id && !item.isLink

          if (item.isLink) {
            return (
              <Link
                key={item.id}
                href={item.href!}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            )
          }

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as AccountTab)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                isActive
                  ? "bg-[#1A2B5E] text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="border-t border-gray-100 p-3">
        {showLogoutConfirm ? (
          <div className="px-3 py-2">
            <p className="text-sm text-gray-700 mb-2">Are you sure you want to sign out?</p>
            <div className="flex gap-2">
              <button
                onClick={handleLogout}
                className="flex-1 text-sm bg-red-500 text-white rounded-lg py-1.5 hover:bg-red-600 transition-colors"
              >
                Yes
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 text-sm bg-gray-100 text-gray-600 rounded-lg py-1.5 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        )}
      </div>
    </div>
  )
}
