import ResetPasswordPage from "@/components/pages/ResetPasswordPage"

export const metadata = {
  title: "Reset Password — FashionHub",
  description: "Set a new password for your account",
}

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  return <ResetPasswordPage token={token} />
}
