"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Check, X, TrendingUp, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { orderAPI } from "@/lib/api"
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
  'delivering': 'ĐANG GIAO',
  'delivered': 'ĐÃ GIAO',
  'completed': 'ĐÃ HOÀN THÀNH',
  'cancelled': 'ĐÃ TỪ CHỐI',
}

interface Order {
  _id: string
  restaurantId: string
  userId: string
  items: Array<{ productId: string; productName: string; quantity: number; price: number }>
  totalPrice: number
  status: string
  createdAt: string
  shippingAddress?: { street: string; district: string; city: string; ward: string; coordinates?: { latitude: number; longitude: number } }
  customerName?: string
  customerPhone?: string
  notes?: string
}

interface Delivery {
  _id: string
  orderId: string
  droneId?: string
  status: string
}

export function OrderPage() {
  const { restaurantId } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showRejectReason, setShowRejectReason] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [deliveries, setDeliveries] = useState<Record<string, Delivery>>({})
  const [activeTab, setActiveTab] = useState("ready")

  // Fetch orders on mount
  useEffect(() => {
    if (restaurantId) {
      fetchOrders()
    }
  }, [restaurantId])

  // Auto-refresh deliveries for ready orders every 3 seconds
  useEffect(() => {
    if (activeTab === 'ready') {
      const interval = setInterval(() => {
        orders
          .filter((o) => o.status === 'ready')
          .forEach((order) => {
            loadDeliveryForOrder(order._id)
          })
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [activeTab, orders])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const data = await orderAPI.getRestaurantOrders(restaurantId!)

      // Data should already be an array from API
      if (Array.isArray(data) && data.length >= 0) {
        setOrders(data)
        // Load deliveries for ready orders
        data
          .filter((o: Order) => o.status === 'ready')
          .forEach((order: Order) => {
            loadDeliveryForOrder(order._id)
          })
      } else {
        console.error("Received invalid orders data:", data)
        setOrders([])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Không thể tải đơn hàng')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const loadDeliveryForOrder = async (orderId: string) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('restaurant_token')
      const response = await fetch(`http://localhost:5000/api/deliveries/order/${orderId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (response.ok) {
        const data = await response.json()
        console.log('📦 Delivery loaded for order', orderId.slice(-6), ':', data.data)
        setDeliveries(prev => ({ ...prev, [orderId]: data.data }))
      } else {
        console.log('❌ Failed to load delivery for order', orderId.slice(-6), ':', response.status)
      }
    } catch (error) {
      console.error('Error loading delivery:', error)
    }
  }

  const getOrderCounts = () => {
    if (!orders || !Array.isArray(orders)) {
      return { pending: 0, preparing: 0, ready: 0, delivering: 0, completed: 0 }
    }
    return {
      pending: orders.filter((o) => o.status === "pending").length,
      preparing: orders.filter((o) => o.status === "preparing").length,
      ready: orders.filter((o) => o.status === "ready").length,
      delivering: orders.filter((o) => o.status === "delivering").length,
      completed: orders.filter((o) => o.status === "completed" || o.status === "delivered").length,
    }
  }

  const handleAcceptOrder = async (orderId: string) => {
    try {
      await orderAPI.updateStatus(orderId, 'preparing')
      toast.success('Đã chấp nhận đơn hàng - Bắt đầu chuẩn bị')
      fetchOrders()
    } catch (error) {
      console.error('Error accepting order:', error)
      toast.error('Không thể chấp nhận đơn hàng')
    }
  }

  const handleRejectOrder = async (orderId: string) => {
    try {
      await orderAPI.updateStatus(orderId, 'cancelled')
      setShowRejectReason(false)
      setRejectReason("")
      toast.success('Đã từ chối đơn hàng')
      fetchOrders()
    } catch (error) {
      console.error('Error rejecting order:', error)
      toast.error('Không thể từ chối đơn hàng')
    }
  }

  const handleUpdateStatus = async (orderId: string) => {
    const statusFlow = ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'completed']
    const order = orders.find(o => o._id === orderId)
    if (!order) return

    const currentIndex = statusFlow.indexOf(order.status)
    const nextStatus = statusFlow[currentIndex + 1] || order.status

    try {
      await orderAPI.updateStatus(orderId, nextStatus as any)
      toast.success('Đã cập nhật trạng thái')
      
      // If order is now delivered, also update delivery status to trigger drone release
      if (nextStatus === 'delivered') {
        try {
          const token = localStorage.getItem('token') || localStorage.getItem('restaurant_token')
          const deliveryRes = await fetch(`http://localhost:5000/api/deliveries/order/${orderId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          })
          if (deliveryRes.ok) {
            const deliveryData = await deliveryRes.json()
            const deliveryId = deliveryData.data._id
            console.log('📦 Updating delivery status:', { deliveryId, orderId })
            
            // Update delivery status to 'delivered' so drone gets freed up
            const updateRes = await fetch(`http://localhost:5000/api/deliveries/${deliveryId}/status`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ status: 'delivered' }),
            })
            const updateData = await updateRes.json()
            console.log('✅ Delivery status updated:', { status: updateRes.status, data: updateData })
            
            if (!updateRes.ok) {
              console.error('❌ Failed to update delivery status:', updateData)
              toast.error('Không thể cập nhật trạng thái giao hàng')
            }
          } else {
            console.error('❌ Failed to fetch delivery:', deliveryRes.status)
          }
        } catch (err) {
          console.error('Error updating delivery status:', err)
          toast.error('Lỗi: Không thể cập nhật trạng thái drone')
        }
      }
      
      fetchOrders()
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Không thể cập nhật trạng thái')
    }
  }

  const handleShipperPickup = async (orderId: string) => {
    try {
      await orderAPI.updateStatus(orderId, 'completed')
      toast.success('Shipper đã nhận hàng - Đơn hàng hoàn thành')
      fetchOrders() // Reload data to show updated status
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

  const counts = getOrderCounts()

  return (
    <div className="space-y-6">

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-muted">
          <TabsTrigger
            value="pending"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Chờ Xử Lý ({counts.pending})
          </TabsTrigger>
          <TabsTrigger
            value="preparing"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Đang Chuẩn Bị ({counts.preparing})
          </TabsTrigger>
          <TabsTrigger
            value="ready"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Sẵn Sàng Giao ({counts.ready})
          </TabsTrigger>
          <TabsTrigger
            value="delivering"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Đang Giao ({counts.delivering})
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Đã Hoàn Thành ({counts.completed})
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
                      {order.items.map(item => `${item.productName} x${item.quantity}`).join(', ')}
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

        <TabsContent value="preparing" className="space-y-4">
          {orders && orders.length > 0 ? (
            orders
              .filter((order) => order.status === 'preparing')
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
                      {order.items.map(item => `${item.productName} x${item.quantity}`).join(', ')}
                    </p>
                    <p className="text-lg font-bold text-primary mb-4">
                      Tổng: {order.totalPrice.toLocaleString("vi-VN")}đ
                    </p>
                    <Button className="w-full bg-primary hover:bg-accent" onClick={() => handleUpdateStatus(order._id)}>
                      <TrendingUp size={16} className="mr-2" /> Hoàn Thành Chuẩn Bị
                    </Button>
                  </CardContent>
                </Card>
              ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Chưa có đơn hàng nào đang chuẩn bị
            </div>
          )}
        </TabsContent>

        <TabsContent value="ready" className="space-y-4">
          {orders && orders.length > 0 ? (
            orders
              .filter((order) => order.status === 'ready')
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
                      {order.items.map(item => `${item.productName} x${item.quantity}`).join(', ')}
                    </p>
                    <p className="text-lg font-bold text-primary mb-4">
                      Tổng: {order.totalPrice.toLocaleString("vi-VN")}đ
                    </p>
                    {(() => {
                      const delivery = deliveries[order._id];
                      const hasDrone = delivery?.droneId && String(delivery.droneId).length > 0;
                      
                      console.log('🔍 Order render check:', { 
                        orderId: order._id.slice(-6), 
                        hasDelivery: !!delivery,
                        droneId: delivery?.droneId,
                        droneIdType: typeof delivery?.droneId,
                        hasDrone: hasDrone,
                        deliveryObj: delivery
                      });

                      if (!delivery) {
                        return (
                          <div className="space-y-2">
                            <Button className="w-full bg-gray-400 cursor-not-allowed" disabled>
                              ⏳ Loading...
                            </Button>
                          </div>
                        );
                      }

                      // Check if droneId exists (could be string or ObjectId)
                      if (hasDrone) {
                        return (
                          <Button
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleUpdateStatus(order._id)}
                          >
                            🚁 Bắt Đầu Giao (Drone Đã Sẵn Sàng)
                          </Button>
                        );
                      }

                      return (
                        <div className="space-y-2">
                          <Button className="w-full bg-gray-400 cursor-not-allowed" disabled>
                            ⏳ Chờ Admin Gán Drone
                          </Button>
                          <p className="text-xs text-muted-foreground text-center">
                            Vui lòng liên hệ quản trị viên để gán drone cho đơn hàng này
                          </p>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Chưa có đơn hàng nào sẵn sàng giao
            </div>
          )}
        </TabsContent>

        <TabsContent value="delivering" className="space-y-4">
          {orders && orders.length > 0 ? (
            orders
              .filter((order) => order.status === 'delivering')
              .map((order) => (
                <Card key={order._id} className="border-border hover:shadow-lg transition-shadow border-cyan-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-bold text-lg text-foreground">#{order._id.slice(-6).toUpperCase()}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.shippingAddress?.street}, {order.shippingAddress?.district}
                        </p>
                      </div>
                      <Badge className="bg-cyan-100 text-cyan-700">
                        {STATUS_MAP[order.status]}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground mb-3">
                      <span className="font-semibold">Món:</span>{' '}
                      {order.items.map(item => `${item.productName} x${item.quantity}`).join(', ')}
                    </p>
                    <p className="text-lg font-bold text-primary mb-4">
                      Tổng: {order.totalPrice.toLocaleString("vi-VN")}đ
                    </p>
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleUpdateStatus(order._id)}
                    >
                      ✅ Xác Nhận Đã Giao
                    </Button>
                  </CardContent>
                </Card>
              ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Chưa có đơn hàng nào đang giao
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {orders && orders.length > 0 ? (
            orders
              .filter((order) => order.status === 'completed' || order.status === 'delivered')
              .map((order) => (
                <Card key={order._id} className="border-border opacity-75">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-bold text-lg text-foreground">#{order._id.slice(-6).toUpperCase()}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.shippingAddress?.street}, {order.shippingAddress?.district}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(order.createdAt).toLocaleString('vi-VN')}
                        </p>
                      </div>
                      <Badge className="bg-green-200 text-green-900">
                        ✅ Đã Hoàn Thành
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground mb-3">
                      <span className="font-semibold">Món:</span>{' '}
                      {order.items.map(item => `${item.productName} x${item.quantity}`).join(', ')}
                    </p>
                    <p className="text-lg font-bold text-primary">
                      Tổng: {order.totalPrice.toLocaleString("vi-VN")}đ
                    </p>
                  </CardContent>
                </Card>
              ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Chưa có đơn hàng nào hoàn thành
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
