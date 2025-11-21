"use client"

import { useState } from "react"
import { LoginPage } from "@/components/auth/login-page"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [restaurantName, setRestaurantName] = useState("")

  const handleLogin = (name: string) => {
    setRestaurantName(name)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setRestaurantName("")
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />
  }

  return <DashboardLayout restaurantName={restaurantName} onLogout={handleLogout} />
}
