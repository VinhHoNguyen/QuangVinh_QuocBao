"use client"

import { Card } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { useState } from "react"

const weeklyData = [
  { name: "T2", orders: 240, revenue: 2400, completed: 200, cancelled: 8 },
  { name: "T3", orders: 340, revenue: 2210, completed: 320, cancelled: 12 },
  { name: "T4", orders: 290, revenue: 2290, completed: 270, cancelled: 15 },
  { name: "T5", orders: 380, revenue: 2000, completed: 360, cancelled: 10 },
  { name: "T6", orders: 420, revenue: 2210, completed: 400, cancelled: 18 },
  { name: "T7", orders: 360, revenue: 2290, completed: 340, cancelled: 12 },
  { name: "CN", orders: 480, revenue: 2390, completed: 450, cancelled: 20 },
]

const droneStatusData = [
  { name: "Hoạt động", value: 38, color: "#16a34a" },
  { name: "Đang sạc", value: 12, color: "#f59e0b" },
  { name: "Bảo trì", value: 5, color: "#ef4444" },
]

const paymentMethodsData = [
  { name: "VNPay", value: 45, color: "#3b82f6" },
  { name: "Momo", value: 35, color: "#ec4899" },
  { name: "ZaloPay", value: 20, color: "#8b5cf6" },
]

const alertsData = [
  {
    id: 1,
    type: "maintenance",
    title: "Drone DR-001 cần bảo trì",
    message: "Pin dung lượng tối đa giảm",
    priority: "high",
  },
  {
    id: 2,
    type: "delay",
    title: "Đơn hàng #ORD-5234 trễ 15 phút",
    message: "Drone DR-015 gặp sự cố định vị",
    priority: "medium",
  },
  {
    id: 3,
    type: "complaint",
    title: "Khiếu nại mới từ khách hàng",
    message: "Đơn #ORD-5230 - Đóng gói bị hỏng",
    priority: "high",
  },
  {
    id: 4,
    type: "violation",
    title: "Nhà hàng NH-003 vi phạm chất lượng",
    message: "Tỷ lệ khiếu nại 15%",
    priority: "medium",
  },
]

const restaurantPerformance = [
  { name: "Nhà hàng A", orders: 45, revenue: 1250000, rating: 4.8, cancellationRate: 2.2 },
  { name: "Nhà hàng B", orders: 38, revenue: 980000, rating: 4.5, cancellationRate: 3.5 },
  { name: "Nhà hàng C", orders: 52, revenue: 1450000, rating: 4.9, cancellationRate: 1.8 },
  { name: "Nhà hàng D", orders: 35, revenue: 850000, rating: 4.2, cancellationRate: 5.2 },
]

const dronePerformance = [
  { id: "DR-001", trips: 28, successRate: 98.2, avgTime: 18, battery: 85 },
  { id: "DR-002", trips: 32, successRate: 96.8, avgTime: 19, battery: 72 },
  { id: "DR-003", trips: 25, successRate: 100, avgTime: 17, battery: 91 },
  { id: "DR-004", trips: 30, successRate: 97.5, avgTime: 18, battery: 68 },
  { id: "DR-005", trips: 22, successRate: 95.4, avgTime: 20, battery: 45 },
]

export default function AdminDashboard() {
  const [timePeriod, setTimePeriod] = useState<"day" | "week" | "month">("week")

  const totalOrders = weeklyData.reduce((sum, d) => sum + d.orders, 0)
  const totalRevenue = weeklyData.reduce((sum, d) => sum + d.revenue, 0)
  const totalCompleted = weeklyData.reduce((sum, d) => sum + d.completed, 0)
  const completionRate = ((totalCompleted / totalOrders) * 100).toFixed(1)
  const totalNewUsers = 127
  const activeDrones = 38

  const stats = [
    {
      label: "Tổng đơn hôm nay",
      value: "187",
      change: "+12%",
      icon: "📦",
    },
    {
      label: "Đang giao",
      value: "45",
      change: "Live",
      icon: "🚁",
    },
    {
      label: "Tỷ lệ hoàn thành",
      value: `${completionRate}%`,
      change: "+3.2%",
      icon: "✅",
    },
    {
      label: "Doanh thu hôm nay",
      value: "12.5M đ",
      change: "+8.5%",
      icon: "💰",
    },
    {
      label: "Người dùng mới",
      value: totalNewUsers.toString(),
      change: "+5%",
      icon: "👥",
    },
    {
      label: "Drone hoạt động",
      value: `${activeDrones}/55`,
      change: "69%",
      icon: "⚡",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground font-sans">Bảng Điều Khiển Tổng Quan</h1>
          <p className="text-muted-foreground mt-2 font-sans">
            Xin chào Admin! Dưới đây là tình hình hoạt động của hệ thống giao đồ ăn bằng drone
          </p>
        </div>
        <div className="flex gap-2">
          {(["day", "week", "month"] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimePeriod(period)}
              className={`px-4 py-2 rounded-lg font-sans text-sm transition-all ${
                timePeriod === period ? "bg-primary text-white" : "bg-muted text-foreground hover:bg-muted/70"
              }`}
            >
              {period === "day" ? "Hôm nay" : period === "week" ? "Tuần" : "Tháng"}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="p-6 border-l-4 border-l-primary hover:shadow-lg transition-all">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1 font-sans">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground font-sans">{stat.value}</p>
                <p className="text-xs text-green-600 mt-2 font-sans">{stat.change}</p>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue & Orders Chart */}
        <Card className="lg:col-span-2 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 font-sans">Doanh Thu & Đơn Hàng Theo Tuần</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
              />
              <Legend />
              <Bar dataKey="revenue" fill="var(--color-primary)" name="Doanh thu (đ)" />
              <Bar dataKey="orders" fill="var(--color-accent)" name="Đơn hàng" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Drone Status */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 font-sans">Trạng Thái Drone</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={droneStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {droneStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2 text-sm">
            {droneStatusData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground font-sans">{item.name}</span>
                </div>
                <span className="font-semibold text-foreground font-sans">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Trend & Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 font-sans">Xu Hướng Doanh Thu</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-primary)"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Payment Methods */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 font-sans">Phương Thức Thanh Toán</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentMethodsData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {paymentMethodsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2 text-sm">
            {paymentMethodsData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground font-sans">{item.name}</span>
                </div>
                <span className="font-semibold text-foreground font-sans">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Alerts Section */}
      <Card className="p-6 border-l-4 border-l-destructive bg-destructive/5">
        <h3 className="text-lg font-semibold text-foreground mb-4 font-sans">⚠️ Cảnh Báo & Sự Cố</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alertsData.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border ${
                alert.priority === "high"
                  ? "bg-destructive/10 border-destructive/30"
                  : "bg-yellow-500/10 border-yellow-500/30"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-foreground font-sans text-sm">{alert.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 font-sans">{alert.message}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded font-sans font-medium ${
                    alert.priority === "high" ? "bg-destructive text-white" : "bg-yellow-500 text-white"
                  }`}
                >
                  {alert.priority === "high" ? "Cao" : "Trung"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Performance Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Restaurant Performance */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 font-sans">Hiệu Suất Nhà Hàng Hôm Nay</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-sans">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground">Nhà hàng</th>
                  <th className="text-right py-2 text-muted-foreground">Đơn</th>
                  <th className="text-right py-2 text-muted-foreground">Doanh thu</th>
                  <th className="text-right py-2 text-muted-foreground">Đánh giá</th>
                  <th className="text-right py-2 text-muted-foreground">Hủy%</th>
                </tr>
              </thead>
              <tbody>
                {restaurantPerformance.map((resto, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 text-foreground">{resto.name}</td>
                    <td className="text-right py-3 text-foreground">{resto.orders}</td>
                    <td className="text-right py-3 text-foreground">{(resto.revenue / 1000000).toFixed(1)}M</td>
                    <td className="text-right py-3">
                      <span className="text-green-600 font-semibold">⭐ {resto.rating}</span>
                    </td>
                    <td className="text-right py-3 text-foreground">{resto.cancellationRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Drone Performance */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 font-sans">Hiệu Suất Drone Hôm Nay</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-sans">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground">Drone</th>
                  <th className="text-right py-2 text-muted-foreground">Chuyến</th>
                  <th className="text-right py-2 text-muted-foreground">Thành công</th>
                  <th className="text-right py-2 text-muted-foreground">Avg. Thời gian</th>
                  <th className="text-right py-2 text-muted-foreground">Pin</th>
                </tr>
              </thead>
              <tbody>
                {dronePerformance.map((drone, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 text-foreground font-semibold">{drone.id}</td>
                    <td className="text-right py-3 text-foreground">{drone.trips}</td>
                    <td className="text-right py-3">
                      <span className="text-green-600 font-semibold">{drone.successRate}%</span>
                    </td>
                    <td className="text-right py-3 text-foreground">{drone.avgTime} phút</td>
                    <td className="text-right py-3">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: `${drone.battery}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-foreground">{drone.battery}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
