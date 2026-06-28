"use client"

import { useState, useRef } from "react"
import { Eye, EyeOff } from "lucide-react"

interface PasswordInputProps {
  id?: string
  name?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  label?: string
  required?: boolean
  showStrength?: boolean
  error?: string
  className?: string
  autoComplete?: string
}

function getStrength(password: string): { score: 0 | 1 | 2 | 3; label: string } {
  if (password.length === 0) return { score: 0, label: "" }
  let score = 0
  if (password.length >= 6) score++
  if (password.length >= 10) score++
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++
  if (score <= 1) return { score: 1, label: "Weak" }
  if (score <= 2) return { score: 2, label: "Fair" }
  return { score: 3, label: "Strong" }
}

const STRENGTH_COLORS: Record<number, string> = {
  1: "var(--color-brand-rose)",
  2: "#d4a644",
  3: "#5a8a6a",
}

export function PasswordInput({
  id,
  name,
  value,
  onChange,
  placeholder = "Enter password",
  label,
  required,
  showStrength = false,
  error,
  className = "",
  autoComplete,
}: PasswordInputProps) {
  const [show, setShow] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const strength = showStrength ? getStrength(value) : null

  const borderColor = error
    ? "var(--color-brand-rose)"
    : "var(--color-border)"

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="block font-sans font-semibold mb-1.5 uppercase tracking-wide"
          style={{ fontSize: "11px", color: "var(--color-brand-charcoal)", opacity: 0.65 }}
        >
          {label}
          {required && <span style={{ color: "var(--color-brand-rose)" }}> *</span>}
        </label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          name={name}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          style={{
            width: "100%",
            height: "44px",
            border: `1px solid ${borderColor}`,
            borderRadius: "10px",
            padding: "0 44px 0 14px",
            fontSize: "14px",
            fontFamily: "var(--font-sans, sans-serif)",
            background: "var(--color-brand-ivory)",
            color: "var(--color-brand-charcoal)",
            outline: "none",
            transition: "border-color 0.15s",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = error ? "var(--color-brand-rose)" : "var(--color-brand-charcoal)" }}
          onBlur={(e) => { e.currentTarget.style.borderColor = borderColor }}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide password" : "Show password"}
          style={{
            position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer",
            color: "var(--color-brand-charcoal)", opacity: 0.4,
            display: "flex", alignItems: "center",
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.8" }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.4" }}
        >
          {show ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>

      {error && (
        <p className="font-sans mt-1" style={{ fontSize: "12px", color: "var(--color-brand-rose)" }}>{error}</p>
      )}

      {showStrength && strength && strength.score > 0 && (
        <div className="mt-2">
          <div className="flex gap-1" style={{ height: "3px" }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  borderRadius: "999px",
                  background: i <= strength.score ? STRENGTH_COLORS[strength.score] : "var(--color-border-light)",
                  transition: "background 0.3s",
                }}
              />
            ))}
          </div>
          <p
            className="font-sans mt-1"
            style={{
              fontSize: "11px",
              color: STRENGTH_COLORS[strength.score],
              fontWeight: 500,
            }}
          >
            {strength.label} password
          </p>
        </div>
      )}
    </div>
  )
}
