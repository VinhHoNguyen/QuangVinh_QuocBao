"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"

interface PendingRestaurant {
  id: number
  restaurantName: string
  email: string
  address: string
  phone: string
  ownerName: string
  status: string
  createdAt: string
}

export function ApprovalPage() {
  const [pendingRestaurants, setPendingRestaurants] = useState<PendingRestaurant[]>([])
  const [approvedRestaurants, setApprovedRestaurants] = useState<PendingRestaurant[]>([])
  const [rejectedRestaurants, setRejectedRestaurants] = useState<PendingRestaurant[]>([])

  useEffect(() => {
    const pending = JSON.parse(localStorage.getItem("pendingRegistrations") || "[]")
    const approved = JSON.parse(localStorage.getItem("approvedRestaurants") || "[]")
    const rejected = JSON.parse(localStorage.getItem("rejectedRestaurants") || "[]")

    setPendingRestaurants(pending.filter((r: any) => r.status === "PENDING"))
    setApprovedRestaurants(approved)
    setRejectedRestaurants(rejected)
  }, [])

  const handleApprove = (id: number, restaurantData: any) => {
    const approved = JSON.parse(localStorage.getItem("approvedRestaurants") || "[]")
    approved.push({ ...restaurantData, status: "APPROVED" })
    localStorage.setItem("approvedRestaurants", JSON.stringify(approved))

    const pending = pendingRestaurants.filter((r) => r.id !== id)
    setPendingRestaurants(pending)

    const updatedPending = JSON.parse(localStorage.getItem("pendingRegistrations") || "[]").filter(
      (r: any) => r.id !== id,
    )
    localStorage.setItem("pendingRegistrations", JSON.stringify(updatedPending))

    setApprovedRestaurants([...approvedRestaurants, { ...restaurantData, status: "APPROVED" }])
  }

  const handleReject = (id: number) => {
    const rejected = JSON.parse(localStorage.getItem("rejectedRestaurants") || "[]")
    const restaurant = pendingRestaurants.find((r) => r.id === id)
    if (restaurant) {
      rejected.push({ ...restaurant, status: "REJECTED" })
      localStorage.setItem("rejectedRestaurants", JSON.stringify(rejected))
    }

    const pending = pendingRestaurants.filter((r) => r.id !== id)
    setPendingRestaurants(pending)

    const updatedPending = JSON.parse(localStorage.getItem("pendingRegistrations") || "[]").filter(
      (r: any) => r.id !== id,
    )
    localStorage.setItem("pendingRegistrations", JSON.stringify(updatedPending))

    setRejectedRestaurants([...rejectedRestaurants, { ...restaurant, status: "REJECTED" }])
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <p className="text-sm text-yellow-800">Chờ Duyệt</p>
            <p className="text-3xl font-bold text-yellow-600">{pendingRestaurants.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <p className="text-sm text-green-800">Đã Duyệt</p>
            <p className="text-3xl font-bold text-green-600">{approvedRestaurants.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <p className="text-sm text-red-800">Từ Chối</p>
            <p className="text-3xl font-bold text-red-600">{rejectedRestaurants.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Đơn Đăng Ký Chờ Duyệt</h2>
        {pendingRestaurants.length === 0 ? (
          <Card className="bg-slate-50">
            <CardContent className="pt-6">
              <p className="text-center text-slate-600">Không có đơn đăng ký nào chờ duyệt</p>
            </CardContent>
          </Card>
        ) : (
          pendingRestaurants.map((restaurant) => (
            <Card key={restaurant.id} className="border-slate-300">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{restaurant.restaurantName}</h3>
                    <p className="text-sm text-slate-600">Chủ: {restaurant.ownerName}</p>
                    <p className="text-sm text-slate-600">Email: {restaurant.email}</p>
                    <p className="text-sm text-slate-600">Địa chỉ: {restaurant.address}</p>
                    <p className="text-sm text-slate-600">Điện thoại: {restaurant.phone}</p>
                    <p className="text-xs text-slate-500 mt-2">
                      Đăng ký lúc: {new Date(restaurant.createdAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Chờ Duyệt</Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => handleApprove(restaurant.id, restaurant)}
                  >
                    <Check size={16} className="mr-2" /> Phê Duyệt
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-red-600 hover:bg-red-50 bg-transparent"
                    onClick={() => handleReject(restaurant.id)}
                  >
                    <X size={16} className="mr-2" /> Từ Chối
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Nhà Hàng Đã Duyệt</h2>
        {approvedRestaurants.length === 0 ? (
          <Card className="bg-slate-50">
            <CardContent className="pt-6">
              <p className="text-center text-slate-600">Chưa có nhà hàng nào được duyệt</p>
            </CardContent>
          </Card>
        ) : (
          approvedRestaurants.map((restaurant) => (
            <Card key={restaurant.id} className="border-green-300 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900">{restaurant.restaurantName}</h3>
                    <p className="text-sm text-slate-600">{restaurant.email}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Đã Duyệt</Badge>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
