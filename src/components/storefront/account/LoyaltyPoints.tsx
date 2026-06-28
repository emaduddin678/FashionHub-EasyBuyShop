"use client"

import { useState } from "react"
import { Gift } from "lucide-react"

const POINTS = 1250
const RATE = 10 // ৳10 per 100 points

const TIERS = [
  { name: "Bronze", threshold: 0 },
  { name: "Silver", threshold: 500 },
  { name: "Gold", threshold: 1000 },
  { name: "Platinum", threshold: 2000 },
]

const HOW_TO_EARN = [
  { action: "Purchase (per ৳100)", points: "10 pts" },
  { action: "Write a review", points: "50 pts" },
  { action: "Refer a friend", points: "200 pts" },
  { action: "Birthday bonus", points: "100 pts" },
  { action: "First purchase", points: "150 pts" },
  { action: "Follow on social media", points: "25 pts each" },
]

const POINTS_HISTORY = [
  { date: "26 Jun 2026", action: "Purchase FBD-1782447580375", points: "+80", balance: "1,250" },
  { date: "20 Jun 2026", action: "Purchase FBD-1782334521001", points: "+430", balance: "1,170" },
  { date: "15 Jun 2026", action: "Write Review", points: "+50", balance: "740" },
  { date: "10 Jun 2026", action: "Purchase FBD-1782201234567", points: "+250", balance: "690" },
  { date: "01 Jun 2026", action: "First Purchase Bonus", points: "+150", balance: "440" },
]

function getCurrentTierIndex() {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (POINTS >= TIERS[i].threshold) return i
  }
  return 0
}

export default function LoyaltyPoints() {
  const [redeemInput, setRedeemInput] = useState("")

  const redeemValue = Math.min(
    Math.floor((parseInt(redeemInput || "0") / 100) * RATE),
    Math.floor((POINTS / 100) * RATE)
  )

  const currentTierIdx = getCurrentTierIndex()
  const nextTier = TIERS[currentTierIdx + 1]
  const currentTier = TIERS[currentTierIdx]
  const progressPct = nextTier
    ? ((POINTS - currentTier.threshold) / (nextTier.threshold - currentTier.threshold)) * 100
    : 100

  return (
    <div>
      {/* Hero card */}
      <div className="bg-[#1A2B5E] rounded-xl p-8 text-center">
        <Gift size={48} className="text-[#D4A017] mx-auto" />
        <p className="text-4xl font-bold text-white mt-3">
          {POINTS.toLocaleString()} Points
        </p>
        <p className="text-white/70 mt-1">= ৳{(Math.floor(POINTS / 100) * RATE).toLocaleString()} reward value</p>

        {/* Tier progress */}
        <div className="mt-6 relative">
          <div className="flex justify-between items-center mb-2">
            {TIERS.map((tier, idx) => {
              const isActive = idx === currentTierIdx
              const isDone = idx < currentTierIdx
              return (
                <div key={tier.name} className="flex flex-col items-center gap-1 z-10 relative">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                      isActive
                        ? "bg-[#D4A017] border-[#D4A017] text-[#1A2B5E]"
                        : isDone
                        ? "bg-white/20 border-white/40 text-white"
                        : "bg-white/10 border-white/20 text-white/40"
                    }`}
                  >
                    {isDone || isActive ? "✓" : tier.threshold >= 1000 ? tier.threshold / 1000 + "k" : tier.threshold}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      isActive ? "text-[#D4A017]" : isDone ? "text-white/70" : "text-white/40"
                    }`}
                  >
                    {tier.name}
                  </span>
                </div>
              )
            })}
          </div>
          {/* Connecting line */}
          <div className="absolute top-4 left-4 right-4 h-0.5 bg-white/20" style={{ zIndex: 0 }}>
            <div
              className="h-0.5 transition-all"
              style={{
                width: `${((currentTierIdx + progressPct / 100) / (TIERS.length - 1)) * 100}%`,
                backgroundColor: "#D4A017",
              }}
            />
          </div>
        </div>

        {nextTier && (
          <p className="text-white/60 text-sm mt-4">
            {(nextTier.threshold - POINTS).toLocaleString()} points to {nextTier.name}
          </p>
        )}
      </div>

      {/* How to earn */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
        <h3 className="font-semibold text-[#1A2B5E] mb-4">How to Earn Points</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-gray-500 font-medium pb-2">Action</th>
                <th className="text-right text-gray-500 font-medium pb-2">Points</th>
              </tr>
            </thead>
            <tbody>
              {HOW_TO_EARN.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-50 last:border-0">
                  <td className="py-2.5 text-gray-700">{row.action}</td>
                  <td className="py-2.5 text-right font-semibold text-[#1A2B5E]">{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Points history */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
        <h3 className="font-semibold text-[#1A2B5E] mb-4">Points History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-gray-500 font-medium pb-2">Date</th>
                <th className="text-left text-gray-500 font-medium pb-2">Action</th>
                <th className="text-right text-gray-500 font-medium pb-2">Points</th>
                <th className="text-right text-gray-500 font-medium pb-2">Balance</th>
              </tr>
            </thead>
            <tbody>
              {POINTS_HISTORY.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-50 last:border-0">
                  <td className="py-2.5 text-gray-500 whitespace-nowrap">{row.date}</td>
                  <td className="py-2.5 text-gray-700">{row.action}</td>
                  <td className={`py-2.5 text-right font-semibold ${row.points.startsWith("+") ? "text-green-600" : "text-red-500"}`}>
                    {row.points} pts
                  </td>
                  <td className="py-2.5 text-right text-gray-700">{row.balance} pts</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Redeem points */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
        <h3 className="font-semibold text-[#1A2B5E] mb-1">Redeem Points</h3>
        <p className="text-sm text-gray-500 mb-4">Use your points as discount on next order</p>
        <div className="flex gap-3 items-start flex-wrap">
          <div className="flex-1 min-w-[160px]">
            <input
              type="number"
              min={0}
              max={POINTS}
              value={redeemInput}
              onChange={(e) => {
                const v = Math.min(parseInt(e.target.value || "0"), POINTS)
                setRedeemInput(v.toString())
              }}
              placeholder="Enter points to redeem"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2B5E]/20 focus:border-[#1A2B5E]"
            />
            {redeemInput && (
              <p className="text-sm text-[#1A2B5E] font-medium mt-1.5">
                = ৳{redeemValue} discount
              </p>
            )}
          </div>
          <button className="bg-[#D4A017] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#b8881a] transition-colors whitespace-nowrap">
            Redeem at Checkout →
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Points will be applied automatically at checkout. Rate: 100 points = ৳{RATE}.
        </p>
      </div>
    </div>
  )
}
