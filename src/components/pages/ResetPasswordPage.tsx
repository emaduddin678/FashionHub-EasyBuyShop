"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthLayout } from "@/components/storefront/auth/AuthLayout"
import { PasswordInput } from "@/components/storefront/auth/PasswordInput"
import authApi from "@/lib/api/auth"

export default function ResetPasswordPage({ token }: { token: string }) {
  const router = useRouter()
  const [newPass, setNewPass] = useState("")
  const [confirmPass, setConfirmPass] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (newPass.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (newPass !== confirmPass) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)
    try {
      await authApi.resetPassword(token, newPass)
      setSuccess(true)
      setTimeout(() => router.push("/account/login"), 2000)
    } catch (err) {
      setError((err as Error).message || "Failed to reset password. The link may have expired.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <AuthLayout mode="login">
        <div className="text-center py-8">
          <div
            className="mx-auto mb-5 flex items-center justify-center"
            style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(90,138,106,0.12)" }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#5a8a6a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="font-heading font-light" style={{ fontSize: "1.75rem", color: "var(--color-brand-charcoal)" }}>
            Password Updated!
          </h2>
          <p className="font-sans mt-2" style={{ fontSize: "14px", color: "var(--color-brand-charcoal)", opacity: 0.6 }}>
            Redirecting you to sign in…
          </p>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout mode="login">
      <h1 className="font-heading font-light" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.125rem)", color: "var(--color-brand-charcoal)", marginBottom: "6px" }}>
        Set New Password
      </h1>
      <p className="font-sans mb-7" style={{ fontSize: "14px", color: "var(--color-brand-charcoal)", opacity: 0.6 }}>
        Choose a new password for your account.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordInput
          label="New Password"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          showStrength
        />
        <PasswordInput
          label="Confirm New Password"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
          placeholder="Re-enter new password"
          autoComplete="new-password"
        />

        {error && (
          <div
            className="rounded-xl px-4 py-3 font-sans text-sm"
            style={{ background: "rgba(198,147,132,0.1)", border: "1px solid rgba(198,147,132,0.3)", color: "var(--color-brand-rose)" }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full font-sans font-semibold text-sm rounded-full transition-colors"
          style={{
            height: "50px",
            marginTop: "8px",
            background: loading ? "var(--color-brand-mauve)" : "var(--color-brand-rose)",
            color: "var(--color-brand-ivory)",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Updating…" : "Update Password →"}
        </button>
      </form>
    </AuthLayout>
  )
}
