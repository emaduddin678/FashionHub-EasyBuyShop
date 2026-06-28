"use client"

import { useState, useEffect } from "react"

const MESSAGES = [
  "🌸 EID COLLECTION NOW LIVE — SHOP BEFORE IT SELLS OUT",
  "🚚 FREE SHIPPING ON ALL ORDERS ABOVE ৳2,000",
  "✨ USE CODE WELCOME10 FOR 10% OFF YOUR FIRST ORDER",
]

const DISMISS_KEY = "fh_announcement_dismissed"
const ROTATE_MS = 4000

export function AnnouncementBar() {
  const [visible, setVisible] = useState(false) // start false to avoid SSR flash
  const [activeIdx, setActiveIdx] = useState(0)
  const [fading, setFading] = useState(false)

  // Only show if not dismissed in this session
  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY)) return
    setVisible(true)
  }, [])

  // Rotate messages
  useEffect(() => {
    if (!visible) return
    const iv = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setActiveIdx((i) => (i + 1) % MESSAGES.length)
        setFading(false)
      }, 300)
    }, ROTATE_MS)
    return () => clearInterval(iv)
  }, [visible])

  if (!visible) return null

  return (
    <div
      className="w-full flex items-center justify-center gap-4 py-2.5 relative"
      style={{ background: "var(--color-brand-rose)" }}
    >
      {/* Message */}
      <p
        className="font-sans uppercase tracking-wide text-brand-ivory text-center transition-opacity duration-300 select-none"
        style={{ fontSize: "12px", opacity: fading ? 0 : 1 }}
      >
        {MESSAGES[activeIdx]}
      </p>

      {/* Dismiss */}
      <button
        onClick={() => {
          sessionStorage.setItem(DISMISS_KEY, "1")
          setVisible(false)
        }}
        aria-label="Dismiss announcement"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-ivory/70 hover:text-brand-ivory transition-colors leading-none"
        style={{ fontSize: "16px" }}
      >
        ×
      </button>
    </div>
  )
}
