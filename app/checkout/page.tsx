"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle2, Truck, Bone as Drone, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useOrders } from "@/lib/orders-context"
import type { CartItem } from "@/app/page"

type DeliveryMethod = "standard" | "fast" | "drone"

export default function CheckoutPage() {
  const router = useRouter()
  const { addOrder } = useOrders()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("standard")

  // Get cart items and restaurant info from sessionStorage
  const [cartItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("cartItems")
      return stored ? JSON.parse(stored) : []
    }
    return []
  })

  const [restaurantName] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("restaurantName") || "Nhà hàng"
    }
    return "Nhà hàng"
  })

  const [baseFee] = useState(() => {
    if (typeof window !== "undefined") {
      return Number.parseInt(sessionStorage.getItem("deliveryFee") || "0")
    }
    return 0
  })

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  })

  const getDeliveryFee = () => {
    if (deliveryMethod === "standard") return baseFee
    if (deliveryMethod === "fast") return baseFee + 15000
    if (deliveryMethod === "drone") return baseFee + 25000
    return baseFee
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = getDeliveryFee()
  const total = subtotal + deliveryFee

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.phone || !formData.address) {
      alert("Vui lòng điền đầy đủ thông tin")
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const order = addOrder({
      items: cartItems,
      subtotal,
      deliveryFee,
      total,
      customerInfo: {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        notes: formData.notes,
      },
      restaurantName,
      deliveryMethod,
      status: "confirmed",
      estimatedDelivery: new Date(
        Date.now() + (deliveryMethod === "drone" ? 15 : deliveryMethod === "fast" ? 20 : 30) * 60000,
      ),
    })

    setIsProcessing(false)
    setIsSuccess(true)

    // Clear cart
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("cartItems")
      sessionStorage.removeItem("restaurantId")
      sessionStorage.removeItem("restaurantName")
      sessionStorage.removeItem("deliveryFee")
    }

    // Redirect to order tracking after 2 seconds
    setTimeout(() => {
      router.push(`/orders?orderId=${order.id}`)
    }, 2000)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-12 pb-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Đặt hàng thành công!</h1>
            <p className="text-muted-foreground mb-6">
              Đơn hàng của bạn đã được xác nhận. Chúng tôi sẽ giao hàng trong{" "}
              {deliveryMethod === "drone" ? "15" : deliveryMethod === "fast" ? "20" : "30"} phút.
            </p>
            <p className="text-sm text-muted-foreground">Đang chuyển hướng...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-10 w-10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">Thanh toán</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin giao hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Delivery Methods */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Phương thức giao hàng</label>
                    <div className="space-y-2">
                      {/* Standard Delivery */}
                      <label
                        className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-muted transition-colors"
                        style={{
                          borderColor: deliveryMethod === "standard" ? "var(--color-primary)" : "var(--color-border)",
                        }}
                      >
                        <input
                          type="radio"
                          name="delivery"
                          value="standard"
                          checked={deliveryMethod === "standard"}
                          onChange={(e) => setDeliveryMethod(e.target.value as DeliveryMethod)}
                          className="w-4 h-4"
                        />
                        <div className="ml-4 flex-1">
                          <div className="flex items-center gap-2">
                            <Truck className="w-5 h-5 text-muted-foreground" />
                            <span className="font-medium">Giao hàng thường</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            30 phút - Phí: {baseFee.toLocaleString("vi-VN")}đ
                          </p>
                        </div>
                      </label>

                      {/* Fast Delivery */}
                      <label
                        className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-muted transition-colors"
                        style={{
                          borderColor: deliveryMethod === "fast" ? "var(--color-primary)" : "var(--color-border)",
                        }}
                      >
                        <input
                          type="radio"
                          name="delivery"
                          value="fast"
                          checked={deliveryMethod === "fast"}
                          onChange={(e) => setDeliveryMethod(e.target.value as DeliveryMethod)}
                          className="w-4 h-4"
                        />
                        <div className="ml-4 flex-1">
                          <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-orange-500" />
                            <span className="font-medium">Giao hàng nhanh</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            20 phút - Phí: {(baseFee + 15000).toLocaleString("vi-VN")}đ
                          </p>
                        </div>
                      </label>

                      {/* Drone Delivery */}
                      <label
                        className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-muted transition-colors"
                        style={{
                          borderColor: deliveryMethod === "drone" ? "var(--color-primary)" : "var(--color-border)",
                        }}
                      >
                        <input
                          type="radio"
                          name="delivery"
                          value="drone"
                          checked={deliveryMethod === "drone"}
                          onChange={(e) => setDeliveryMethod(e.target.value as DeliveryMethod)}
                          className="w-4 h-4"
                        />
                        <div className="ml-4 flex-1">
                          <div className="flex items-center gap-2">
                            <Drone className="w-5 h-5 text-blue-500" />
                            <span className="font-medium">Giao hàng bằng Drone</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            15 phút - Phí: {(baseFee + 25000).toLocaleString("vi-VN")}đ
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <Separator />

                  {/* Customer Info */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Họ và tên</label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Nhập họ và tên"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Số điện thoại</label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Nhập số điện thoại"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Địa chỉ giao hàng</label>
                    <Textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Nhập địa chỉ giao hàng"
                      required
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Ghi chú (tùy chọn)</label>
                    <Textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Ghi chú thêm cho đơn hàng"
                      rows={2}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                    {isProcessing ? "Đang xử lý..." : "Xác nhận thanh toán"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm font-medium text-muted-foreground">{restaurantName}</div>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="font-medium">{(item.price * item.quantity).toLocaleString("vi-VN")}đ</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span>{subtotal.toLocaleString("vi-VN")}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phí giao hàng</span>
                    <span>{deliveryFee.toLocaleString("vi-VN")}đ</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{total.toLocaleString("vi-VN")}đ</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
