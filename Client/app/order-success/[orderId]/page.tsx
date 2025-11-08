import { useOrder } from "@/lib/order-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Package, Clock, MapPin, Phone } from "lucide-react"
import Link from "next/link"

async function OrderSuccessContent({ orderId }: { orderId: string }) {
  return <OrderSuccessDisplay orderId={orderId} />
}

function OrderSuccessDisplay({ orderId }: { orderId: string }) {
  "use client"
  const { getOrderById } = useOrder()
  const order = getOrderById(orderId)

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-lg text-muted-foreground mb-4">Không tìm thấy đơn hàng</p>
          <Link href="/">
            <Button>Quay lại trang chủ</Button>
          </Link>
        </Card>
      </div>
    )
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
                <p className="font-bold text-lg text-primary">{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Thời gian dự kiến</p>
                <p className="font-bold text-lg text-foreground">{order.estimatedDeliveryTime}</p>
              </div>
            </div>

            {/* Recipient Info */}
            <div className="mb-6 pb-6 border-b">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Địa chỉ giao hàng
              </h3>
              <p className="text-muted-foreground">
                <strong>{order.recipientInfo.fullName}</strong>
              </p>
              <p className="text-muted-foreground">{order.recipientInfo.address}</p>
              <p className="text-muted-foreground flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {order.recipientInfo.phone}
              </p>
            </div>

            {/* Delivery Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Hình thức vận chuyển</p>
                <p className="font-semibold text-foreground capitalize">
                  {order.deliveryMethod === "drone" ? "Drone" : "Xe máy"}
                </p>
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
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between pb-3 border-b">
                  <span className="text-muted-foreground">
                    {item.name} x{item.quantity}
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
              <li>3. Đơn hàng sẽ được giao trong {order.estimatedDeliveryTime}</li>
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

export default async function OrderSuccessPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params
  return <OrderSuccessContent orderId={orderId} />
}
