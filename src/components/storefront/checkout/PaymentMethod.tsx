"use client"

import { useState } from "react"

export type PaymentMethodType = "bkash" | "nagad" | "rocket" | "card" | "cod" | ""

export interface PaymentData {
  method: PaymentMethodType
  accountNumber: string
  cardNumber: string
  cardExpiry: string
  cardCvv: string
  cardName: string
}

interface Props {
  data: PaymentData
  onChange: (data: PaymentData) => void
  errors: Partial<Record<string, string>>
  submitAttempted?: boolean
}

function formatCardNumber(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 16)
  return digits.replace(/(.{4})/g, "$1 ").trim()
}

function formatExpiry(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 4)
  if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2)
  return digits
}

export function PaymentMethod({ data, onChange, errors, submitAttempted }: Props) {
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({})

  function set<K extends keyof PaymentData>(key: K, value: PaymentData[K]) {
    onChange({ ...data, [key]: value })
  }

  function selectMethod(m: PaymentMethodType) {
    onChange({ ...data, method: m, accountNumber: "", cardNumber: "", cardExpiry: "", cardCvv: "", cardName: "" })
  }

  function blur(key: string) {
    setTouchedFields((p) => ({ ...p, [key]: true }))
  }

  function isTouched(key: string) {
    return !!(touchedFields[key] || submitAttempted)
  }

  function inputClass(key: string) {
    const hasErr = errors[key] && isTouched(key)
    return `w-full h-11 border rounded-lg px-3 text-sm outline-none transition-colors ${
      hasErr ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-[#1A2B5E]"
    }`
  }

  const options: {
    id: PaymentMethodType
    label: string
    sub: string
    badge?: string
    dot: string
    dotText: string
  }[] = [
    { id: "bkash", label: "bKash Mobile Banking", sub: "Pay instantly via bKash", dot: "#E2136E", dotText: "bKash" },
    { id: "nagad", label: "Nagad Mobile Banking", sub: "Pay via Nagad wallet", dot: "#F15A22", dotText: "Nagad" },
    { id: "rocket", label: "Rocket (DBBL Mobile Banking)", sub: "Pay via Rocket wallet", dot: "#8B1A7A", dotText: "Rocket" },
    { id: "card", label: "Credit / Debit Card", sub: "VISA, MasterCard accepted", dot: "#1A2B5E", dotText: "Card" },
    { id: "cod", label: "Cash on Delivery", sub: "Pay when your order arrives", badge: "Most Popular", dot: "#16a34a", dotText: "COD" },
  ]

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-7 h-7 rounded-full bg-[#1A2B5E] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
          3
        </div>
        <h2 className="font-semibold text-lg text-[#1A2B5E]">Payment Method</h2>
      </div>

      {errors.method && (
        <p className="text-xs text-red-500 mb-3 border border-red-200 bg-red-50 rounded-lg px-3 py-2">
          Please select a payment method
        </p>
      )}

      <div className="space-y-3">
        {options.map((opt) => {
          const selected = data.method === opt.id
          return (
            <div key={opt.id}>
              <button
                type="button"
                onClick={() => selectMethod(opt.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors text-left ${
                  selected
                    ? "border-[#1A2B5E] bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-400"
                }`}
              >
                {/* Logo circle */}
                {opt.id === "card" ? (
                  <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-800 text-white text-xs font-bold">
                    💳
                  </div>
                ) : opt.id === "cod" ? (
                  <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center bg-green-100 text-xl">
                    💵
                  </div>
                ) : (
                  <div
                    className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: opt.dot }}
                  >
                    {opt.dotText.slice(0, 2)}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-gray-900 text-sm">{opt.label}</p>
                    {opt.badge && (
                      <span className="text-xs font-bold text-[#D4A017] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                        {opt.badge}
                      </span>
                    )}
                    {opt.id === "card" && (
                      <div className="flex gap-1">
                        <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">VISA</span>
                        <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">MasterCard</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{opt.sub}</p>
                </div>

                {/* Radio */}
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                  selected ? "border-[#1A2B5E]" : "border-gray-300"
                }`}>
                  {selected && <div className="w-2 h-2 rounded-full bg-[#1A2B5E]" />}
                </div>
              </button>

              {/* Expanded content */}
              {selected && (opt.id === "bkash" || opt.id === "nagad" || opt.id === "rocket") && (
                <div className="bg-gray-50 rounded-lg p-3 mt-2 border border-gray-100">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    {opt.id === "bkash" ? "bKash" : opt.id === "nagad" ? "Nagad" : "Rocket"} Account Number
                  </label>
                  <input
                    type="tel"
                    value={data.accountNumber}
                    onChange={(e) => set("accountNumber", e.target.value)}
                    onBlur={() => blur("accountNumber")}
                    placeholder="+880 1XXXXXXXXX"
                    className={inputClass("accountNumber")}
                  />
                  {errors.accountNumber && isTouched("accountNumber") && (
                    <p className="text-xs text-red-500 mt-1">{errors.accountNumber}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1.5">
                    You&apos;ll receive a payment request on this number
                  </p>
                </div>
              )}

              {selected && opt.id === "card" && (
                <div className="bg-gray-50 rounded-lg p-3 mt-2 border border-gray-100 grid gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Card Number</label>
                    <input
                      type="text"
                      value={data.cardNumber}
                      onChange={(e) => set("cardNumber", formatCardNumber(e.target.value))}
                      onBlur={() => blur("cardNumber")}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className={inputClass("cardNumber")}
                    />
                    {errors.cardNumber && isTouched("cardNumber") && (
                      <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Expiry Date</label>
                      <input
                        type="text"
                        value={data.cardExpiry}
                        onChange={(e) => set("cardExpiry", formatExpiry(e.target.value))}
                        onBlur={() => blur("cardExpiry")}
                        placeholder="MM/YY"
                        maxLength={5}
                        className={inputClass("cardExpiry")}
                      />
                      {errors.cardExpiry && isTouched("cardExpiry") && (
                        <p className="text-xs text-red-500 mt-1">{errors.cardExpiry}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">CVV</label>
                      <input
                        type="password"
                        value={data.cardCvv}
                        onChange={(e) => set("cardCvv", e.target.value.replace(/\D/g, "").slice(0, 3))}
                        onBlur={() => blur("cardCvv")}
                        placeholder="•••"
                        maxLength={3}
                        className={inputClass("cardCvv")}
                      />
                      {errors.cardCvv && isTouched("cardCvv") && (
                        <p className="text-xs text-red-500 mt-1">{errors.cardCvv}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Cardholder Name</label>
                    <input
                      type="text"
                      value={data.cardName}
                      onChange={(e) => set("cardName", e.target.value)}
                      onBlur={() => blur("cardName")}
                      placeholder="RAHIM UDDIN"
                      className={inputClass("cardName")}
                    />
                    {errors.cardName && isTouched("cardName") && (
                      <p className="text-xs text-red-500 mt-1">{errors.cardName}</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    🔒 Your card details are encrypted and secure
                  </p>
                </div>
              )}

              {selected && opt.id === "cod" && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2">
                  <p className="text-xs text-amber-800 leading-relaxed">
                    ⚠️ Please keep exact change ready.<br />
                    COD orders may take 1-2 extra days to process.
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
