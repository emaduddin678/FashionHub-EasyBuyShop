"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAppSelector } from "@/lib/store/hooks"

// Keeps already-logged-in users off /account/login and /account/register —
// sends them straight to /account (or ?returnUrl=) instead of letting them
// submit the form and hit a confusing "User is already logged in" error.
export function useRedirectIfAuthenticated() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, sessionChecked } = useAppSelector((s) => s.auth)

  const alreadyLoggedIn = sessionChecked && !!user

  useEffect(() => {
    if (alreadyLoggedIn) {
      router.replace(searchParams.get("returnUrl") || "/account")
    }
  }, [alreadyLoggedIn, searchParams, router])

  // While the session check hasn't resolved yet, or a redirect is about to
  // happen, tell the caller to render a loading state instead of the form.
  return { checking: !sessionChecked || alreadyLoggedIn }
}
