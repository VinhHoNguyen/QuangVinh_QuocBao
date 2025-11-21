"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const reports = [
  {
    title: "Báo cáo doanh thu tháng",
    description: "Thống kê tổng doanh thu, so sánh với tháng trước",
    date: "Cập nhật: 2025-01-11",
    type: "Tài chính",
  },
  {
    title: "Báo cáo hiệu suất giao drone",
    description: "Tỷ lệ thành công, thời gian giao trung bình, số lượng chuyến",
    date: "Cập nhật: 2025-01-11",
    type: "Vận hành",
  },
  {
    title: "Báo cáo tỉ lệ đơn hủy",
    description: "Phân tích nguyên nhân hủy, so sánh với các kỳ trước",
    date: "Cập nhật: 2025-01-10",
    type: "Khách hàng",
  },
  {
    title: "Báo cáo tình trạng hoạt động khu vực",
    description: "Hiệu suất giao hàng theo từng quận/huyện",
    date: "Cập nhật: 2025-01-11",
    type: "Khu vực",
  },
]

const revenueData = [
  { date: "01/01", revenue: 2400, orders: 120, cancels: 8 },
  { date: "02/01", revenue: 3200, orders: 145, cancels: 12 },
  { date: "03/01", revenue: 2800, orders: 130, cancels: 9 },
  { date: "04/01", revenue: 3600, orders: 160, cancels: 10 },
  { date: "05/01", revenue: 4200, orders: 185, cancels: 14 },
  { date: "06/01", revenue: 3900, orders: 172, cancels: 11 },
  { date: "07/01", revenue: 4500, orders: 200, cancels: 15 },
]

const droneStats = [
  { id: "D001", name: "Drone 001", totalFlights: 245, successRate: 98.4, avgTime: 18, battery: 85 },
  { id: "D002", name: "Drone 002", totalFlights: 223, successRate: 97.8, avgTime: 19, battery: 72 },
  { id: "D003", name: "Drone 003", totalFlights: 198, successRate: 99.1, avgTime: 17, battery: 91 },
  { id: "D004", name: "Drone 004", totalFlights: 189, successRate: 96.3, avgTime: 20, battery: 45 },
  { id: "D005", name: "Drone 005", totalFlights: 210, successRate: 98.6, avgTime: 18, battery: 68 },
]

const restaurantStats = [
  { id: "R001", name: "Phở Hà Nội", orders: 156, revenue: 18720, rating: 4.8, cancelRate: 2.5 },
  { id: "R002", name: "Cơm Tấm Sài Gòn", orders: 143, revenue: 15860, rating: 4.6, cancelRate: 3.2 },
  { id: "R003", name: "Bánh Mì Việt", orders: 128, revenue: 12160, rating: 4.7, cancelRate: 2.8 },
  { id: "R004", name: "Tôm Hùm Hoàng Gia", orders: 98, revenue: 28350, rating: 4.9, cancelRate: 1.5 },
  { id: "R005", name: "Gà Rô Tí Nakhon", orders: 87, revenue: 9570, rating: 4.5, cancelRate: 4.1 },
]

const paymentMethods = [
  { name: "VNPay", value: 42, color: "#2563eb" },
  { name: "Momo", value: 35, color: "#d84315" },
  { name: "ZaloPay", value: 18, color: "#0084ff" },
  { name: "COD", value: 5, color: "#90a4ae" },
]

const cancelReasons = [
  { reason: "Hết hàng", count: 32 },
  { reason: "Giao thất lại", count: 28 },
  { reason: "Khách hủy", count: 22 },
  { reason: "Drone có sự cố", count: 18 },
  { reason: "Lỗi hệ thống", count: 8 },
]

export default function ReportsPage() {
  const [timeframe, setTimeframe] = useState("month")

  const totalOrders = revenueData.reduce((sum, d) => sum + d.orders, 0)
  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0)
  const totalCancels = revenueData.reduce((sum, d) => sum + d.cancels, 0)
  const cancelRate = ((totalCancels / totalOrders) * 100).toFixed(1)
  const avgRating = (restaurantStats.reduce((sum, r) => sum + r.rating, 0) / restaurantStats.length).toFixed(1)

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border border-border">
          <p className="text-sm text-muted-foreground">Tổng đơn hàng</p>
          <p className="text-3xl font-bold text-primary mt-2">{totalOrders}</p>
          <p className="text-xs text-green-600 mt-1">+12% so với tuần trước</p>
        </Card>
        <Card className="p-4 border border-border">
          <p className="text-sm text-muted-foreground">Doanh thu</p>
          <p className="text-3xl font-bold text-primary mt-2">{(totalRevenue / 1000).toFixed(1)}K</p>
          <p className="text-xs text-green-600 mt-1">+8% so với tuần trước</p>
        </Card>
        <Card className="p-4 border border-border">
          <p className="text-sm text-muted-foreground">Tỉ lệ hủy</p>
          <p className="text-3xl font-bold text-primary mt-2">{cancelRate}%</p>
          <p className="text-xs text-yellow-600 mt-1">{totalCancels} đơn đã hủy</p>
        </Card>
        <Card className="p-4 border border-border">
          <p className="text-sm text-muted-foreground">Đánh giá TB</p>
          <p className="text-3xl font-bold text-primary mt-2">{avgRating}⭐</p>
          <p className="text-xs text-green-600 mt-1">Từ {restaurantStats.length} nhà hàng</p>
        </Card>
      </div>

      {/* Revenue trend chart */}
      <Card className="p-6 border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">Xu hướng doanh thu & đơn hàng</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#d84315" name="Doanh thu (K)" />
            <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#2563eb" name="Số đơn" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Payment methods and cancel reasons pie charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Phương thức thanh toán</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={paymentMethods}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {paymentMethods.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Lý do hủy đơn</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={cancelReasons}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="reason" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#d84315" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Drone performance table */}
      <Card className="p-6 border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">Hiệu suất hoạt động Drone</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Mã Drone</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Tên</th>
                <th className="text-center py-3 px-4 font-semibold text-foreground">Tổng chuyến</th>
                <th className="text-center py-3 px-4 font-semibold text-foreground">Tỉ lệ thành công</th>
                <th className="text-center py-3 px-4 font-semibold text-foreground">Thời gian TB (phút)</th>
                <th className="text-center py-3 px-4 font-semibold text-foreground">Pin</th>
              </tr>
            </thead>
            <tbody>
              {droneStats.map((drone) => (
                <tr key={drone.id} className="border-b border-border hover:bg-muted/50">
                  <td className="py-3 px-4 text-foreground font-mono">{drone.id}</td>
                  <td className="py-3 px-4 text-foreground">{drone.name}</td>
                  <td className="py-3 px-4 text-center">{drone.totalFlights}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={
                        drone.successRate >= 98 ? "text-green-600 font-semibold" : "text-yellow-600 font-semibold"
                      }
                    >
                      {drone.successRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">{drone.avgTime}p</td>
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
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Restaurant performance table */}
      <Card className="p-6 border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">Hiệu suất hoạt động Nhà hàng</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Mã NCC</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Tên nhà hàng</th>
                <th className="text-center py-3 px-4 font-semibold text-foreground">Số đơn</th>
                <th className="text-center py-3 px-4 font-semibold text-foreground">Doanh thu</th>
                <th className="text-center py-3 px-4 font-semibold text-foreground">Đánh giá</th>
                <th className="text-center py-3 px-4 font-semibold text-foreground">Tỉ lệ hủy</th>
              </tr>
            </thead>
            <tbody>
              {restaurantStats.map((restaurant) => (
                <tr key={restaurant.id} className="border-b border-border hover:bg-muted/50">
                  <td className="py-3 px-4 text-foreground font-mono">{restaurant.id}</td>
                  <td className="py-3 px-4 text-foreground">{restaurant.name}</td>
                  <td className="py-3 px-4 text-center font-semibold">{restaurant.orders}</td>
                  <td className="py-3 px-4 text-center font-semibold text-primary">
                    {restaurant.revenue.toLocaleString()}₫
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-yellow-500 font-semibold">{restaurant.rating}⭐</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={
                        restaurant.cancelRate <= 2.5
                          ? "text-green-600 font-semibold"
                          : restaurant.cancelRate <= 3.5
                            ? "text-yellow-600 font-semibold"
                            : "text-red-600 font-semibold"
                      }
                    >
                      {restaurant.cancelRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Existing reports grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report, idx) => (
          <Card key={idx} className="p-6 border border-border space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 rounded-lg bg-primary/10 mt-1">{/* Placeholder for chart icon */}</div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg">{report.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{report.type}</span>
                    <span className="text-xs text-muted-foreground">{report.date}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                {/* Placeholder for download icon */}
                Excel
              </Button>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                {/* Placeholder for download icon */}
                PDF
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
