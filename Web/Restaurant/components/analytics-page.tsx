"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Download } from "lucide-react"

const revenueData = [
  { day: "T2", revenue: 2400000 },
  { day: "T3", revenue: 2210000 },
  { day: "T4", revenue: 2290000 },
  { day: "T5", revenue: 2000000 },
  { day: "T6", revenue: 2181000 },
  { day: "T7", revenue: 2500000 },
  { day: "CN", revenue: 2100000 },
]

const orderStatusData = [
  { name: "Hoàn Thành", value: 350 },
  { name: "Đã Từ Chối", value: 45 },
  { name: "Đang Xử Lý", value: 25 },
]

const topDishes = [
  { name: "Phở Bò", count: 125 },
  { name: "Bánh Mì", count: 108 },
  { name: "Cơm Chiên", count: 95 },
  { name: "Gỏi Cuốn", count: 82 },
  { name: "Bún Chả", count: 78 },
]

const COLORS = ["#10B981", "#EF4444", "#F59E0B"]

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Thống Kê & Báo Cáo</h1>
        <Button className="bg-primary hover:bg-accent">
          <Download size={16} className="mr-2" /> Xuất Báo Cáo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <p className="text-sm text-green-700">Doanh Thu Hôm Nay</p>
            <p className="text-2xl font-bold text-green-600 mt-2">2,100,000đ</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-700">Đơn Hàng Hôm Nay</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">42</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <p className="text-sm text-yellow-700">Đánh Giá Trung Bình</p>
            <p className="text-2xl font-bold text-yellow-600 mt-2">4.8/5</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="pt-6">
            <p className="text-sm text-purple-700">Tỷ Lệ Thành Công</p>
            <p className="text-2xl font-bold text-purple-600 mt-2">98.5%</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Doanh Thu Theo Ngày</CardTitle>
            <CardDescription>Biểu đồ doanh thu 7 ngày qua</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#E85D3E" name="Doanh Thu (VND)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Trạng Thái Đơn Hàng</CardTitle>
            <CardDescription>Phân bổ trạng thái đơn hàng</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#E85D3E"
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Dishes */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Món Ăn Bán Chạy Nhất</CardTitle>
          <CardDescription>Top 5 món ăn được đặt nhiều nhất</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topDishes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#E85D3E" name="Số Lượng" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Export Section */}
      <Card className="border-primary bg-primary/5">
        <CardHeader>
          <CardTitle>Xuất Báo Cáo</CardTitle>
          <CardDescription>Tải xuống báo cáo doanh thu theo định dạng CSV hoặc PDF</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button className="bg-primary hover:bg-accent">
            <Download size={16} className="mr-2" /> Xuất CSV
          </Button>
          <Button className="bg-primary hover:bg-accent">
            <Download size={16} className="mr-2" /> Xuất PDF
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
