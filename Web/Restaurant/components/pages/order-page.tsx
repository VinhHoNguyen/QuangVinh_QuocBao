"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Check, X, TrendingUp, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { orderAPI } from "@/lib/api"
import { useWebSocket } from "@/lib/websocket-context"
import { toast } from "sonner"

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

// Status mapping
const STATUS_MAP: Record<string, string> = {
  'pending': 'CHỜ XỬ LÝ',
  'confirmed': 'ĐÃ CHẤP NHẬN',
  'preparing': 'ĐANG CHUẨN BỊ',
  'ready': 'SẴN SÀNG',
  'picked_up': 'ĐÃ LẤY',
  'delivering': 'ĐANG GIAO',
  'delivered': 'ĐÃ GIAO',
  'cancelled': 'ĐÃ TỪ CHỐI',
}

interface Order {
  _id: string
  restaurantId: string
  userId: string
  items: Array<{ productId: string; name: string; quantity: number; price: number }>
  totalPrice: number
  status: string
  createdAt: string
  shippingAddress?: { street: string; district: string; city: string }
}

export function OrderPage() {
  const { restaurantId } = useAuth()
  const { socket } = useWebSocket()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showRejectReason, setShowRejectReason] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  // Fetch orders on mount
  useEffect(() => {
    if (restaurantId) {
      fetchOrders()
    }
  }, [restaurantId])

  // WebSocket listener for new orders
  useEffect(() => {
    if (!socket) return

    socket.on('order:new', (newOrder: Order) => {
      if (newOrder.restaurantId === restaurantId) {
        setOrders(prev => [newOrder, ...prev])
        toast.success('Đơn hàng mới!', {
          description: `Đơn hàng mới từ khách hàng`
        })
      }
    })

    socket.on('order:updated', (updatedOrder: Order) => {
      if (updatedOrder.restaurantId === restaurantId) {
        setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o))
      }
    })

    return () => {
      socket.off('order:new')
      socket.off('order:updated')
    }
  }, [socket, restaurantId])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const data = await orderAPI.getRestaurantOrders(restaurantId!)
      setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Không thể tải đơn hàng')
    } finally {
      setLoading(false)
    }
  }

  const getStatistics = () => {
    if (!orders || !Array.isArray(orders)) {
      return {
        "CHỜ XỬ LÝ": 0,
        "ĐÃ CHẤP NHẬN": 0,
        "ĐANG CHUẨN BỊ": 0,
        "SẴN SÀNG": 0,
      }
    }
    return {
      "CHỜ XỬ LÝ": orders.filter((o) => o.status === "pending").length,
      "ĐÃ CHẤP NHẬN": orders.filter((o) => o.status === "confirmed").length,
      "ĐANG CHUẨN BỊ": orders.filter((o) => o.status === "preparing").length,
      "SẴN SÀNG": orders.filter((o) => o.status === "ready").length,
    }
  }

  const handleAcceptOrder = async (orderId: string) => {
    try {
      await orderAPI.updateStatus(orderId, 'confirmed')
      setOrders(orders.map((order) => (order._id === orderId ? { ...order, status: 'confirmed' } : order)))
      toast.success('Đã chấp nhận đơn hàng')
    } catch (error) {
      console.error('Error accepting order:', error)
      toast.error('Không thể chấp nhận đơn hàng')
    }
  }

  const handleRejectOrder = async (orderId: string) => {
    try {
      await orderAPI.updateStatus(orderId, 'cancelled')
      setOrders(orders.map((order) => (order._id === orderId ? { ...order, status: 'cancelled' } : order)))
      setShowRejectReason(false)
      setRejectReason("")
      toast.success('Đã từ chối đơn hàng')
    } catch (error) {
      console.error('Error rejecting order:', error)
      toast.error('Không thể từ chối đơn hàng')
    }
  }

  const handleUpdateStatus = async (orderId: string) => {
    const statusFlow = ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivering', 'delivered']
    const order = orders.find(o => o._id === orderId)
    if (!order) return

    const currentIndex = statusFlow.indexOf(order.status)
    const nextStatus = statusFlow[currentIndex + 1] || order.status

    try {
      await orderAPI.updateStatus(orderId, nextStatus as any)
      setOrders(orders.map((o) => (o._id === orderId ? { ...o, status: nextStatus } : o)))
      toast.success('Đã cập nhật trạng thái')
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Không thể cập nhật trạng thái')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
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
          {orders && orders.length > 0 ? (
            orders
            .filter((order) => order.status === "pending")
            .map((order) => (
              <Card key={order._id} className="border-border hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-bold text-lg text-foreground">#{order._id.slice(-6).toUpperCase()}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.shippingAddress?.street}, {order.shippingAddress?.district}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">{STATUS_MAP[order.status]}</Badge>
                  </div>
                  <p className="text-sm text-foreground mb-3">
                    <span className="font-semibold">Món:</span>{' '}
                    {order.items.map(item => `${item.name} x${item.quantity}`).join(', ')}
                  </p>
                  <p className="text-lg font-bold text-primary mb-4">
                    Tổng: {order.totalPrice.toLocaleString("vi-VN")}đ
                  </p>
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-primary hover:bg-accent" onClick={() => handleAcceptOrder(order._id)}>
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
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Chưa có đơn hàng nào đang chờ xử lý
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {orders && orders.length > 0 ? (
            orders
            .filter((order) => ['confirmed', 'preparing', 'ready'].includes(order.status))
            .map((order) => (
              <Card key={order._id} className="border-border hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-bold text-lg text-foreground">#{order._id.slice(-6).toUpperCase()}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.shippingAddress?.street}, {order.shippingAddress?.district}
                      </p>
                    </div>
                    <Badge className={STATUS_COLORS[STATUS_MAP[order.status] as keyof typeof STATUS_COLORS]}>
                      {STATUS_MAP[order.status]}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground mb-3">
                    <span className="font-semibold">Món:</span>{' '}
                    {order.items.map(item => `${item.name} x${item.quantity}`).join(', ')}
                  </p>
                  <p className="text-lg font-bold text-primary mb-4">
                    Tổng: {order.totalPrice.toLocaleString("vi-VN")}đ
                  </p>
                  <Button className="w-full bg-primary hover:bg-accent" onClick={() => handleUpdateStatus(order._id)}>
                    <TrendingUp size={16} className="mr-2" /> Cập Nhật Trạng Thái
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Chưa có đơn hàng nào đang xử lý
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {orders && orders.length > 0 ? (
            orders
            .filter((order) => ['delivered', 'cancelled'].includes(order.status))
            .map((order) => (
              <Card key={order._id} className="border-border opacity-75">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-foreground">#{order._id.slice(-6).toUpperCase()}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.shippingAddress?.street}, {order.shippingAddress?.district}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <Badge className={STATUS_COLORS[STATUS_MAP[order.status] as keyof typeof STATUS_COLORS]}>
                      {STATUS_MAP[order.status]}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Chưa có đơn hàng hoàn thành
            </div>
          )}
        </TabsContent>
      </Tabs>

      {showRejectReason && selectedOrder && (
        <Card className="border-destructive bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">Từ Chối Đơn Hàng #{selectedOrder._id.slice(-6).toUpperCase()}</CardTitle>
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
                onClick={() => handleRejectOrder(selectedOrder._id)}
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
