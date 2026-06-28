"use client"

import { useState } from "react"
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar"
import { Header } from "@/components/storefront/Header"
import { Footer } from "@/components/storefront/Footer"
import { WhatsAppFloat } from "@/components/storefront/WhatsAppFloat"
import { ChevronDown, ChevronUp } from "lucide-react"

const TABS = ["Tops & Kurtas", "Bottoms & Pants", "Dresses & Suits", "Sarees"] as const
type Tab = (typeof TABS)[number]

const topsData = [
  { size: "XS",  bust: "76–80",   waist: "60–64",  hip: "84–88",    length: "38–40", uk: "6"  },
  { size: "S",   bust: "81–85",   waist: "65–69",  hip: "89–93",    length: "40–42", uk: "8"  },
  { size: "M",   bust: "86–90",   waist: "70–74",  hip: "94–98",    length: "42–44", uk: "10" },
  { size: "L",   bust: "91–96",   waist: "75–80",  hip: "99–104",   length: "44–46", uk: "12" },
  { size: "XL",  bust: "97–102",  waist: "81–86",  hip: "105–110",  length: "46–48", uk: "14" },
  { size: "XXL", bust: "103–110", waist: "87–94",  hip: "111–118",  length: "48–50", uk: "16" },
]

const bottomsData = [
  { size: "XS",  waist: "60–64", hip: "84–88",   inseam: "73–75", rise: "23–24" },
  { size: "S",   waist: "65–69", hip: "89–93",   inseam: "75–77", rise: "24–25" },
  { size: "M",   waist: "70–74", hip: "94–98",   inseam: "77–79", rise: "25–26" },
  { size: "L",   waist: "75–80", hip: "99–104",  inseam: "79–81", rise: "26–27" },
  { size: "XL",  waist: "81–86", hip: "105–110", inseam: "81–83", rise: "27–28" },
  { size: "XXL", waist: "87–94", hip: "111–118", inseam: "83–85", rise: "28–29" },
]

const dressesData = [
  { size: "XS",  bust: "76–80",   waist: "60–64", hip: "84–88",   length: "90–94"   },
  { size: "S",   bust: "81–85",   waist: "65–69", hip: "89–93",   length: "94–98"   },
  { size: "M",   bust: "86–90",   waist: "70–74", hip: "94–98",   length: "98–102"  },
  { size: "L",   bust: "91–96",   waist: "75–80", hip: "99–104",  length: "102–106" },
  { size: "XL",  bust: "97–102",  waist: "81–86", hip: "105–110", length: "106–110" },
  { size: "XXL", bust: "103–110", waist: "87–94", hip: "111–118", length: "110–114" },
]

const brandNotes = [
  { brand: "Aarong", note: "Aarong kurtas run true to size. Measure your bust and match against our chart for the best fit." },
  { brand: "Yellow", note: "Yellow sizes run slightly fitted. Consider going one size up if you prefer a relaxed or layered look." },
  { brand: "Sapphire", note: "Pakistani sizing — Sapphire tends to run slightly large. Go half a size down for the Bangladeshi standard equivalent." },
  { brand: "Sana Safinaz", note: "Sana Safinaz follows Pakistani sizing charts. S/M/L may differ from BD standard by 1–2 cm in the bust." },
  { brand: "Gul Ahmed", note: "Gul Ahmed unstitched suits come in one size — fabric is cut and tailored by you. Refer to the fabric yardage to confirm it suits your measurements." },
]

function TableHeader({ cols }: { cols: string[] }) {
  return (
    <thead>
      <tr>
        {cols.map((col, i) => (
          <th
            key={col}
            className="py-3 px-4 text-left text-xs font-semibold tracking-wide"
            style={{
              background: "var(--color-brand-rose)",
              color: "#fff",
              borderRadius: i === 0 ? "8px 0 0 8px" : i === cols.length - 1 ? "0 8px 8px 0" : 0,
            }}
          >
            {col}
          </th>
        ))}
      </tr>
    </thead>
  )
}

export default function SizeGuidePage() {
  const [activeTab, setActiveTab] = useState<Tab>("Tops & Kurtas")
  const [openBrand, setOpenBrand] = useState<string | null>(null)

  return (
    <div className="min-h-screen font-sans" style={{ background: "var(--color-brand-ivory)" }}>
      <AnnouncementBar />
      <Header />

      <main className="max-w-3xl mx-auto px-5 py-16">
        {/* Heading */}
        <div className="mb-10 text-center">
          <h1
            className="font-heading mb-3"
            style={{
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              color: "var(--color-brand-charcoal)",
              letterSpacing: "-0.01em",
            }}
          >
            Size Guide
          </h1>
          <p style={{ fontSize: 15, color: "var(--color-brand-charcoal)", opacity: 0.6 }}>
            Find your perfect fit. All measurements are in centimetres (cm) unless noted.
          </p>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 mb-8 rounded-xl p-1"
          style={{ background: "var(--color-brand-beige)", border: "1px solid var(--color-border-light)" }}
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all"
              style={{
                background: activeTab === tab ? "#fff" : "transparent",
                color: activeTab === tab ? "var(--color-brand-charcoal)" : "var(--color-brand-charcoal)",
                opacity: activeTab === tab ? 1 : 0.55,
                boxShadow: activeTab === tab ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                fontWeight: activeTab === tab ? 600 : 400,
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tables */}
        {activeTab === "Tops & Kurtas" && (
          <div
            className="rounded-xl overflow-hidden mb-8"
            style={{ border: "1px solid var(--color-border)", background: "#fff" }}
          >
            <div className="px-6 pt-5 pb-1">
              <h2 className="font-heading text-xl mb-4" style={{ color: "var(--color-brand-charcoal)" }}>
                Tops &amp; Kurtas — cm
              </h2>
            </div>
            <div className="overflow-x-auto px-6 pb-6">
              <table className="w-full text-sm">
                <TableHeader cols={["Size", "Bust (cm)", "Waist (cm)", "Hip (cm)", "Length (cm)", "UK Size"]} />
                <tbody>
                  {topsData.map((row, i) => (
                    <tr
                      key={row.size}
                      style={{ background: i % 2 === 0 ? "#fff" : "var(--color-brand-beige)" }}
                    >
                      <td className="py-3 px-4 font-semibold" style={{ color: "var(--color-brand-charcoal)" }}>{row.size}</td>
                      <td className="py-3 px-4" style={{ color: "var(--color-brand-charcoal)", opacity: 0.75 }}>{row.bust}</td>
                      <td className="py-3 px-4" style={{ color: "var(--color-brand-charcoal)", opacity: 0.75 }}>{row.waist}</td>
                      <td className="py-3 px-4" style={{ color: "var(--color-brand-charcoal)", opacity: 0.75 }}>{row.hip}</td>
                      <td className="py-3 px-4" style={{ color: "var(--color-brand-charcoal)", opacity: 0.75 }}>{row.length}</td>
                      <td className="py-3 px-4" style={{ color: "var(--color-brand-charcoal)", opacity: 0.75 }}>{row.uk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "Bottoms & Pants" && (
          <div
            className="rounded-xl overflow-hidden mb-8"
            style={{ border: "1px solid var(--color-border)", background: "#fff" }}
          >
            <div className="px-6 pt-5 pb-1">
              <h2 className="font-heading text-xl mb-4" style={{ color: "var(--color-brand-charcoal)" }}>
                Bottoms &amp; Pants — cm
              </h2>
            </div>
            <div className="overflow-x-auto px-6 pb-6">
              <table className="w-full text-sm">
                <TableHeader cols={["Size", "Waist (cm)", "Hip (cm)", "Inseam (cm)", "Rise (cm)"]} />
                <tbody>
                  {bottomsData.map((row, i) => (
                    <tr
                      key={row.size}
                      style={{ background: i % 2 === 0 ? "#fff" : "var(--color-brand-beige)" }}
                    >
                      <td className="py-3 px-4 font-semibold" style={{ color: "var(--color-brand-charcoal)" }}>{row.size}</td>
                      <td className="py-3 px-4" style={{ color: "var(--color-brand-charcoal)", opacity: 0.75 }}>{row.waist}</td>
                      <td className="py-3 px-4" style={{ color: "var(--color-brand-charcoal)", opacity: 0.75 }}>{row.hip}</td>
                      <td className="py-3 px-4" style={{ color: "var(--color-brand-charcoal)", opacity: 0.75 }}>{row.inseam}</td>
                      <td className="py-3 px-4" style={{ color: "var(--color-brand-charcoal)", opacity: 0.75 }}>{row.rise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "Dresses & Suits" && (
          <div
            className="rounded-xl overflow-hidden mb-8"
            style={{ border: "1px solid var(--color-border)", background: "#fff" }}
          >
            <div className="px-6 pt-5 pb-1">
              <h2 className="font-heading text-xl mb-4" style={{ color: "var(--color-brand-charcoal)" }}>
                Dresses &amp; Suits — cm
              </h2>
            </div>
            <div className="overflow-x-auto px-6 pb-6">
              <table className="w-full text-sm">
                <TableHeader cols={["Size", "Bust (cm)", "Waist (cm)", "Hip (cm)", "Length (cm)"]} />
                <tbody>
                  {dressesData.map((row, i) => (
                    <tr
                      key={row.size}
                      style={{ background: i % 2 === 0 ? "#fff" : "var(--color-brand-beige)" }}
                    >
                      <td className="py-3 px-4 font-semibold" style={{ color: "var(--color-brand-charcoal)" }}>{row.size}</td>
                      <td className="py-3 px-4" style={{ color: "var(--color-brand-charcoal)", opacity: 0.75 }}>{row.bust}</td>
                      <td className="py-3 px-4" style={{ color: "var(--color-brand-charcoal)", opacity: 0.75 }}>{row.waist}</td>
                      <td className="py-3 px-4" style={{ color: "var(--color-brand-charcoal)", opacity: 0.75 }}>{row.hip}</td>
                      <td className="py-3 px-4" style={{ color: "var(--color-brand-charcoal)", opacity: 0.75 }}>{row.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "Sarees" && (
          <div
            className="rounded-xl overflow-hidden mb-8"
            style={{ border: "1px solid var(--color-border)", background: "#fff" }}
          >
            <div className="px-6 pt-5 pb-1">
              <h2 className="font-heading text-xl mb-4" style={{ color: "var(--color-brand-charcoal)" }}>
                Sarees
              </h2>
            </div>
            <div className="overflow-x-auto px-6 pb-4">
              <table className="w-full text-sm">
                <TableHeader cols={["Type", "Length", "Blouse Length", "Notes"]} />
                <tbody>
                  {[
                    { type: "Standard", length: "5.5 yards", blouse: "17–19 in", notes: "Fall & petticoat sold separately" },
                    { type: "Plus Size", length: "6 yards",   blouse: "20–22 in", notes: "Fall & petticoat sold separately" },
                    { type: "Dupatta",   length: "2.5 yards", blouse: "—",        notes: "Blouse fabric usually included" },
                  ].map((row, i) => (
                    <tr
                      key={row.type}
                      style={{ background: i % 2 === 0 ? "#fff" : "var(--color-brand-beige)" }}
                    >
                      <td className="py-3 px-4 font-semibold" style={{ color: "var(--color-brand-charcoal)" }}>{row.type}</td>
                      <td className="py-3 px-4" style={{ color: "var(--color-brand-charcoal)", opacity: 0.75 }}>{row.length}</td>
                      <td className="py-3 px-4" style={{ color: "var(--color-brand-charcoal)", opacity: 0.75 }}>{row.blouse}</td>
                      <td className="py-3 px-4 text-xs" style={{ color: "var(--color-brand-charcoal)", opacity: 0.55 }}>{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="px-6 pb-5 text-xs" style={{ color: "var(--color-brand-charcoal)", opacity: 0.45 }}>
              Saree blouse sizing is approximate — tailoring is recommended for the best fit.
            </p>
          </div>
        )}

        {/* How to Measure */}
        <div
          className="rounded-xl p-6 mb-8"
          style={{ border: "1.5px solid var(--color-border-light)", background: "var(--color-brand-beige)" }}
        >
          <h2 className="font-heading text-xl mb-5" style={{ color: "var(--color-brand-charcoal)" }}>
            How to Measure
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                point: "Bust",
                icon: (
                  <svg viewBox="0 0 60 60" width="48" height="48" fill="none">
                    <ellipse cx="30" cy="30" rx="22" ry="14" stroke="var(--color-brand-rose)" strokeWidth="2" />
                    <line x1="8" y1="30" x2="52" y2="30" stroke="var(--color-brand-rose)" strokeWidth="1.5" strokeDasharray="3 2" />
                    <circle cx="8" cy="30" r="2.5" fill="var(--color-brand-rose)" />
                    <circle cx="52" cy="30" r="2.5" fill="var(--color-brand-rose)" />
                  </svg>
                ),
                desc: "Measure around the fullest part of your chest, keeping the tape parallel to the floor.",
              },
              {
                point: "Waist",
                icon: (
                  <svg viewBox="0 0 60 60" width="48" height="48" fill="none">
                    <ellipse cx="30" cy="30" rx="14" ry="10" stroke="var(--color-brand-rose)" strokeWidth="2" />
                    <line x1="16" y1="30" x2="44" y2="30" stroke="var(--color-brand-rose)" strokeWidth="1.5" strokeDasharray="3 2" />
                    <circle cx="16" cy="30" r="2.5" fill="var(--color-brand-rose)" />
                    <circle cx="44" cy="30" r="2.5" fill="var(--color-brand-rose)" />
                  </svg>
                ),
                desc: "Measure around your natural waistline — the narrowest part of your torso, usually above your navel.",
              },
              {
                point: "Hip",
                icon: (
                  <svg viewBox="0 0 60 60" width="48" height="48" fill="none">
                    <ellipse cx="30" cy="34" rx="24" ry="16" stroke="var(--color-brand-rose)" strokeWidth="2" />
                    <line x1="6" y1="34" x2="54" y2="34" stroke="var(--color-brand-rose)" strokeWidth="1.5" strokeDasharray="3 2" />
                    <circle cx="6" cy="34" r="2.5" fill="var(--color-brand-rose)" />
                    <circle cx="54" cy="34" r="2.5" fill="var(--color-brand-rose)" />
                  </svg>
                ),
                desc: "Measure around the fullest part of your hips and seat, usually 18–23 cm below your natural waist.",
              },
              {
                point: "Length",
                icon: (
                  <svg viewBox="0 0 60 60" width="48" height="48" fill="none">
                    <line x1="30" y1="6" x2="30" y2="54" stroke="var(--color-brand-rose)" strokeWidth="2" strokeDasharray="4 3" />
                    <circle cx="30" cy="6"  r="3" fill="var(--color-brand-rose)" />
                    <circle cx="30" cy="54" r="3" fill="var(--color-brand-rose)" />
                    <line x1="22" y1="6"  x2="38" y2="6"  stroke="var(--color-brand-rose)" strokeWidth="1.5" />
                    <line x1="22" y1="54" x2="38" y2="54" stroke="var(--color-brand-rose)" strokeWidth="1.5" />
                  </svg>
                ),
                desc: "Measure from your shoulder seam down to your desired hemline. For kurtas, this is typically 95–110 cm.",
              },
            ].map(({ point, icon, desc }) => (
              <div
                key={point}
                className="flex items-start gap-4 p-4 rounded-xl"
                style={{ background: "#fff", border: "1px solid var(--color-border)" }}
              >
                <div className="shrink-0">{icon}</div>
                <div>
                  <p className="font-semibold text-sm mb-1" style={{ color: "var(--color-brand-charcoal)" }}>
                    {point}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--color-brand-charcoal)", opacity: 0.65 }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div
            className="mt-5 rounded-lg px-4 py-3 text-sm"
            style={{ background: "rgba(200,140,150,0.12)", border: "1px solid var(--color-brand-rose)", color: "var(--color-brand-charcoal)" }}
          >
            <strong>Tip:</strong> Use a soft measuring tape. If you&apos;re between sizes, go up one size for comfort. Our charts are in cm.
          </div>
        </div>

        {/* Brand sizing notes */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--color-border)", background: "#fff" }}
        >
          <div className="px-6 pt-5 pb-3">
            <h2 className="font-heading text-xl" style={{ color: "var(--color-brand-charcoal)" }}>
              Sizing Notes by Brand
            </h2>
          </div>
          <div className="px-4 pb-4 space-y-2">
            {brandNotes.map(({ brand, note }) => (
              <div
                key={brand}
                className="rounded-xl overflow-hidden"
                style={{ border: "1px solid var(--color-border-light)" }}
              >
                <button
                  onClick={() => setOpenBrand(openBrand === brand ? null : brand)}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-left"
                >
                  <span className="font-medium text-sm" style={{ color: "var(--color-brand-charcoal)" }}>
                    {brand}
                  </span>
                  {openBrand === brand ? (
                    <ChevronUp size={15} style={{ color: "var(--color-brand-rose)", flexShrink: 0 }} />
                  ) : (
                    <ChevronDown size={15} style={{ color: "var(--color-brand-charcoal)", opacity: 0.4, flexShrink: 0 }} />
                  )}
                </button>
                {openBrand === brand && (
                  <div
                    className="px-5 pb-4 text-sm leading-relaxed"
                    style={{
                      color: "var(--color-brand-charcoal)",
                      opacity: 0.7,
                      background: "var(--color-brand-beige)",
                      borderTop: "1px solid var(--color-border-light)",
                    }}
                  >
                    {note}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
