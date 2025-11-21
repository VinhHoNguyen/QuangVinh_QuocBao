"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Check, X, TrendingUp, Phone, Printer } from "lucide-react"

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

const STATUS_FLOW = ["CHỜ XỬ LÝ", "ĐÃ CHẤP NHẬN", "ĐANG CHUẨN BỊ", "SẴN SÀNG", "ĐÃ LẤY", "ĐANG GIAO", "ĐÃ GIAO"]

const getNextStatus = (currentStatus: string): string | null => {
  const currentIndex = STATUS_FLOW.indexOf(currentStatus)
  return currentIndex !== -1 && currentIndex < STATUS_FLOW.length - 1 ? STATUS_FLOW[currentIndex + 1] : null
}

export function OrderPage() {
  const [orders, setOrders] = useState([
    {
      id: "#ORD001",
      customer: "Nguyễn Văn A",
      phone: "0912345678",
      items: "Phở Bò x2, Gỏi Cuốn x1",
      total: 135000,
      status: "CHỜ XỬ LÝ",
      time: "14:30",
      orderTime: "2024-12-20 14:30",
      note: "Ít cay, thêm nước mắm",
    },
    {
      id: "#ORD002",
      customer: "Trần Thị B",
      phone: "0987654321",
      items: "Bánh Mì x1",
      total: 25000,
      status: "ĐÃ CHẤP NHẬN",
      time: "14:25",
      orderTime: "2024-12-20 14:25",
      note: "Không ớt",
    },
    {
      id: "#ORD003",
      customer: "Lê Văn C",
      phone: "0901234567",
      items: "Cơm Chiên x3",
      total: 105000,
      status: "ĐANG CHUẨN BỊ",
      time: "14:20",
      orderTime: "2024-12-20 14:20",
      note: "Thêm trứng",
    },
  ])

  const [selectedOrder, setSelectedOrder] = useState<(typeof orders)[0] | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showRejectOptions, setShowRejectOptions] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("pending")

  const rejectReasons = ["Hết món", "Quán bận", "Lỗi kỹ thuật", "Yêu cầu khác"]

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

  const handleRejectOrder = (orderId: string, reason: string) => {
    setOrders(
      orders.map((order) => (order.id === orderId ? { ...order, status: "ĐÃ TỪ CHỐI", rejectReason: reason } : order)),
    )
    setShowRejectOptions(null)
  }

  const handleAutoNextStatus = (orderId: string) => {
    setOrders(
      orders.map((order) => {
        if (order.id === orderId) {
          const nextStatus = getNextStatus(order.status)
          if (nextStatus) {
            console.log("[v0] Order", orderId, "moving from", order.status, "to", nextStatus)
            if (nextStatus === "SẴN SÀNG" || nextStatus === "ĐÃ LẤY" || nextStatus === "ĐANG GIAO") {
              setActiveTab("ready")
            }
            return { ...order, status: nextStatus }
          }
        }
        return order
      }),
    )
  }

  const handlePrint = (order: (typeof orders)[0]) => {
    const printContent = `
      PHIẾU BẾP
      ========================
      Đơn: ${order.id}
      Khách: ${order.customer}
      SĐT: ${order.phone}
      Thời gian: ${order.orderTime}
      
      Ghi chú: ${order.note}
      
      CHI TIẾT MÓN:
      ${order.items}
      
      Tổng tiền: ${order.total.toLocaleString("vi-VN")}đ
    `
    const printWindow = window.open("", "", "width=400,height=600")
    if (printWindow) {
      printWindow.document.write("<pre>" + printContent + "</pre>")
      printWindow.print()
      printWindow.close()
    }
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-muted">
          <TabsTrigger
            value="pending"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <div className="flex items-center gap-2">
              <span>Chờ Xử Lý</span>
              <Badge variant="secondary" className="ml-1">
                {orders.filter((o) => o.status === "CHỜ XỬ LÝ").length}
              </Badge>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="active"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <div className="flex items-center gap-2">
              <span>Đang Xử Lý</span>
              <Badge variant="secondary" className="ml-1">
                {orders.filter((o) => ["ĐÃ CHẤP NHẬN", "ĐANG CHUẨN BỊ"].includes(o.status)).length}
              </Badge>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="ready"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <div className="flex items-center gap-2">
              <span>Sẵn Sàng Giao</span>
              <Badge variant="secondary" className="ml-1">
                {orders.filter((o) => ["SẴN SÀNG", "ĐÃ LẤY", "ĐANG GIAO"].includes(o.status)).length}
              </Badge>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <div className="flex items-center gap-2">
              <span>Hoàn Thành</span>
              <Badge variant="secondary" className="ml-1">
                {orders.filter((o) => ["ĐÃ GIAO", "ĐÃ TỪ CHỐI"].includes(o.status)).length}
              </Badge>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {orders
            .filter((order) => order.status === "CHỜ XỬ LÝ")
            .map((order) => (
              <Card key={order.id} className="border-border hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="font-bold text-lg text-foreground">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Phone size={14} className="text-primary" />
                        <a href={`tel:${order.phone}`} className="text-sm text-primary hover:underline">
                          {order.phone}
                        </a>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Đặt lúc: {order.orderTime}</p>
                      <p className="text-xs text-muted-foreground mt-1">Ghi chú: {order.note}</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">{order.status}</Badge>
                  </div>
                  <p className="text-sm text-foreground mb-3">
                    <span className="font-semibold">Món:</span> {order.items}
                  </p>
                  <p className="text-lg font-bold text-primary mb-4">Tổng: {order.total.toLocaleString("vi-VN")}đ</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      className="flex-1 min-w-[120px] bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleAcceptOrder(order.id)}
                    >
                      <Check size={16} className="mr-2" /> Nhận Đơn
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 min-w-[120px] text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                      onClick={() => setShowRejectOptions(order.id)}
                    >
                      <X size={16} className="mr-2" /> Hủy Đơn
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 min-w-[120px] bg-transparent"
                      onClick={() => handlePrint(order)}
                    >
                      <Printer size={16} className="mr-2" /> In Phiếu
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 min-w-[120px] bg-transparent"
                      onClick={() => {
                        setSelectedOrder(order)
                        setShowDetailModal(true)
                      }}
                    >
                      Xem Chi Tiết
                    </Button>
                  </div>
                  {showRejectOptions === order.id && (
                    <div className="mt-4 p-3 bg-red-50 rounded-md border border-red-200">
                      <p className="text-sm font-semibold text-foreground mb-2">Chọn lý do hủy:</p>
                      <div className="space-y-2">
                        {rejectReasons.map((reason) => (
                          <button
                            key={reason}
                            className="w-full text-left p-2 text-sm hover:bg-red-100 rounded transition-colors"
                            onClick={() => handleRejectOrder(order.id, reason)}
                          >
                            {reason}
                          </button>
                        ))}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => setShowRejectOptions(null)}
                      >
                        Đóng
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {orders
            .filter((order) => ["ĐÃ CHẤP NHẬN", "ĐANG CHUẨN BỊ"].includes(order.status))
            .map((order) => (
              <Card key={order.id} className="border-border hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="font-bold text-lg text-foreground">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Phone size={14} className="text-primary" />
                        <a href={`tel:${order.phone}`} className="text-sm text-primary hover:underline">
                          {order.phone}
                        </a>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Đặt lúc: {order.orderTime}</p>
                      <p className="text-xs text-muted-foreground mt-1">Ghi chú: {order.note}</p>
                    </div>
                    <Badge className={STATUS_COLORS[order.status as keyof typeof STATUS_COLORS]}>{order.status}</Badge>
                  </div>
                  <p className="text-sm text-foreground mb-3">
                    <span className="font-semibold">Món:</span> {order.items}
                  </p>
                  <p className="text-lg font-bold text-primary mb-4">Tổng: {order.total.toLocaleString("vi-VN")}đ</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      className="flex-1 min-w-[120px] bg-primary hover:bg-accent"
                      onClick={() => handleAutoNextStatus(order.id)}
                    >
                      <TrendingUp size={16} className="mr-2" />
                      Cập Nhật Trạng Thái
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 min-w-[120px] bg-transparent"
                      onClick={() => handlePrint(order)}
                    >
                      <Printer size={16} className="mr-2" /> In Phiếu
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 min-w-[120px] bg-transparent"
                      onClick={() => {
                        setSelectedOrder(order)
                        setShowDetailModal(true)
                      }}
                    >
                      Xem Chi Tiết
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="ready" className="space-y-4">
          {orders
            .filter((order) => ["SẴN SÀNG", "ĐÃ LẤY", "ĐANG GIAO"].includes(order.status))
            .map((order) => (
              <Card key={order.id} className="border-border hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="font-bold text-lg text-foreground">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Phone size={14} className="text-primary" />
                        <a href={`tel:${order.phone}`} className="text-sm text-primary hover:underline">
                          {order.phone}
                        </a>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Đặt lúc: {order.orderTime}</p>
                      <p className="text-xs text-muted-foreground mt-1">Ghi chú: {order.note}</p>
                    </div>
                    <Badge className={STATUS_COLORS[order.status as keyof typeof STATUS_COLORS]}>{order.status}</Badge>
                  </div>
                  <p className="text-sm text-foreground mb-3">
                    <span className="font-semibold">Món:</span> {order.items}
                  </p>
                  <p className="text-lg font-bold text-primary mb-4">Tổng: {order.total.toLocaleString("vi-VN")}đ</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      className="flex-1 min-w-[120px] bg-primary hover:bg-accent"
                      onClick={() => handleAutoNextStatus(order.id)}
                    >
                      <TrendingUp size={16} className="mr-2" />
                      Cập Nhật Trạng Thái
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 min-w-[120px] bg-transparent"
                      onClick={() => handlePrint(order)}
                    >
                      <Printer size={16} className="mr-2" /> In Phiếu
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 min-w-[120px] bg-transparent"
                      onClick={() => {
                        setSelectedOrder(order)
                        setShowDetailModal(true)
                      }}
                    >
                      Xem Chi Tiết
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {orders
            .filter((order) => ["ĐÃ GIAO", "ĐÃ TỪ CHỐI"].includes(order.status))
            .map((order) => (
              <Card key={order.id} className="border-border opacity-75">
                <CardHeader className="border-b">
                  <CardTitle>Chi Tiết Đơn Hàng {order.id}</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Khách hàng</p>
                    <p className="text-foreground">{order.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Số điện thoại</p>
                    <a href={`tel:${order.phone}`} className="text-primary hover:underline">
                      {order.phone}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Thời gian đặt</p>
                    <p className="text-foreground">{order.orderTime}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Trạng thái</p>
                    <Badge className={STATUS_COLORS[order.status as keyof typeof STATUS_COLORS]}>{order.status}</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Món ăn</p>
                    <p className="text-foreground">{order.items}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Ghi chú</p>
                    <p className="text-foreground">{order.note}</p>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-lg font-bold text-primary">Tổng tiền: {order.total.toLocaleString("vi-VN")}đ</p>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>

      {showDetailModal && selectedOrder && (
        <Card className="border-border bg-white fixed inset-0 m-auto max-w-md max-h-96 overflow-y-auto shadow-2xl z-50">
          <CardHeader className="border-b">
            <CardTitle>Chi Tiết Đơn Hàng {selectedOrder.id}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Khách hàng</p>
              <p className="text-foreground">{selectedOrder.customer}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Số điện thoại</p>
              <a href={`tel:${selectedOrder.phone}`} className="text-primary hover:underline">
                {selectedOrder.phone}
              </a>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Thời gian đặt</p>
              <p className="text-foreground">{selectedOrder.orderTime}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Trạng thái</p>
              <Badge className={STATUS_COLORS[selectedOrder.status as keyof typeof STATUS_COLORS]}>
                {selectedOrder.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Món ăn</p>
              <p className="text-foreground">{selectedOrder.items}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Ghi chú</p>
              <p className="text-foreground">{selectedOrder.note}</p>
            </div>
            <div className="border-t pt-4">
              <p className="text-lg font-bold text-primary">
                Tổng tiền: {selectedOrder.total.toLocaleString("vi-VN")}đ
              </p>
            </div>
            <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowDetailModal(false)}>
              Đóng
            </Button>
          </CardContent>
        </Card>
      )}

      {showDetailModal && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowDetailModal(false)} />}
    </div>
  )
}
