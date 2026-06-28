import Link from "next/link"

interface AuthLayoutProps {
  children: React.ReactNode
  mode: "login" | "register"
}

export function AuthLayout({ children, mode }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex font-sans" style={{ background: "var(--color-brand-ivory)" }}>
      {/* ── Left decorative panel (45%) — desktop only ── */}
      <div
        className="hidden lg:flex flex-col justify-between flex-shrink-0"
        style={{ width: "45%", background: "var(--color-brand-rose)", position: "relative", overflow: "hidden" }}
      >
        {/* Botanical SVG pattern */}
        <svg
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.12 }}
          viewBox="0 0 500 700"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Large background ellipses */}
          <ellipse cx="80"  cy="120" rx="120" ry="60"  transform="rotate(-25 80 120)"  fill="white" />
          <ellipse cx="420" cy="580" rx="140" ry="70"  transform="rotate(15 420 580)" fill="white" />
          <ellipse cx="300" cy="250" rx="90"  ry="45"  transform="rotate(-40 300 250)" fill="white" />
          <ellipse cx="160" cy="500" rx="100" ry="50"  transform="rotate(20 160 500)"  fill="white" />
          <ellipse cx="460" cy="180" rx="80"  ry="40"  transform="rotate(-15 460 180)" fill="white" />
          <ellipse cx="50"  cy="650" rx="110" ry="55"  transform="rotate(30 50 650)"   fill="white" />
          {/* Stem curves */}
          <path d="M100 200 Q180 320 120 450 Q80 520 150 600" stroke="white" strokeWidth="2.5" fill="none" />
          <path d="M380 100 Q300 220 360 380 Q410 470 340 580" stroke="white" strokeWidth="2"   fill="none" />
          <path d="M250 50  Q200 180 260 300 Q310 400 240 520" stroke="white" strokeWidth="1.5" fill="none" />
          {/* Petal clusters */}
          <ellipse cx="100" cy="300" rx="18" ry="9"  transform="rotate(-50 100 300)"  fill="white" />
          <ellipse cx="115" cy="290" rx="18" ry="9"  transform="rotate(10 115 290)"   fill="white" />
          <ellipse cx="130" cy="308" rx="18" ry="9"  transform="rotate(60 130 308)"   fill="white" />
          <ellipse cx="370" cy="380" rx="22" ry="11" transform="rotate(-30 370 380)"  fill="white" />
          <ellipse cx="390" cy="368" rx="22" ry="11" transform="rotate(25 390 368)"   fill="white" />
          <ellipse cx="355" cy="368" rx="22" ry="11" transform="rotate(80 355 368)"   fill="white" />
          <ellipse cx="240" cy="520" rx="16" ry="8"  transform="rotate(-60 240 520)"  fill="white" />
          <ellipse cx="255" cy="510" rx="16" ry="8"  transform="rotate(5 255 510)"    fill="white" />
          <ellipse cx="225" cy="510" rx="16" ry="8"  transform="rotate(70 225 510)"   fill="white" />
          {/* Small dots */}
          <circle cx="180" cy="150" r="4" fill="white" />
          <circle cx="320" cy="440" r="5" fill="white" />
          <circle cx="70"  cy="420" r="3" fill="white" />
          <circle cx="440" cy="280" r="4" fill="white" />
        </svg>

        {/* Centered brand content */}
        <div className="flex-1 flex flex-col items-center justify-center px-12 relative z-10">
          <Link href="/" className="text-center">
            <p
              className="font-heading font-light"
              style={{ fontSize: "clamp(2.25rem, 3.5vw, 2.75rem)", color: "var(--color-brand-ivory)", lineHeight: 1.1, letterSpacing: "0.02em" }}
            >
              FashionHub
            </p>
          </Link>
          <p
            className="font-sans italic mt-4 text-center"
            style={{ fontSize: "15px", color: "var(--color-brand-ivory)", opacity: 0.8, maxWidth: "280px", lineHeight: 1.55 }}
          >
            &ldquo;Dress how you want to be addressed.&rdquo;
          </p>

          {/* Floating trust chips */}
          <div className="mt-12 space-y-3 w-full max-w-[240px]">
            {["50,000+ Happy Customers", "Authentic Brands Only", "Free Returns within 7 Days"].map((t) => (
              <div
                key={t}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.15)" }}
              >
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--color-brand-ivory)", flexShrink: 0 }} />
                <span className="font-sans" style={{ fontSize: "13px", color: "var(--color-brand-ivory)", opacity: 0.9 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom copyright */}
        <p
          className="text-center pb-8 font-sans relative z-10"
          style={{ fontSize: "11px", color: "var(--color-brand-ivory)", opacity: 0.4 }}
        >
          © 2026 FashionHub Bangladesh
        </p>
      </div>

      {/* ── Right form area (55%) ── */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top bar */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--color-border-light)" }}
        >
          <Link href="/" className="font-heading font-light" style={{ fontSize: "1.25rem", color: "var(--color-brand-charcoal)", letterSpacing: "0.02em" }}>
            FashionHub
          </Link>
          <Link
            href={mode === "login" ? "/account/register" : "/account/login"}
            className="font-sans text-sm"
            style={{ color: "var(--color-brand-rose)", fontWeight: 600 }}
          >
            {mode === "login" ? "Create Account →" : "Sign In →"}
          </Link>
        </div>

        {/* Centered form */}
        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
