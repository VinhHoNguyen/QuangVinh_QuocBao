"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { MapPin, Truck, CreditCard, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { PaymentMethodSelector, type PaymentDetails } from "@/components/payment-method-selector"

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { cart, totalPrice, loading: cartLoading, clearCart } = useCart()

  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [deliveryMethod, setDeliveryMethod] = useState<"drone" | "motorcycle">("motorcycle")
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [deliveryNote, setDeliveryNote] = useState("")
  const [saveAddress, setSaveAddress] = useState(false)
  const [loading, setLoading] = useState(false)
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null)

  // Use cart's totalPrice
  const total = totalPrice

  const handlePaymentDetails = (details: PaymentDetails) => {
    setPaymentDetails(details)
  }

  const handlePlaceOrder = async () => {
    if (!fullName || !phone || !email || !address) {
      alert("Vui lòng điền đầy đủ thông tin")
      return
    }

    if (!paymentDetails) {
      alert("Vui lòng xác nhận phương thức thanh toán")
      return
    }

    if (cart.length === 0) {
      alert("Giỏ hàng trống")
      return
    }

    setLoading(true)
    try {
      // Get restaurant ID from first item (assuming all items from same restaurant)
      const restaurantId = cart[0].restaurantId

      if (!restaurantId) {
        alert("Không tìm thấy thông tin nhà hàng")
        return
      }

      // Prepare order data for API
      const orderData = {
        restaurantId: restaurantId,
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        paymentMethod: paymentMethod,
        shippingAddress: {
          street: address,
          city: "Hồ Chí Minh",
          district: "Quận 1",
          ward: "Phường 1",
          coordinates: {
            latitude: 10.762622,
            longitude: 106.660172
          }
        }
      }

      // Import orderAPI
      const { orderAPI } = await import("@/lib/api")
      
      // Create order via API
      const response = await orderAPI.create(orderData)

      if (response.success && response.data) {
        // Clear cart after successful order
        await clearCart()
        
        // Redirect to order success page
        router.push(`/order-success/${response.data._id}`)
      } else {
        throw new Error(response.error || "Không thể tạo đơn hàng")
      }
    } catch (error: any) {
      alert(error.message || "Lỗi khi tạo đơn hàng")
      console.error("Order creation error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </Link>
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">Giỏ hàng của bạn trống</p>
            <Link href="/">
              <Button>Tiếp tục mua hàng</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-8">Thanh toán</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main checkout form */}
          <div className="md:col-span-2 space-y-6">
            {/* Recipient Info */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Thông tin người nhận
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Họ và tên" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  <Input placeholder="Số điện thoại" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Textarea
                  placeholder="Địa chỉ giao hàng"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                />
              </div>
            </Card>

            {/* Delivery Method */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                Hình thức vận chuyển
              </h2>
              <div className="space-y-3">
                {[
                  {
                    id: "drone",
                    label: "Drone (15-20 phút)",
                    description: "Giao nhanh bằng drone, an toàn",
                    price: 15000,
                  },
                  {
                    id: "motorcycle",
                    label: "Xe máy (30-45 phút)",
                    description: "Giao tiết kiệm bằng xe máy",
                    price: 0,
                  },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                      deliveryMethod === method.id
                        ? "bg-primary/10 border-primary"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value={method.id}
                      checked={deliveryMethod === method.id}
                      onChange={(e) => setDeliveryMethod(e.target.value as any)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{method.label}</p>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                    {method.price > 0 && (
                      <span className="font-bold text-primary">+{method.price.toLocaleString()}đ</span>
                    )}
                  </label>
                ))}

                <Textarea
                  placeholder="Ghi chú cho shipper (tuỳ chọn)"
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                />
              </div>
            </Card>

            {/* Payment Method */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Hình thức thanh toán
              </h2>
              <PaymentMethodSelector
                selectedMethod={paymentMethod}
                onMethodChange={setPaymentMethod}
                onPaymentDetails={handlePaymentDetails}
                deliveryMethod={deliveryMethod}
                totalAmount={total + (deliveryMethod === "drone" ? 15000 : 0)}
              />
            </Card>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-lg font-bold text-foreground mb-4">Tóm tắt đơn hàng</h2>

              {/* Items */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="font-semibold text-foreground">
                      {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span className="text-foreground">{total.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phí vận chuyển</span>
                  <span className="text-foreground">{deliveryMethod === "drone" ? "+15,000đ" : "Miễn phí"}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Tổng cộng</span>
                  <span className="text-primary">
                    {(total + (deliveryMethod === "drone" ? 15000 : 0)).toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>

              <Button
                onClick={handlePlaceOrder}
                disabled={loading || !paymentDetails}
                className="w-full mt-6 bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-6 disabled:opacity-50"
              >
                {loading ? "Đang xử lý..." : "Đặt hàng ngay"}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
