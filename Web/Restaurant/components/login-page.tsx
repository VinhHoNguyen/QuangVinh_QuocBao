"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LoginPageProps {
  onLogin: (restaurantName: string) => void
  onRegister?: (data: any) => void
}

const DEMO_ACCOUNT = {
  restaurantName: "Phở Việt Nam",
  email: "admin@pho-vietnam.com",
  password: "demo123456",
}

export function LoginPage({ onLogin, onRegister }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [restaurantName, setRestaurantName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Registration form states
  const [regRestaurantName, setRegRestaurantName] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [regAddress, setRegAddress] = useState("")
  const [regPhone, setRegPhone] = useState("")
  const [regOwnerName, setRegOwnerName] = useState("")
  const [regIsLoading, setRegIsLoading] = useState(false)
  const [regSuccess, setRegSuccess] = useState(false)

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

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (regRestaurantName && regEmail && regPassword && regAddress && regPhone && regOwnerName) {
      setRegIsLoading(true)
      setTimeout(() => {
        // Store registration request in localStorage (pending admin approval)
        const pendingRequests = JSON.parse(localStorage.getItem("pendingRegistrations") || "[]")
        pendingRequests.push({
          id: Date.now(),
          restaurantName: regRestaurantName,
          email: regEmail,
          password: regPassword,
          address: regAddress,
          phone: regPhone,
          ownerName: regOwnerName,
          status: "PENDING",
          createdAt: new Date().toISOString(),
        })
        localStorage.setItem("pendingRegistrations", JSON.stringify(pendingRequests))

        setRegSuccess(true)
        setTimeout(() => {
          setRegRestaurantName("")
          setRegEmail("")
          setRegPassword("")
          setRegAddress("")
          setRegPhone("")
          setRegOwnerName("")
          setRegSuccess(false)
          setRegIsLoading(false)
        }, 3000)
      }, 500)
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
          <p className="text-slate-500">Đăng nhập vào hệ thống quản lý</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-100 mb-6">
            <TabsTrigger value="login" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              Đăng Nhập
            </TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              Đăng Ký
            </TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login" className="space-y-4">
            <Card className="bg-white border-slate-200 shadow-lg">
              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
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
          </TabsContent>

          {/* Registration Tab */}
          <TabsContent value="register" className="space-y-4">
            <Card className="bg-white border-slate-200 shadow-lg">
              <div className="p-8">
                {regSuccess ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                      <span className="text-xl">✓</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">Đăng Ký Thành Công!</h3>
                    <p className="text-sm text-slate-600">
                      Nhà hàng của bạn đã được gửi cho admin xét duyệt. Vui lòng chờ phê duyệt để có thể đăng nhập.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-name" className="text-slate-700 text-sm font-medium">
                        Tên Nhà Hàng
                      </Label>
                      <Input
                        id="reg-name"
                        placeholder="Tên nhà hàng"
                        value={regRestaurantName}
                        onChange={(e) => setRegRestaurantName(e.target.value)}
                        className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-red-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reg-owner" className="text-slate-700 text-sm font-medium">
                        Tên Chủ Nhà Hàng
                      </Label>
                      <Input
                        id="reg-owner"
                        placeholder="Tên chủ"
                        value={regOwnerName}
                        onChange={(e) => setRegOwnerName(e.target.value)}
                        className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-red-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reg-address" className="text-slate-700 text-sm font-medium">
                        Địa Chỉ
                      </Label>
                      <Input
                        id="reg-address"
                        placeholder="Địa chỉ nhà hàng"
                        value={regAddress}
                        onChange={(e) => setRegAddress(e.target.value)}
                        className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-red-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reg-phone" className="text-slate-700 text-sm font-medium">
                        Số Điện Thoại
                      </Label>
                      <Input
                        id="reg-phone"
                        placeholder="0912345678"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-red-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reg-email" className="text-slate-700 text-sm font-medium">
                        Email
                      </Label>
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="admin@restaurant.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-red-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reg-password" className="text-slate-700 text-sm font-medium">
                        Mật Khẩu
                      </Label>
                      <Input
                        id="reg-password"
                        type="password"
                        placeholder="Nhập mật khẩu"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-red-500"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={regIsLoading}
                      className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-2.5 rounded-lg shadow-lg transition-all"
                    >
                      {regIsLoading ? "Đang xử lý..." : "Đăng Ký Nhà Hàng"}
                    </Button>
                  </form>
                )}
              </div>
            </Card>

            <p className="text-xs text-center text-slate-600">
              Sau khi đăng ký, nhà hàng của bạn sẽ được admin xét duyệt trước khi có thể đăng nhập.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
