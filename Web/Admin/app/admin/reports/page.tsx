"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface Order {
  _id: string
  totalPrice: number
  status: string
  paymentMethod: string
  createdAt: string
}

interface Restaurant {
  _id: string
  name: string
}

interface Drone {
  _id: string
  model: string
  status: string
  battery: number
}

export default function ReportsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [drones, setDrones] = useState<Drone[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("admin_token") || localStorage.getItem("token")
      
      if (!token) {
        router.push("/login")
        return
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      }

      // Load orders, restaurants, and drones in parallel
      const [ordersRes, restaurantsRes, dronesRes] = await Promise.all([
        fetch("http://localhost:5000/api/orders", { headers }),
        fetch("http://localhost:5000/api/restaurants", { headers }),
        fetch("http://localhost:5000/api/drones", { headers }),
      ])

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        setOrders(ordersData.data || [])
      }

      if (restaurantsRes.ok) {
        const restaurantsData = await restaurantsRes.json()
        setRestaurants(restaurantsData.data || [])
      }

      if (dronesRes.ok) {
        const dronesData = await dronesRes.json()
        setDrones(dronesData.data || [])
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate statistics from real data
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0)
  const completedOrders = orders.filter(o => o.status === "completed" || o.status === "delivered").length
  const cancelledOrders = orders.filter(o => o.status === "cancelled").length
  const cancelRate = totalOrders > 0 ? ((cancelledOrders / totalOrders) * 100).toFixed(1) : "0.0"
  
  // Active drones
  const activeDrones = drones.filter(d => d.status === "available" || d.status === "busy").length
  
  // Payment method distribution
  const paymentMethodsData = orders.reduce((acc: any[], order) => {
    const existing = acc.find(item => item.name === order.paymentMethod)
    if (existing) {
      existing.count++
    } else {
      acc.push({ name: order.paymentMethod, count: 1 })
    }
    return acc
  }, [])

  // Order status distribution
  const statusDistribution = orders.reduce((acc: any[], order) => {
    const existing = acc.find(item => item.status === order.status)
    if (existing) {
      existing.count++
    } else {
      acc.push({ status: order.status, count: 1 })
    }
    return acc
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Đang tải dữ liệu...</div>
      </div>
    )
  }

  const handleExportExcel = () => {
    alert("✓ Đang xuất báo cáo Excel...")
  }

  const handleExportPDF = () => {
    alert("✓ Đang xuất báo cáo PDF...")
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Báo cáo & Thống kê</h1>
          <p className="text-muted-foreground mt-1">Dashboard tổng hợp hoạt động hệ thống</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportExcel} className="bg-primary hover:bg-primary/90">
            📊 Excel
          </Button>
          <Button onClick={handleExportPDF} className="bg-primary hover:bg-primary/90">
            📄 PDF
          </Button>
        </div>
      </div>

      {/* Summary cards for key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4 border border-border">
          <p className="text-sm text-muted-foreground">Tổng đơn hàng</p>
          <p className="text-3xl font-bold text-primary mt-2">{totalOrders}</p>
          <p className="text-xs text-muted-foreground mt-1">Tất cả đơn hàng</p>
        </Card>
        <Card className="p-4 border border-border">
          <p className="text-sm text-muted-foreground">Doanh thu</p>
          <p className="text-3xl font-bold text-primary mt-2">{(totalRevenue / 1000000).toFixed(1)}M</p>
          <p className="text-xs text-muted-foreground mt-1">{totalRevenue.toLocaleString("vi-VN")}đ</p>
        </Card>
        <Card className="p-4 border border-border">
          <p className="text-sm text-muted-foreground">Đã hoàn thành</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{completedOrders}</p>
          <p className="text-xs text-muted-foreground mt-1">{totalOrders > 0 ? ((completedOrders/totalOrders)*100).toFixed(1) : 0}% đơn hàng</p>
        </Card>
        <Card className="p-4 border border-border">
          <p className="text-sm text-muted-foreground">Tỉ lệ hủy</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{cancelRate}%</p>
          <p className="text-xs text-muted-foreground mt-1">{cancelledOrders} đơn đã hủy</p>
        </Card>
        <Card className="p-4 border border-border">
          <p className="text-sm text-muted-foreground">Drone hoạt động</p>
          <p className="text-3xl font-bold text-primary mt-2">{activeDrones}/{drones.length}</p>
          <p className="text-xs text-muted-foreground mt-1">{restaurants.length} nhà hàng</p>
        </Card>
      </div>

      {/* Payment methods and order status charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Phương thức thanh toán</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={paymentMethodsData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Phân bố trạng thái đơn hàng</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={statusDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Drone performance table */}
      <Card className="p-6 border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">Danh sách Drone</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Mã Drone</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Model</th>
                <th className="text-center py-3 px-4 font-semibold text-foreground">Trạng thái</th>
                <th className="text-center py-3 px-4 font-semibold text-foreground">Pin</th>
              </tr>
            </thead>
            <tbody>
              {drones.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-muted-foreground">
                    Không có dữ liệu drone
                  </td>
                </tr>
              ) : (
                drones.map((drone) => (
                  <tr key={drone._id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 text-foreground font-mono">{drone._id.slice(-6).toUpperCase()}</td>
                    <td className="py-3 px-4 text-foreground">{drone.model}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs ${
                          drone.status === "available"
                            ? "bg-green-100 text-green-700"
                            : drone.status === "busy"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {drone.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={
                          drone.battery >= 70
                            ? "text-green-600 font-semibold"
                            : drone.battery >= 40
                              ? "text-yellow-600 font-semibold"
                              : "text-red-600 font-semibold"
                        }
                      >
                        {drone.battery}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Restaurant performance table */}
      <Card className="p-6 border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">Danh sách Nhà hàng</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Mã</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Tên nhà hàng</th>
                <th className="text-center py-3 px-4 font-semibold text-foreground">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-muted-foreground">
                    Không có dữ liệu nhà hàng
                  </td>
                </tr>
              ) : (
                restaurants.map((restaurant) => (
                  <tr key={restaurant._id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 text-foreground font-mono">{restaurant._id.slice(-6).toUpperCase()}</td>
                    <td className="py-3 px-4 text-foreground">{restaurant.name}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2 py-1 rounded text-xs bg-green-100 text-green-700">
                        active
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
