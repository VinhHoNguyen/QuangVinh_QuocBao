"use client"

import { Card } from "@/components/ui/card"
import {
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
  BarChart,
  Bar,
} from "recharts"
import { useState } from "react"

const transactions = [
  {
    id: "TXN001",
    orderId: "ORD-2024-001",
    restaurant: "Pizza Italia",
    amount: 250000,
    method: "VNPay",
    status: "Hoàn tất",
    date: "2024-11-08",
    commission: 15000,
    platformFee: 10000,
  },
  {
    id: "TXN002",
    orderId: "ORD-2024-002",
    restaurant: "Phở Hà Nội",
    amount: 180000,
    method: "Momo",
    status: "Hoàn tất",
    date: "2024-11-08",
    commission: 10800,
    platformFee: 7200,
  },
  {
    id: "TXN003",
    orderId: "ORD-2024-003",
    restaurant: "Burger King",
    amount: 350000,
    method: "ZaloPay",
    status: "Hoàn tất",
    date: "2024-11-08",
    commission: 21000,
    platformFee: 14000,
  },
  {
    id: "TXN004",
    orderId: "ORD-2024-004",
    restaurant: "Sushi Palace",
    amount: 420000,
    method: "VNPay",
    status: "Hoàn tất",
    date: "2024-11-07",
    commission: 25200,
    platformFee: 16800,
  },
  {
    id: "TXN005",
    orderId: "ORD-2024-005",
    restaurant: "Cơm Tấm Sài Gòn",
    amount: 95000,
    method: "Momo",
    status: "Hoàn tất",
    date: "2024-11-07",
    commission: 5700,
    platformFee: 3800,
  },
  {
    id: "TXN006",
    orderId: "ORD-2024-006",
    restaurant: "Pizza Italia",
    amount: 320000,
    method: "ZaloPay",
    status: "Chờ xác nhận",
    date: "2024-11-08",
    commission: 19200,
    platformFee: 12800,
  },
  {
    id: "TXN007",
    orderId: "ORD-2024-007",
    restaurant: "Phở Hà Nội",
    amount: 215000,
    method: "VNPay",
    status: "Hoàn tất",
    date: "2024-11-06",
    commission: 12900,
    platformFee: 8600,
  },
  {
    id: "TXN008",
    orderId: "ORD-2024-008",
    restaurant: "Burger King",
    amount: 275000,
    method: "Momo",
    status: "Hoàn tất",
    date: "2024-11-06",
    commission: 16500,
    platformFee: 11000,
  },
]

const restaurantCommissions = [
  {
    name: "Pizza Italia",
    revenue: 570000,
    commission: 34200,
    platformFee: 22800,
    pendingPayment: 19200,
    lastPayout: "2024-11-01",
    status: "Thanh toán",
  },
  {
    name: "Phở Hà Nội",
    revenue: 395000,
    commission: 23700,
    platformFee: 15800,
    pendingPayment: 12900,
    lastPayout: "2024-11-01",
    status: "Thanh toán",
  },
  {
    name: "Burger King",
    revenue: 625000,
    commission: 37500,
    platformFee: 25000,
    pendingPayment: 16500,
    lastPayout: "2024-11-01",
    status: "Thanh toán",
  },
  {
    name: "Sushi Palace",
    revenue: 420000,
    commission: 25200,
    platformFee: 16800,
    pendingPayment: 0,
    lastPayout: "2024-11-05",
    status: "Đã thanh toán",
  },
  {
    name: "Cơm Tấm Sài Gòn",
    revenue: 95000,
    commission: 5700,
    platformFee: 3800,
    pendingPayment: 5700,
    lastPayout: "2024-11-01",
    status: "Thanh toán",
  },
]

const revenueByDay = [
  { date: "1-5", total: 1200000, commission: 72000, platformFee: 48000, transactions: 12 },
  { date: "6-10", total: 1900000, commission: 114000, platformFee: 76000, transactions: 19 },
  { date: "11-15", total: 1200000, commission: 72000, platformFee: 48000, transactions: 12 },
  { date: "16-20", total: 2200000, commission: 132000, platformFee: 88000, transactions: 22 },
  { date: "21-25", total: 2290000, commission: 137400, platformFee: 91600, transactions: 23 },
  { date: "26-31", total: 1890000, commission: 113400, platformFee: 75600, transactions: 19 },
]

const monthlyTrend = [
  { month: "Tháng 9", revenue: 8500000, commission: 510000, platformFee: 340000 },
  { month: "Tháng 10", revenue: 10200000, commission: 612000, platformFee: 408000 },
  { month: "Tháng 11", revenue: 10680000, commission: 640800, platformFee: 427200 },
]

const paymentMethods = [
  { name: "VNPay", transactions: 18, percentage: 45, color: "#0066cc" },
  { name: "Momo", transactions: 14, percentage: 35, color: "#a60c00" },
  { name: "ZaloPay", transactions: 8, percentage: 20, color: "#0084ff" },
]

export default function PaymentsPage() {
  const [filterMethod, setFilterMethod] = useState("Tất cả")
  const [filterStatus, setFilterStatus] = useState("Tất cả")
  const [timeRange, setTimeRange] = useState("month")

  const filteredTransactions = transactions.filter(
    (t) =>
      (filterMethod === "Tất cả" || t.method === filterMethod) &&
      (filterStatus === "Tất cả" || t.status === filterStatus),
  )

  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0)
  const totalCommission = transactions.reduce((sum, t) => sum + t.commission, 0)
  const totalPlatformFee = transactions.reduce((sum, t) => sum + t.platformFee, 0)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Quản lý thanh toán & doanh thu</h1>
        <p className="text-muted-foreground mt-1">Theo dõi giao dịch, doanh thu, chia hoa hồng</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Tổng doanh thu</p>
          <p className="text-2xl font-bold text-foreground">{(totalRevenue / 1000000).toFixed(1)}M đ</p>
          <p className="text-xs text-green-600 mt-2">↑ 12% so với tháng trước</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Hoa hồng nhà hàng</p>
          <p className="text-2xl font-bold text-foreground">{(totalCommission / 1000000).toFixed(1)}M đ</p>
          <p className="text-xs text-muted-foreground mt-2">{transactions.length} giao dịch</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Phí nền tảng</p>
          <p className="text-2xl font-bold text-foreground">{(totalPlatformFee / 1000000).toFixed(1)}M đ</p>
          <p className="text-xs text-muted-foreground mt-2">6% doanh thu</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Tỷ lệ thành công</p>
          <p className="text-2xl font-bold text-green-600">99.2%</p>
          <p className="text-xs text-muted-foreground mt-2">Giao dịch hoàn tất</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Xu hướng doanh thu hàng ngày</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueByDay}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip
              contentStyle={{ backgroundColor: "var(--color-card)", border: `1px solid var(--color-border)` }}
              formatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#dc2626" strokeWidth={2} name="Tổng doanh thu" />
            <Line type="monotone" dataKey="commission" stroke="#ea580c" strokeWidth={2} name="Hoa hồng" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Phân tích xu hướng tháng</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip
              contentStyle={{ backgroundColor: "var(--color-card)", border: `1px solid var(--color-border)` }}
              formatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            />
            <Legend />
            <Bar dataKey="revenue" fill="#dc2626" name="Doanh thu" />
            <Bar dataKey="commission" fill="#ea580c" name="Hoa hồng" />
            <Bar dataKey="platformFee" fill="#f97316" name="Phí nền tảng" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Phương thức thanh toán</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={paymentMethods} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="transactions">
                {paymentMethods.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {paymentMethods.map((method, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-foreground">{method.name}</span>
                <span className="text-sm text-muted-foreground">
                  {method.transactions} giao dịch ({method.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Chia hoa hồng nhà hàng</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {restaurantCommissions.map((item, idx) => (
              <div key={idx} className="pb-3 border-b border-border last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Doanh thu: {(item.revenue / 1000000).toFixed(1)}M đ</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${item.status === "Đã thanh toán" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Hoa hồng</p>
                    <p className="font-semibold text-foreground">{(item.commission / 1000000).toFixed(1)}M</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Chờ thanh toán</p>
                    <p className="font-semibold text-orange-600">{(item.pendingPayment / 1000000).toFixed(1)}M</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Thanh toán lần cuối</p>
                    <p className="font-semibold text-foreground">{item.lastPayout}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-foreground">Quản lý giao dịch</h3>
          <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90">
            📥 Xuất báo cáo
          </button>
        </div>

        <div className="flex gap-3 mb-4 flex-wrap">
          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm text-foreground bg-background"
          >
            <option>Tất cả phương thức</option>
            <option>VNPay</option>
            <option>Momo</option>
            <option>ZaloPay</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm text-foreground bg-background"
          >
            <option>Tất cả trạng thái</option>
            <option>Hoàn tất</option>
            <option>Chờ xác nhận</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Mã giao dịch</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Nhà hàng</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Số tiền</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Phương thức</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Hoa hồng</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Trạng thái</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Ngày</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((txn, idx) => (
                <tr key={idx} className="border-b border-border hover:bg-muted/50">
                  <td className="py-3 px-4 text-foreground font-mono text-xs">{txn.id}</td>
                  <td className="py-3 px-4 text-foreground">{txn.restaurant}</td>
                  <td className="py-3 px-4 text-foreground font-semibold">{(txn.amount / 1000).toFixed(0)}K đ</td>
                  <td className="py-3 px-4">
                    <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">{txn.method}</span>
                  </td>
                  <td className="py-3 px-4 text-orange-600 font-semibold">{(txn.commission / 1000).toFixed(0)}K đ</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs px-2 py-1 rounded ${txn.status === "Hoàn tất" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                    >
                      {txn.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{txn.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
