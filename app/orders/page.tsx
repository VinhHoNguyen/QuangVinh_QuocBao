"use client"

import { useSearchParams } from "next/navigation"
import { useOrders } from "@/lib/orders-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, CheckCircle2, Truck, MapPin, Phone, User, Zap, Bone as Drone } from "lucide-react"
import Link from "next/link"

const statusConfig = {
  pending: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800", icon: CheckCircle2 },
  preparing: { label: "Đang chuẩn bị", color: "bg-purple-100 text-purple-800", icon: Clock },
  "on-the-way": { label: "Đang giao", color: "bg-orange-100 text-orange-800", icon: Truck },
  delivered: { label: "Đã giao", color: "bg-green-100 text-green-800", icon: CheckCircle2 },
}

const deliveryMethodConfig = {
  standard: { label: "Giao hàng thường", icon: Truck, color: "text-blue-600" },
  fast: { label: "Giao hàng nhanh", icon: Zap, color: "text-orange-600" },
  drone: { label: "Giao hàng bằng Drone", icon: Drone, color: "text-blue-600" },
}

export default function OrdersPage() {
  const searchParams = useSearchParams()
  const { orders, updateOrderStatus } = useOrders()
  const selectedOrderId = searchParams.get("orderId")

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0]

  // Simulate order status updates
  const simulateStatusUpdate = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId)
    if (!order) return

    const statusFlow: Array<typeof order.status> = ["pending", "confirmed", "preparing", "on-the-way", "delivered"]
    const currentIndex = statusFlow.indexOf(order.status)
    if (currentIndex < statusFlow.length - 1) {
      updateOrderStatus(orderId, statusFlow[currentIndex + 1])
    }
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Đơn hàng của tôi</h1>
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-muted-foreground mb-6">Bạn chưa có đơn hàng nào</p>
              <Link href="/restaurants">
                <Button>Quay lại mua hàng</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Đơn hàng của tôi</h1>
          <Link href="/restaurants">
            <Button variant="outline">Tiếp tục mua hàng</Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Orders List */}
          <div className="md:col-span-1">
            <div className="space-y-2">
              {orders.map((order) => (
                <Link key={order.id} href={`/orders?orderId=${order.id}`}>
                  <Card
                    className={`cursor-pointer transition-all ${
                      selectedOrder?.id === order.id ? "ring-2 ring-primary" : "hover:shadow-md"
                    }`}
                  >
                    <CardContent className="pt-4">
                      <p className="font-semibold text-sm mb-1">{order.id}</p>
                      <p className="text-xs text-muted-foreground mb-2">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                      <Badge className="text-xs">{statusConfig[order.status].label}</Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Order Details */}
          {selectedOrder && (
            <div className="md:col-span-2 space-y-6">
              {/* Restaurant and Delivery Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Nhà hàng</p>
                    <p className="font-semibold text-lg">{selectedOrder.restaurantName}</p>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const DeliveryIcon = deliveryMethodConfig[selectedOrder.deliveryMethod].icon
                        return (
                          <DeliveryIcon
                            className={`w-5 h-5 ${deliveryMethodConfig[selectedOrder.deliveryMethod].color}`}
                          />
                        )
                      })()}
                      <div>
                        <p className="text-sm text-muted-foreground">Phương thức giao hàng</p>
                        <p className="font-semibold">{deliveryMethodConfig[selectedOrder.deliveryMethod].label}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Trạng thái đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Badge className={`${statusConfig[selectedOrder.status].color}`}>
                        {statusConfig[selectedOrder.status].label}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => simulateStatusUpdate(selectedOrder.id)}
                      disabled={selectedOrder.status === "delivered"}
                    >
                      Cập nhật
                    </Button>
                  </div>

                  {selectedOrder.estimatedDelivery && (
                    <div className="bg-primary/5 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Dự kiến giao hàng</p>
                      <p className="font-semibold">
                        {new Date(selectedOrder.estimatedDelivery).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin giao hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">Tên khách hàng</p>
                      <p className="font-medium">{selectedOrder.customerInfo.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">Số điện thoại</p>
                      <p className="font-medium">{selectedOrder.customerInfo.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">Địa chỉ giao hàng</p>
                      <p className="font-medium">{selectedOrder.customerInfo.address}</p>
                    </div>
                  </div>
                  {selectedOrder.customerInfo.notes && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Ghi chú</p>
                      <p className="font-medium text-sm">{selectedOrder.customerInfo.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Chi tiết đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-start">
                        <div className="flex gap-3 flex-1">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-semibold text-sm">{(item.price * item.quantity).toLocaleString("vi-VN")}đ</p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tạm tính</span>
                      <span>{selectedOrder.subtotal.toLocaleString("vi-VN")}đ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phí giao hàng</span>
                      <span>{selectedOrder.deliveryFee.toLocaleString("vi-VN")}đ</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng cộng</span>
                    <span className="text-primary">{selectedOrder.total.toLocaleString("vi-VN")}đ</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
