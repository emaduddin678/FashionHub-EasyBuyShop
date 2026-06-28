import type { Metadata } from "next"
import LoginPage from "@/components/pages/LoginPage"

export const metadata: Metadata = {
  title: "Sign In — FashionHub",
  description: "Sign in to your FashionHub account.",
}

export default function Page() {
  return <LoginPage />
}
