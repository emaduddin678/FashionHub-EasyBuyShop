import type { Metadata } from "next"
import RegisterPage from "@/components/pages/RegisterPage"

export const metadata: Metadata = {
  title: "Create Account — FashionHub",
  description: "Join FashionHub and shop the latest looks.",
}

export default function Page() {
  return <RegisterPage />
}
