"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

const mockUser = {
  firstName: "Rahim",
  lastName: "Uddin",
  email: "rahim@example.com",
  phone: "+880 1712-345678",
  dob: "",
  gender: "Male",
}

function getPasswordStrength(pwd: string): {
  label: string
  bgColor: string
  width: string
} {
  if (!pwd) return { label: "", bgColor: "", width: "0%" }
  if (pwd.length < 6) return { label: "Weak", bgColor: "#ef4444", width: "33%" }
  if (pwd.length >= 10 && /[^a-zA-Z0-9]/.test(pwd))
    return { label: "Strong", bgColor: "#22c55e", width: "100%" }
  return { label: "Fair", bgColor: "#f59e0b", width: "66%" }
}

function PasswordField({
  label,
  value,
  onChange,
  showStrength,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  showStrength?: boolean
}) {
  const [show, setShow] = useState(false)
  const strength = getPasswordStrength(value)

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 pr-10 text-sm focus:border-brand-charcoal focus:ring-2 focus:ring-brand-charcoal/20 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {showStrength && value && (
        <div className="mt-1.5">
          <div className="h-1.5 rounded-full bg-gray-100">
            <div
              className="h-1.5 rounded-full transition-all"
              style={{
                width: strength.width,
                backgroundColor: strength.bgColor,
              }}
            />
          </div>
          <p
            className="mt-0.5 text-xs font-medium"
            style={{ color: strength.bgColor }}
          >
            {strength.label}
          </p>
        </div>
      )}
    </div>
  )
}

interface ToggleProps {
  checked: boolean
  onChange: (v: boolean) => void
}

function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
        checked ? "bg-brand-charcoal" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  )
}

export default function AccountSettings() {
  const [profile, setProfile] = useState(mockUser)
  const [profileToast, setProfileToast] = useState(false)

  const [currentPwd, setCurrentPwd] = useState("")
  const [newPwd, setNewPwd] = useState("")
  const [confirmPwd, setConfirmPwd] = useState("")
  const [pwdToast, setPwdToast] = useState(false)
  const [pwdError, setPwdError] = useState("")

  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    whatsapp: true,
    promo: true,
  })

  const [deleteInput, setDeleteInput] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  function handleProfileSave() {
    setProfileToast(true)
    setTimeout(() => setProfileToast(false), 4000)
  }

  function handlePasswordUpdate() {
    setPwdError("")
    if (!currentPwd) {
      setPwdError("Enter your current password.")
      return
    }
    if (newPwd.length < 6) {
      setPwdError("New password must be at least 6 characters.")
      return
    }
    if (newPwd !== confirmPwd) {
      setPwdError("Passwords do not match.")
      return
    }
    setPwdToast(true)
    setCurrentPwd("")
    setNewPwd("")
    setConfirmPwd("")
    setTimeout(() => setPwdToast(false), 4000)
  }

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-brand-charcoal">
        Account Settings
      </h2>

      {/* Section A — Personal Information */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 font-semibold text-brand-charcoal">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            { label: "First Name", key: "firstName", type: "text" },
            { label: "Last Name", key: "lastName", type: "text" },
            { label: "Email", key: "email", type: "email" },
            { label: "Phone", key: "phone", type: "tel" },
            { label: "Date of Birth", key: "dob", type: "date" },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {label}
              </label>
              <input
                type={type}
                value={profile[key as keyof typeof profile]}
                onChange={(e) =>
                  setProfile({ ...profile, [key]: e.target.value })
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-brand-charcoal focus:ring-2 focus:ring-brand-charcoal/20 focus:outline-none"
              />
            </div>
          ))}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              value={profile.gender}
              onChange={(e) =>
                setProfile({ ...profile, gender: e.target.value })
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-brand-charcoal focus:ring-2 focus:ring-brand-charcoal/20 focus:outline-none"
            >
              {["Male", "Female", "Prefer not to say"].map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>
        {profileToast && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm text-green-700">
            ✓ Profile updated!
          </div>
        )}
        <button
          onClick={handleProfileSave}
          className="mt-4 w-full rounded-lg bg-brand-charcoal py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0d1733]"
        >
          Save Changes
        </button>
      </div>

      {/* Section B — Change Password */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 font-semibold text-brand-charcoal">
          Change Password
        </h3>
        <div className="space-y-4">
          <PasswordField
            label="Current Password"
            value={currentPwd}
            onChange={setCurrentPwd}
          />
          <PasswordField
            label="New Password"
            value={newPwd}
            onChange={setNewPwd}
            showStrength
          />
          <PasswordField
            label="Confirm New Password"
            value={confirmPwd}
            onChange={setConfirmPwd}
          />
        </div>
        {pwdError && <p className="mt-3 text-sm text-red-500">{pwdError}</p>}
        {pwdToast && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm text-green-700">
            ✓ Password updated!
          </div>
        )}
        <button
          onClick={handlePasswordUpdate}
          className="mt-4 rounded-lg bg-brand-charcoal px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0d1733]"
        >
          Update Password
        </button>
      </div>

      {/* Section C — Notification Preferences */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 font-semibold text-brand-charcoal">
          Notifications
        </h3>
        <div className="space-y-4">
          {[
            {
              key: "email",
              label: "📧 Email notifications",
              description: "Order updates",
            },
            {
              key: "sms",
              label: "📱 SMS notifications",
              description: "Delivery alerts",
            },
            {
              key: "whatsapp",
              label: "💬 WhatsApp notifications",
              description: "Order status",
            },
            {
              key: "promo",
              label: "🎁 Promotional emails",
              description: "Deals and offers",
            },
          ].map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">{label}</p>
                <p className="text-xs text-gray-500">{description}</p>
              </div>
              <Toggle
                checked={notifications[key as keyof typeof notifications]}
                onChange={(v) =>
                  setNotifications({ ...notifications, [key]: v })
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* Section D — Danger Zone */}
      <div className="rounded-xl border border-red-200 bg-white p-6">
        <h3 className="mb-4 font-semibold text-red-600">Danger Zone</h3>
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-lg border border-red-500 px-5 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
          >
            Delete Account
          </button>
        ) : (
          <div>
            <p className="mb-3 text-sm text-gray-700">
              This action cannot be undone. Type <strong>DELETE</strong> to
              confirm:
            </p>
            <input
              type="text"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder="Type DELETE"
              className="w-full max-w-xs rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-red-400 focus:ring-2 focus:ring-red-300 focus:outline-none"
            />
            <div className="mt-3 flex gap-3">
              <button
                disabled={deleteInput !== "DELETE"}
                className="rounded-lg bg-red-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setDeleteInput("")
                }}
                className="rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
