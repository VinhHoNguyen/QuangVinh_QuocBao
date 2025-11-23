"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { orderAPI, Order } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Clock, CheckCircle, Star, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { label: string; variant: any; icon: any }> = {
    pending: { label: "Chờ xác nhận", variant: "secondary", icon: Clock },
    confirmed: { label: "Đã xác nhận", variant: "secondary", icon: CheckCircle },
    preparing: { label: "Đang chuẩn bị", variant: "secondary", icon: Clock },
    ready: { label: "Sẵn sàng giao", variant: "default", icon: Package },
    delivering: { label: "Đang giao", variant: "default", icon: Package },
    delivered: { label: "Đã giao", variant: "default", icon: CheckCircle },
    completed: { label: "✅ Hoàn thành", variant: "default", icon: CheckCircle },
    cancelled: { label: "Đã hủy", variant: "destructive", icon: null },
  }
  return statusMap[status] || { label: status, variant: "secondary", icon: Clock }
}

export default function OrdersPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/?auth=login')
      return
    }

    if (user) {
      loadOrders()
    }
  }, [user, authLoading, router])

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await orderAPI.getUserOrders()
      
      if (response.success && response.data) {
        setOrders(response.data)
      } else {
        setError(response.error || "Không thể tải đơn hàng")
      }
    } catch (err: any) {
      console.error("Error loading orders:", err)
      setError(err.message || "Lỗi khi tải đơn hàng")
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="p-8 text-center">
            <p className="text-lg text-destructive mb-4">{error}</p>
            <Button onClick={loadOrders}>Thử lại</Button>
          </Card>
        </div>
      </div>
    )
  }

  const allOrders = orders
  const preparingOrders = orders.filter((o) => ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status))
  const deliveringOrders = orders.filter((o) => o.status === "delivering")
  const completedOrders = orders.filter((o) => ['delivered', 'completed'].includes(o.status))

  const OrderCard = ({ order }: { order: Order }) => {
    const statusInfo = getStatusBadge(order.status)
    const StatusIcon = statusInfo.icon
    const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0)

    return (
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Mã đơn hàng</p>
            <p className="font-bold text-primary">#{order._id.slice(-8)}</p>
          </div>
          <Badge variant={statusInfo.variant}>
            {StatusIcon && <StatusIcon className="w-3 h-3 mr-1" />}
            {statusInfo.label}
          </Badge>
        </div>

        <div className="space-y-2 mb-4 pb-4 border-b">
          <p className="font-semibold text-foreground">{order.shippingAddress.street}</p>
          <p className="text-sm text-muted-foreground">
            {order.shippingAddress.district}, {order.shippingAddress.city}
          </p>
          <p className="text-sm text-muted-foreground">
            {order.items.length} món • {totalItems} sản phẩm
          </p>
          <p className="text-lg font-bold text-primary">{order.totalPrice.toLocaleString("vi-VN")}đ</p>
        </div>

        {/* Items preview */}
        <div className="mb-4 pb-4 border-b">
          <div className="space-y-1">
            {order.items.slice(0, 2).map((item, idx) => (
              <p key={idx} className="text-sm text-muted-foreground">
                • {item.productName} x{item.quantity}
              </p>
            ))}
            {order.items.length > 2 && (
              <p className="text-sm text-muted-foreground">... và {order.items.length - 2} món khác</p>
            )}
          </div>
        </div>

        <Link href={`/orders/${order._id}`}>
          <Button size="sm" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            Xem chi tiết
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">Đơn hàng của tôi</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadOrders}>
              🔄 Tải lại
            </Button>
            <Link href="/">
              <Button variant="outline">Tiếp tục mua hàng</Button>
            </Link>
          </div>
        </div>

        {orders.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-4">Bạn chưa có đơn hàng nào</p>
            <Link href="/">
              <Button>Bắt đầu mua hàng</Button>
            </Link>
          </Card>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="all">Tất cả ({allOrders.length})</TabsTrigger>
              <TabsTrigger value="preparing">Đang xử lý ({preparingOrders.length})</TabsTrigger>
              <TabsTrigger value="delivering">Đang giao ({deliveringOrders.length})</TabsTrigger>
              <TabsTrigger value="completed">Hoàn thành ({completedOrders.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {allOrders.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground">Không có đơn hàng nào</Card>
              ) : (
                allOrders.map((order) => <OrderCard key={order._id} order={order} />)
              )}
            </TabsContent>

            <TabsContent value="preparing" className="space-y-4">
              {preparingOrders.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground">Không có đơn hàng nào</Card>
              ) : (
                preparingOrders.map((order) => <OrderCard key={order._id} order={order} />)
              )}
            </TabsContent>

            <TabsContent value="delivering" className="space-y-4">
              {deliveringOrders.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground">Không có đơn hàng nào</Card>
              ) : (
                deliveringOrders.map((order) => <OrderCard key={order._id} order={order} />)
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {completedOrders.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground">Không có đơn hàng nào</Card>
              ) : (
                completedOrders.map((order) => <OrderCard key={order._id} order={order} />)
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
