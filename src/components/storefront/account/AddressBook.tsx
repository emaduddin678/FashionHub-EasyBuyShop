"use client"

import { useState } from "react"

interface Address {
  id: string
  label: string
  isDefault: boolean
  name: string
  phone: string
  street: string
  area: string
  city: string
  postalCode: string
}

const INITIAL_ADDRESSES: Address[] = [
  {
    id: "ADDR-001",
    label: "Home",
    isDefault: true,
    name: "Rahim Uddin",
    phone: "+880 1712-345678",
    street: "House 12, Road 4, Block B",
    area: "Dhanmondi",
    city: "Dhaka",
    postalCode: "1205",
  },
  {
    id: "ADDR-002",
    label: "Office",
    isDefault: false,
    name: "Rahim Uddin",
    phone: "+880 1712-345678",
    street: "Level 5, Rupayan Trade Centre",
    area: "Banglamotor",
    city: "Dhaka",
    postalCode: "1000",
  },
]

const LABEL_ICONS: Record<string, string> = {
  Home: "🏠",
  Office: "🏢",
  Other: "📍",
}

const CITIES = ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Rangpur", "Mymensingh"]

const emptyForm = { label: "Home", name: "", phone: "", street: "", area: "", city: "Dhaka", postalCode: "", isDefault: false }

export default function AddressBook() {
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  function openAddForm() {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
  }

  function openEditForm(addr: Address) {
    setForm({
      label: addr.label,
      name: addr.name,
      phone: addr.phone,
      street: addr.street,
      area: addr.area,
      city: addr.city,
      postalCode: addr.postalCode,
      isDefault: addr.isDefault,
    })
    setEditingId(addr.id)
    setShowForm(true)
  }

  function handleSave() {
    if (editingId) {
      setAddresses((prev) =>
        prev.map((a) =>
          a.id === editingId
            ? { ...a, ...form }
            : form.isDefault
            ? { ...a, isDefault: false }
            : a
        )
      )
    } else {
      const newAddr: Address = {
        id: `ADDR-${Date.now()}`,
        ...form,
      }
      setAddresses((prev) =>
        form.isDefault ? prev.map((a) => ({ ...a, isDefault: false })).concat(newAddr) : [...prev, newAddr]
      )
    }
    setShowForm(false)
    setEditingId(null)
  }

  function handleDelete(id: string) {
    setAddresses((prev) => prev.filter((a) => a.id !== id))
    setDeleteConfirmId(null)
  }

  function handleSetDefault(id: string) {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })))
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl text-[#1A2B5E]">Address Book</h2>
        <button
          onClick={openAddForm}
          className="text-sm border border-[#1A2B5E] text-[#1A2B5E] px-4 py-2 rounded-lg hover:bg-[#1A2B5E] hover:text-white transition-colors"
        >
          + Add New Address
        </button>
      </div>

      {/* Address grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`bg-white rounded-xl p-5 ${
              addr.isDefault ? "border-2 border-[#1A2B5E]" : "border border-gray-200"
            }`}
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 bg-[#1A2B5E] text-white text-xs font-medium px-2.5 py-1 rounded-full">
                {LABEL_ICONS[addr.label] ?? "📍"} {addr.label}
              </span>
              {addr.isDefault && (
                <span className="text-xs font-medium bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                  ✓ Default
                </span>
              )}
            </div>

            {/* Details */}
            <div className="mt-3">
              <p className="font-medium text-[#1A2B5E]">{addr.name}</p>
              <p className="text-sm text-gray-600 mt-1">{addr.phone}</p>
              <p className="text-sm text-gray-600 mt-1">{addr.street}</p>
              <p className="text-sm text-gray-600">{addr.area}</p>
              <p className="text-sm text-gray-600">{addr.city} — {addr.postalCode}</p>
            </div>

            {/* Actions */}
            {deleteConfirmId === addr.id ? (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-700 mb-2">Delete this address?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="text-sm bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="text-sm bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-4">
                <button
                  onClick={() => openEditForm(addr)}
                  className="text-sm text-[#1A2B5E] hover:underline"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => setDeleteConfirmId(addr.id)}
                  className="text-sm text-red-500 hover:underline"
                >
                  🗑️ Delete
                </button>
                {!addr.isDefault && (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-sm text-gray-500 hover:underline"
                  >
                    ✓ Set as Default
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-[#1A2B5E] mb-4">
            {editingId ? "Edit Address" : "Add New Address"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
              <select
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2B5E]/20 focus:border-[#1A2B5E]"
              >
                {["Home", "Office", "Other"].map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2B5E]/20 focus:border-[#1A2B5E]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2B5E]/20 focus:border-[#1A2B5E]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street / House</label>
              <input
                type="text"
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2B5E]/20 focus:border-[#1A2B5E]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
              <input
                type="text"
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2B5E]/20 focus:border-[#1A2B5E]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <select
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2B5E]/20 focus:border-[#1A2B5E]"
              >
                {CITIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
              <input
                type="text"
                value={form.postalCode}
                onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2B5E]/20 focus:border-[#1A2B5E]"
              />
            </div>
            <div className="flex items-center gap-2 self-end pb-2.5">
              <input
                type="checkbox"
                id="setDefault"
                checked={form.isDefault}
                onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                className="w-4 h-4 accent-[#1A2B5E]"
              />
              <label htmlFor="setDefault" className="text-sm text-gray-700">
                Set as default address
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button
              onClick={handleSave}
              className="bg-[#1A2B5E] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0d1733] transition-colors"
            >
              Save Address
            </button>
            <button
              onClick={() => { setShowForm(false); setEditingId(null) }}
              className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
