"use client"

import { useContext } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { OrdersContext } from "@/lib/orders-context"
import { Calendar, MapPin, DollarSign, Package, ArrowRight } from "lucide-react"

const statusConfig = {
  pending: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800" },
  preparing: { label: "Đang chuẩn bị", color: "bg-purple-100 text-purple-800" },
  delivering: { label: "Đang giao", color: "bg-orange-100 text-orange-800" },
  delivered: { label: "Đã giao", color: "bg-green-100 text-green-800" },
}

export default function OrderHistoryPage() {
  const { orders } = useContext(OrdersContext)

  const sortedOrders = [...orders].reverse()

  return (
    <div className="min-h-screen bg-background">
      <Header cartCount={0} onCartClick={() => {}} />

      {/* Page Title */}
      <div className="bg-gradient-to-b from-primary/10 to-background py-8">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Lịch Sử Đơn Hàng</h1>
          <p className="text-muted-foreground">Xem tất cả các đơn hàng của bạn</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {sortedOrders.length > 0 ? (
          <div className="space-y-4">
            {sortedOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-muted-foreground">Mã đơn:</span>
                        <span className="font-semibold text-lg">{order.id}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.createdAt).toLocaleString("vi-VN")}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={statusConfig[order.status as keyof typeof statusConfig]?.color}>
                        {statusConfig[order.status as keyof typeof statusConfig]?.label}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 border-t pt-4">
                  {/* Order Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Số lượng</p>
                        <p className="font-semibold">{order.items.length} món</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Giao hàng</p>
                        <p className="font-semibold text-sm">{order.deliveryMethod}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Tổng tiền</p>
                        <p className="font-semibold text-lg text-primary">
                          {order.totalAmount.toLocaleString("vi-VN")}đ
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <Link href={`/orders?id=${order.id}`}>
                    <Button className="w-full md:w-auto">
                      Xem Chi Tiết
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
              <h3 className="font-semibold text-xl mb-2">Không có đơn hàng</h3>
              <p className="text-muted-foreground mb-6">Bạn chưa có đơn hàng nào. Hãy bắt đầu đặt hàng ngay!</p>
              <Link href="/restaurants">
                <Button>Khám Phá Nhà Hàng</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
