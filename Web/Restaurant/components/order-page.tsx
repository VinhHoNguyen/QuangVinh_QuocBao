"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Check, X, TrendingUp, Phone, Printer, RefreshCw } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { orderAPI, Order } from "@/lib/api"
import { useWebSocket } from "@/lib/websocket"

// Map backend status to Vietnamese display
const STATUS_DISPLAY: Record<Order['status'], string> = {
  "pending": "CHỜ XỬ LÝ",
  "confirmed": "ĐÃ CHẤP NHẬN",
  "preparing": "ĐANG CHUẨN BỊ",
  "ready": "SẴN SÀNG",
  "delivering": "ĐANG GIAO",
  "delivered": "ĐÃ GIAO",
  "cancelled": "ĐÃ HỦY",
}

const STATUS_COLORS: Record<string, string> = {
  "CHỜ XỬ LÝ": "bg-yellow-100 text-yellow-800",
  "ĐÃ CHẤP NHẬN": "bg-blue-100 text-blue-800",
  "ĐANG CHUẨN BỊ": "bg-purple-100 text-purple-800",
  "SẴN SÀNG": "bg-green-100 text-green-800",
  "ĐANG GIAO": "bg-indigo-100 text-indigo-800",
  "ĐÃ GIAO": "bg-green-200 text-green-900",
  "ĐÃ HỦY": "bg-red-100 text-red-800",
}

// Status flow for progression
const STATUS_FLOW: Order['status'][] = ["pending", "confirmed", "preparing", "ready", "delivering", "delivered"]

const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
  const currentIndex = STATUS_FLOW.indexOf(currentStatus)
  return currentIndex !== -1 && currentIndex < STATUS_FLOW.length - 1 ? STATUS_FLOW[currentIndex + 1] : null
}

export function OrderPage() {
  const { restaurantId } = useAuth()
  const { updateOrderStatus } = useWebSocket()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showRejectOptions, setShowRejectOptions] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("pending")

  const rejectReasons = ["Hết món", "Quán bận", "Lỗi kỹ thuật", "Yêu cầu khác"]

  // Load orders from MongoDB
  useEffect(() => {
    loadOrders()
    // Auto refresh every 30 seconds
    const interval = setInterval(loadOrders, 30000)
    return () => clearInterval(interval)
  }, [restaurantId])

  // Listen for WebSocket order refresh events
  useEffect(() => {
    const handleOrderRefresh = () => {
      console.log("[Restaurant] Order refresh triggered by WebSocket")
      loadOrders()
    }

    window.addEventListener('order:refresh', handleOrderRefresh)
    return () => window.removeEventListener('order:refresh', handleOrderRefresh)
  }, [restaurantId])

  const loadOrders = async () => {
    if (!restaurantId) {
      setError("Restaurant ID not found")
      setLoading(false)
      return
    }

    try {
      setError("")
      const data = await orderAPI.getRestaurantOrders(restaurantId)
      setOrders(data)
      console.log("[Restaurant] Loaded orders:", data.length)
    } catch (err: any) {
      console.error("[Restaurant] Load orders error:", err)
      setError(err.message || "Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  const getStatistics = () => {
    return {
      "CHỜ XỬ LÝ": orders.filter((o) => o.status === "pending").length,
      "ĐÃ CHẤP NHẬN": orders.filter((o) => o.status === "confirmed").length,
      "ĐANG CHUẨN BỊ": orders.filter((o) => o.status === "preparing").length,
      "SẴN SÀNG": orders.filter((o) => o.status === "ready").length,
    }
  }

  const handleAcceptOrder = async (orderId: string) => {
    try {
      const order = orders.find((o) => o._id === orderId)
      await orderAPI.updateStatus(orderId, "confirmed")
      setOrders(orders.map((order) => (order._id === orderId ? { ...order, status: "confirmed" } : order)))
      console.log("[Restaurant] Order confirmed:", orderId)
      
      // Notify customer via WebSocket
      if (order && order.userId) {
        updateOrderStatus(orderId, "confirmed", order.userId)
      }
    } catch (err: any) {
      alert("Failed to confirm order: " + err.message)
    }
  }

  const handleRejectOrder = async (orderId: string, reason: string) => {
    try {
      const order = orders.find((o) => o._id === orderId)
      await orderAPI.cancelOrder(orderId, reason)
      setOrders(orders.map((order) => (order._id === orderId ? { ...order, status: "cancelled" } : order)))
      setShowRejectOptions(null)
      console.log("[Restaurant] Order cancelled:", orderId, reason)
      
      // Notify customer via WebSocket
      if (order && order.userId) {
        updateOrderStatus(orderId, "cancelled", order.userId)
      }
    } catch (err: any) {
      alert("Failed to cancel order: " + err.message)
    }
  }

  const handleAutoNextStatus = async (orderId: string) => {
    const order = orders.find((o) => o._id === orderId)
    if (!order) return

    const nextStatus = getNextStatus(order.status)
    if (!nextStatus) return

    try {
      await orderAPI.updateStatus(orderId, nextStatus)
      setOrders(orders.map((o) => (o._id === orderId ? { ...o, status: nextStatus } : o)))
      
      console.log("[Restaurant] Order status updated:", orderId, order.status, "→", nextStatus)
      
      // Notify customer via WebSocket
      if (order.userId) {
        updateOrderStatus(orderId, nextStatus, order.userId)
      }
      
      // Auto switch tab
      if (nextStatus === "ready" || nextStatus === "delivering") {
        setActiveTab("ready")
      }
    } catch (err: any) {
      alert("Failed to update status: " + err.message)
    }
  }

  const handlePrint = (order: Order) => {
    const itemsList = order.items.map(item => `${item.productName} x${item.quantity} - ${item.price.toLocaleString("vi-VN")}đ`).join('\n')
    const printContent = `
      PHIẾU BẾP
      ========================
      Đơn: ${order._id.slice(-8)}
      Khách: ${order.customerName}
      SĐT: ${order.customerPhone}
      Thời gian: ${new Date(order.createdAt).toLocaleString("vi-VN")}
      
      Ghi chú: ${order.notes || "Không có"}
      
      CHI TIẾT MÓN:
      ${itemsList}
      
      Địa chỉ giao: ${order.shippingAddress.street}, ${order.shippingAddress.district}, ${order.shippingAddress.city}
      
      Tổng tiền: ${order.totalAmount.toLocaleString("vi-VN")}đ
      Thanh toán: ${order.paymentMethod}
    `
    const printWindow = window.open("", "", "width=400,height=600")
    if (printWindow) {
      printWindow.document.write("<pre>" + printContent + "</pre>")
      printWindow.print()
      printWindow.close()
    }
  }

  const stats = getStatistics()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin mr-2" />
        <span>Đang tải đơn hàng...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
        <Button onClick={loadOrders}>
          <RefreshCw className="mr-2" /> Thử Lại
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản Lý Đơn Hàng</h2>
        <Button onClick={loadOrders} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" /> Làm Mới
        </Button>
      </div>

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
                {orders.filter((o) => o.status === "pending").length}
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
                {orders.filter((o) => ["confirmed", "preparing"].includes(o.status)).length}
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
                {orders.filter((o) => ["ready", "delivering"].includes(o.status)).length}
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
                {orders.filter((o) => ["delivered", "cancelled"].includes(o.status)).length}
              </Badge>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {orders.filter((order) => order.status === "pending").length === 0 ? (
            <Card className="border-border">
              <CardContent className="pt-6 text-center text-muted-foreground">
                Không có đơn hàng chờ xử lý
              </CardContent>
            </Card>
          ) : (
            orders
              .filter((order) => order.status === "pending")
              .map((order) => {
                const itemsList = order.items.map(item => `${item.productName} x${item.quantity}`).join(", ")
                return (
                  <Card key={order._id} className="border-border hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <p className="font-bold text-lg text-foreground">#{order._id.slice(-8)}</p>
                          <p className="text-sm text-muted-foreground">{order.customerName}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Phone size={14} className="text-primary" />
                            <a href={`tel:${order.customerPhone}`} className="text-sm text-primary hover:underline">
                              {order.customerPhone}
                            </a>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Đặt lúc: {new Date(order.createdAt).toLocaleString("vi-VN")}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">Ghi chú: {order.notes || "Không có"}</p>
                        </div>
                        <Badge className={STATUS_COLORS[STATUS_DISPLAY[order.status]]}>
                          {STATUS_DISPLAY[order.status]}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground mb-3">
                        <span className="font-semibold">Món:</span> {itemsList}
                      </p>
                      <p className="text-lg font-bold text-primary mb-4">
                        Tổng: {order.totalAmount.toLocaleString("vi-VN")}đ
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          className="flex-1 min-w-[120px] bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleAcceptOrder(order._id)}
                        >
                          <Check size={16} className="mr-2" /> Nhận Đơn
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 min-w-[120px] text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                          onClick={() => setShowRejectOptions(order._id)}
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
                      {showRejectOptions === order._id && (
                        <div className="mt-4 p-3 bg-red-50 rounded-md border border-red-200">
                          <p className="text-sm font-semibold text-foreground mb-2">Chọn lý do hủy:</p>
                          <div className="space-y-2">
                            {rejectReasons.map((reason) => (
                              <button
                                key={reason}
                                className="w-full text-left p-2 text-sm hover:bg-red-100 rounded transition-colors"
                                onClick={() => handleRejectOrder(order._id, reason)}
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
                )
              })
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {orders.filter((order) => ["confirmed", "preparing"].includes(order.status)).length === 0 ? (
            <Card className="border-border">
              <CardContent className="pt-6 text-center text-muted-foreground">
                Không có đơn hàng đang xử lý
              </CardContent>
            </Card>
          ) : (
            orders
              .filter((order) => ["confirmed", "preparing"].includes(order.status))
              .map((order) => {
                const itemsList = order.items.map(item => `${item.productName} x${item.quantity}`).join(", ")
                return (
                  <Card key={order._id} className="border-border hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <p className="font-bold text-lg text-foreground">#{order._id.slice(-8)}</p>
                          <p className="text-sm text-muted-foreground">{order.customerName}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Phone size={14} className="text-primary" />
                            <a href={`tel:${order.customerPhone}`} className="text-sm text-primary hover:underline">
                              {order.customerPhone}
                            </a>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Đặt lúc: {new Date(order.createdAt).toLocaleString("vi-VN")}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">Ghi chú: {order.notes || "Không có"}</p>
                        </div>
                        <Badge className={STATUS_COLORS[STATUS_DISPLAY[order.status]]}>
                          {STATUS_DISPLAY[order.status]}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground mb-3">
                        <span className="font-semibold">Món:</span> {itemsList}
                      </p>
                      <p className="text-lg font-bold text-primary mb-4">
                        Tổng: {order.totalAmount.toLocaleString("vi-VN")}đ
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          className="flex-1 min-w-[120px] bg-primary hover:bg-accent"
                          onClick={() => handleAutoNextStatus(order._id)}
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
                )
              })
          )}
        </TabsContent>

        <TabsContent value="ready" className="space-y-4">
          {orders.filter((order) => ["ready", "delivering"].includes(order.status)).length === 0 ? (
            <Card className="border-border">
              <CardContent className="pt-6 text-center text-muted-foreground">
                Không có đơn hàng sẵn sàng giao
              </CardContent>
            </Card>
          ) : (
            orders
              .filter((order) => ["ready", "delivering"].includes(order.status))
              .map((order) => {
                const itemsList = order.items.map(item => `${item.productName} x${item.quantity}`).join(", ")
                return (
                  <Card key={order._id} className="border-border hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <p className="font-bold text-lg text-foreground">#{order._id.slice(-8)}</p>
                          <p className="text-sm text-muted-foreground">{order.customerName}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Phone size={14} className="text-primary" />
                            <a href={`tel:${order.customerPhone}`} className="text-sm text-primary hover:underline">
                              {order.customerPhone}
                            </a>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Đặt lúc: {new Date(order.createdAt).toLocaleString("vi-VN")}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">Ghi chú: {order.notes || "Không có"}</p>
                        </div>
                        <Badge className={STATUS_COLORS[STATUS_DISPLAY[order.status]]}>
                          {STATUS_DISPLAY[order.status]}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground mb-3">
                        <span className="font-semibold">Món:</span> {itemsList}
                      </p>
                      <p className="text-lg font-bold text-primary mb-4">
                        Tổng: {order.totalAmount.toLocaleString("vi-VN")}đ
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          className="flex-1 min-w-[120px] bg-primary hover:bg-accent"
                          onClick={() => handleAutoNextStatus(order._id)}
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
                )
              })
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {orders.filter((order) => ["delivered", "cancelled"].includes(order.status)).length === 0 ? (
            <Card className="border-border">
              <CardContent className="pt-6 text-center text-muted-foreground">
                Không có đơn hàng hoàn thành
              </CardContent>
            </Card>
          ) : (
            orders
              .filter((order) => ["delivered", "cancelled"].includes(order.status))
              .map((order) => {
                const itemsList = order.items.map(item => `${item.productName} x${item.quantity}`).join(", ")
                return (
                  <Card key={order._id} className="border-border opacity-75">
                    <CardHeader className="border-b">
                      <CardTitle>Chi Tiết Đơn Hàng #{order._id.slice(-8)}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground">Khách hàng</p>
                        <p className="text-foreground">{order.customerName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground">Số điện thoại</p>
                        <a href={`tel:${order.customerPhone}`} className="text-primary hover:underline">
                          {order.customerPhone}
                        </a>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground">Thời gian đặt</p>
                        <p className="text-foreground">{new Date(order.createdAt).toLocaleString("vi-VN")}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground">Trạng thái</p>
                        <Badge className={STATUS_COLORS[STATUS_DISPLAY[order.status]]}>
                          {STATUS_DISPLAY[order.status]}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground">Món ăn</p>
                        <p className="text-foreground">{itemsList}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground">Ghi chú</p>
                        <p className="text-foreground">{order.notes || "Không có"}</p>
                      </div>
                      <div className="border-t pt-4">
                        <p className="text-lg font-bold text-primary">
                          Tổng tiền: {order.totalAmount.toLocaleString("vi-VN")}đ
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
          )}
        </TabsContent>
      </Tabs>

      {showDetailModal && selectedOrder && (
        <Card className="border-border bg-white fixed inset-0 m-auto max-w-md max-h-96 overflow-y-auto shadow-2xl z-50">
          <CardHeader className="border-b">
            <CardTitle>Chi Tiết Đơn Hàng #{selectedOrder._id.slice(-8)}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Khách hàng</p>
              <p className="text-foreground">{selectedOrder.customerName}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Số điện thoại</p>
              <a href={`tel:${selectedOrder.customerPhone}`} className="text-primary hover:underline">
                {selectedOrder.customerPhone}
              </a>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Thời gian đặt</p>
              <p className="text-foreground">{new Date(selectedOrder.createdAt).toLocaleString("vi-VN")}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Trạng thái</p>
              <Badge className={STATUS_COLORS[STATUS_DISPLAY[selectedOrder.status]]}>
                {STATUS_DISPLAY[selectedOrder.status]}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Món ăn</p>
              {selectedOrder.items.map((item, idx) => (
                <p key={idx} className="text-foreground">
                  {item.productName} x{item.quantity} - {item.price.toLocaleString("vi-VN")}đ
                </p>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Địa chỉ giao</p>
              <p className="text-foreground">
                {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.district},{" "}
                {selectedOrder.shippingAddress.city}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Ghi chú</p>
              <p className="text-foreground">{selectedOrder.notes || "Không có"}</p>
            </div>
            <div className="border-t pt-4">
              <p className="text-lg font-bold text-primary">
                Tổng tiền: {selectedOrder.totalAmount.toLocaleString("vi-VN")}đ
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
