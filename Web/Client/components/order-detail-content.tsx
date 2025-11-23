"use client"

import { useState, useEffect } from "react"
import { orderAPI, Order } from "@/lib/api"
import { Button } from "@/components/ui/button"
import OrderTrackingTimeline from "@/components/order-tracking-timeline"
import ShipperInfoCard from "@/components/shipper-info-card"
import DroneStatusCard from "@/components/drone-status-card"
import { ChevronLeft, Star, Loader2 } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { toast } from "sonner"

// Dynamic import to avoid SSR issues with Leaflet
const OrderTrackingMap = dynamic(
  () => import("@/components/order-tracking-map-leaflet"),
  { 
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-[400px] bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }
)

export default function OrderDetailContent({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [isReviewing, setIsReviewing] = useState(false)
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState("")
  const [prevStatus, setPrevStatus] = useState<string>("")

  const fetchOrder = async () => {
    try {
      const response = await orderAPI.getById(orderId)
      if (response.success && response.data) {
        const newOrder = response.data
        
        // Notify status change
        if (prevStatus && prevStatus !== newOrder.status) {
          const statusMessages: Record<string, { title: string; message: string }> = {
            preparing: {
              title: "🔥 Đang chuẩn bị",
              message: "Nhà hàng đang chuẩn bị món ăn của bạn",
            },
            ready: {
              title: "✅ Sẵn sàng giao",
              message: "Đơn hàng đã sẵn sàng, chờ shipper nhận",
            },
            delivering: {
              title: "🚚 Đang giao hàng",
              message: "Shipper đã nhận hàng và đang giao đến bạn. Sẽ tự động hoàn thành sau 4 giây.",
            },
            completed: {
              title: "🎉 Đã hoàn thành",
              message: "Chúc bạn ngon miệng!",
            },
          }

          if (statusMessages[newOrder.status]) {
            const msg = statusMessages[newOrder.status]
            toast.success(msg.title, { description: msg.message })
          }
        }
        
        setOrder(newOrder)
        setPrevStatus(newOrder.status)
      }
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  const completeOrder = async () => {
    try {
      console.log('[Order Auto-Complete] Calling API to complete order...')
      const response = await orderAPI.updateStatus(orderId, 'completed')
      if (response.success) {
        toast.success('✅ Đơn hàng đã hoàn thành', {
          description: 'Cảm ơn bạn đã sử dụng dịch vụ!'
        })
        fetchOrder() // Refresh order
      }
    } catch (error) {
      console.error('Error completing order:', error)
    }
  }

  // Fetch order on mount
  useEffect(() => {
    fetchOrder()
  }, [orderId])

  // Auto-complete order when status is "delivering" (for demo)
  useEffect(() => {
    if (!order) return

    console.log('[Order Auto-Complete] Current status:', order.status)

    if (order.status === 'delivering') {
      console.log('[Order Auto-Complete] Starting 4 second timer...')
      const timer = setTimeout(() => {
        console.log('[Order Auto-Complete] Timer fired, completing order...')
        completeOrder()
      }, 4000) // Auto complete after 4 seconds

      return () => {
        console.log('[Order Auto-Complete] Cleaning up timer')
        clearTimeout(timer)
      }
    }
  }, [order?._id, order?.status])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Link href="/orders" className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-4">
            <ChevronLeft className="w-5 h-5" />
            Quay lại
          </Link>
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-600">Không tìm thấy đơn hàng</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/orders" className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-4">
            <ChevronLeft className="w-5 h-5" />
            Quay lại danh sách đơn
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">#{order._id.slice(-8).toUpperCase()}</h1>
          <p className="text-gray-600 mt-1">Đặt lúc {new Date(order.createdAt).toLocaleString("vi-VN")}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map - Always show for visualization */}
            <OrderTrackingMap
              latitude={order.shippingAddress.coordinates?.latitude || 21.0285}
              longitude={order.shippingAddress.coordinates?.longitude || 105.8542}
              deliveryMethod={order.deliveryMethod || 'drone'}
              recipientLat={order.shippingAddress.coordinates?.latitude || 21.0285}
              recipientLng={order.shippingAddress.coordinates?.longitude || 105.8542}
              restaurantLat={21.0278}
              restaurantLng={105.8342}
              status={order.status}
            />

            {/* Order Items */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Danh sách món hàng</h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={item._id || index} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0">
                    <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center text-2xl">
                      🍜
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.productName}</p>
                      <p className="text-sm text-gray-600">x{item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Tạm tính:</span>
                  <span>{order.totalPrice.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Phí giao hàng:</span>
                  <span className="text-green-600">Miễn phí</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 mt-3">
                  <span>Tổng cộng:</span>
                  <span>{order.totalPrice.toLocaleString("vi-VN")}đ</span>
                </div>
              </div>
            </div>

            {/* Recipient Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Địa chỉ nhận hàng</h3>
              <div className="space-y-2 text-gray-700">
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.ward}, {order.shippingAddress.district}</p>
                <p>{order.shippingAddress.city}</p>
              </div>
            </div>

            {/* Review Section */}
            {order.status === "delivered" && !isReviewing && (
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Đánh giá đơn hàng</h3>
                <p className="text-gray-700 mb-4">Chia sẻ trải nghiệm của bạn để giúp chúng tôi cải thiện dịch vụ</p>
                <button
                  onClick={() => setIsReviewing(true)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                >
                  Viết đánh giá
                </button>
              </div>
            )}

            {isReviewing && (
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Đánh giá của bạn</h3>

                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Đánh giá:</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => setRating(star)} className="text-2xl transition-colors">
                        <Star
                          className="w-8 h-8"
                          fill={star <= rating ? "#f59e0b" : "none"}
                          stroke={star <= rating ? "#f59e0b" : "#d1d5db"}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Nhận xét:</p>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Chia sẻ cảm nhận của bạn về đơn hàng..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows={4}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsReviewing(false)
                      addNotification({
                        title: "Cảm ơn bạn",
                        message: "Đánh giá của bạn đã được ghi nhận",
                        type: "success",
                      })
                    }}
                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                  >
                    Gửi đánh giá
                  </button>
                  <button
                    onClick={() => setIsReviewing(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Status Badge */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">Trạng thái</p>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    order.status === "preparing"
                      ? "bg-orange-500"
                      : order.status === "on-the-way"
                        ? "bg-blue-500"
                        : "bg-green-500"
                  }`}
                />
                <p className="font-semibold text-gray-900">
                  {order.status === "preparing"
                    ? "Đang chuẩn bị"
                    : order.status === "on-the-way"
                      ? "Đang giao hàng"
                      : order.status === "delivered"
                        ? "Đã giao thành công"
                        : "Đã hủy"}
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-600 uppercase tracking-wider mb-2">Phương thức thanh toán</p>
              <p className="font-semibold text-gray-900">
                {order.paymentMethod === "cod"
                  ? "Thanh toán khi nhận"
                  : order.paymentMethod === "ewallet"
                    ? "Ví điện tử"
                    : order.paymentMethod === "bank"
                      ? "Chuyển khoản ngân hàng"
                      : "Thẻ Visa"}
              </p>
            </div>

            {/* Delivery Method */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-600 uppercase tracking-wider mb-2">Hình thức giao hàng</p>
              <p className="font-semibold text-gray-900 flex items-center gap-2">
                {order.deliveryMethod === "drone" ? "🚁 Giao bằng drone" : "🏍️ Giao bằng xe máy"}
              </p>
              <p className="text-sm text-gray-600 mt-2">{order.deliveryNote}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom action buttons */}
      <div className="bg-white border-t border-gray-200 sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4 flex gap-3">
          <Link href="/orders" className="flex-1">
            <Button variant="outline" className="w-full bg-transparent">
              Xem tất cả đơn hàng
            </Button>
          </Link>
          {order.status !== "delivered" && (
            <Button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white">Liên hệ hỗ trợ</Button>
          )}
        </div>
      </div>
    </div>
  )
}
