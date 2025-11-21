"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

interface LoginPageProps {
  onLogin: (restaurantName: string) => void
}

const DEMO_ACCOUNT = {
  restaurantName: "Phở Việt Nam",
  email: "admin@pho-vietnam.com",
  password: "demo123456",
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [restaurantName, setRestaurantName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password && restaurantName) {
      setIsLoading(true)
      setTimeout(() => {
        onLogin(restaurantName)
        setIsLoading(false)
      }, 500)
    }
  }

  const handleDemoLogin = () => {
    setRestaurantName(DEMO_ACCOUNT.restaurantName)
    setEmail(DEMO_ACCOUNT.email)
    setPassword(DEMO_ACCOUNT.password)

    setTimeout(() => {
      setIsLoading(true)
      setTimeout(() => {
        onLogin(DEMO_ACCOUNT.restaurantName)
        setIsLoading(false)
      }, 500)
    }, 100)
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 mb-4 shadow-lg">
            <span className="text-2xl font-bold text-white">🍜</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Quản Lý Nhà Hàng</h1>
          <p className="text-slate-500">Đăng nhập vào hệ thống quản lý</p>
        </div>

        {/* Main Card */}
        <Card className="bg-white border-slate-200 shadow-lg mb-6">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Restaurant Name */}
              <div className="space-y-2">
                <Label htmlFor="restaurant" className="text-slate-700 text-sm font-medium">
                  Tên Nhà Hàng
                </Label>
                <Input
                  id="restaurant"
                  placeholder="Nhập tên nhà hàng"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:ring-red-500/20"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@restaurant.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:ring-red-500/20"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 text-sm font-medium">
                  Mật Khẩu
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:ring-red-500/20"
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-2.5 rounded-lg shadow-lg transition-all"
              >
                {isLoading ? "Đang xử lý..." : "Đăng Nhập"}
              </Button>
            </form>
          </div>
        </Card>

        <div
          onClick={handleDemoLogin}
          className="bg-slate-50 border border-slate-300 rounded-lg p-4 space-y-3 cursor-pointer hover:bg-slate-100 hover:shadow-md transition-all"
        >
          <p className="text-sm font-semibold text-slate-700">Tài Khoản Demo (Bấm để đăng nhập):</p>
          <div className="bg-white border border-slate-200 rounded p-3 space-y-2 text-sm">
            <div>
              <span className="text-slate-600">Tên Nhà Hàng: </span>
              <span className="font-semibold text-slate-900">{DEMO_ACCOUNT.restaurantName}</span>
            </div>
            <div>
              <span className="text-slate-600">Email: </span>
              <span className="font-semibold text-slate-900">{DEMO_ACCOUNT.email}</span>
            </div>
            <div>
              <span className="text-slate-600">Mật Khẩu: </span>
              <span className="font-semibold text-slate-900">{DEMO_ACCOUNT.password}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
