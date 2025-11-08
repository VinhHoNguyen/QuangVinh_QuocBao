"use client"

import { useState } from "react"
import { useOrder } from "@/lib/order-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Clock, CheckCircle, Star, ArrowRight } from "lucide-react"
import Link from "next/link"

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { label: string; variant: any; icon: any }> = {
    preparing: { label: "Đang chuẩn bị", variant: "secondary", icon: Clock },
    "on-the-way": { label: "Đang giao", variant: "default", icon: Package },
    delivered: { label: "Đã giao", variant: "default", icon: CheckCircle },
    cancelled: { label: "Đã hủy", variant: "destructive", icon: null },
  }
  return statusMap[status]
}

export default function OrdersPage() {
  const { getOrders } = useOrder()
  const orders = getOrders()
  const [activeTab, setActiveTab] = useState("preparing")

  const preparingOrders = orders.filter((o) => o.status === "preparing")
  const onTheWayOrders = orders.filter((o) => o.status === "on-the-way")
  const deliveredOrders = orders.filter((o) => o.status === "delivered")
  const ratedOrders = orders.filter((o) => o.rating !== undefined)

  const OrderCard = ({ order }: { order: any }) => {
    const statusInfo = getStatusBadge(order.status)
    const StatusIcon = statusInfo.icon

    return (
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Mã đơn hàng</p>
            <p className="font-bold text-primary">{order.id}</p>
          </div>
          <Badge variant={statusInfo.variant}>
            {StatusIcon && <StatusIcon className="w-3 h-3 mr-1" />}
            {statusInfo.label}
          </Badge>
        </div>

        <div className="space-y-2 mb-4 pb-4 border-b">
          <p className="font-semibold text-foreground">{order.recipientInfo.address}</p>
          <p className="text-sm text-muted-foreground">
            {order.items.length} món • {order.items.reduce((sum: number, item: any) => sum + item.quantity, 0)} sản phẩm
          </p>
          <p className="text-lg font-bold text-primary">{order.totalPrice.toLocaleString("vi-VN")}đ</p>
        </div>

        {/* Items preview */}
        <div className="mb-4 pb-4 border-b">
          <div className="space-y-1">
            {order.items.slice(0, 2).map((item: any) => (
              <p key={item.id} className="text-sm text-muted-foreground">
                • {item.name} x{item.quantity}
              </p>
            ))}
            {order.items.length > 2 && (
              <p className="text-sm text-muted-foreground">... và {order.items.length - 2} món khác</p>
            )}
          </div>
        </div>

        <Link href={`/orders/${order.id}`}>
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
          <Link href="/">
            <Button variant="outline">Tiếp tục mua hàng</Button>
          </Link>
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
              <TabsTrigger value="preparing">Đang chuẩn bị ({preparingOrders.length})</TabsTrigger>
              <TabsTrigger value="on-the-way">Đang giao ({onTheWayOrders.length})</TabsTrigger>
              <TabsTrigger value="delivered">Đã giao ({deliveredOrders.length})</TabsTrigger>
              <TabsTrigger value="rated">Đã đánh giá ({ratedOrders.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="preparing" className="space-y-4">
              {preparingOrders.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground">Không có đơn hàng nào</Card>
              ) : (
                preparingOrders.map((order) => <OrderCard key={order.id} order={order} />)
              )}
            </TabsContent>

            <TabsContent value="on-the-way" className="space-y-4">
              {onTheWayOrders.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground">Không có đơn hàng nào</Card>
              ) : (
                onTheWayOrders.map((order) => <OrderCard key={order.id} order={order} />)
              )}
            </TabsContent>

            <TabsContent value="delivered" className="space-y-4">
              {deliveredOrders.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground">Không có đơn hàng nào</Card>
              ) : (
                deliveredOrders.map((order) => <OrderCard key={order.id} order={order} />)
              )}
            </TabsContent>

            <TabsContent value="rated" className="space-y-4">
              {ratedOrders.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground">Không có đơn hàng nào</Card>
              ) : (
                ratedOrders.map((order) => (
                  <Card key={order.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-bold text-primary">{order.id}</p>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < (order.rating || 0) ? "fill-primary text-primary" : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{order.review}</p>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
