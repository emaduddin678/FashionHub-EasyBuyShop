"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { X } from "lucide-react"
import { AuthLayout } from "@/components/storefront/auth/AuthLayout"
import { PasswordInput } from "@/components/storefront/auth/PasswordInput"
import { SocialLogin } from "@/components/storefront/auth/SocialLogin"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { loginUser } from "@/lib/store/authSlice"
import authApi from "@/lib/api/auth"
import { useRedirectIfAuthenticated } from "@/lib/hooks/useRedirectIfAuthenticated"

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

// ── Forgot Password panel — real email-link flow (backend has no OTP concept) ──

type ForgotStep = "email" | "sent"

function ForgotPanel({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<ForgotStep>("email")
  const [ident, setIdent] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSend() {
    setError("")
    setLoading(true)
    try {
      await authApi.forgetPassword(ident.trim())
      setStep("sent")
    } catch (err) {
      setError((err as Error).message || "Failed to send reset email")
    } finally {
      setLoading(false)
    }
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
            Enter your email — we&apos;ll send a link to reset your password.
          </p>
          <input
            type="email"
            value={ident}
            onChange={(e) => setIdent(e.target.value)}
            placeholder="email@example.com"
            style={inputStyle}
          />
          {error && (
            <p className="font-sans mt-2" style={{ fontSize: "12px", color: "var(--color-brand-rose)" }}>{error}</p>
          )}
          <button
            type="button"
            onClick={handleSend}
            disabled={!ident.trim() || loading}
            className="w-full mt-3 font-sans font-semibold text-sm rounded-full"
            style={{
              height: "42px",
              background: "var(--color-brand-rose)",
              color: "var(--color-brand-ivory)",
              border: "none",
              cursor: ident.trim() && !loading ? "pointer" : "not-allowed",
              opacity: ident.trim() && !loading ? 1 : 0.5,
            }}
          >
            {loading ? "Sending…" : "Send Reset Link →"}
          </button>
        </>
      )}

      {step === "sent" && (
        <>
          <p className="font-sans font-semibold text-sm" style={{ color: "var(--color-brand-charcoal)" }}>Check Your Email</p>
          <p className="font-sans mt-1" style={{ fontSize: "12px", color: "var(--color-brand-charcoal)", opacity: 0.6 }}>
            We&apos;ve sent a password reset link to <span style={{ fontWeight: 600 }}>{ident}</span>. The link expires in 10 minutes.
          </p>
        </>
      )}

      <button
        type="button"
        onClick={onClose}
        className="w-full mt-3 font-sans text-sm"
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
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const authStatus = useAppSelector((s) => s.auth.status)
  const { checking } = useRedirectIfAuthenticated()

  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [shake, setShake] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const loading = authStatus === "loading"

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type })
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    const result = await dispatch(loginUser({ email: identifier, password }))

    if (loginUser.fulfilled.match(result)) {
      const user = result.payload
      showToast(`Welcome back, ${user.firstName}!`, "success")
      setTimeout(() => router.push(searchParams.get("returnUrl") || "/account"), 900)
    } else {
      const msg = (result.payload as string) || "Invalid email or password. Please try again."
      setError(msg)
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  if (checking) {
    return (
      <AuthLayout mode="login">
        <div className="flex items-center justify-center py-24">
          <p className="font-sans text-sm" style={{ color: "var(--color-brand-charcoal)", opacity: 0.5 }}>Loading…</p>
        </div>
      </AuthLayout>
    )
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
            <FieldLabel required>Email Address</FieldLabel>
            <input
              type="email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="email@example.com"
              autoComplete="username"
              required
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
        {showForgot && <ForgotPanel onClose={() => setShowForgot(false)} />}

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
