"use client"

import { useState, useEffect } from "react"
import { useOrder } from "@/lib/order-context"
import { Button } from "@/components/ui/button"
import OrderTrackingTimeline from "@/components/order-tracking-timeline"
import OrderTrackingMap from "@/components/order-tracking-map"
import ShipperInfoCard from "@/components/shipper-info-card"
import DroneStatusCard from "@/components/drone-status-card"
import OrderNotificationToast, { type NotificationMessage } from "@/components/order-notification-toast"
import { ChevronLeft, Star } from "lucide-react"
import Link from "next/link"

export default function OrderDetailContent({ orderId }: { orderId: string }) {
  const { getOrderById, updateOrderStatus } = useOrder()
  const order = getOrderById(orderId)
  const [notifications, setNotifications] = useState<NotificationMessage[]>([])
  const [isReviewing, setIsReviewing] = useState(false)
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState("")

  useEffect(() => {
    if (!order || order.status === "delivered") return

    const statusSequence = ["preparing", "on-the-way", "delivered"]
    const currentIndex = statusSequence.indexOf(order.status)

    if (currentIndex < statusSequence.length - 1) {
      const timer = setTimeout(() => {
        const nextStatus = statusSequence[currentIndex + 1]
        updateOrderStatus(orderId, nextStatus as any)

        // Add notification
        const statusMessages: Record<string, { title: string; message: string }> = {
          "on-the-way": {
            title: "Đơn hàng đang được giao",
            message: `${order.deliveryMethod === "drone" ? "Drone" : "Tài xế"} đang trên đường đến bạn`,
          },
          delivered: {
            title: "Đã giao thành công",
            message: "Cảm ơn bạn đã mua hàng. Hãy đánh giá để giúp chúng tôi cải thiện",
          },
        }

        if (statusMessages[nextStatus]) {
          const msg = statusMessages[nextStatus]
          addNotification({
            title: msg.title,
            message: msg.message,
            type: nextStatus === "delivered" ? "success" : "info",
          })
        }
      }, 8000)

      return () => clearTimeout(timer)
    }
  }, [order, orderId, updateOrderStatus])

  const addNotification = (msg: Omit<NotificationMessage, "id">) => {
    const id = Date.now().toString()
    const notification: NotificationMessage = {
      id,
      ...msg,
      duration: msg.duration || 5000,
    }
    setNotifications((prev) => [...prev, notification])

    if (msg.duration) {
      setTimeout(() => {
        removeNotification(id)
      }, msg.duration)
    }
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
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
      <OrderNotificationToast notifications={notifications} onClose={removeNotification} />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/orders" className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-4">
            <ChevronLeft className="w-5 h-5" />
            Quay lại danh sách đơn
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{order.id}</h1>
          <p className="text-gray-600 mt-1">Đặt lúc {order.createdAt?.toLocaleString("vi-VN")}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timeline */}
            <OrderTrackingTimeline
              timeline={order.timeline}
              currentStatus={order.status}
              estimatedDeliveryTime={order.estimatedDeliveryTime}
            />

            {/* Map */}
            {order.driverInfo && (
              <OrderTrackingMap
                latitude={order.driverInfo.latitude}
                longitude={order.driverInfo.longitude}
                deliveryMethod={order.deliveryMethod}
                recipientLat={21.0285}
                recipientLng={105.8542}
              />
            )}

            {/* Shipper or Drone Info */}
            {order.deliveryMethod === "drone" && order.droneInfo ? (
              <DroneStatusCard
                batteryLevel={order.droneInfo.batteryLevel}
                altitude={order.droneInfo.altitude}
                speed={order.droneInfo.speed}
                estimatedArrivalTime={order.droneInfo.estimatedArrivalTime}
              />
            ) : order.driverInfo ? (
              <ShipperInfoCard
                name={order.driverInfo.name}
                phone={order.driverInfo.phone}
                vehicle={order.driverInfo.vehicle}
                rating={order.driverInfo.rating}
                avatar={order.driverInfo.avatar}
              />
            ) : null}

            {/* Order Items */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Danh sách món hàng</h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.name}</p>
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
                <p className="font-semibold">{order.recipientInfo.fullName}</p>
                <p>{order.recipientInfo.phone}</p>
                <p>{order.recipientInfo.address}</p>
                {order.recipientInfo.notes && (
                  <p className="text-sm italic text-gray-600">Ghi chú: {order.recipientInfo.notes}</p>
                )}
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
