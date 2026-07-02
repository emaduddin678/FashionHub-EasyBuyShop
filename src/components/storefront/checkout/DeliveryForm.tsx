"use client"

import { useState } from "react"

export type DeliveryType = "home" | "pickup"
export type DeliverySpeed = "standard" | "express"

export interface DeliveryData {
  type: DeliveryType
  address: string
  area: string
  city: string
  postalCode: string
  instructions: string
  speed: DeliverySpeed
}

interface Props {
  data: DeliveryData
  onChange: (data: DeliveryData) => void
  errors: Partial<Record<keyof DeliveryData, string>>
  subtotal: number
  submitAttempted?: boolean
}

const CITIES = ["Dhaka", "Chattogram", "Sylhet", "Rajshahi", "Khulna", "Barishal", "Rangpur", "Mymensingh"]

export function DeliveryForm({ data, onChange, errors, subtotal, submitAttempted }: Props) {
  const [touched, setTouched] = useState<Partial<Record<keyof DeliveryData, boolean>>>({})

  function set<K extends keyof DeliveryData>(key: K, value: DeliveryData[K]) {
    onChange({ ...data, [key]: value })
  }

  function blur(key: keyof DeliveryData) {
    setTouched((prev) => ({ ...prev, [key]: true }))
  }

  function isTouched(key: keyof DeliveryData) {
    return !!(touched[key] || submitAttempted)
  }

  const standardFree = subtotal >= 2000
  const isPickup = data.type === "pickup"

  function inputClass(key: keyof DeliveryData) {
    const hasErr = errors[key] && isTouched(key)
    return `w-full h-11 border rounded-lg px-3 text-sm outline-none transition-colors ${
      hasErr ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-brand-charcoal"
    }`
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-7 h-7 rounded-full bg-brand-charcoal text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
          2
        </div>
        <h2 className="font-semibold text-lg text-brand-charcoal">Delivery Address</h2>
      </div>

      {/* Delivery type toggle */}
      <div className="flex gap-3 mb-5">
        <button
          type="button"
          onClick={() => set("type", "home")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-semibold transition-colors ${
            !isPickup
              ? "bg-brand-charcoal text-white border-brand-charcoal"
              : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
          }`}
        >
          <span>🏠</span> Home Delivery
        </button>
        <button
          type="button"
          onClick={() => set("type", "pickup")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-semibold transition-colors ${
            isPickup
              ? "bg-brand-charcoal text-white border-brand-charcoal"
              : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
          }`}
        >
          <span>🏪</span> Store Pickup
        </button>
      </div>

      {isPickup ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          Visit any FashionHub store in Dhaka, Chattogram or Sylhet
        </div>
      ) : (
        <>
          {/* Address fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address / House <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.address}
                onChange={(e) => set("address", e.target.value)}
                onBlur={() => blur("address")}
                placeholder="House 12, Road 4, Block B"
                className={inputClass("address")}
              />
              {errors.address && isTouched("address") && (
                <p className="text-xs text-red-500 mt-1">{errors.address}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Area / Thana <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.area}
                onChange={(e) => set("area", e.target.value)}
                onBlur={() => blur("area")}
                placeholder="Dhanmondi, Gulshan, Banani..."
                className={inputClass("area")}
              />
              {errors.area && isTouched("area") && (
                <p className="text-xs text-red-500 mt-1">{errors.area}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <select
                  value={data.city}
                  onChange={(e) => set("city", e.target.value)}
                  onBlur={() => blur("city")}
                  className={`${inputClass("city")} bg-white appearance-none`}
                >
                  <option value="">Select City</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.city && isTouched("city") && (
                  <p className="text-xs text-red-500 mt-1">{errors.city}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={data.postalCode}
                  onChange={(e) => set("postalCode", e.target.value)}
                  placeholder="1205"
                  className="w-full h-11 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-brand-charcoal transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Instructions <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={data.instructions}
                onChange={(e) => set("instructions", e.target.value)}
                rows={3}
                placeholder="e.g. Call before delivery, leave at gate..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-charcoal transition-colors resize-none"
              />
            </div>
          </div>

          {/* Delivery speed */}
          <div className="mt-5 space-y-3">
            <p className="text-sm font-medium text-gray-700">Delivery Speed</p>

            {/* Standard */}
            <button
              type="button"
              onClick={() => set("speed", "standard")}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-colors text-left ${
                data.speed === "standard"
                  ? "border-brand-charcoal bg-[#F0F4FF]"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                data.speed === "standard" ? "border-brand-charcoal" : "border-gray-300"
              }`}>
                {data.speed === "standard" && (
                  <div className="w-2 h-2 rounded-full bg-brand-charcoal" />
                )}
              </div>
              <span className="text-2xl">🚚</span>
              <div className="flex-1">
                <p className="font-medium text-brand-charcoal text-sm">Standard Delivery</p>
                <p className="text-xs text-gray-500">3-5 business days</p>
              </div>
              <div className="text-right">
                {standardFree ? (
                  <span className="font-bold text-green-600 text-sm">FREE</span>
                ) : (
                  <span className="font-bold text-brand-charcoal text-sm">৳120</span>
                )}
              </div>
            </button>

            {/* Express */}
            <button
              type="button"
              onClick={() => set("speed", "express")}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-colors text-left ${
                data.speed === "express"
                  ? "border-brand-charcoal bg-[#F0F4FF]"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                data.speed === "express" ? "border-brand-charcoal" : "border-gray-300"
              }`}>
                {data.speed === "express" && (
                  <div className="w-2 h-2 rounded-full bg-brand-charcoal" />
                )}
              </div>
              <span className="text-2xl">⚡</span>
              <div className="flex-1">
                <p className="font-medium text-brand-charcoal text-sm">Express Delivery</p>
                <p className="text-xs text-gray-500">Next business day</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-brand-gold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Fast
                </span>
                <span className="font-bold text-brand-charcoal text-sm">৳250</span>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
