const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3002"

export interface AuthUser {
  _id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  isAdmin: boolean
  isVerified: boolean
  isBanned: boolean
  savedAddresses?: unknown[]
  createdAt?: string
}

const authApi = {
  async login(email: string, password: string): Promise<AuthUser> {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message ?? "Login failed")
    return data.payload.userWithoutPassword as AuthUser
  },

  async logout(): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error((data as { message?: string }).message ?? "Logout failed")
    }
  },

  async checkAuth(): Promise<AuthUser> {
    const res = await fetch(`${BASE_URL}/api/auth/check-auth/me`, {
      credentials: "include",
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message ?? "Not authenticated")
    return data.payload.me as AuthUser
  },

  // The access token cookie only lives ~55 minutes; the refresh token lives 30 days.
  // Call this to mint a fresh access token from a still-valid refresh token cookie.
  async refreshToken(): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/auth/refresh-token`, {
      credentials: "include",
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error((data as { message?: string }).message ?? "Session refresh failed")
    }
  },

  async register(payload: {
    firstName: string
    lastName: string
    email: string
    password: string
    phoneNumber?: string
    agreeTerms: boolean
  }): Promise<string> {
    const res = await fetch(`${BASE_URL}/api/users/process-register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message ?? "Registration failed")
    return data.message as string
  },

  async forgetPassword(email: string): Promise<string> {
    const res = await fetch(`${BASE_URL}/api/users/forget-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message ?? "Failed to send reset email")
    return data.message as string
  },

  async resetPassword(token: string, password: string): Promise<string> {
    const res = await fetch(`${BASE_URL}/api/users/reset-password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message ?? "Failed to reset password")
    return data.message as string
  },
}

export default authApi
