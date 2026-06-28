"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { X, Check } from "lucide-react"
import { AuthLayout } from "@/components/storefront/auth/AuthLayout"
import { PasswordInput } from "@/components/storefront/auth/PasswordInput"
import { SocialLogin } from "@/components/storefront/auth/SocialLogin"

// ── Helpers ────────────────────────────────────────────────────────────────────

const BD_PHONE_RE = /^(\+8801|8801|01)[3-9]\d{8}$/
const EMAIL_RE    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

function FieldLabel({ children, required, optional }: { children: React.ReactNode; required?: boolean; optional?: boolean }) {
  return (
    <label
      className="block font-sans font-semibold mb-1.5 uppercase tracking-wide"
      style={{ fontSize: "11px", color: "var(--color-brand-charcoal)", opacity: 0.65 }}
    >
      {children}
      {required && <span style={{ color: "var(--color-brand-rose)" }}> *</span>}
      {optional && <span style={{ color: "var(--color-brand-charcoal)", opacity: 0.4, fontWeight: 400, textTransform: "none", letterSpacing: 0, fontSize: "11px" }}> (optional)</span>}
    </label>
  )
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return <p className="font-sans mt-1" style={{ fontSize: "12px", color: "var(--color-brand-rose)" }}>{msg}</p>
}

// ── Toast ──────────────────────────────────────────────────────────────────────

function Toast({ message, type, onDismiss }: { message: string; type: "success" | "error"; onDismiss: () => void }) {
  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 rounded-xl px-4 py-3 font-sans text-sm"
      style={{
        background: type === "success" ? "rgba(90,138,106,0.95)" : "rgba(198,147,132,0.95)",
        color: "var(--color-brand-ivory)",
        boxShadow: "0 8px 30px rgba(45,42,38,0.18)",
        maxWidth: "340px",
      }}
    >
      <span className="flex-1">{message}</span>
      <button type="button" onClick={onDismiss} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", opacity: 0.7, padding: 0 }}>
        <X size={14} />
      </button>
    </div>
  )
}

// ── Success screen ─────────────────────────────────────────────────────────────

function SuccessScreen({ name, onContinue }: { name: string; onContinue: () => void }) {
  return (
    <div className="text-center py-6">
      <div
        className="mx-auto mb-5 flex items-center justify-center"
        style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(90,138,106,0.12)" }}
      >
        <Check size={32} strokeWidth={2} style={{ color: "#5a8a6a" }} />
      </div>
      <h2
        className="font-heading font-light"
        style={{ fontSize: "clamp(1.75rem, 3vw, 2rem)", color: "var(--color-brand-charcoal)", lineHeight: 1.15, marginBottom: "8px" }}
      >
        Welcome, {name.split(" ")[0]}!
      </h2>
      <p className="font-sans mb-8" style={{ fontSize: "14px", color: "var(--color-brand-charcoal)", opacity: 0.6 }}>
        Your FashionHub account has been created.
      </p>
      <div className="space-y-3">
        <button
          type="button"
          onClick={onContinue}
          className="w-full font-sans font-semibold text-sm rounded-full"
          style={{ height: "50px", background: "var(--color-brand-rose)", color: "var(--color-brand-ivory)", border: "none", cursor: "pointer" }}
        >
          Start Shopping →
        </button>
        <Link
          href="/account"
          className="block w-full font-sans font-semibold text-sm rounded-full text-center"
          style={{ height: "50px", lineHeight: "50px", border: "1.5px solid var(--color-border)", color: "var(--color-brand-charcoal)" }}
        >
          Go to My Account
        </Link>
      </div>
    </div>
  )
}

// ── Checkbox ───────────────────────────────────────────────────────────────────

function Checkbox({
  checked,
  onChange,
  children,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  children: React.ReactNode
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer select-none">
      <div
        onClick={() => onChange(!checked)}
        style={{
          flexShrink: 0,
          marginTop: "2px",
          width: "18px",
          height: "18px",
          borderRadius: "4px",
          border: checked ? "none" : "1.5px solid var(--color-border)",
          background: checked ? "var(--color-brand-rose)" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "background 0.15s, border 0.15s",
        }}
      >
        {checked && <Check size={11} strokeWidth={3} style={{ color: "var(--color-brand-ivory)" }} />}
      </div>
      <span className="font-sans" style={{ fontSize: "13px", color: "var(--color-brand-charcoal)", opacity: 0.75 }}>
        {children}
      </span>
    </label>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────────

interface FormErrors {
  fullName?:    string
  phone?:       string
  email?:       string
  password?:    string
  confirmPwd?:  string
  terms?:       string
}

export default function RegisterPage() {
  const router = useRouter()

  const [fullName,    setFullName]    = useState("")
  const [phone,       setPhone]       = useState("")
  const [email,       setEmail]       = useState("")
  const [password,    setPassword]    = useState("")
  const [confirmPwd,  setConfirmPwd]  = useState("")
  const [dob,         setDob]         = useState("")
  const [terms,       setTerms]       = useState(false)
  const [newsletter,  setNewsletter]  = useState(true)
  const [loading,     setLoading]     = useState(false)
  const [errors,      setErrors]      = useState<FormErrors>({})
  const [success,     setSuccess]     = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type })
  }, [])

  function validate(): boolean {
    const e: FormErrors = {}
    if (fullName.trim().length < 2)            e.fullName   = "Please enter your full name"
    if (!BD_PHONE_RE.test(phone.replace(/[\s-]/g, ""))) e.phone = "Enter a valid Bangladesh phone number"
    if (email.trim() && !EMAIL_RE.test(email)) e.email      = "Enter a valid email address"
    if (password.length < 6)                   e.password   = "Password must be at least 6 characters"
    if (password !== confirmPwd)               e.confirmPwd = "Passwords don't match"
    if (!terms)                                e.terms      = "You must accept the Terms & Conditions"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    console.log("Register:", { fullName, phone, email, dob, newsletter })
    setLoading(false)
    setSuccess(true)
  }

  const pwdMatch = confirmPwd.length > 0 && password === confirmPwd

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}

      <AuthLayout mode="register">
        {success ? (
          <SuccessScreen name={fullName || "there"} onContinue={() => router.push("/")} />
        ) : (
          <>
            <h1
              className="font-heading font-light"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.125rem)", color: "var(--color-brand-charcoal)", lineHeight: 1.2, marginBottom: "6px" }}
            >
              Create Your Account
            </h1>
            <p className="font-sans mb-7" style={{ fontSize: "14px", color: "var(--color-brand-charcoal)", opacity: 0.6 }}>
              Join FashionHub and shop the latest looks.
            </p>

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Full Name */}
              <div>
                <FieldLabel required>Full Name</FieldLabel>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Rahim Uddin"
                  style={{ ...inputStyle, borderColor: errors.fullName ? "var(--color-brand-rose)" : "var(--color-border)" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = errors.fullName ? "var(--color-brand-rose)" : "var(--color-brand-charcoal)" }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = errors.fullName ? "var(--color-brand-rose)" : "var(--color-border)" }}
                />
                <FieldError msg={errors.fullName} />
              </div>

              {/* Phone */}
              <div>
                <FieldLabel required>Phone Number</FieldLabel>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  autoComplete="tel"
                  style={{ ...inputStyle, borderColor: errors.phone ? "var(--color-brand-rose)" : "var(--color-border)" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = errors.phone ? "var(--color-brand-rose)" : "var(--color-brand-charcoal)" }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = errors.phone ? "var(--color-brand-rose)" : "var(--color-border)" }}
                />
                <FieldError msg={errors.phone} />
              </div>

              {/* Email */}
              <div>
                <FieldLabel optional>Email Address</FieldLabel>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  autoComplete="email"
                  style={{ ...inputStyle, borderColor: errors.email ? "var(--color-brand-rose)" : "var(--color-border)" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = errors.email ? "var(--color-brand-rose)" : "var(--color-brand-charcoal)" }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = errors.email ? "var(--color-brand-rose)" : "var(--color-border)" }}
                />
                <FieldError msg={errors.email} />
              </div>

              {/* Password */}
              <PasswordInput
                label="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                autoComplete="new-password"
                showStrength
                error={errors.password}
              />

              {/* Confirm Password */}
              <div>
                <FieldLabel required>Confirm Password</FieldLabel>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                    style={{
                      ...inputStyle,
                      borderColor: errors.confirmPwd
                        ? "var(--color-brand-rose)"
                        : confirmPwd && pwdMatch
                        ? "#5a8a6a"
                        : "var(--color-border)",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = errors.confirmPwd ? "var(--color-brand-rose)" : "var(--color-brand-charcoal)" }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = errors.confirmPwd
                        ? "var(--color-brand-rose)"
                        : confirmPwd && pwdMatch ? "#5a8a6a" : "var(--color-border)"
                    }}
                  />
                  {confirmPwd && (
                    <div
                      style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)" }}
                    >
                      {pwdMatch
                        ? <Check size={15} style={{ color: "#5a8a6a" }} />
                        : <X size={15} style={{ color: "var(--color-brand-rose)" }} />}
                    </div>
                  )}
                </div>
                {confirmPwd && (
                  <p className="font-sans mt-1" style={{ fontSize: "12px", color: pwdMatch ? "#5a8a6a" : "var(--color-brand-rose)" }}>
                    {pwdMatch ? "Passwords match" : "Passwords don't match"}
                  </p>
                )}
                <FieldError msg={errors.confirmPwd} />
              </div>

              {/* Date of Birth */}
              <div>
                <FieldLabel optional>Date of Birth</FieldLabel>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  style={{ ...inputStyle }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-brand-charcoal)" }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-border)" }}
                />
                <p className="font-sans mt-1" style={{ fontSize: "11px", color: "var(--color-brand-charcoal)", opacity: 0.45 }}>
                  Get a special birthday offer from us.
                </p>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 pt-1">
                <Checkbox checked={terms} onChange={setTerms}>
                  I agree to the{" "}
                  <Link href="/terms" target="_blank" style={{ color: "var(--color-brand-rose)", fontWeight: 600 }}>
                    Terms &amp; Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" target="_blank" style={{ color: "var(--color-brand-rose)", fontWeight: 600 }}>
                    Privacy Policy
                  </Link>
                  <span style={{ color: "var(--color-brand-rose)" }}> *</span>
                </Checkbox>
                {errors.terms && <FieldError msg={errors.terms} />}

                <Checkbox checked={newsletter} onChange={setNewsletter}>
                  Sign me up for new arrival &amp; offer emails
                </Checkbox>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !terms}
                className="w-full font-sans font-semibold text-sm rounded-full flex items-center justify-center gap-2 transition-colors"
                style={{
                  height: "50px",
                  marginTop: "8px",
                  background: loading || !terms ? "var(--color-brand-mauve)" : "var(--color-brand-rose)",
                  color: "var(--color-brand-ivory)",
                  border: "none",
                  cursor: loading || !terms ? "not-allowed" : "pointer",
                  opacity: !terms && !loading ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!loading && terms) (e.currentTarget as HTMLButtonElement).style.background = "var(--color-brand-mauve)"
                }}
                onMouseLeave={(e) => {
                  if (!loading && terms) (e.currentTarget as HTMLButtonElement).style.background = "var(--color-brand-rose)"
                }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Creating Account…
                  </>
                ) : (
                  "Create Account →"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1" style={{ height: "1px", background: "var(--color-border-light)" }} />
              <span className="font-sans" style={{ fontSize: "11px", color: "var(--color-brand-charcoal)", opacity: 0.45 }}>or continue with</span>
              <div className="flex-1" style={{ height: "1px", background: "var(--color-border-light)" }} />
            </div>

            <SocialLogin onToast={(m) => showToast(m)} />

            <p className="font-sans text-center mt-5" style={{ fontSize: "13px", color: "var(--color-brand-charcoal)", opacity: 0.6 }}>
              Already have an account?{" "}
              <Link href="/account/login" style={{ color: "var(--color-brand-rose)", fontWeight: 600 }}>
                Sign In →
              </Link>
            </p>
          </>
        )}
      </AuthLayout>
    </>
  )
}
