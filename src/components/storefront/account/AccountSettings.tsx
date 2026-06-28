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

function getPasswordStrength(pwd: string): { label: string; bgColor: string; width: string } {
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
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2B5E]/20 focus:border-[#1A2B5E]"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {showStrength && value && (
        <div className="mt-1.5">
          <div className="h-1.5 bg-gray-100 rounded-full">
            <div
              className="h-1.5 rounded-full transition-all"
              style={{ width: strength.width, backgroundColor: strength.bgColor }}
            />
          </div>
          <p
            className="text-xs mt-0.5 font-medium"
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
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
        checked ? "bg-[#1A2B5E]" : "bg-gray-200"
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
    setTimeout(() => setProfileToast(false), 3000)
  }

  function handlePasswordUpdate() {
    setPwdError("")
    if (!currentPwd) { setPwdError("Enter your current password."); return }
    if (newPwd.length < 6) { setPwdError("New password must be at least 6 characters."); return }
    if (newPwd !== confirmPwd) { setPwdError("Passwords do not match."); return }
    setPwdToast(true)
    setCurrentPwd(""); setNewPwd(""); setConfirmPwd("")
    setTimeout(() => setPwdToast(false), 3000)
  }

  return (
    <div>
      <h2 className="font-bold text-xl text-[#1A2B5E] mb-6">Account Settings</h2>

      {/* Section A — Personal Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 className="font-semibold text-[#1A2B5E] mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "First Name", key: "firstName", type: "text" },
            { label: "Last Name", key: "lastName", type: "text" },
            { label: "Email", key: "email", type: "email" },
            { label: "Phone", key: "phone", type: "tel" },
            { label: "Date of Birth", key: "dob", type: "date" },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={type}
                value={profile[key as keyof typeof profile]}
                onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2B5E]/20 focus:border-[#1A2B5E]"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              value={profile.gender}
              onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2B5E]/20 focus:border-[#1A2B5E]"
            >
              {["Male", "Female", "Prefer not to say"].map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>
        {profileToast && (
          <div className="mt-4 flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 text-sm">
            ✓ Profile updated!
          </div>
        )}
        <button
          onClick={handleProfileSave}
          className="mt-4 w-full bg-[#1A2B5E] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#0d1733] transition-colors"
        >
          Save Changes
        </button>
      </div>

      {/* Section B — Change Password */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 className="font-semibold text-[#1A2B5E] mb-4">Change Password</h3>
        <div className="space-y-4">
          <PasswordField label="Current Password" value={currentPwd} onChange={setCurrentPwd} />
          <PasswordField label="New Password" value={newPwd} onChange={setNewPwd} showStrength />
          <PasswordField label="Confirm New Password" value={confirmPwd} onChange={setConfirmPwd} />
        </div>
        {pwdError && (
          <p className="mt-3 text-sm text-red-500">{pwdError}</p>
        )}
        {pwdToast && (
          <div className="mt-3 flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 text-sm">
            ✓ Password updated!
          </div>
        )}
        <button
          onClick={handlePasswordUpdate}
          className="mt-4 bg-[#1A2B5E] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0d1733] transition-colors"
        >
          Update Password
        </button>
      </div>

      {/* Section C — Notification Preferences */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 className="font-semibold text-[#1A2B5E] mb-4">Notifications</h3>
        <div className="space-y-4">
          {[
            { key: "email", label: "📧 Email notifications", description: "Order updates" },
            { key: "sms", label: "📱 SMS notifications", description: "Delivery alerts" },
            { key: "whatsapp", label: "💬 WhatsApp notifications", description: "Order status" },
            { key: "promo", label: "🎁 Promotional emails", description: "Deals and offers" },
          ].map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">{label}</p>
                <p className="text-xs text-gray-500">{description}</p>
              </div>
              <Toggle
                checked={notifications[key as keyof typeof notifications]}
                onChange={(v) => setNotifications({ ...notifications, [key]: v })}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Section D — Danger Zone */}
      <div className="bg-white rounded-xl border border-red-200 p-6">
        <h3 className="font-semibold text-red-600 mb-4">Danger Zone</h3>
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="border border-red-500 text-red-500 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
          >
            Delete Account
          </button>
        ) : (
          <div>
            <p className="text-sm text-gray-700 mb-3">
              This action cannot be undone. Type <strong>DELETE</strong> to confirm:
            </p>
            <input
              type="text"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder="Type DELETE"
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400"
            />
            <div className="flex gap-3 mt-3">
              <button
                disabled={deleteInput !== "DELETE"}
                className="bg-red-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => { setShowDeleteConfirm(false); setDeleteInput("") }}
                className="bg-gray-100 text-gray-600 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
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
