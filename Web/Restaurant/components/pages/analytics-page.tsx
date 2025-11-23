"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface AnalyticsData {
  todayRevenue: number
  todayOrderCount: number
  successRate: string
  orderStatusCounts: {
    completed: number
    cancelled: number
    processing: number
  }
  revenueData: Array<{ day: string; revenue: number }>
  topDishes: Array<{ name: string; count: number }>
}

export function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      const token = localStorage.getItem("restaurant_token")
      const restaurantId = localStorage.getItem("restaurant_id")

      if (!token || !restaurantId) {
        console.error("No token or restaurant ID found")
        return
      }

      const response = await fetch(`${API_URL}/analytics/restaurant/${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.data)
      }
    } catch (error) {
      console.error("Error loading analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Đang tải dữ liệu...</p>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Không có dữ liệu thống kê</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Thống Kê</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <p className="text-sm text-green-700">Doanh Thu Hôm Nay</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {analytics.todayRevenue.toLocaleString("vi-VN")}đ
            </p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-700">Đơn Hàng Hôm Nay</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">{analytics.todayOrderCount}</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="pt-6">
            <p className="text-sm text-purple-700">Tỷ Lệ Thành Công</p>
            <p className="text-2xl font-bold text-purple-600 mt-2">{analytics.successRate}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Doanh Thu Theo Ngày</CardTitle>
          <CardDescription>Biểu đồ doanh thu 7 ngày qua</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => `${Number(value).toLocaleString("vi-VN")}đ`} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#E85D3E" name="Doanh Thu (VND)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Dishes */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Món Ăn Bán Chạy Nhất</CardTitle>
          <CardDescription>Top 5 món ăn được đặt nhiều nhất</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.topDishes.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.topDishes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#E85D3E" name="Số Lượng" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-[300px]">
              <p className="text-muted-foreground">Chưa có dữ liệu món ăn</p>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  )
}
