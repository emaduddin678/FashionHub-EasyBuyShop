const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3002"

export interface Address {
  _id: string
  label?: string
  recipientName?: string
  phoneNumber?: string
  addressLine1: string
  addressLine2?: string
  city: string
  district?: string
  division?: string
  postalCode?: string
  isDefault: boolean
}

export type AddressInput = Omit<Address, "_id" | "isDefault"> & { isDefault?: boolean }

export interface UpdatedUser {
  _id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  profileImage?: string
}

async function handle<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error((data as { message?: string }).message ?? "Request failed")
  return data as T
}

const userApi = {
  async updateProfile(
    userId: string,
    payload: { firstName?: string; lastName?: string; phoneNumber?: string },
  ): Promise<UpdatedUser> {
    const res = await fetch(`${BASE_URL}/api/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    })
    const data = await handle<{ payload: { updatedUser: UpdatedUser } }>(res)
    return data.payload.updatedUser
  },

  async updatePassword(
    userId: string,
    payload: { oldPassword: string; newPassword: string; confirmedPassword: string },
  ): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/users/update-password/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    })
    await handle(res)
  },

  async getAddresses(userId: string): Promise<{ addresses: Address[]; defaultAddressId: string | null }> {
    const res = await fetch(`${BASE_URL}/api/users/${userId}/addresses`, {
      credentials: "include",
    })
    const data = await handle<{ payload: { addresses: Address[]; defaultAddressId: string | null } }>(res)
    return data.payload
  },

  async addAddress(userId: string, payload: AddressInput): Promise<Address> {
    const res = await fetch(`${BASE_URL}/api/users/${userId}/addresses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    })
    const data = await handle<{ payload: { address: Address } }>(res)
    return data.payload.address
  },

  async updateAddress(userId: string, addressId: string, payload: Partial<AddressInput>): Promise<Address> {
    const res = await fetch(`${BASE_URL}/api/users/${userId}/addresses/${addressId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    })
    const data = await handle<{ payload: { address: Address } }>(res)
    return data.payload.address
  },

  async deleteAddress(userId: string, addressId: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/users/${userId}/addresses/${addressId}`, {
      method: "DELETE",
      credentials: "include",
    })
    await handle(res)
  },

  async setDefaultAddress(userId: string, addressId: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/users/${userId}/addresses/${addressId}/default`, {
      method: "PATCH",
      credentials: "include",
    })
    await handle(res)
  },
}

export default userApi
