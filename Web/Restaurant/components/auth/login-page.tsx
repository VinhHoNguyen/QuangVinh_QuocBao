"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

export function LoginPage() {
  const { login } = useAuth()
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [restaurantName, setRestaurantName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!")
      toast.error("Mật khẩu xác nhận không khớp!")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("http://localhost:5000/api/restaurants/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name: restaurantName,
          phone,
          address,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Đăng ký thất bại")
      }

      toast.success("🎉 Đăng ký thành công!", {
        description: "Tài khoản của bạn đã được tạo và đang chờ admin duyệt. Bạn sẽ nhận được thông báo qua email khi tài khoản được kích hoạt.",
        duration: 8000,
      })

      // Reset form and switch to login mode
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      setRestaurantName("")
      setPhone("")
      setAddress("")
      setIsRegisterMode(false)
    } catch (err: any) {
      const errorMessage = err.message || "Đăng ký thất bại"
      setError(errorMessage)
      toast.error("❌ Đăng ký thất bại!", {
        description: errorMessage,
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      setIsLoading(true)
      setError("")
      try {
        await login(email, password)
        toast.success("Đăng nhập thành công!")
      } catch (err: any) {
        const errorMessage = err.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
        setError(errorMessage)
        
        if (errorMessage.includes("chưa được duyệt") || errorMessage.includes("pending")) {
          toast.error("⏳ Tài khoản chưa được duyệt!", {
            description: "Tài khoản của bạn đang chờ admin phê duyệt. Vui lòng liên hệ admin hoặc đợi thông báo qua email.",
            duration: 7000,
          })
        } else if (errorMessage.includes("không đúng") || errorMessage.includes("không chính xác")) {
          toast.error("❌ Đăng nhập thất bại!", {
            description: "Email hoặc mật khẩu không đúng.",
            duration: 5000,
          })
        } else if (errorMessage.includes("không tồn tại") || errorMessage.includes("không tìm thấy")) {
          toast.error("❌ Tài khoản không tồn tại!", {
            description: "Tài khoản này chưa có trong hệ thống. Vui lòng đăng ký tài khoản mới.",
            duration: 5000,
          })
        } else if (errorMessage.includes("bị khóa") || errorMessage.includes("suspended")) {
          toast.error("❌ Tài khoản bị khóa!", {
            description: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ admin.",
            duration: 6000,
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

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 mb-4 shadow-lg">
            <span className="text-2xl font-bold text-white">🍜</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Quản Lý Nhà Hàng</h1>
          <p className="text-slate-500">
            {isRegisterMode ? "Đăng ký tài khoản mới" : "Đăng nhập vào hệ thống quản lý"}
          </p>
        </div>

        {/* Main Card */}
        <Card className="bg-white border-slate-200 shadow-lg mb-6">
          <div className="p-8">
            <form onSubmit={isRegisterMode ? handleRegister : handleLogin} className="space-y-5">
              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 text-xl">❌</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-red-800 mb-1">
                        {isRegisterMode ? "Đăng ký thất bại" : "Đăng nhập thất bại"}
                      </p>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Register Mode Fields */}
              {isRegisterMode && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="restaurantName" className="text-slate-700 text-sm font-medium">
                      Tên nhà hàng
                    </Label>
                    <Input
                      id="restaurantName"
                      type="text"
                      placeholder="VD: Phở Hà Nội"
                      value={restaurantName}
                      onChange={(e) => setRestaurantName(e.target.value)}
                      className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:ring-red-500/20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-slate-700 text-sm font-medium">
                      Số điện thoại
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="VD: 0123456789"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:ring-red-500/20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-slate-700 text-sm font-medium">
                      Địa chỉ
                    </Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="VD: 123 Phố Huế, Hai Bà Trưng, Hà Nội"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:ring-red-500/20"
                      required
                    />
                  </div>
                </>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="restaurant@example.com"
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

              {/* Confirm Password - Only in Register Mode */}
              {isRegisterMode && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-700 text-sm font-medium">
                    Xác nhận mật khẩu
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:ring-red-500/20"
                    required
                  />
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-2.5 rounded-lg shadow-lg transition-all"
              >
                {isLoading ? "Đang xử lý..." : isRegisterMode ? "Đăng Ký" : "Đăng Nhập"}
              </Button>

              {/* Toggle Mode */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(!isRegisterMode)
                    setError("")
                    setEmail("")
                    setPassword("")
                    setConfirmPassword("")
                    setRestaurantName("")
                    setPhone("")
                    setAddress("")
                  }}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  {isRegisterMode ? "Đã có tài khoản? Đăng nhập" : "Chưa có tài khoản? Đăng ký ngay"}
                </button>
              </div>
            </form>
          </div>
        </Card>

        {/* Info Message */}
        {isRegisterMode && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-blue-500 text-xl">ℹ️</span>
              <div>
                <p className="text-sm font-semibold text-blue-800 mb-1">Lưu ý</p>
                <p className="text-sm text-blue-700">
                  Sau khi đăng ký, tài khoản của bạn sẽ được gửi đến admin để xét duyệt. 
                  Bạn chỉ có thể đăng nhập sau khi admin phê duyệt tài khoản.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
