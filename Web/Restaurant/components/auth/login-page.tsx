"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

interface LoginPageProps {
  onLogin: (restaurantName: string) => void
}

const DEMO_ACCOUNT = {
  restaurantName: "Phở Việt Nam",
  email: "restaurant1@example.com",
  password: "restaurant123",
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      setIsLoading(true)
      setError("")
      try {
        await login(email, password)
        toast.success("Đăng nhập thành công!")
        // Get restaurant name from response (could be enhanced)
        onLogin("Restaurant") // This will be updated with actual restaurant name
      } catch (err: any) {
        const errorMessage = err.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
        setError(errorMessage)
        
        // Show appropriate toast based on error message
        if (errorMessage.includes("không đúng") || errorMessage.includes("không chính xác")) {
          toast.error("❌ Đăng nhập thất bại!", {
            description: "Email hoặc mật khẩu không đúng. Bạn chưa có tài khoản hoặc thông tin không chính xác.",
            duration: 5000,
          })
        } else if (errorMessage.includes("không tồn tại") || errorMessage.includes("không tìm thấy")) {
          toast.error("❌ Tài khoản không tồn tại!", {
            description: "Tài khoản này chưa có trong hệ thống. Vui lòng đăng ký tài khoản mới hoặc liên hệ admin.",
            duration: 5000,
          })
        } else if (errorMessage.includes("không phải") || errorMessage.includes("nhà hàng")) {
          toast.error("❌ Tài khoản không hợp lệ!", {
            description: "Tài khoản này không phải là tài khoản nhà hàng. Vui lòng sử dụng tài khoản nhà hàng.",
            duration: 5000,
          })
        } else if (errorMessage.includes("bị khóa") || errorMessage.includes("chưa được kích hoạt")) {
          toast.error("❌ Tài khoản bị hạn chế!", {
            description: "Tài khoản của bạn đã bị khóa hoặc chưa được kích hoạt. Vui lòng liên hệ admin.",
            duration: 6000,
          })
        } else if (errorMessage.includes("server") || errorMessage.includes("kết nối")) {
          toast.error("⚠️ Lỗi kết nối!", {
            description: errorMessage,
            duration: 5000,
          })
        } else {
          toast.error("❌ Đăng nhập thất bại!", {
            description: errorMessage,
            duration: 5000,
          })
        }
        
        setIsLoading(false)
      }
    }
  }

  const handleDemoLogin = () => {
    setEmail(DEMO_ACCOUNT.email)
    setPassword(DEMO_ACCOUNT.password)

    setTimeout(() => {
      setIsLoading(true)
      setError("")
      login(DEMO_ACCOUNT.email, DEMO_ACCOUNT.password)
        .then(() => {
          toast.success("Đăng nhập thành công với tài khoản demo!")
          onLogin(DEMO_ACCOUNT.restaurantName)
        })
        .catch((err) => {
          const errorMessage = err.message || "Demo login failed"
          setError(errorMessage)
          toast.error("❌ Đăng nhập demo thất bại!", {
            description: "Tài khoản demo chưa có trong hệ thống hoặc mật khẩu không đúng."
          })
          setIsLoading(false)
        })
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
              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 text-xl">❌</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-red-800 mb-1">Đăng nhập thất bại</p>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

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
              <span className="text-slate-600">Email: </span>
              <span className="font-semibold text-slate-900">{DEMO_ACCOUNT.email}</span>
            </div>
            <div>
              <span className="text-slate-600">Mật Khẩu: </span>
              <span className="font-semibold text-slate-900">{DEMO_ACCOUNT.password}</span>
            </div>
          </div>
          <p className="text-xs text-slate-500">Tài khoản này kết nối với MongoDB backend</p>
        </div>
      </div>
    </div>
  )
}
