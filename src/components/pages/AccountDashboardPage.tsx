"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Package, Heart, User, MapPin, Lock, LogOut,
  X, Check, ChevronRight, Eye, EyeOff,
} from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { logoutUser } from "@/lib/store/authSlice"
import { getMyOrders, type MyOrder } from "@/lib/api/orders"
import userApi, { type Address, type AddressInput } from "@/lib/api/user"

// ── Types ─────────────────────────────────────────────────────────────────────

type NavTab = "orders" | "wishlist" | "details" | "addresses" | "security"

type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled"

// Backend order.status: pending | confirmed | processing | shipped | delivered | cancelled | refunded
const BACKEND_STATUS_LABEL: Record<string, OrderStatus> = {
  pending: "Processing",
  confirmed: "Processing",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Cancelled",
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function taka(n: number) { return `৳${n.toLocaleString()}` }

function formatOrderDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
}

function summarizeItems(items: MyOrder["items"]): string {
  if (items.length === 0) return "—"
  const first = items[0]
  const suffix = items.length > 1 ? ` +${items.length - 1} more` : ""
  return `${first.productName}${first.quantity > 1 ? ` ×${first.quantity}` : ""}${suffix}`
}

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

function Sidebar({
  active,
  onChange,
  onLogout,
  fullName,
  phone,
}: {
  active: NavTab
  onChange: (t: NavTab) => void
  onLogout: () => void
  fullName: string
  phone: string
}) {
  const initials = fullName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?"

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
          {fullName}
        </p>
        {phone && (
          <p className="font-sans mt-0.5" style={{ fontSize: "12px", color: "var(--color-brand-charcoal)", opacity: 0.5 }}>
            {phone}
          </p>
        )}
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
  const [orders, setOrders] = useState<MyOrder[] | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false
    getMyOrders()
      .then((res) => { if (!cancelled) setOrders(res.payload.orders) })
      .catch(() => { if (!cancelled) setError("Couldn't load your orders. Please try again.") })
    return () => { cancelled = true }
  }, [])

  return (
    <SectionCard>
      <SectionHeading>My Orders</SectionHeading>

      {error && (
        <p className="font-sans mb-4" style={{ fontSize: "13px", color: "var(--color-brand-rose)" }}>{error}</p>
      )}

      {orders === null && !error && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: "var(--color-brand-beige)" }} />
          ))}
        </div>
      )}

      {orders !== null && orders.length === 0 && (
        <div className="text-center py-12">
          <Package size={40} strokeWidth={1.5} style={{ color: "var(--color-brand-rose)", opacity: 0.35, margin: "0 auto 12px" }} />
          <p className="font-sans mb-4" style={{ fontSize: "14px", color: "var(--color-brand-charcoal)", opacity: 0.6 }}>
            You haven&apos;t placed any orders yet.
          </p>
          <Link
            href="/"
            className="font-sans font-semibold text-sm rounded-full px-6 py-2.5 inline-block"
            style={{ background: "var(--color-brand-rose)", color: "var(--color-brand-ivory)" }}
          >
            Start Shopping →
          </Link>
        </div>
      )}

      {orders !== null && orders.length > 0 && (
        <>
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
                {orders.map((order) => {
                  const status = BACKEND_STATUS_LABEL[order.status] ?? "Processing"
                  return (
                    <tr key={order._id} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                      <td className="py-4 pr-4">
                        <p className="font-sans font-semibold" style={{ fontSize: "13px", color: "var(--color-brand-charcoal)" }}>{order.orderId}</p>
                      </td>
                      <td className="py-4 pr-4">
                        <p className="font-sans" style={{ fontSize: "13px", color: "var(--color-brand-charcoal)", opacity: 0.65 }}>{formatOrderDate(order.createdAt)}</p>
                      </td>
                      <td className="py-4 pr-4" style={{ maxWidth: "200px" }}>
                        <p className="font-sans truncate" style={{ fontSize: "13px", color: "var(--color-brand-charcoal)", opacity: 0.75 }}>{summarizeItems(order.items)}</p>
                      </td>
                      <td className="py-4 pr-4">
                        <p className="font-sans font-semibold" style={{ fontSize: "13px", color: "var(--color-brand-charcoal)" }}>{taka(order.pricing.total)}</p>
                      </td>
                      <td className="py-4 pr-4">
                        <span
                          className="font-sans font-semibold rounded-full px-3 py-1"
                          style={{ ...STATUS_STYLE[status], fontSize: "11px", display: "inline-block" }}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="py-4">
                        <Link
                          href={`/track?orderId=${order.orderId}`}
                          className="font-sans font-semibold text-xs flex items-center gap-1"
                          style={{ color: "var(--color-brand-rose)", whiteSpace: "nowrap" }}
                        >
                          View <ChevronRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="md:hidden space-y-4">
            {orders.map((order) => {
              const status = BACKEND_STATUS_LABEL[order.status] ?? "Processing"
              return (
                <div
                  key={order._id}
                  className="rounded-xl p-4"
                  style={{ background: "var(--color-brand-beige)", border: "1px solid var(--color-border-light)" }}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-sans font-semibold" style={{ fontSize: "13px", color: "var(--color-brand-charcoal)" }}>{order.orderId}</p>
                    <span className="font-sans font-semibold rounded-full px-2.5 py-0.5 flex-shrink-0" style={{ ...STATUS_STYLE[status], fontSize: "10px" }}>
                      {status}
                    </span>
                  </div>
                  <p className="font-sans" style={{ fontSize: "12px", color: "var(--color-brand-charcoal)", opacity: 0.65 }}>{summarizeItems(order.items)}</p>
                  <div className="flex items-center justify-between mt-3">
                    <p className="font-sans font-semibold" style={{ fontSize: "14px", color: "var(--color-brand-charcoal)" }}>{taka(order.pricing.total)}</p>
                    <Link href={`/track?orderId=${order.orderId}`} className="font-sans font-semibold text-xs flex items-center gap-1" style={{ color: "var(--color-brand-rose)" }}>
                      View Details <ChevronRight size={12} />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
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

function DetailsPanel({
  userId,
  initialFirstName,
  initialLastName,
  initialPhone,
  email,
  onSaved,
}: {
  userId: string
  initialFirstName: string
  initialLastName: string
  initialPhone: string
  email: string
  onSaved: (patch: { firstName: string; lastName: string; phoneNumber: string }) => void
}) {
  const [firstName, setFirstName] = useState(initialFirstName)
  const [lastName,  setLastName]  = useState(initialLastName)
  const [phone,     setPhone]     = useState(initialPhone)
  const [saving,    setSaving]    = useState(false)
  const [error,     setError]     = useState("")

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
    setError("")
    setSaving(true)
    try {
      await userApi.updateProfile(userId, { firstName, lastName, phoneNumber: phone })
      onSaved({ firstName, lastName, phoneNumber: phone })
    } catch (err) {
      setError((err as Error).message || "Failed to save changes.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <SectionCard>
      <SectionHeading>My Details</SectionHeading>
      <form onSubmit={handleSave} className="space-y-5 max-w-md">
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "First Name", value: firstName, set: setFirstName },
            { label: "Last Name", value: lastName, set: setLastName },
          ].map(({ label, value, set }) => (
            <div key={label}>
              <label className="block font-sans font-semibold mb-1.5 uppercase tracking-wide" style={{ fontSize: "11px", color: "var(--color-brand-charcoal)", opacity: 0.6 }}>
                {label}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => set(e.target.value)}
                style={inputSt}
                onFocus={(el) => { el.currentTarget.style.borderColor = "var(--color-brand-charcoal)" }}
                onBlur={(el) => { el.currentTarget.style.borderColor = "var(--color-border)" }}
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block font-sans font-semibold mb-1.5 uppercase tracking-wide" style={{ fontSize: "11px", color: "var(--color-brand-charcoal)", opacity: 0.6 }}>
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="01XXXXXXXXX"
            style={inputSt}
            onFocus={(el) => { el.currentTarget.style.borderColor = "var(--color-brand-charcoal)" }}
            onBlur={(el) => { el.currentTarget.style.borderColor = "var(--color-border)" }}
          />
        </div>

        <div>
          <label className="block font-sans font-semibold mb-1.5 uppercase tracking-wide" style={{ fontSize: "11px", color: "var(--color-brand-charcoal)", opacity: 0.6 }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            disabled
            style={{ ...inputSt, opacity: 0.6, cursor: "not-allowed" }}
          />
          <p className="font-sans mt-1" style={{ fontSize: "11px", color: "var(--color-brand-charcoal)", opacity: 0.45 }}>
            Email can&apos;t be changed here.
          </p>
        </div>

        {error && <p className="font-sans text-sm" style={{ color: "var(--color-brand-rose)" }}>{error}</p>}

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

const emptyAddressForm: AddressInput = {
  label: "Home",
  recipientName: "",
  phoneNumber: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  district: "",
  division: "",
  postalCode: "",
}

function AddressForm({
  initial,
  onCancel,
  onSaved,
}: {
  initial: AddressInput
  onCancel: () => void
  onSaved: (payload: AddressInput) => Promise<void>
}) {
  const [form, setForm] = useState<AddressInput>(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const inputSt: React.CSSProperties = {
    width: "100%", height: "40px",
    border: "1px solid var(--color-border)", borderRadius: "8px",
    padding: "0 12px", fontSize: "13px",
    fontFamily: "var(--font-sans, sans-serif)",
    background: "var(--color-brand-ivory)", color: "var(--color-brand-charcoal)",
    outline: "none",
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.addressLine1.trim() || !form.city.trim()) {
      setError("Address line and city are required.")
      return
    }
    setError("")
    setSaving(true)
    try {
      await onSaved(form)
    } catch (err) {
      setError((err as Error).message || "Failed to save address.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl p-5 space-y-3" style={{ background: "var(--color-brand-beige)", border: "1.5px dashed var(--color-border)" }}>
      <div className="grid grid-cols-2 gap-3">
        <input placeholder="Label (e.g. Home)" value={form.label ?? ""} onChange={(e) => setForm({ ...form, label: e.target.value })} style={inputSt} />
        <input placeholder="Recipient Name" value={form.recipientName ?? ""} onChange={(e) => setForm({ ...form, recipientName: e.target.value })} style={inputSt} />
      </div>
      <input placeholder="Address Line 1 *" value={form.addressLine1} onChange={(e) => setForm({ ...form, addressLine1: e.target.value })} style={inputSt} />
      <input placeholder="Address Line 2 (optional)" value={form.addressLine2 ?? ""} onChange={(e) => setForm({ ...form, addressLine2: e.target.value })} style={inputSt} />
      <div className="grid grid-cols-2 gap-3">
        <input placeholder="City *" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} style={inputSt} />
        <input placeholder="District" value={form.district ?? ""} onChange={(e) => setForm({ ...form, district: e.target.value })} style={inputSt} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input placeholder="Division" value={form.division ?? ""} onChange={(e) => setForm({ ...form, division: e.target.value })} style={inputSt} />
        <input placeholder="Postal Code" value={form.postalCode ?? ""} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} style={inputSt} />
      </div>
      <input placeholder="Phone Number" value={form.phoneNumber ?? ""} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} style={inputSt} />

      {error && <p className="font-sans text-sm" style={{ color: "var(--color-brand-rose)" }}>{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="font-sans font-semibold text-sm rounded-full px-6"
          style={{ height: "38px", background: "var(--color-brand-rose)", color: "var(--color-brand-ivory)", border: "none", cursor: saving ? "not-allowed" : "pointer" }}
        >
          {saving ? "Saving…" : "Save Address"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="font-sans text-sm"
          style={{ height: "38px", background: "none", border: "none", color: "var(--color-brand-charcoal)", opacity: 0.6, cursor: "pointer" }}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

function AddressesPanel({ userId }: { userId: string }) {
  const [addresses, setAddresses] = useState<Address[] | null>(null)
  const [defaultId, setDefaultId] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const load = useCallback(() => {
    userApi.getAddresses(userId)
      .then((res) => { setAddresses(res.addresses); setDefaultId(res.defaultAddressId) })
      .catch(() => setError("Couldn't load your addresses."))
  }, [userId])

  useEffect(() => { load() }, [load])

  async function handleAdd(payload: AddressInput) {
    await userApi.addAddress(userId, payload)
    setAdding(false)
    load()
  }

  async function handleEdit(addressId: string, payload: AddressInput) {
    await userApi.updateAddress(userId, addressId, payload)
    setEditingId(null)
    load()
  }

  async function handleDelete(addressId: string) {
    await userApi.deleteAddress(userId, addressId).catch(() => {})
    load()
  }

  async function handleSetDefault(addressId: string) {
    await userApi.setDefaultAddress(userId, addressId).catch(() => {})
    load()
  }

  return (
    <SectionCard>
      <SectionHeading>Addresses</SectionHeading>

      {error && <p className="font-sans mb-4" style={{ fontSize: "13px", color: "var(--color-brand-rose)" }}>{error}</p>}

      {addresses === null && !error && (
        <div className="space-y-3">
          {[0, 1].map((i) => (
            <div key={i} className="h-24 rounded-xl animate-pulse" style={{ background: "var(--color-brand-beige)" }} />
          ))}
        </div>
      )}

      {addresses !== null && (
        <div className="space-y-4">
          {addresses.length === 0 && !adding && (
            <p className="font-sans" style={{ fontSize: "14px", color: "var(--color-brand-charcoal)", opacity: 0.6 }}>
              No saved addresses yet.
            </p>
          )}

          {addresses.map((addr) => {
            const isDefault = addr._id === defaultId || addr.isDefault
            if (editingId === addr._id) {
              return (
                <AddressForm
                  key={addr._id}
                  initial={addr}
                  onCancel={() => setEditingId(null)}
                  onSaved={(payload) => handleEdit(addr._id, payload)}
                />
              )
            }
            return (
              <div
                key={addr._id}
                className="rounded-xl p-5"
                style={{
                  background: "var(--color-brand-beige)",
                  border: isDefault ? "1.5px solid var(--color-brand-rose)" : "1px solid var(--color-border-light)",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-sans font-bold text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--color-brand-ivory)", color: "var(--color-brand-charcoal)", border: "1px solid var(--color-border)" }}>
                        {addr.label || "Address"}
                      </span>
                      {isDefault && (
                        <span className="font-sans font-bold text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(198,147,132,0.15)", color: "var(--color-brand-rose)" }}>
                          Default
                        </span>
                      )}
                    </div>
                    {addr.recipientName && (
                      <p className="font-sans font-semibold text-sm" style={{ color: "var(--color-brand-charcoal)" }}>{addr.recipientName}</p>
                    )}
                    <p className="font-sans text-sm mt-0.5" style={{ color: "var(--color-brand-charcoal)", opacity: 0.65 }}>
                      {[addr.addressLine1, addr.addressLine2].filter(Boolean).join(", ")}
                    </p>
                    <p className="font-sans text-sm" style={{ color: "var(--color-brand-charcoal)", opacity: 0.65 }}>
                      {[addr.city, addr.district, addr.division].filter(Boolean).join(", ")} {addr.postalCode}
                    </p>
                    {addr.phoneNumber && (
                      <p className="font-sans text-sm" style={{ color: "var(--color-brand-charcoal)", opacity: 0.5 }}>{addr.phoneNumber}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setEditingId(addr._id)}
                      className="font-sans text-xs underline underline-offset-2"
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-brand-rose)", fontWeight: 600 }}
                    >
                      Edit
                    </button>
                    {!isDefault && (
                      <button
                        type="button"
                        onClick={() => handleSetDefault(addr._id)}
                        className="font-sans text-xs underline underline-offset-2"
                        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-brand-charcoal)", opacity: 0.55 }}
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(addr._id)}
                      className="font-sans text-xs underline underline-offset-2"
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-brand-charcoal)", opacity: 0.4 }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          {adding ? (
            <AddressForm
              initial={emptyAddressForm}
              onCancel={() => setAdding(false)}
              onSaved={handleAdd}
            />
          ) : (
            <button
              type="button"
              onClick={() => setAdding(true)}
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
          )}
        </div>
      )}
    </SectionCard>
  )
}

// ── Security panel ─────────────────────────────────────────────────────────────

function SecurityPanel({ userId, onSaved }: { userId: string; onSaved: () => void }) {
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
    if (!current || newPwd.length < 8 || !match) {
      setError(newPwd.length > 0 && newPwd.length < 8 ? "New password must be at least 8 characters." : "Please fill all fields correctly.")
      return
    }
    setError("")
    setLoading(true)
    try {
      await userApi.updatePassword(userId, { oldPassword: current, newPassword: newPwd, confirmedPassword: confPwd })
      setCurrent(""); setNewPwd(""); setConfPwd("")
      onSaved()
    } catch (err) {
      setError((err as Error).message || "Failed to update password.")
    } finally {
      setLoading(false)
    }
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
  const dispatch = useAppDispatch()
  const { user, sessionChecked } = useAppSelector((s) => s.auth)
  const [activeTab, setActiveTab] = useState<NavTab>("orders")
  const [toast, setToast] = useState("")
  // Local override so Details-panel edits reflect immediately without waiting
  // on a full session re-check.
  const [profileOverride, setProfileOverride] = useState<{ firstName: string; lastName: string; phoneNumber: string } | null>(null)

  const showToast = useCallback((msg: string) => setToast(msg), [])

  useEffect(() => {
    if (sessionChecked && !user) {
      router.replace("/account/login?returnUrl=/account")
    }
  }, [sessionChecked, user, router])

  async function handleLogout() {
    await dispatch(logoutUser())
    router.push("/")
  }

  if (!sessionChecked || !user) {
    return (
      <div style={{ background: "var(--color-brand-ivory)", minHeight: "80vh" }} className="flex items-center justify-center">
        <p className="font-sans" style={{ fontSize: "14px", color: "var(--color-brand-charcoal)", opacity: 0.5 }}>Loading…</p>
      </div>
    )
  }

  const firstName = profileOverride?.firstName ?? user.firstName
  const lastName = profileOverride?.lastName ?? user.lastName
  const phoneNumber = profileOverride?.phoneNumber ?? user.phoneNumber ?? ""
  const fullName = `${firstName} ${lastName}`.trim()

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
              <Sidebar active={activeTab} onChange={setActiveTab} onLogout={handleLogout} fullName={fullName} phone={phoneNumber} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {activeTab === "orders"    && <OrdersPanel />}
              {activeTab === "wishlist"  && <WishlistPanel />}
              {activeTab === "details"   && (
                <DetailsPanel
                  userId={user._id}
                  initialFirstName={firstName}
                  initialLastName={lastName}
                  initialPhone={phoneNumber}
                  email={user.email}
                  onSaved={(patch) => {
                    setProfileOverride(patch)
                    showToast("Profile saved successfully.")
                  }}
                />
              )}
              {activeTab === "addresses" && <AddressesPanel userId={user._id} />}
              {activeTab === "security"  && <SecurityPanel userId={user._id} onSaved={() => showToast("Password updated successfully.")} />}
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
