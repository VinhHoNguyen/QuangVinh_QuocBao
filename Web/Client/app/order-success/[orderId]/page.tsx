"use client"
import { useEffect, useState } from "react"
import { orderAPI, Order } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Package, Clock, MapPin, Loader2 } from "lucide-react"
import Link from "next/link"

function OrderSuccessDisplay({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const response = await orderAPI.getById(orderId)
        if (response.success && response.data) {
          setOrder(response.data)
        } else {
          setError("Không tìm thấy đơn hàng")
        }
      } catch (err) {
        setError("Lỗi khi tải đơn hàng")
      } finally {
        setLoading(false)
      }
    }
    loadOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-lg text-muted-foreground mb-4">{error || "Không tìm thấy đơn hàng"}</p>
          <Link href="/">
            <Button>Quay lại trang chủ</Button>
          </Link>
        </Card>
      </div>
    )
  }

  // Calculate estimated delivery time based on status
  const getEstimatedTime = () => {
    switch(order.status) {
      case 'pending': return '30-45 phút'
      case 'confirmed': return '25-40 phút'
      case 'preparing': return '20-35 phút'
      case 'ready': return '15-25 phút'
      case 'delivering': return '10-15 phút'
      default: return '30-45 phút'
    }
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Đặt hàng thành công!</h1>
          <p className="text-lg text-muted-foreground">Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được chuẩn bị</p>
        </div>

        {/* Order Details */}
        <div className="space-y-4 mb-8">
          <Card className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b">
              <div>
                <p className="text-sm text-muted-foreground">Mã đơn hàng</p>
                <p className="font-bold text-lg text-primary">#{order._id.slice(-8)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Thời gian dự kiến</p>
                <p className="font-bold text-lg text-foreground">{getEstimatedTime()}</p>
              </div>
            </div>

            {/* Recipient Info */}
            <div className="mb-6 pb-6 border-b">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Địa chỉ giao hàng
              </h3>
              <p className="text-muted-foreground">{order.shippingAddress.street}</p>
              <p className="text-muted-foreground">
                {order.shippingAddress.ward}, {order.shippingAddress.district}, {order.shippingAddress.city}
              </p>
            </div>

            {/* Delivery Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Trạng thái</p>
                <p className="font-semibold text-foreground capitalize">{order.status}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hình thức thanh toán</p>
                <p className="font-semibold text-foreground capitalize">{order.paymentMethod}</p>
              </div>
            </div>
          </Card>

          {/* Order Items */}
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              Các món ăn
            </h3>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between pb-3 border-b">
                  <span className="text-muted-foreground">
                    {item.productName} x{item.quantity}
                  </span>
                  <span className="font-semibold text-foreground">
                    {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
              <span>Tổng cộng</span>
              <span className="text-primary">{order.totalPrice.toLocaleString("vi-VN")}đ</span>
            </div>
          </Card>

          {/* Next Steps */}
          <Card className="p-6 bg-primary/10">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Bước tiếp theo
            </h3>
            <ol className="space-y-2 text-muted-foreground">
              <li>1. Quán ăn đang chuẩn bị các món ăn của bạn</li>
              <li>2. Shipper sẽ liên hệ với bạn để xác nhận</li>
              <li>3. Đơn hàng sẽ được giao trong {getEstimatedTime()}</li>
            </ol>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button variant="outline" size="lg">
              Tiếp tục mua hàng
            </Button>
          </Link>
          <Link href="/orders">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Theo dõi đơn hàng
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const [orderId, setOrderId] = useState<string>("")

  useEffect(() => {
    params.then((p) => setOrderId(p.orderId))
  }, [params])

  if (!orderId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return <OrderSuccessDisplay orderId={orderId} />
}
