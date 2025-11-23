"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Store, Eye, EyeOff } from "lucide-react"
import { useAdminAuth } from "@/lib/admin-auth-context"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAdminAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(email, password)
      toast.success("Đăng nhập thành công!")
      // Router push is handled in login function
    } catch (error: any) {
      const errorMessage = error.message || "Đăng nhập thất bại"
      
      // Hiển thị thông báo chi tiết hơn
      if (errorMessage.includes("Invalid credentials") || errorMessage.includes("credentials")) {
        const friendlyMessage = "Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại hoặc liên hệ quản trị viên nếu chưa có tài khoản."
        setError(friendlyMessage)
        toast.error(friendlyMessage, { duration: 5000 })
      } else if (errorMessage.includes("không có quyền")) {
        setError(errorMessage)
        toast.error(errorMessage, { duration: 5000 })
      } else {
        setError("Không thể đăng nhập. Vui lòng thử lại sau hoặc liên hệ quản trị viên.")
        toast.error("Không thể đăng nhập. Vui lòng thử lại sau.", { duration: 5000 })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleQuickLogin = (email: string, password: string) => {
    setEmail(email)
    setPassword(password)
    setError("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Store size={28} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground font-sans">FastFood Admin</h1>
          <p className="text-muted-foreground mt-2 font-sans">Đăng nhập vào tài khoản quản lý của bạn</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="bg-card rounded-xl border border-border p-8 shadow-lg space-y-6 mb-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground font-sans">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@fastfood.com"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground transition-all font-sans"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground font-sans">Mật khẩu</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu của bạn"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground transition-all font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive font-sans">
              {error}
            </div>
          )}

          {/* Login Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 transition-all font-sans"
          >
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </Button>
        </form>

        {/* Demo Account Section */}
        <div className="space-y-3">
          <p className="text-center text-xs text-muted-foreground font-sans mb-3">Tài khoản demo (nếu có trong database):</p>
          <button
            onClick={() => handleQuickLogin("admin@fastfood.com", "admin123")}
            className="w-full bg-muted hover:bg-muted/70 border border-border rounded-lg p-3 text-left transition-all hover:border-primary group"
          >
            <div className="font-medium text-foreground group-hover:text-primary font-sans text-sm">
              Admin Hệ thống
            </div>
            <div className="text-xs text-muted-foreground font-sans">admin@fastfood.com</div>
            <div className="text-xs text-muted-foreground font-sans">Pass: admin123</div>
          </button>
        </div>
      </div>
    </div>
  )
}
