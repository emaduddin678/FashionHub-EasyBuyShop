"use client"

import { useEffect, useRef } from "react"
import { Provider } from "react-redux"
import { store } from "@/lib/store"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { checkAuthStatus } from "@/lib/store/authSlice"
import { syncWishlistFromServer, clearWishlist } from "@/lib/store/wishlistSlice"

function AuthInitializer() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const prevUserIdRef = useRef<string | null>(null)

  // Restore session from HttpOnly cookie on every cold mount
  useEffect(() => {
    dispatch(checkAuthStatus())
  }, [dispatch])

  // The access token cookie only lives ~55 minutes. For a tab left open longer than
  // that, re-check periodically so the refresh-token fallback in checkAuthStatus
  // kicks in before some other authenticated request hits a stale 401.
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(checkAuthStatus())
    }, 50 * 60 * 1000)
    return () => clearInterval(interval)
  }, [dispatch])

  // Sync wishlist when user logs in; clear when user logs out
  useEffect(() => {
    const currentId = user?._id ?? null
    const prevId = prevUserIdRef.current

    if (currentId && currentId !== prevId) {
      dispatch(syncWishlistFromServer())
    } else if (!currentId && prevId) {
      dispatch(clearWishlist())
    }

    prevUserIdRef.current = currentId
  }, [dispatch, user])

  return null
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer />
      {children}
    </Provider>
  )
}
