"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, Lock, ShieldCheck, ChevronDown } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { clearCart, type CartItem } from "@/lib/store/cartSlice"
import { createOrder, type OrderItemPayload, type CreateOrderPayload } from "@/lib/api/orders"
import type { PromoResult } from "@/lib/api/discounts"

// ── Types ─────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3

type Division = "Dhaka" | "Chattogram" | "Sylhet" | "Rajshahi" | "Khulna" | "Barisal" | "Rangpur" | "Mymensingh"

type DeliverySpeed = "same-day" | "standard" | "express"

type PaymentMethod = "bkash" | "nagad" | "card" | "cod"

interface DeliveryForm {
  fullName: string
  phone: string
  email: string
  division: Division | ""
  district: string
  upazila: string
  address: string
  postalCode: string
  speed: DeliverySpeed
  instructions: string
}

interface PaymentForm {
  method: PaymentMethod | ""
  mobileNumber: string
  otpSent: boolean
  cardNumber: string
  cardExpiry: string
  cardCvv: string
  cardName: string
}

type FormErrors = Partial<Record<string, string>>

// ── Constants ──────────────────────────────────────────────────────────────────

const DIVISIONS: Division[] = [
  "Dhaka", "Chattogram", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Rangpur", "Mymensingh",
]

const DELIVERY_OPTIONS: { id: DeliverySpeed; label: string; sub: string; fee: number; dhakaOnly?: boolean }[] = [
  { id: "same-day", label: "Dhaka Metro — Same Day", sub: "Delivered today if ordered before 2 PM", fee: 60, dhakaOnly: true },
  { id: "standard", label: "Standard — 2–3 Days", sub: "Tracked delivery across Bangladesh", fee: 100 },
  { id: "express",  label: "Express — Next Day",   sub: "Priority dispatch, next business day", fee: 150 },
]

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; sub: string }[] = [
  { id: "bkash", label: "bKash", sub: "Pay via bKash mobile banking" },
  { id: "nagad", label: "Nagad", sub: "Pay via Nagad mobile banking" },
  { id: "card",  label: "Credit / Debit Card", sub: "Visa · Mastercard accepted" },
  { id: "cod",   label: "Cash on Delivery",   sub: "Pay when your order arrives (+৳20 handling fee)" },
]

const BD_PHONE_RE = /^(\+880|880|0)1[3-9]\d{8}$/
const CARD_NUM_RE = /^\d{4} \d{4} \d{4} \d{4}$/
const EXPIRY_RE   = /^(0[1-9]|1[0-2])\/\d{2}$/

// ── Helpers ────────────────────────────────────────────────────────────────────

function parsePrice(p: string) {
  return parseInt(p.replace(/[৳,\s]/g, ""), 10) || 0
}

function taka(n: number) {
  return `৳${n.toLocaleString()}`
}

// Only real backend products (Mongo ObjectIds) can be referenced on an order —
// mock/demo products used in a few "you may also like" rails have no backend record.
function isServerProductId(id: string | number) {
  return /^[0-9a-fA-F]{24}$/.test(String(id))
}

function isExpiryValid(val: string): boolean {
  if (!EXPIRY_RE.test(val)) return false
  const [mm, yy] = val.split("/").map(Number)
  const now = new Date()
  const expYear = 2000 + yy
  return expYear > now.getFullYear() || (expYear === now.getFullYear() && mm >= now.getMonth() + 1)
}

function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 16)
  return digits.replace(/(.{4})/g, "$1 ").trim()
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4)
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return digits
}

// ── Step Indicator ─────────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: Step }) {
  const steps: { label: string }[] = [
    { label: "Delivery" },
    { label: "Payment" },
    { label: "Review" },
  ]

  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map(({ label }, i) => {
        const n = (i + 1) as Step
        const done   = n < step
        const active = n === step

        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all"
                style={{
                  background: active ? "var(--color-brand-rose)"
                    : done   ? "var(--color-brand-charcoal)"
                    : "transparent",
                  color: active || done ? "var(--color-brand-ivory)" : "var(--color-brand-charcoal)",
                  border: done || active ? "none" : "2px solid var(--color-border)",
                  opacity: !active && !done ? 0.45 : 1,
                }}
              >
                {done ? (
                  <Check size={15} strokeWidth={2.5} />
                ) : n}
              </div>
              <span
                className="text-xs font-medium mt-1.5 whitespace-nowrap"
                style={{
                  color: active ? "var(--color-brand-rose)"
                    : done   ? "var(--color-brand-charcoal)"
                    : "var(--color-brand-charcoal)",
                  opacity: !active && !done ? 0.45 : 1,
                }}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="mx-3 mb-5 rounded-full transition-all"
                style={{
                  width: "clamp(48px, 8vw, 80px)",
                  height: "1px",
                  background: done ? "var(--color-brand-charcoal)" : "var(--color-border-light)",
                  opacity: done ? 1 : 0.6,
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Field components ────────────────────────────────────────────────────────────

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        className="block font-sans text-xs font-semibold mb-1.5 uppercase tracking-wide"
        style={{ color: "var(--color-brand-charcoal)", opacity: 0.7 }}
      >
        {label}
        {required && <span style={{ color: "var(--color-brand-rose)" }}> *</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs mt-1" style={{ color: "var(--color-brand-rose)" }}>{error}</p>
      )}
    </div>
  )
}

const inputBase: React.CSSProperties = {
  width: "100%",
  height: "44px",
  border: "1px solid var(--color-border)",
  borderRadius: "10px",
  padding: "0 14px",
  fontSize: "14px",
  fontFamily: "var(--font-sans, sans-serif)",
  background: "var(--color-brand-ivory)",
  color: "var(--color-brand-charcoal)",
  outline: "none",
  transition: "border-color 0.15s",
}

function InputField({
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  maxLength,
  ...rest
}: {
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  error?: boolean
  maxLength?: number
  [k: string]: unknown
}) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <input
      ref={ref}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      style={{
        ...inputBase,
        borderColor: error ? "var(--color-brand-rose)" : "var(--color-border)",
      }}
      onFocus={() => { if (ref.current) ref.current.style.borderColor = error ? "var(--color-brand-rose)" : "var(--color-brand-charcoal)" }}
      onBlur={() => { if (ref.current) ref.current.style.borderColor = error ? "var(--color-brand-rose)" : "var(--color-border)" }}
      {...rest}
    />
  )
}

function SelectField({
  value,
  onChange,
  options,
  placeholder,
  error,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder?: string
  error?: boolean
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          ...inputBase,
          appearance: "none",
          paddingRight: "36px",
          borderColor: error ? "var(--color-brand-rose)" : "var(--color-border)",
          cursor: "pointer",
        }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown
        size={15}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
        style={{ color: "var(--color-brand-charcoal)", opacity: 0.5 }}
      />
    </div>
  )
}

function TextareaField({
  value,
  onChange,
  placeholder,
  rows = 3,
  maxLength,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
  maxLength?: number
}) {
  const ref = useRef<HTMLTextAreaElement>(null)
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      maxLength={maxLength}
      style={{
        ...inputBase,
        height: "auto",
        padding: "12px 14px",
        resize: "vertical",
        lineHeight: 1.5,
      }}
      onFocus={() => { if (ref.current) ref.current.style.borderColor = "var(--color-brand-charcoal)" }}
      onBlur={() => { if (ref.current) ref.current.style.borderColor = "var(--color-border)" }}
    />
  )
}

// ── Card wrapper ────────────────────────────────────────────────────────────────

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={className}
      style={{
        background: "var(--color-brand-ivory)",
        border: "1px solid var(--color-border-light)",
        borderRadius: "var(--radius-card, 16px)",
        padding: "24px",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {children}
    </div>
  )
}

function CardHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-heading font-light mb-6"
      style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)", color: "var(--color-brand-charcoal)", lineHeight: 1.2 }}
    >
      {children}
    </h2>
  )
}

// ── Delivery Radio Card ─────────────────────────────────────────────────────────

function DeliveryRadioCard({
  option,
  selected,
  disabled,
  onSelect,
}: {
  option: typeof DELIVERY_OPTIONS[0]
  selected: boolean
  disabled: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onSelect}
      disabled={disabled}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        width: "100%",
        padding: "14px 16px",
        borderRadius: "10px",
        border: selected ? "2px solid var(--color-brand-rose)" : "1.5px solid var(--color-border-light)",
        background: selected ? "rgba(198,147,132,0.06)" : "transparent",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "border-color 0.15s, background 0.15s",
        textAlign: "left",
      }}
    >
      {/* Radio dot */}
      <div
        style={{
          flexShrink: 0,
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          border: selected ? "none" : "2px solid var(--color-border)",
          background: selected ? "var(--color-brand-rose)" : "transparent",
          marginTop: "2px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selected && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "white" }} />}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <span
            className="font-sans font-semibold"
            style={{ fontSize: "14px", color: "var(--color-brand-charcoal)" }}
          >
            {option.label}
            {option.dhakaOnly && (
              <span
                className="ml-2 font-normal text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded"
                style={{ background: "var(--color-brand-beige)", color: "var(--color-brand-charcoal)", opacity: 0.7 }}
              >
                Dhaka only
              </span>
            )}
          </span>
          <span
            className="font-sans font-bold flex-shrink-0"
            style={{ fontSize: "14px", color: selected ? "var(--color-brand-rose)" : "var(--color-brand-charcoal)" }}
          >
            {taka(option.fee)}
          </span>
        </div>
        <p className="font-sans mt-0.5" style={{ fontSize: "12px", color: "var(--color-brand-charcoal)", opacity: 0.55 }}>
          {option.sub}
        </p>
      </div>
    </button>
  )
}

// ── Payment Method Card ─────────────────────────────────────────────────────────

function PaymentCard({
  option,
  selected,
  onSelect,
}: {
  option: typeof PAYMENT_OPTIONS[0]
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        width: "100%",
        padding: "14px 16px",
        borderRadius: "10px",
        border: selected ? "2px solid var(--color-brand-rose)" : "1.5px solid var(--color-border-light)",
        background: selected ? "rgba(198,147,132,0.06)" : "transparent",
        cursor: "pointer",
        transition: "border-color 0.15s, background 0.15s",
        textAlign: "left",
      }}
    >
      {/* Radio dot */}
      <div
        style={{
          flexShrink: 0,
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          border: selected ? "none" : "2px solid var(--color-border)",
          background: selected ? "var(--color-brand-rose)" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selected && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "white" }} />}
      </div>
      {/* Logo / icon area */}
      <div
        style={{
          width: "40px",
          height: "28px",
          borderRadius: "6px",
          background: "var(--color-brand-beige)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontSize: "11px",
          fontWeight: 700,
          color: "var(--color-brand-charcoal)",
          letterSpacing: "0.02em",
        }}
      >
        {option.id === "bkash" && "bK"}
        {option.id === "nagad" && "Ng"}
        {option.id === "card"  && "💳"}
        {option.id === "cod"   && "৳"}
      </div>
      <div className="flex-1">
        <p className="font-sans font-semibold" style={{ fontSize: "14px", color: "var(--color-brand-charcoal)" }}>
          {option.label}
        </p>
        <p className="font-sans" style={{ fontSize: "12px", color: "var(--color-brand-charcoal)", opacity: 0.55 }}>
          {option.sub}
        </p>
      </div>
    </button>
  )
}

// ── Order Mini Summary (right sidebar) ────────────────────────────────────────

function MiniSummary({
  items,
  subtotal,
  discount,
  shipping,
  total,
  cod,
}: {
  items: CartItem[]
  subtotal: number
  discount: number
  shipping: number
  total: number
  cod: boolean
}) {
  return (
    <div
      className="lg:sticky"
      style={{
        top: "88px",
        background: "var(--color-brand-beige)",
        border: "1px solid var(--color-border-light)",
        borderRadius: "var(--radius-card, 16px)",
        padding: "20px",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <h3
        className="font-heading font-light mb-4"
        style={{ fontSize: "1.125rem", color: "var(--color-brand-charcoal)", lineHeight: 1.2 }}
      >
        Order Summary
      </h3>

      {/* Item list */}
      <div className="space-y-3 mb-4" style={{ borderBottom: "1px solid var(--color-border-light)", paddingBottom: "16px" }}>
        {items.map((item) => {
          const unit = parsePrice(item.price)
          return (
            <div key={`${item.id}-${item.size}`} className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://placehold.co/56x72/${item.imgBg || "F5EFE6"}/${item.imgFg || "2D2D2D"}?text=${encodeURIComponent(item.imgText || "")}`}
                alt={item.name}
                style={{ width: "56px", height: "72px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }}
              />
              <div className="flex-1 min-w-0">
                <p
                  className="font-sans font-medium truncate"
                  style={{ fontSize: "13px", color: "var(--color-brand-charcoal)" }}
                >
                  {item.name}
                </p>
                <p className="font-sans mt-0.5" style={{ fontSize: "11px", color: "var(--color-brand-charcoal)", opacity: 0.55 }}>
                  Size {item.size} · Qty {item.quantity}
                  {item.selectedColor && (
                    <span>
                      {" · "}
                      <span
                        style={{
                          display: "inline-block",
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: item.selectedColor.hex,
                          verticalAlign: "middle",
                          marginRight: "2px",
                        }}
                      />
                      {item.selectedColor.name}
                    </span>
                  )}
                </p>
              </div>
              <p className="font-sans font-semibold flex-shrink-0" style={{ fontSize: "13px", color: "var(--color-brand-charcoal)" }}>
                {taka(unit * item.quantity)}
              </p>
            </div>
          )
        })}
      </div>

      {/* Totals */}
      <div className="space-y-2 text-sm" style={{ borderBottom: "1px solid var(--color-border-light)", paddingBottom: "14px", marginBottom: "14px" }}>
        <div className="flex justify-between" style={{ color: "var(--color-brand-charcoal)", opacity: 0.65 }}>
          <span className="font-sans">Subtotal</span>
          <span className="font-sans">{taka(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between font-sans font-semibold" style={{ color: "#5a8a6a" }}>
            <span>Discount</span>
            <span>−{taka(discount)}</span>
          </div>
        )}
        <div className="flex justify-between" style={{ color: "var(--color-brand-charcoal)", opacity: 0.65 }}>
          <span className="font-sans">Shipping</span>
          <span className="font-sans">
            {shipping === 0 ? <span style={{ color: "#5a8a6a", fontWeight: 600 }}>FREE</span> : taka(shipping)}
          </span>
        </div>
        {cod && (
          <div className="flex justify-between" style={{ color: "var(--color-brand-charcoal)", opacity: 0.65 }}>
            <span className="font-sans">COD Handling</span>
            <span className="font-sans">৳20</span>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center">
        <span className="font-heading font-light" style={{ fontSize: "1.0625rem", color: "var(--color-brand-charcoal)" }}>Total</span>
        <span className="font-sans font-bold" style={{ fontSize: "1.125rem", color: "var(--color-brand-charcoal)" }}>{taka(total)}</span>
      </div>

      {/* Trust badges */}
      <div
        className="mt-5 flex flex-wrap gap-x-3 gap-y-1 justify-center"
        style={{ paddingTop: "14px", borderTop: "1px solid var(--color-border-light)" }}
      >
        {["Secure Checkout", "SSL Encrypted", "Data Protected"].map((badge) => (
          <div key={badge} className="flex items-center gap-1">
            <Lock size={10} style={{ color: "var(--color-brand-charcoal)", opacity: 0.4 }} />
            <span className="font-sans" style={{ fontSize: "10px", color: "var(--color-brand-charcoal)", opacity: 0.5 }}>{badge}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Step 1: Delivery ────────────────────────────────────────────────────────────

function Step1Delivery({
  form,
  errors,
  onChange,
  onContinue,
}: {
  form: DeliveryForm
  errors: FormErrors
  onChange: (patch: Partial<DeliveryForm>) => void
  onContinue: () => void
}) {
  const isDhaka = form.division === "Dhaka"

  return (
    <Card>
      <CardHeading>Delivery Information</CardHeading>

      <div className="space-y-5">
        {/* Row: Full Name + Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name" required error={errors.fullName}>
            <InputField
              value={form.fullName}
              onChange={(v) => onChange({ fullName: v })}
              placeholder="Rahim Uddin"
              error={!!errors.fullName}
            />
          </Field>
          <Field label="Phone Number" required error={errors.phone}>
            <InputField
              type="tel"
              value={form.phone}
              onChange={(v) => onChange({ phone: v })}
              placeholder="+880 1XXX-XXXXXX"
              error={!!errors.phone}
            />
          </Field>
        </div>

        {/* Email */}
        <Field label="Email (optional)" error={errors.email}>
          <InputField
            type="email"
            value={form.email}
            onChange={(v) => onChange({ email: v })}
            placeholder="rahim@example.com"
            error={!!errors.email}
          />
        </Field>

        {/* Division */}
        <Field label="Division" required error={errors.division}>
          <SelectField
            value={form.division}
            onChange={(v) => {
              onChange({ division: v as Division, speed: v !== "Dhaka" && form.speed === "same-day" ? "standard" : form.speed })
            }}
            options={DIVISIONS}
            placeholder="Select Division"
            error={!!errors.division}
          />
        </Field>

        {/* District + Upazila */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="District" required error={errors.district}>
            <InputField
              value={form.district}
              onChange={(v) => onChange({ district: v })}
              placeholder="e.g. Dhaka"
              error={!!errors.district}
            />
          </Field>
          <Field label="Upazila / Thana" required error={errors.upazila}>
            <InputField
              value={form.upazila}
              onChange={(v) => onChange({ upazila: v })}
              placeholder="e.g. Gulshan"
              error={!!errors.upazila}
            />
          </Field>
        </div>

        {/* Address */}
        <Field label="Full Address" required error={errors.address}>
          <TextareaField
            value={form.address}
            onChange={(v) => onChange({ address: v })}
            placeholder="House no., road, area..."
            rows={2}
          />
        </Field>

        {/* Postal Code */}
        <Field label="Postal Code" error={errors.postalCode}>
          <InputField
            value={form.postalCode}
            onChange={(v) => onChange({ postalCode: v })}
            placeholder="1212"
            maxLength={6}
            error={!!errors.postalCode}
          />
        </Field>

        {/* Delivery speed */}
        <Field label="Delivery Type" required>
          <div className="space-y-2 mt-1">
            {DELIVERY_OPTIONS.map((opt) => {
              const disabled = !!(opt.dhakaOnly && !isDhaka)
              return (
                <DeliveryRadioCard
                  key={opt.id}
                  option={opt}
                  selected={form.speed === opt.id}
                  disabled={disabled}
                  onSelect={() => onChange({ speed: opt.id })}
                />
              )
            })}
          </div>
        </Field>

        {/* Special instructions */}
        <Field label={`Special Instructions (optional) — ${form.instructions.length}/250`}>
          <TextareaField
            value={form.instructions}
            onChange={(v) => onChange({ instructions: v })}
            placeholder="Gate code, landmark, preferred delivery time..."
            rows={3}
            maxLength={250}
          />
        </Field>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={onContinue}
        className="w-full mt-8 font-sans font-semibold text-sm rounded-full transition-colors"
        style={{
          height: "50px",
          background: "var(--color-brand-rose)",
          color: "var(--color-brand-ivory)",
          border: "none",
          cursor: "pointer",
          letterSpacing: "0.02em",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--color-brand-mauve)" }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--color-brand-rose)" }}
      >
        Continue to Payment →
      </button>
    </Card>
  )
}

// ── Step 2: Payment ─────────────────────────────────────────────────────────────

function Step2Payment({
  form,
  errors,
  onChange,
  onBack,
  onContinue,
}: {
  form: PaymentForm
  errors: FormErrors
  onChange: (patch: Partial<PaymentForm>) => void
  onBack: () => void
  onContinue: () => void
}) {
  return (
    <Card>
      <CardHeading>Payment Method</CardHeading>

      <div className="space-y-3">
        {PAYMENT_OPTIONS.map((opt) => (
          <PaymentCard
            key={opt.id}
            option={opt}
            selected={form.method === opt.id}
            onSelect={() => onChange({ method: opt.id })}
          />
        ))}
      </div>

      {errors.method && (
        <p className="text-xs mt-3" style={{ color: "var(--color-brand-rose)" }}>{errors.method}</p>
      )}

      {/* bKash / Nagad mobile fields */}
      {(form.method === "bkash" || form.method === "nagad") && (
        <div
          className="mt-6 space-y-4 rounded-xl p-4"
          style={{ background: "var(--color-brand-beige)", border: "1px solid var(--color-border-light)" }}
        >
          <p className="font-sans font-semibold text-sm" style={{ color: "var(--color-brand-charcoal)" }}>
            {form.method === "bkash" ? "bKash" : "Nagad"} Mobile Number
          </p>
          <Field label="Mobile Number" required error={errors.mobileNumber}>
            <InputField
              type="tel"
              value={form.mobileNumber}
              onChange={(v) => onChange({ mobileNumber: v })}
              placeholder="+880 1XXX-XXXXXX"
              error={!!errors.mobileNumber}
            />
          </Field>
          <button
            type="button"
            onClick={() => onChange({ otpSent: true })}
            className="font-sans font-semibold text-xs rounded-full px-5 py-2 transition-colors"
            style={{
              background: "var(--color-brand-rose)",
              color: "var(--color-brand-ivory)",
              border: "none",
              cursor: "pointer",
            }}
          >
            {form.otpSent ? "OTP Sent ✓" : "Send OTP"}
          </button>
          {form.otpSent && (
            <Field label="Enter OTP">
              <InputField
                value=""
                onChange={() => {}}
                placeholder="6-digit OTP"
                maxLength={6}
              />
              <p className="text-xs mt-1" style={{ color: "var(--color-brand-charcoal)", opacity: 0.5 }}>
                UI mock — no real OTP is sent in this demo.
              </p>
            </Field>
          )}
        </div>
      )}

      {/* Card fields */}
      {form.method === "card" && (
        <div
          className="mt-6 space-y-4 rounded-xl p-4"
          style={{ background: "var(--color-brand-beige)", border: "1px solid var(--color-border-light)" }}
        >
          <p className="font-sans font-semibold text-sm" style={{ color: "var(--color-brand-charcoal)" }}>Card Details</p>
          <Field label="Cardholder Name" required error={errors.cardName}>
            <InputField
              value={form.cardName}
              onChange={(v) => onChange({ cardName: v })}
              placeholder="As it appears on card"
              error={!!errors.cardName}
            />
          </Field>
          <Field label="Card Number" required error={errors.cardNumber}>
            <InputField
              value={form.cardNumber}
              onChange={(v) => onChange({ cardNumber: formatCardNumber(v) })}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              error={!!errors.cardNumber}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Expiry (MM/YY)" required error={errors.cardExpiry}>
              <InputField
                value={form.cardExpiry}
                onChange={(v) => onChange({ cardExpiry: formatExpiry(v) })}
                placeholder="MM/YY"
                maxLength={5}
                error={!!errors.cardExpiry}
              />
            </Field>
            <Field label="CVV" required error={errors.cardCvv}>
              <InputField
                value={form.cardCvv}
                onChange={(v) => onChange({ cardCvv: v.replace(/\D/g, "").slice(0, 3) })}
                placeholder="123"
                maxLength={3}
                error={!!errors.cardCvv}
              />
            </Field>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <ShieldCheck size={13} style={{ color: "var(--color-brand-charcoal)", opacity: 0.4 }} />
            <span className="font-sans" style={{ fontSize: "11px", color: "var(--color-brand-charcoal)", opacity: 0.5 }}>
              Your card data is encrypted and secure.
            </span>
          </div>
        </div>
      )}

      {/* COD note */}
      {form.method === "cod" && (
        <div
          className="mt-4 rounded-xl p-4"
          style={{ background: "var(--color-brand-beige)", border: "1px solid var(--color-border-light)" }}
        >
          <p className="font-sans text-sm" style={{ color: "var(--color-brand-charcoal)", opacity: 0.75 }}>
            Pay in cash when your order is delivered. A handling fee of <strong>৳20</strong> applies.
          </p>
        </div>
      )}

      {/* Nav buttons */}
      <div className="flex items-center justify-between mt-8 gap-4">
        <button
          type="button"
          onClick={onBack}
          className="font-sans text-sm underline underline-offset-2"
          style={{ color: "var(--color-brand-charcoal)", opacity: 0.6, background: "none", border: "none", cursor: "pointer" }}
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="flex-1 font-sans font-semibold text-sm rounded-full transition-colors"
          style={{
            height: "50px",
            background: "var(--color-brand-rose)",
            color: "var(--color-brand-ivory)",
            border: "none",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--color-brand-mauve)" }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--color-brand-rose)" }}
        >
          Continue to Review →
        </button>
      </div>
    </Card>
  )
}

// ── Step 3: Review ─────────────────────────────────────────────────────────────

function Step3Review({
  delivery,
  payment,
  items,
  subtotal,
  discount,
  shipping,
  total,
  cod,
  onEdit,
  onPlaceOrder,
  loading,
  error,
}: {
  delivery: DeliveryForm
  payment: PaymentForm
  items: CartItem[]
  subtotal: number
  discount: number
  shipping: number
  total: number
  cod: boolean
  onEdit: (step: Step) => void
  onPlaceOrder: () => void
  loading: boolean
  error: string
}) {
  const speedLabel = DELIVERY_OPTIONS.find((o) => o.id === delivery.speed)?.label ?? delivery.speed
  const methodLabel = PAYMENT_OPTIONS.find((o) => o.id === payment.method)?.label ?? payment.method

  return (
    <div className="space-y-5">
      {/* Delivery address review */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-light" style={{ fontSize: "1.125rem", color: "var(--color-brand-charcoal)" }}>
            Delivery Address
          </h3>
          <button
            type="button"
            onClick={() => onEdit(1)}
            className="font-sans text-xs font-semibold underline underline-offset-2"
            style={{ color: "var(--color-brand-rose)", background: "none", border: "none", cursor: "pointer" }}
          >
            Edit
          </button>
        </div>
        <div className="space-y-1 font-sans text-sm" style={{ color: "var(--color-brand-charcoal)", opacity: 0.75 }}>
          <p className="font-semibold" style={{ opacity: 1, color: "var(--color-brand-charcoal)" }}>{delivery.fullName}</p>
          <p>{delivery.phone}{delivery.email ? ` · ${delivery.email}` : ""}</p>
          <p>{delivery.address}</p>
          <p>{delivery.upazila}, {delivery.district}, {delivery.division} {delivery.postalCode}</p>
          <p className="mt-1 font-medium" style={{ color: "var(--color-brand-rose)", opacity: 1 }}>{speedLabel}</p>
          {delivery.instructions && (
            <p className="italic">&ldquo;{delivery.instructions}&rdquo;</p>
          )}
        </div>
      </Card>

      {/* Payment review */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-light" style={{ fontSize: "1.125rem", color: "var(--color-brand-charcoal)" }}>
            Payment Method
          </h3>
          <button
            type="button"
            onClick={() => onEdit(2)}
            className="font-sans text-xs font-semibold underline underline-offset-2"
            style={{ color: "var(--color-brand-rose)", background: "none", border: "none", cursor: "pointer" }}
          >
            Edit
          </button>
        </div>
        <p className="font-sans text-sm font-semibold" style={{ color: "var(--color-brand-charcoal)" }}>{methodLabel}</p>
        {(payment.method === "bkash" || payment.method === "nagad") && payment.mobileNumber && (
          <p className="font-sans text-sm mt-0.5" style={{ color: "var(--color-brand-charcoal)", opacity: 0.6 }}>
            {payment.mobileNumber}
          </p>
        )}
        {payment.method === "card" && payment.cardNumber && (
          <p className="font-sans text-sm mt-0.5" style={{ color: "var(--color-brand-charcoal)", opacity: 0.6 }}>
            •••• •••• •••• {payment.cardNumber.replace(/\s/g, "").slice(-4)}
          </p>
        )}
      </Card>

      {/* Items review */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-light" style={{ fontSize: "1.125rem", color: "var(--color-brand-charcoal)" }}>
            Items ({items.reduce((s, i) => s + i.quantity, 0)})
          </h3>
          <Link
            href="/cart"
            className="font-sans text-xs font-semibold underline underline-offset-2"
            style={{ color: "var(--color-brand-rose)" }}
          >
            Edit Cart
          </Link>
        </div>
        <div className="space-y-4">
          {items.map((item) => {
            const unit = parsePrice(item.price)
            return (
              <div key={`${item.id}-${item.size}`} className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://placehold.co/64x80/${item.imgBg || "F5EFE6"}/${item.imgFg || "2D2D2D"}?text=${encodeURIComponent(item.imgText || "")}`}
                  alt={item.name}
                  style={{ width: "64px", height: "80px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-sans font-medium text-sm truncate" style={{ color: "var(--color-brand-charcoal)" }}>{item.name}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span
                      className="font-sans text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "var(--color-brand-beige)", color: "var(--color-brand-charcoal)", border: "1px solid var(--color-border-light)" }}
                    >
                      {item.size}
                    </span>
                    {item.selectedColor && (
                      <span className="flex items-center gap-1">
                        <span
                          style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", background: item.selectedColor.hex }}
                        />
                        <span className="font-sans text-xs" style={{ color: "var(--color-brand-charcoal)", opacity: 0.6 }}>
                          {item.selectedColor.name}
                        </span>
                      </span>
                    )}
                    <span className="font-sans text-xs" style={{ color: "var(--color-brand-charcoal)", opacity: 0.5 }}>
                      × {item.quantity}
                    </span>
                  </div>
                </div>
                <p className="font-sans font-semibold text-sm flex-shrink-0" style={{ color: "var(--color-brand-charcoal)" }}>
                  {taka(unit * item.quantity)}
                </p>
              </div>
            )
          })}
        </div>

        {/* Totals inside review card */}
        <div
          className="mt-5 space-y-2 pt-4"
          style={{ borderTop: "1px solid var(--color-border-light)" }}
        >
          <div className="flex justify-between text-sm font-sans" style={{ color: "var(--color-brand-charcoal)", opacity: 0.65 }}>
            <span>Subtotal</span><span>{taka(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm font-sans font-semibold" style={{ color: "#5a8a6a" }}>
              <span>Discount</span><span>−{taka(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-sans" style={{ color: "var(--color-brand-charcoal)", opacity: 0.65 }}>
            <span>Shipping</span>
            <span>{shipping === 0 ? <span style={{ color: "#5a8a6a", fontWeight: 600 }}>FREE</span> : taka(shipping)}</span>
          </div>
          {cod && (
            <div className="flex justify-between text-sm font-sans" style={{ color: "var(--color-brand-charcoal)", opacity: 0.65 }}>
              <span>COD Handling</span><span>৳20</span>
            </div>
          )}
          <div className="flex justify-between font-sans font-bold pt-2" style={{ borderTop: "1px solid var(--color-border-light)", marginTop: "8px" }}>
            <span style={{ fontSize: "15px", color: "var(--color-brand-charcoal)" }}>Total</span>
            <span style={{ fontSize: "17px", color: "var(--color-brand-charcoal)" }}>{taka(total)}</span>
          </div>
        </div>
      </Card>

      {/* Order error */}
      {error && (
        <div
          className="rounded-xl px-4 py-3 font-sans text-sm"
          style={{ background: "rgba(198,147,132,0.1)", border: "1px solid rgba(198,147,132,0.3)", color: "var(--color-brand-rose)" }}
        >
          {error}
        </div>
      )}

      {/* Place Order CTA */}
      <button
        type="button"
        onClick={onPlaceOrder}
        disabled={loading}
        className="w-full font-sans font-semibold text-sm rounded-full flex items-center justify-center gap-3 transition-colors"
        style={{
          height: "56px",
          background: loading ? "var(--color-brand-mauve)" : "var(--color-brand-rose)",
          color: "var(--color-brand-ivory)",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: "15px",
          letterSpacing: "0.02em",
          boxShadow: "0 4px 20px rgba(198,147,132,0.35)",
        }}
        onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "var(--color-brand-mauve)" }}
        onMouseLeave={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "var(--color-brand-rose)" }}
      >
        {loading ? (
          <>
            <svg className="animate-spin" width="18" height="18" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Placing your order…
          </>
        ) : (
          "Place Order →"
        )}
      </button>

      <p
        className="text-center font-sans"
        style={{ fontSize: "11px", color: "var(--color-brand-charcoal)", opacity: 0.45 }}
      >
        By placing your order you agree to FashionHub&apos;s Terms &amp; Conditions.
      </p>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function CheckoutPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const cartItems = useAppSelector((s) => s.cart.items)

  // Redirect if empty cart
  const redirectedRef = useRef(false)
  useEffect(() => {
    if (cartItems.length === 0 && !redirectedRef.current) {
      redirectedRef.current = true
      router.replace("/cart")
    }
  }, [cartItems.length, router])

  // Pick up promo from sessionStorage (carried from cart)
  const [appliedPromo, setAppliedPromo] = useState<PromoResult | null>(null)
  useEffect(() => {
    const raw = sessionStorage.getItem("appliedPromo")
    if (raw) {
      try { setAppliedPromo(JSON.parse(raw)) } catch { /* ignore */ }
    }
  }, [])

  const [step, setStep] = useState<Step>(1)

  const [delivery, setDelivery] = useState<DeliveryForm>({
    fullName: "", phone: "", email: "",
    division: "", district: "", upazila: "",
    address: "", postalCode: "",
    speed: "standard", instructions: "",
  })

  const [payment, setPayment] = useState<PaymentForm>({
    method: "", mobileNumber: "", otpSent: false,
    cardNumber: "", cardExpiry: "", cardCvv: "", cardName: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [orderError, setOrderError] = useState("")

  // ── Derived pricing ────────────────────────────────────────────────
  const subtotal = cartItems.reduce((s, i) => s + parsePrice(i.price) * i.quantity, 0)
  const discount = appliedPromo?.discountAmount ?? 0
  const afterDiscount = Math.max(subtotal - discount, 0)
  const freeShip = appliedPromo?.freeShipping ?? false
  const isCod = payment.method === "cod"

  const speedFee = DELIVERY_OPTIONS.find((o) => o.id === delivery.speed)?.fee ?? 100
  let shipping = speedFee
  if (freeShip || afterDiscount >= 2000) shipping = 0
  const total = afterDiscount + shipping + (isCod ? 20 : 0)

  // ── Validation ─────────────────────────────────────────────────────
  function validateDelivery(): FormErrors {
    const e: FormErrors = {}
    if (!delivery.fullName.trim() || delivery.fullName.trim().length < 2)
      e.fullName = "Please enter your full name"
    if (!BD_PHONE_RE.test(delivery.phone.trim()))
      e.phone = "Enter a valid Bangladesh phone number"
    if (!delivery.division)
      e.division = "Please select a division"
    if (!delivery.district.trim())
      e.district = "Please enter your district"
    if (!delivery.upazila.trim())
      e.upazila = "Please enter your upazila / thana"
    if (delivery.address.trim().length < 8)
      e.address = "Please enter a full address"
    return e
  }

  function validatePayment(): FormErrors {
    const e: FormErrors = {}
    if (!payment.method)
      e.method = "Please select a payment method"
    if (payment.method === "bkash" || payment.method === "nagad") {
      if (!BD_PHONE_RE.test(payment.mobileNumber.trim()))
        e.mobileNumber = "Enter a valid Bangladesh phone number"
    }
    if (payment.method === "card") {
      if (!CARD_NUM_RE.test(payment.cardNumber)) e.cardNumber = "Enter a valid 16-digit card number"
      if (!isExpiryValid(payment.cardExpiry))    e.cardExpiry = "Enter a valid expiry (MM/YY)"
      if (!/^\d{3}$/.test(payment.cardCvv))      e.cardCvv   = "CVV must be 3 digits"
      if (!payment.cardName.trim())               e.cardName  = "Enter the cardholder name"
    }
    return e
  }

  const handleDeliveryContinue = useCallback(() => {
    const errs = validateDelivery()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setStep(2)
    window.scrollTo({ top: 0, behavior: "smooth" })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delivery])

  const handlePaymentContinue = useCallback(() => {
    const errs = validatePayment()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setStep(3)
    window.scrollTo({ top: 0, behavior: "smooth" })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payment])

  const handlePlaceOrder = useCallback(async () => {
    setLoading(true)
    setOrderError("")

    try {
      const orderItems: OrderItemPayload[] = cartItems.map((item) => {
        const unit = parsePrice(item.price)
        return {
          productId: isServerProductId(item.id) ? String(item.id) : undefined,
          productName: item.name,
          variant: { color: item.selectedColor?.name, size: item.size },
          quantity: item.quantity,
          unitPrice: unit,
          totalPrice: unit * item.quantity,
        }
      })

      const paymentMethod: CreateOrderPayload["payment"]["method"] =
        payment.method === "cod" ? "cash_on_delivery" : (payment.method as "bkash" | "nagad" | "card")

      const result = await createOrder({
        customer: {
          name: delivery.fullName,
          email: delivery.email || undefined,
          phone: delivery.phone,
          shippingAddress: {
            street: [delivery.address, delivery.upazila].filter(Boolean).join(", "),
            city: delivery.district,
            state: delivery.division,
            zip: delivery.postalCode || undefined,
            country: "Bangladesh",
          },
        },
        items: orderItems,
        pricing: {
          subtotal,
          discountAmount: discount,
          couponCode: appliedPromo?.code,
          shippingCost: shipping,
          total,
        },
        payment: { method: paymentMethod },
        source: "website",
      })

      const orderData = {
        orderId: result.payload.orderId,
        items: cartItems,
        customer: { fullName: delivery.fullName, phone: delivery.phone, email: delivery.email },
        delivery: {
          address: delivery.address, upazila: delivery.upazila,
          district: delivery.district, division: delivery.division,
          postalCode: delivery.postalCode, speed: delivery.speed,
          instructions: delivery.instructions, charge: shipping,
        },
        payment: {
          method: payment.method,
          mobileNumber: payment.method === "bkash" || payment.method === "nagad"
            ? payment.mobileNumber : null,
        },
        pricing: { subtotal, discount, deliveryCharge: shipping, codFee: isCod ? 20 : 0, total },
        placedAt: new Date().toISOString(),
      }

      sessionStorage.setItem("lastOrder", JSON.stringify(orderData))
      sessionStorage.removeItem("appliedPromo")
      redirectedRef.current = true // suppress the empty-cart guard before clearing the cart
      dispatch(clearCart())
      router.push("/order-confirm")
    } catch (err) {
      setOrderError((err as Error).message || "Failed to place your order. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [cartItems, delivery, payment, subtotal, discount, shipping, isCod, total, appliedPromo, dispatch, router])

  if (cartItems.length === 0) return null

  return (
    <main
      className="w-full"
      style={{
        paddingTop: "clamp(32px, 5vw, 56px)",
        paddingBottom: "clamp(64px, 8vw, 96px)",
        paddingLeft: "clamp(16px, 4vw, 32px)",
        paddingRight: "clamp(16px, 4vw, 32px)",
      }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 font-sans" style={{ fontSize: "12px", color: "var(--color-brand-charcoal)", opacity: 0.5 }}>
          <Link href="/" className="hover:opacity-100 transition-opacity">Home</Link>
          <span>/</span>
          <Link href="/cart" className="hover:opacity-100 transition-opacity">Bag</Link>
          <span>/</span>
          <span style={{ opacity: 1, color: "var(--color-brand-charcoal)" }}>Checkout</span>
        </nav>

        {/* Page heading */}
        <h1
          className="font-heading font-light mb-2"
          style={{ fontSize: "clamp(2rem, 5vw, 2.5rem)", color: "var(--color-brand-charcoal)", lineHeight: 1.15 }}
        >
          Checkout
        </h1>
        <p
          className="font-sans mb-8"
          style={{ fontSize: "13px", color: "var(--color-brand-charcoal)", opacity: 0.5 }}
        >
          {cartItems.reduce((s, i) => s + i.quantity, 0)} item{cartItems.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""}
        </p>

        {/* Step indicator */}
        <StepIndicator step={step} />

        {/* Layout: left form + right sidebar */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left: step content */}
          <div className="flex-1 min-w-0">
            {step === 1 && (
              <Step1Delivery
                form={delivery}
                errors={errors}
                onChange={(patch) => setDelivery((p) => ({ ...p, ...patch }))}
                onContinue={handleDeliveryContinue}
              />
            )}
            {step === 2 && (
              <Step2Payment
                form={payment}
                errors={errors}
                onChange={(patch) => setPayment((p) => ({ ...p, ...patch }))}
                onBack={() => { setStep(1); window.scrollTo({ top: 0, behavior: "smooth" }) }}
                onContinue={handlePaymentContinue}
              />
            )}
            {step === 3 && (
              <Step3Review
                delivery={delivery}
                payment={payment}
                items={cartItems}
                subtotal={subtotal}
                discount={discount}
                shipping={shipping}
                total={total}
                cod={isCod}
                onEdit={(s) => { setStep(s); window.scrollTo({ top: 0, behavior: "smooth" }) }}
                onPlaceOrder={handlePlaceOrder}
                loading={loading}
                error={orderError}
              />
            )}
          </div>

          {/* Right: mini summary (desktop) */}
          <div className="hidden lg:block w-[320px] xl:w-[360px] flex-shrink-0">
            <MiniSummary
              items={cartItems}
              subtotal={subtotal}
              discount={discount}
              shipping={shipping}
              total={total}
              cod={isCod}
            />
          </div>
        </div>

        {/* Mobile sticky bottom bar */}
        <div
          className="fixed bottom-0 left-0 right-0 z-50 lg:hidden flex items-center justify-between px-4 py-3"
          style={{
            background: "var(--color-brand-ivory)",
            borderTop: "1px solid var(--color-border-light)",
            boxShadow: "0 -4px 20px rgba(45,42,38,0.08)",
          }}
        >
          <div>
            <p className="font-sans" style={{ fontSize: "11px", color: "var(--color-brand-charcoal)", opacity: 0.5 }}>Total</p>
            <p className="font-sans font-bold" style={{ fontSize: "17px", color: "var(--color-brand-charcoal)" }}>{taka(total)}</p>
          </div>
          {step < 3 ? (
            <button
              type="button"
              onClick={step === 1 ? handleDeliveryContinue : handlePaymentContinue}
              className="font-sans font-semibold text-sm rounded-full px-6"
              style={{
                height: "44px",
                background: "var(--color-brand-rose)",
                color: "var(--color-brand-ivory)",
                border: "none",
                cursor: "pointer",
              }}
            >
              {step === 1 ? "To Payment →" : "To Review →"}
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={loading}
              className="font-sans font-semibold text-sm rounded-full px-6 flex items-center gap-2"
              style={{
                height: "44px",
                background: "var(--color-brand-rose)",
                color: "var(--color-brand-ivory)",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.75 : 1,
              }}
            >
              {loading ? (
                <svg className="animate-spin" width="15" height="15" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : "Place Order →"}
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
