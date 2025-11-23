"use client"

import { LoginPage } from "@/components/auth/login-page"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useAuth } from "@/lib/auth-context"
import { Loader2 } from "lucide-react"

export default function Home() {
  const { user, loading, logout } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  return <DashboardLayout restaurantName={user.name || "Nhà hàng"} onLogout={logout} />
}
