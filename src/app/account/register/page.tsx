import type { Metadata } from "next"
import { Suspense } from "react"
import RegisterPage from "@/components/pages/RegisterPage"

export const metadata: Metadata = {
  title: "Create Account — FashionHub",
  description: "Join FashionHub and shop the latest looks.",
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <RegisterPage />
    </Suspense>
  )
}
