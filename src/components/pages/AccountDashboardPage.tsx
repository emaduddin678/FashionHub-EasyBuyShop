"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Package, Heart, User, MapPin, Lock, LogOut,
  X, Check, ChevronRight, Eye, EyeOff,
} from "lucide-react"

// ── Types ─────────────────────────────────────────────────────────────────────

type NavTab = "orders" | "wishlist" | "details" | "addresses" | "security"

// ── Mock data ──────────────────────────────────────────────────────────────────

const MOCK_USER = {
  fullName: "Rahim Uddin",
  phone:    "01712-345678",
  email:    "rahim@example.com",
  dob:      "1992-05-14",
  joinedAt: "March 2024",
}

type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled"

interface MockOrder {
  id: string
  date: string
  items: string
  total: number
  status: OrderStatus
}

const MOCK_ORDERS: MockOrder[] = [
  { id: "FH-1719234567", date: "24 Jun 2026", items: "Aarong Cotton Block Print Kurta (M)",    total: 1850, status: "Delivered"  },
  { id: "FH-1718034210", date: "18 Jun 2026", items: "Yellow Printed A-Line Kurta (S) ×2",    total: 2900, status: "Shipped"    },
  { id: "FH-1717200000", date: "10 Jun 2026", items: "Sana Safinaz Embroidered Lawn Suit (M)", total: 5200, status: "Processing" },
  { id: "FH-1716000100", date: "01 Jun 2026", items: "Gul Ahmed Premium Lawn (L)",             total: 3100, status: "Delivered"  },
  { id: "FH-1714800000", date: "19 May 2026", items: "Khas Silk Anarkali Suit (M)",            total: 4800, status: "Cancelled"  },
]

const MOCK_ADDRESSES = [
  { id: 1, label: "Home", name: "Rahim Uddin", line: "House 12, Road 4, Block B, Dhanmondi", city: "Dhaka", postal: "1205", phone: "01712-345678", isDefault: true },
  { id: 2, label: "Office", name: "Rahim Uddin", line: "Floor 6, Gulshan Tower, Plot 20", city: "Dhaka", postal: "1212", phone: "01712-345678", isDefault: false },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

function taka(n: number) { return `৳${n.toLocaleString()}` }

const STATUS_STYLE: Record<OrderStatus, React.CSSProperties> = {
  Processing: { background: "var(--color-brand-beige)", color: "var(--color-brand-charcoal)", border: "1px solid var(--color-border)" },
  Shipped:    { background: "rgba(90,138,106,0.12)",    color: "#5a8a6a", border: "1px solid rgba(90,138,106,0.3)" },
  Delivered:  { background: "rgba(198,147,132,0.12)",   color: "var(--color-brand-rose)", border: "1px solid rgba(198,147,132,0.3)" },
  Cancelled:  { background: "rgba(120,100,100,0.08)",   color: "var(--color-brand-charcoal)", opacity: 0.5, border: "1px solid var(--color-border-light)" },
}

// ── Toast ──────────────────────────────────────────────────────────────────────

function Toast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000)
    return () => clearTimeout(t)
  }, [onDismiss])
  return (
    <div
      className="fixed bottom-6 right-6 z-[300] flex items-center gap-3 rounded-xl px-4 py-3 font-sans text-sm"
      style={{ background: "rgba(90,138,106,0.95)", color: "var(--color-brand-ivory)", boxShadow: "0 8px 30px rgba(45,42,38,0.18)", maxWidth: "320px" }}
    >
      <Check size={15} />
      <span className="flex-1">{message}</span>
      <button type="button" onClick={onDismiss} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", opacity: 0.7 }}>
        <X size={13} />
      </button>
    </div>
  )
}

// ── Sidebar ────────────────────────────────────────────────────────────────────

const NAV_ITEMS: { id: NavTab; label: string; icon: React.ElementType }[] = [
  { id: "orders",    label: "My Orders",           icon: Package },
  { id: "wishlist",  label: "Wishlist",             icon: Heart },
  { id: "details",   label: "My Details",           icon: User },
  { id: "addresses", label: "Addresses",            icon: MapPin },
  { id: "security",  label: "Password & Security",  icon: Lock },
]

function Sidebar({ active, onChange, onLogout }: { active: NavTab; onChange: (t: NavTab) => void; onLogout: () => void }) {
  const initials = MOCK_USER.fullName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()

  return (
    <div
      className="flex flex-col"
      style={{
        width: "240px",
        flexShrink: 0,
        background: "var(--color-brand-beige)",
        border: "1px solid var(--color-border-light)",
        borderRadius: "var(--radius-card, 16px)",
        padding: "24px 0",
        height: "fit-content",
        position: "sticky",
        top: "88px",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* Avatar */}
      <div className="text-center px-6 pb-6" style={{ borderBottom: "1px solid var(--color-border-light)" }}>
        <div
          className="mx-auto mb-3 flex items-center justify-center font-heading font-light"
          style={{
            width: "56px", height: "56px", borderRadius: "50%",
            background: "var(--color-brand-rose)",
            color: "var(--color-brand-ivory)",
            fontSize: "1.25rem",
          }}
        >
          {initials}
        </div>
        <p className="font-sans font-semibold" style={{ fontSize: "14px", color: "var(--color-brand-charcoal)" }}>
          {MOCK_USER.fullName}
        </p>
        <p className="font-sans mt-0.5" style={{ fontSize: "12px", color: "var(--color-brand-charcoal)", opacity: 0.5 }}>
          {MOCK_USER.phone}
        </p>
      </div>

      {/* Nav */}
      <nav className="mt-2">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = id === active
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                width: "100%",
                padding: "11px 24px",
                background: "none",
                border: "none",
                borderLeft: isActive ? "3px solid var(--color-brand-rose)" : "3px solid transparent",
                cursor: "pointer",
                transition: "border-color 0.15s, color 0.15s",
                color: isActive ? "var(--color-brand-rose)" : "var(--color-brand-charcoal)",
                fontFamily: "var(--font-sans, sans-serif)",
                fontSize: "14px",
                fontWeight: isActive ? 600 : 400,
                opacity: isActive ? 1 : 0.75,
                textAlign: "left",
              }}
            >
              <Icon size={16} strokeWidth={isActive ? 2 : 1.75} />
              {label}
            </button>
          )
        })}

        {/* Logout */}
        <button
          type="button"
          onClick={onLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            width: "100%",
            padding: "11px 24px",
            background: "none",
            border: "none",
            borderLeft: "3px solid transparent",
            cursor: "pointer",
            color: "var(--color-brand-charcoal)",
            fontFamily: "var(--font-sans, sans-serif)",
            fontSize: "14px",
            opacity: 0.5,
            marginTop: "8px",
            textAlign: "left",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; (e.currentTarget as HTMLButtonElement).style.color = "var(--color-brand-rose)" }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.5"; (e.currentTarget as HTMLButtonElement).style.color = "var(--color-brand-charcoal)" }}
        >
          <LogOut size={16} strokeWidth={1.75} />
          Logout
        </button>
      </nav>
    </div>
  )
}

// ── Section card wrapper ───────────────────────────────────────────────────────

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--color-brand-ivory)",
        border: "1px solid var(--color-border-light)",
        borderRadius: "var(--radius-card, 16px)",
        padding: "28px",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {children}
    </div>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-heading font-light mb-6"
      style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "var(--color-brand-charcoal)", lineHeight: 1.2 }}
    >
      {children}
    </h2>
  )
}

// ── Orders panel ───────────────────────────────────────────────────────────────

function OrdersPanel() {
  return (
    <SectionCard>
      <SectionHeading>My Orders</SectionHeading>

      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-light)" }}>
              {["Order ID", "Date", "Items", "Total", "Status", ""].map((h) => (
                <th
                  key={h}
                  className="font-sans text-left pb-3"
                  style={{ fontSize: "11px", color: "var(--color-brand-charcoal)", opacity: 0.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", paddingRight: "16px" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_ORDERS.map((order) => (
              <tr
                key={order.id}
                style={{ borderBottom: "1px solid var(--color-border-light)" }}
              >
                <td className="py-4 pr-4">
                  <p className="font-sans font-semibold" style={{ fontSize: "13px", color: "var(--color-brand-charcoal)" }}>{order.id}</p>
                </td>
                <td className="py-4 pr-4">
                  <p className="font-sans" style={{ fontSize: "13px", color: "var(--color-brand-charcoal)", opacity: 0.65 }}>{order.date}</p>
                </td>
                <td className="py-4 pr-4" style={{ maxWidth: "200px" }}>
                  <p className="font-sans" style={{ fontSize: "13px", color: "var(--color-brand-charcoal)", opacity: 0.75 }}>{order.items}</p>
                </td>
                <td className="py-4 pr-4">
                  <p className="font-sans font-semibold" style={{ fontSize: "13px", color: "var(--color-brand-charcoal)" }}>{taka(order.total)}</p>
                </td>
                <td className="py-4 pr-4">
                  <span
                    className="font-sans font-semibold rounded-full px-3 py-1"
                    style={{ ...STATUS_STYLE[order.status], fontSize: "11px", display: "inline-block" }}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-4">
                  <Link
                    href={`/track?orderId=${order.id}`}
                    className="font-sans font-semibold text-xs flex items-center gap-1"
                    style={{ color: "var(--color-brand-rose)", whiteSpace: "nowrap" }}
                  >
                    View <ChevronRight size={12} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-4">
        {MOCK_ORDERS.map((order) => (
          <div
            key={order.id}
            className="rounded-xl p-4"
            style={{ background: "var(--color-brand-beige)", border: "1px solid var(--color-border-light)" }}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="font-sans font-semibold" style={{ fontSize: "13px", color: "var(--color-brand-charcoal)" }}>{order.id}</p>
              <span className="font-sans font-semibold rounded-full px-2.5 py-0.5 flex-shrink-0" style={{ ...STATUS_STYLE[order.status], fontSize: "10px" }}>
                {order.status}
              </span>
            </div>
            <p className="font-sans" style={{ fontSize: "12px", color: "var(--color-brand-charcoal)", opacity: 0.65 }}>{order.items}</p>
            <div className="flex items-center justify-between mt-3">
              <p className="font-sans font-semibold" style={{ fontSize: "14px", color: "var(--color-brand-charcoal)" }}>{taka(order.total)}</p>
              <Link href={`/track?orderId=${order.id}`} className="font-sans font-semibold text-xs flex items-center gap-1" style={{ color: "var(--color-brand-rose)" }}>
                View Details <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

// ── Wishlist panel ─────────────────────────────────────────────────────────────

function WishlistPanel() {
  return (
    <SectionCard>
      <SectionHeading>Wishlist</SectionHeading>
      <div className="text-center py-12">
        <Heart size={48} strokeWidth={1.5} style={{ color: "var(--color-brand-rose)", opacity: 0.35, margin: "0 auto 16px" }} />
        <p className="font-sans mb-5" style={{ fontSize: "14px", color: "var(--color-brand-charcoal)", opacity: 0.6 }}>
          View and manage your saved items.
        </p>
        <Link
          href="/wishlist"
          className="font-sans font-semibold text-sm rounded-full px-6 py-2.5 inline-block"
          style={{ background: "var(--color-brand-rose)", color: "var(--color-brand-ivory)" }}
        >
          Go to Wishlist →
        </Link>
      </div>
    </SectionCard>
  )
}

// ── Details panel ──────────────────────────────────────────────────────────────

function DetailsPanel({ onSaved }: { onSaved: () => void }) {
  const [fullName, setFullName] = useState(MOCK_USER.fullName)
  const [phone,    setPhone]    = useState(MOCK_USER.phone)
  const [email,    setEmail]    = useState(MOCK_USER.email)
  const [dob,      setDob]      = useState(MOCK_USER.dob)
  const [saving,   setSaving]   = useState(false)

  const inputSt: React.CSSProperties = {
    width: "100%", height: "44px",
    border: "1px solid var(--color-border)", borderRadius: "10px",
    padding: "0 14px", fontSize: "14px",
    fontFamily: "var(--font-sans, sans-serif)",
    background: "var(--color-brand-ivory)",
    color: "var(--color-brand-charcoal)",
    outline: "none",
    transition: "border-color 0.15s",
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await new Promise((r) => setTimeout(r, 700))
    console.log("Profile saved:", { fullName, phone, email, dob })
    setSaving(false)
    onSaved()
  }

  return (
    <SectionCard>
      <SectionHeading>My Details</SectionHeading>
      <form onSubmit={handleSave} className="space-y-5 max-w-md">
        {[
          { label: "Full Name",    value: fullName, set: setFullName, type: "text",  placeholder: "Your full name" },
          { label: "Phone Number", value: phone,    set: setPhone,    type: "tel",   placeholder: "01XXXXXXXXX" },
          { label: "Email",        value: email,    set: setEmail,    type: "email", placeholder: "email@example.com" },
        ].map(({ label, value, set, type, placeholder }) => (
          <div key={label}>
            <label className="block font-sans font-semibold mb-1.5 uppercase tracking-wide" style={{ fontSize: "11px", color: "var(--color-brand-charcoal)", opacity: 0.6 }}>
              {label}
            </label>
            <input
              type={type}
              value={value}
              onChange={(e) => set(e.target.value)}
              placeholder={placeholder}
              style={inputSt}
              onFocus={(el) => { el.currentTarget.style.borderColor = "var(--color-brand-charcoal)" }}
              onBlur={(el) => { el.currentTarget.style.borderColor = "var(--color-border)" }}
            />
          </div>
        ))}

        <div>
          <label className="block font-sans font-semibold mb-1.5 uppercase tracking-wide" style={{ fontSize: "11px", color: "var(--color-brand-charcoal)", opacity: 0.6 }}>
            Date of Birth
          </label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            style={inputSt}
            onFocus={(el) => { el.currentTarget.style.borderColor = "var(--color-brand-charcoal)" }}
            onBlur={(el) => { el.currentTarget.style.borderColor = "var(--color-border)" }}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="font-sans font-semibold text-sm rounded-full px-8 flex items-center gap-2 transition-colors"
          style={{
            height: "46px",
            background: saving ? "var(--color-brand-mauve)" : "var(--color-brand-rose)",
            color: "var(--color-brand-ivory)",
            border: "none",
            cursor: saving ? "not-allowed" : "pointer",
          }}
          onMouseEnter={(e) => { if (!saving) (e.currentTarget as HTMLButtonElement).style.background = "var(--color-brand-mauve)" }}
          onMouseLeave={(e) => { if (!saving) (e.currentTarget as HTMLButtonElement).style.background = "var(--color-brand-rose)" }}
        >
          {saving ? (
            <>
              <svg className="animate-spin" width="15" height="15" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Saving…
            </>
          ) : "Save Changes"}
        </button>
      </form>
    </SectionCard>
  )
}

// ── Addresses panel ────────────────────────────────────────────────────────────

function AddressesPanel() {
  return (
    <SectionCard>
      <SectionHeading>Addresses</SectionHeading>
      <div className="space-y-4">
        {MOCK_ADDRESSES.map((addr) => (
          <div
            key={addr.id}
            className="rounded-xl p-5"
            style={{
              background: "var(--color-brand-beige)",
              border: addr.isDefault ? "1.5px solid var(--color-brand-rose)" : "1px solid var(--color-border-light)",
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-sans font-bold text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--color-brand-ivory)", color: "var(--color-brand-charcoal)", border: "1px solid var(--color-border)" }}>
                    {addr.label}
                  </span>
                  {addr.isDefault && (
                    <span className="font-sans font-bold text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(198,147,132,0.15)", color: "var(--color-brand-rose)" }}>
                      Default
                    </span>
                  )}
                </div>
                <p className="font-sans font-semibold text-sm" style={{ color: "var(--color-brand-charcoal)" }}>{addr.name}</p>
                <p className="font-sans text-sm mt-0.5" style={{ color: "var(--color-brand-charcoal)", opacity: 0.65 }}>{addr.line}</p>
                <p className="font-sans text-sm" style={{ color: "var(--color-brand-charcoal)", opacity: 0.65 }}>{addr.city} {addr.postal}</p>
                <p className="font-sans text-sm" style={{ color: "var(--color-brand-charcoal)", opacity: 0.5 }}>{addr.phone}</p>
              </div>
              <button
                type="button"
                className="font-sans text-xs underline underline-offset-2 flex-shrink-0"
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-brand-rose)", fontWeight: 600 }}
              >
                Edit
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="w-full font-sans font-semibold text-sm rounded-full"
          style={{
            height: "44px",
            background: "transparent",
            border: "1.5px dashed var(--color-border)",
            color: "var(--color-brand-charcoal)",
            opacity: 0.6,
            cursor: "pointer",
          }}
        >
          + Add New Address
        </button>
      </div>
    </SectionCard>
  )
}

// ── Security panel ─────────────────────────────────────────────────────────────

function SecurityPanel({ onSaved }: { onSaved: () => void }) {
  const [current,  setCurrent]  = useState("")
  const [newPwd,   setNewPwd]   = useState("")
  const [confPwd,  setConfPwd]  = useState("")
  const [showCur,  setShowCur]  = useState(false)
  const [showNew,  setShowNew]  = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState("")

  const match = confPwd.length > 0 && newPwd === confPwd

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!current || !newPwd || !match) { setError("Please fill all fields correctly."); return }
    setError("")
    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    console.log("Password change requested")
    setLoading(false)
    setCurrent(""); setNewPwd(""); setConfPwd("")
    onSaved()
  }

  const inputSt: React.CSSProperties = {
    width: "100%", height: "44px",
    border: "1px solid var(--color-border)", borderRadius: "10px",
    padding: "0 44px 0 14px", fontSize: "14px",
    fontFamily: "var(--font-sans, sans-serif)",
    background: "var(--color-brand-ivory)", color: "var(--color-brand-charcoal)",
    outline: "none", transition: "border-color 0.15s",
  }

  function PwdField({ label, value, set, show, setShow }: { label: string; value: string; set: (v: string) => void; show: boolean; setShow: (v: boolean) => void }) {
    return (
      <div>
        <label className="block font-sans font-semibold mb-1.5 uppercase tracking-wide" style={{ fontSize: "11px", color: "var(--color-brand-charcoal)", opacity: 0.6 }}>{label}</label>
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            value={value}
            onChange={(e) => set(e.target.value)}
            style={inputSt}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-brand-charcoal)" }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-border)" }}
          />
          <button type="button" tabIndex={-1} onClick={() => setShow(!show)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--color-brand-charcoal)", opacity: 0.4 }}>
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
    )
  }

  return (
    <SectionCard>
      <SectionHeading>Password &amp; Security</SectionHeading>
      <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
        <PwdField label="Current Password" value={current} set={setCurrent} show={showCur} setShow={setShowCur} />
        <PwdField label="New Password"     value={newPwd}  set={setNewPwd}  show={showNew} setShow={setShowNew} />

        <div>
          <label className="block font-sans font-semibold mb-1.5 uppercase tracking-wide" style={{ fontSize: "11px", color: "var(--color-brand-charcoal)", opacity: 0.6 }}>Confirm New Password</label>
          <input
            type="password"
            value={confPwd}
            onChange={(e) => setConfPwd(e.target.value)}
            style={{ ...inputSt, borderColor: confPwd && match ? "#5a8a6a" : "var(--color-border)" }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-brand-charcoal)" }}
            onBlur={(e) => { e.currentTarget.style.borderColor = confPwd && match ? "#5a8a6a" : "var(--color-border)" }}
          />
          {confPwd && (
            <p className="font-sans mt-1" style={{ fontSize: "12px", color: match ? "#5a8a6a" : "var(--color-brand-rose)" }}>
              {match ? "Passwords match" : "Passwords don't match"}
            </p>
          )}
        </div>

        {error && <p className="font-sans text-sm" style={{ color: "var(--color-brand-rose)" }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="font-sans font-semibold text-sm rounded-full px-8 flex items-center gap-2"
          style={{
            height: "46px",
            background: loading ? "var(--color-brand-mauve)" : "var(--color-brand-rose)",
            color: "var(--color-brand-ivory)",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
          }}
          onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "var(--color-brand-mauve)" }}
          onMouseLeave={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "var(--color-brand-rose)" }}
        >
          {loading ? (
            <>
              <svg className="animate-spin" width="15" height="15" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Updating…
            </>
          ) : "Update Password"}
        </button>
      </form>
    </SectionCard>
  )
}

// ── Mobile bottom nav ──────────────────────────────────────────────────────────

function MobileNav({ active, onChange }: { active: NavTab; onChange: (t: NavTab) => void }) {
  const icons = NAV_ITEMS.slice(0, 5)
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden flex border-t"
      style={{ background: "var(--color-brand-ivory)", borderColor: "var(--color-border-light)" }}
    >
      {icons.map(({ id, label, icon: Icon }) => {
        const isActive = id === active
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className="flex-1 flex flex-col items-center gap-1 py-2.5"
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: isActive ? "var(--color-brand-rose)" : "var(--color-brand-charcoal)",
              opacity: isActive ? 1 : 0.5,
              fontFamily: "var(--font-sans, sans-serif)",
              fontSize: "9px", fontWeight: 500,
              transition: "color 0.15s, opacity 0.15s",
            }}
          >
            <Icon size={18} strokeWidth={isActive ? 2 : 1.75} />
            {label.split(" ")[0]}
          </button>
        )
      })}
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────────

export default function AccountDashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<NavTab>("orders")
  const [toast, setToast] = useState("")

  const showToast = useCallback((msg: string) => setToast(msg), [])

  function handleLogout() {
    router.push("/account/login")
  }

  return (
    <>
      <div
        style={{ background: "var(--color-brand-ivory)", minHeight: "80vh" }}
      >
        {/* Breadcrumb */}
        <div style={{ background: "var(--color-brand-beige)", borderBottom: "1px solid var(--color-border-light)", padding: "12px clamp(16px, 4vw, 32px)" }}>
          <nav className="max-w-7xl mx-auto flex items-center gap-2 font-sans" style={{ fontSize: "12px", color: "var(--color-brand-charcoal)", opacity: 0.5 }}>
            <Link href="/" className="hover:opacity-100 transition-opacity">Home</Link>
            <span>/</span>
            <span style={{ opacity: 1, color: "var(--color-brand-charcoal)" }}>My Account</span>
          </nav>
        </div>

        <div
          className="max-w-7xl mx-auto"
          style={{ padding: "clamp(24px, 4vw, 40px) clamp(16px, 4vw, 32px) clamp(80px, 10vh, 100px)" }}
        >
          <h1
            className="font-heading font-light mb-8 lg:hidden"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.25rem)", color: "var(--color-brand-charcoal)", lineHeight: 1.2 }}
          >
            My Account
          </h1>

          <div className="flex gap-8 items-start">
            {/* Sidebar — desktop only */}
            <div className="hidden lg:block">
              <Sidebar active={activeTab} onChange={setActiveTab} onLogout={handleLogout} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {activeTab === "orders"    && <OrdersPanel />}
              {activeTab === "wishlist"  && <WishlistPanel />}
              {activeTab === "details"   && <DetailsPanel onSaved={() => showToast("Profile saved successfully.")} />}
              {activeTab === "addresses" && <AddressesPanel />}
              {activeTab === "security"  && <SecurityPanel onSaved={() => showToast("Password updated successfully.")} />}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav active={activeTab} onChange={setActiveTab} />

      {/* Toast */}
      {toast && <Toast message={toast} onDismiss={() => setToast("")} />}
    </>
  )
}
