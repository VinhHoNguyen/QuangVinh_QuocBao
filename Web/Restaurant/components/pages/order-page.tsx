"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Check, X, TrendingUp } from "lucide-react"

const STATUS_COLORS = {
  "CHỜ XỬ LÝ": "bg-yellow-100 text-yellow-800",
  "ĐÃ CHẤP NHẬN": "bg-blue-100 text-blue-800",
  "ĐANG CHUẨN BỊ": "bg-purple-100 text-purple-800",
  "SẴN SÀNG": "bg-green-100 text-green-800",
  "ĐÃ LẤY": "bg-cyan-100 text-cyan-800",
  "ĐANG GIAO": "bg-indigo-100 text-indigo-800",
  "ĐÃ GIAO": "bg-green-200 text-green-900",
  "ĐÃ TỪ CHỐI": "bg-red-100 text-red-800",
}

export function OrderPage() {
  const [orders, setOrders] = useState([
    {
      id: "#ORD001",
      customer: "Nguyễn Văn A",
      items: "Phở Bò x2, Gỏi Cuốn x1",
      total: 135000,
      status: "CHỜ XỬ LÝ",
      time: "14:30",
    },
    {
      id: "#ORD002",
      customer: "Trần Thị B",
      items: "Bánh Mì x1",
      total: 25000,
      status: "ĐÃ CHẤP NHẬN",
      time: "14:25",
    },
    {
      id: "#ORD003",
      customer: "Lê Văn C",
      items: "Cơm Chiên x3",
      total: 105000,
      status: "ĐANG CHUẨN BỊ",
      time: "14:20",
    },
  ])

  const [selectedOrder, setSelectedOrder] = useState<(typeof orders)[0] | null>(null)
  const [showRejectReason, setShowRejectReason] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  const getStatistics = () => {
    return {
      "CHỜ XỬ LÝ": orders.filter((o) => o.status === "CHỜ XỬ LÝ").length,
      "ĐÃ CHẤP NHẬN": orders.filter((o) => o.status === "ĐÃ CHẤP NHẬN").length,
      "ĐANG CHUẨN BỊ": orders.filter((o) => o.status === "ĐANG CHUẨN BỊ").length,
      "SẴN SÀNG": orders.filter((o) => o.status === "SẴN SÀNG").length,
    }
  }

  const handleAcceptOrder = (orderId: string) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: "ĐÃ CHẤP NHẬN" } : order)))
  }

  const handleRejectOrder = (orderId: string) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: "ĐÃ TỪ CHỐI" } : order)))
    setShowRejectReason(false)
    setRejectReason("")
  }

  const handleUpdateStatus = (orderId: string) => {
    const statusFlow = ["CHỜ XỬ LÝ", "ĐÃ CHẤP NHẬN", "ĐANG CHUẨN BỊ", "SẴN SÀNG", "ĐÃ LẤY", "ĐANG GIAO", "ĐÃ GIAO"]
    setOrders(
      orders.map((order) => {
        if (order.id === orderId) {
          const currentIndex = statusFlow.indexOf(order.status)
          const nextStatus = statusFlow[currentIndex + 1] || order.status
          return { ...order, status: nextStatus }
        }
        return order
      }),
    )
  }

  const stats = getStatistics()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Chờ Xử Lý", key: "CHỜ XỬ LÝ", color: "bg-yellow-100" },
          { label: "Đã Chấp Nhận", key: "ĐÃ CHẤP NHẬN", color: "bg-blue-100" },
          { label: "Đang Chuẩn Bị", key: "ĐANG CHUẨN BỊ", color: "bg-purple-100" },
          { label: "Sẵn Sàng", key: "SẴN SÀNG", color: "bg-green-100" },
        ].map((stat) => (
          <Card key={stat.label} className={`${stat.color} border-border`}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold text-primary mt-2">{stats[stat.key as keyof typeof stats]}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted">
          <TabsTrigger
            value="pending"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Chờ Xử Lý
          </TabsTrigger>
          <TabsTrigger
            value="active"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Đang Xử Lý
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Hoàn Thành
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {orders
            .filter((order) => order.status === "CHỜ XỬ LÝ")
            .map((order) => (
              <Card key={order.id} className="border-border hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-bold text-lg text-foreground">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                      <p className="text-sm text-muted-foreground mt-1">{order.time}</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">{order.status}</Badge>
                  </div>
                  <p className="text-sm text-foreground mb-3">
                    <span className="font-semibold">Món:</span> {order.items}
                  </p>
                  <p className="text-lg font-bold text-primary mb-4">Tổng: {order.total.toLocaleString("vi-VN")}đ</p>
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-primary hover:bg-accent" onClick={() => handleAcceptOrder(order.id)}>
                      <Check size={16} className="mr-2" /> Chấp Nhận
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                      onClick={() => {
                        setSelectedOrder(order)
                        setShowRejectReason(true)
                      }}
                    >
                      <X size={16} className="mr-2" /> Từ Chối
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {orders
            .filter((order) => ["ĐÃ CHẤP NHẬN", "ĐANG CHUẨN BỊ", "SẴN SÀNG"].includes(order.status))
            .map((order) => (
              <Card key={order.id} className="border-border hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-bold text-lg text-foreground">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                    </div>
                    <Badge className={STATUS_COLORS[order.status as keyof typeof STATUS_COLORS]}>{order.status}</Badge>
                  </div>
                  <p className="text-sm text-foreground mb-3">
                    <span className="font-semibold">Món:</span> {order.items}
                  </p>
                  <p className="text-lg font-bold text-primary mb-4">Tổng: {order.total.toLocaleString("vi-VN")}đ</p>
                  <Button className="w-full bg-primary hover:bg-accent" onClick={() => handleUpdateStatus(order.id)}>
                    <TrendingUp size={16} className="mr-2" /> Cập Nhật Trạng Thái
                  </Button>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {orders
            .filter((order) => ["ĐÃ GIAO", "ĐÃ TỪ CHỐI"].includes(order.status))
            .map((order) => (
              <Card key={order.id} className="border-border opacity-75">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-foreground">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                      <p className="text-sm text-muted-foreground mt-1">{order.time}</p>
                    </div>
                    <Badge className={STATUS_COLORS[order.status as keyof typeof STATUS_COLORS]}>{order.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>

      {showRejectReason && selectedOrder && (
        <Card className="border-destructive bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">Từ Chối Đơn Hàng {selectedOrder.id}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Lý Do Từ Chối</label>
              <textarea
                className="w-full p-2 border border-border rounded-md"
                placeholder="Nhập lý do từ chối"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowRejectReason(false)}>
                Hủy
              </Button>
              <Button
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                onClick={() => handleRejectOrder(selectedOrder.id)}
              >
                Xác Nhận Từ Chối
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
