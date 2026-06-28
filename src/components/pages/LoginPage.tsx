"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"
import { AuthLayout } from "@/components/storefront/auth/AuthLayout"
import { PasswordInput } from "@/components/storefront/auth/PasswordInput"
import { SocialLogin } from "@/components/storefront/auth/SocialLogin"

// ── Shared input style ─────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
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

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label
      className="block font-sans font-semibold mb-1.5 uppercase tracking-wide"
      style={{ fontSize: "11px", color: "var(--color-brand-charcoal)", opacity: 0.65 }}
    >
      {children}
      {required && <span style={{ color: "var(--color-brand-rose)" }}> *</span>}
    </label>
  )
}

// ── Toast ──────────────────────────────────────────────────────────────────────

function Toast({ message, type, onDismiss }: { message: string; type: "success" | "error"; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 rounded-xl px-4 py-3 font-sans text-sm"
      style={{
        background: type === "success" ? "rgba(90,138,106,0.95)" : "rgba(198,147,132,0.95)",
        color: "var(--color-brand-ivory)",
        boxShadow: "0 8px 30px rgba(45,42,38,0.18)",
        maxWidth: "340px",
        backdropFilter: "blur(8px)",
      }}
    >
      <span className="flex-1">{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", opacity: 0.7, padding: 0 }}
      >
        <X size={14} />
      </button>
    </div>
  )
}

// ── Forgot Password flow ───────────────────────────────────────────────────────

type ForgotStep = "idle" | "email" | "otp" | "newpass"

function ForgotPanel({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [step, setStep]       = useState<ForgotStep>("email")
  const [ident, setIdent]     = useState("")
  const [otp, setOtp]         = useState(["", "", "", "", "", ""])
  const [newPass, setNewPass] = useState("")
  const [confPass, setConf]   = useState("")
  const otpRefs               = useRef<(HTMLInputElement | null)[]>([])

  function handleOtpChange(i: number, v: string) {
    if (!/^\d?$/.test(v)) return
    const next = [...otp]; next[i] = v; setOtp(next)
    if (v && i < 5) otpRefs.current[i + 1]?.focus()
  }
  function handleOtpKey(i: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus()
  }

  return (
    <div
      className="mt-5 rounded-xl p-5"
      style={{ background: "var(--color-brand-beige)", border: "1px solid var(--color-border-light)" }}
    >
      {step === "email" && (
        <>
          <p className="font-sans font-semibold text-sm" style={{ color: "var(--color-brand-charcoal)" }}>Reset Password</p>
          <p className="font-sans mt-1 mb-4" style={{ fontSize: "12px", color: "var(--color-brand-charcoal)", opacity: 0.6 }}>
            Enter your phone or email — we&apos;ll send a reset code.
          </p>
          <input
            type="text"
            value={ident}
            onChange={(e) => setIdent(e.target.value)}
            placeholder="Phone or email"
            style={inputStyle}
          />
          <button
            type="button"
            onClick={() => { if (ident.trim()) setStep("otp") }}
            disabled={!ident.trim()}
            className="w-full mt-3 font-sans font-semibold text-sm rounded-full"
            style={{
              height: "42px",
              background: "var(--color-brand-rose)",
              color: "var(--color-brand-ivory)",
              border: "none",
              cursor: ident.trim() ? "pointer" : "not-allowed",
              opacity: ident.trim() ? 1 : 0.5,
            }}
          >
            Send Reset Code →
          </button>
        </>
      )}

      {step === "otp" && (
        <>
          <p className="font-sans text-sm mb-3" style={{ color: "var(--color-brand-charcoal)", opacity: 0.7 }}>
            Enter the 6-digit code sent to your phone.
          </p>
          <div className="flex gap-2 justify-center">
            {otp.map((d, i) => (
              <input
                key={i}
                ref={(el) => { otpRefs.current[i] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKey(i, e)}
                style={{
                  width: "40px", height: "44px",
                  border: "1.5px solid var(--color-border)",
                  borderRadius: "8px",
                  textAlign: "center",
                  fontSize: "18px",
                  fontWeight: 700,
                  fontFamily: "var(--font-sans, sans-serif)",
                  background: "var(--color-brand-ivory)",
                  color: "var(--color-brand-charcoal)",
                  outline: "none",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-brand-rose)" }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-border)" }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setStep("newpass")}
            className="w-full mt-4 font-sans font-semibold text-sm rounded-full"
            style={{ height: "42px", background: "var(--color-brand-rose)", color: "var(--color-brand-ivory)", border: "none", cursor: "pointer" }}
          >
            Verify Code →
          </button>
        </>
      )}

      {step === "newpass" && (
        <>
          <p className="font-sans font-semibold text-sm mb-4" style={{ color: "var(--color-brand-charcoal)" }}>Set New Password</p>
          <div className="space-y-3">
            <PasswordInput value={newPass} onChange={(e) => setNewPass(e.target.value)} label="New Password" autoComplete="new-password" />
            <PasswordInput value={confPass} onChange={(e) => setConf(e.target.value)} label="Confirm Password" autoComplete="new-password" />
          </div>
          <button
            type="button"
            onClick={() => { onSuccess(); onClose() }}
            disabled={!newPass || newPass !== confPass}
            className="w-full mt-4 font-sans font-semibold text-sm rounded-full"
            style={{
              height: "42px",
              background: "var(--color-brand-rose)",
              color: "var(--color-brand-ivory)",
              border: "none",
              cursor: !newPass || newPass !== confPass ? "not-allowed" : "pointer",
              opacity: !newPass || newPass !== confPass ? 0.5 : 1,
            }}
          >
            Update Password →
          </button>
        </>
      )}

      <button
        type="button"
        onClick={onClose}
        className="w-full mt-2 font-sans text-sm"
        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-brand-charcoal)", opacity: 0.5 }}
      >
        ← Back to Sign In
      </button>
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState("")
  const [password,   setPassword]   = useState("")
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState("")
  const [shake,      setShake]      = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type })
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))

    const valid = identifier.trim() && password.trim()
    if (valid) {
      showToast("Welcome back! Signing you in…", "success")
      setTimeout(() => router.push("/account"), 1200)
    } else {
      setError("Please check your phone/email and password.")
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
    setLoading(false)
  }

  return (
    <>
      <style>{`
        @keyframes fh-shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-6px)}
          40%{transform:translateX(6px)}
          60%{transform:translateX(-4px)}
          80%{transform:translateX(4px)}
        }
      `}</style>

      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}

      <AuthLayout mode="login">
        {/* Heading */}
        <h1
          className="font-heading font-light"
          style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.125rem)", color: "var(--color-brand-charcoal)", lineHeight: 1.2, marginBottom: "6px" }}
        >
          Welcome Back
        </h1>
        <p
          className="font-sans mb-8"
          style={{ fontSize: "14px", color: "var(--color-brand-charcoal)", opacity: 0.6 }}
        >
          Sign in to your FashionHub account.
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Identifier */}
          <div>
            <FieldLabel required>Phone Number or Email</FieldLabel>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="01XXXXXXXXX or email@example.com"
              autoComplete="username"
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-brand-charcoal)" }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-border)" }}
            />
          </div>

          {/* Password */}
          <div>
            <PasswordInput
              label="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            {/* Forgot password link */}
            <div className="flex justify-end mt-1.5">
              <button
                type="button"
                onClick={() => setShowForgot((v) => !v)}
                className="font-sans text-xs"
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-brand-rose)", fontWeight: 600 }}
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              className="rounded-xl px-4 py-3 font-sans text-sm"
              style={{
                background: "rgba(198,147,132,0.1)",
                border: "1px solid rgba(198,147,132,0.3)",
                color: "var(--color-brand-rose)",
                animation: shake ? "fh-shake 0.5s ease" : "none",
              }}
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full font-sans font-semibold text-sm rounded-full flex items-center justify-center gap-2 transition-colors"
            style={{
              height: "50px",
              marginTop: "8px",
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
                <svg className="animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Signing in…
              </>
            ) : (
              "Sign In →"
            )}
          </button>
        </form>

        {/* Forgot password panel */}
        {showForgot && (
          <ForgotPanel
            onClose={() => setShowForgot(false)}
            onSuccess={() => showToast("Password updated. Please sign in again.", "success")}
          />
        )}

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1" style={{ height: "1px", background: "var(--color-border-light)" }} />
          <span className="font-sans" style={{ fontSize: "11px", color: "var(--color-brand-charcoal)", opacity: 0.45 }}>or continue with</span>
          <div className="flex-1" style={{ height: "1px", background: "var(--color-border-light)" }} />
        </div>

        <SocialLogin onToast={(m) => showToast(m, "success")} />

        <p className="font-sans text-center mt-6" style={{ fontSize: "13px", color: "var(--color-brand-charcoal)", opacity: 0.6 }}>
          Don&apos;t have an account?{" "}
          <Link href="/account/register" style={{ color: "var(--color-brand-rose)", fontWeight: 600 }}>
            Create one →
          </Link>
        </p>
      </AuthLayout>
    </>
  )
}
