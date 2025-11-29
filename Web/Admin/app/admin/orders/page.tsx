"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import dynamic from "next/dynamic"

const DeliveryRouteMap = dynamic(() => import("@/components/delivery-route-map"), { ssr: false })
interface Order {
  _id: string
  userId: {
    _id: string
    name: string
    email: string
    phone?: string
  }
  restaurantId: {
    _id: string
    name: string
    address: string
    locationId?: {
      coords: {
        latitude: number
        longitude: number
      }
      address: string
    }
  }
  items: Array<{
    productId: string
    productName: string
    quantity: number
    price: number
  }>
  totalPrice: number
  status: string
  deliveryMethod: string
  paymentMethod: string
  paymentStatus: string
  shippingAddress: {
    street: string
    ward: string
    district: string
    city: string
    coordinates: {
      latitude: number
      longitude: number
    }
  }
  notes?: string
  createdAt: string
  updatedAt: string
}
const statusLabels: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  preparing: "Đang chuẩn bị",
  ready: "Sẵn sàng",
  delivering: "Đang giao",
  delivered: "Đã giao",
  completed: "Hoàn tất",
  cancelled: "Đã hủy",
}
const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-purple-100 text-purple-700",
  ready: "bg-indigo-100 text-indigo-700",
  delivering: "bg-cyan-100 text-cyan-700",
  delivered: "bg-green-100 text-green-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
}
const deliveryMethodLabels: Record<string, string> = {
  drone: "Drone",
  bike: "Xe máy",
  car: "Ô tô",
}
const paymentMethodLabels: Record<string, string> = {
  cash: "Tiền mặt",
  credit_card: "Thẻ tín dụng",
  debit_card: "Thẻ ghi nợ",
  e_wallet: "Ví điện tử",
  bank_transfer: "Chuyển khoản",
}
const paymentStatusLabels: Record<string, string> = {
  pending: "Chờ thanh toán",
  processing: "Đang xử lý",
  completed: "Đã thanh toán",
  failed: "Thất bại",
  refunded: "Đã hoàn tiền",
}
export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deliveryFilter, setDeliveryFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [restaurantLocation, setRestaurantLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  useEffect(() => {
    loadOrders()
  }, [])
  const loadOrders = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("admin_token") || localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }
      const response = await fetch("http://localhost:5000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("admin_token")
        localStorage.removeItem("token")
        router.push("/login")
        return
      }
      if (!response.ok) {
        throw new Error("Failed to fetch orders")
      }
      const data = await response.json()
      setOrders(data.data || [])
    } catch (error) {
      console.error("Error loading orders:", error)
      alert("Không thể tải danh sách đơn hàng")
    } finally {
      setLoading(false)
    }
  }
  const filteredOrders = orders.filter((order) => {
    const searchLower = search.toLowerCase()
    const matchesSearch =
      order._id.toLowerCase().includes(searchLower) ||
      order.userId?.name?.toLowerCase().includes(searchLower) ||
      order.restaurantId?.name?.toLowerCase().includes(searchLower)
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesDelivery = deliveryFilter === "all" || order.deliveryMethod === deliveryFilter
    return matchesSearch && matchesStatus && matchesDelivery
  })
  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order)
    
    // Get restaurant location from populated data
    if (order.restaurantId?.locationId?.coords) {
      setRestaurantLocation({
        latitude: order.restaurantId.locationId.coords.latitude,
        longitude: order.restaurantId.locationId.coords.longitude,
      })
    } else {
      // Fallback to Hanoi coordinates if not available
      setRestaurantLocation({
        latitude: 21.0285,
        longitude: 105.8542,
      })
    }
    
    setShowDetail(true)
  }

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("admin_token") || localStorage.getItem("token")
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!response.ok) {
        throw new Error("Failed to update order status")
      }
      await loadOrders()
      alert(`Đã cập nhật trạng thái đơn hàng thành: ${statusLabels[newStatus]}`)
      setShowDetail(false)
    } catch (error) {
      console.error("Error updating order:", error)
      alert("Không thể cập nhật trạng thái đơn hàng")
    }
  }
  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Bạn có chắc muốn hủy đơn hàng này?")) return
    try {
      const token = localStorage.getItem("admin_token") || localStorage.getItem("token")
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/cancel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        throw new Error("Failed to cancel order")
      }
      await loadOrders()
      alert("Đã hủy đơn hàng thành công")
      setShowDetail(false)
    } catch (error) {
      console.error("Error cancelling order:", error)
      alert("Không thể hủy đơn hàng")
    }
  }

  const getOrderStats = () => {
    const today = new Date().toDateString()
    const todayOrders = orders.filter(
      (o) => new Date(o.createdAt).toDateString() === today
    )
    return {
      total: todayOrders.length,
      delivering: orders.filter((o) => o.status === "delivering").length,
      delivered: orders.filter((o) => o.status === "delivered" || o.status === "completed").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    }
  }
  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Đang tải dữ liệu...</div>
      </div>
    )
  }
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Quản lý đơn hàng</h1>
        <p className="text-muted-foreground mt-1">Giám sát toàn bộ đơn hàng: từ đặt → giao → hoàn tất</p>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-muted-foreground text-sm font-medium">Tổng đơn hôm nay</p>
          <p className="text-2xl font-bold text-foreground mt-1">{getOrderStats().total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-muted-foreground text-sm font-medium">Đang giao</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{getOrderStats().delivering}</p>
        </Card>
        <Card className="p-4">
          <p className="text-muted-foreground text-sm font-medium">Đã giao</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{getOrderStats().delivered}</p>
        </Card>
        <Card className="p-4">
          <p className="text-muted-foreground text-sm font-medium">Đã hủy</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{getOrderStats().cancelled}</p>
        </Card>
      </div>
      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <span className="absolute left-3 top-3 text-muted-foreground">🔍</span>
              <Input
                placeholder="Tìm theo mã đơn, khách hàng, nhà hàng..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <select
            className="px-4 py-2 border border-border rounded-lg bg-card text-foreground"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="preparing">Đang chuẩn bị</option>
            <option value="ready">Sẵn sàng</option>
            <option value="delivering">Đang giao</option>
            <option value="delivered">Đã giao</option>
            <option value="completed">Hoàn tất</option>
            <option value="cancelled">Đã hủy</option>
          </select>
          <select
            className="px-4 py-2 border border-border rounded-lg bg-card text-foreground"
            value={deliveryFilter}
            onChange={(e) => setDeliveryFilter(e.target.value)}
          >
            <option value="all">Tất cả phương thức</option>
            <option value="drone">Drone</option>
            <option value="bike">Xe máy</option>
            <option value="car">Ô tô</option>
          </select>
        </div>
      </Card>
      {/* Orders Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Mã đơn</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Khách hàng</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Nhà hàng</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Tổng tiền</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Giao hàng</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Thanh toán</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Trạng thái</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Thời gian</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-muted-foreground">
                    Không có đơn hàng nào
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-foreground font-medium text-primary">
                      {order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-foreground">
                        <p className="font-medium">{order.userId?.name || "N/A"}</p>
                        <p className="text-xs text-muted-foreground">{order.userId?.phone || ""}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {order.restaurantId?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-foreground font-semibold">
                      {order.totalPrice.toLocaleString("vi-VN")}đ
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                        {deliveryMethodLabels[order.deliveryMethod] || order.deliveryMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">
                        {paymentMethodLabels[order.paymentMethod] || order.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm ${statusColors[order.status] || "bg-gray-100 text-gray-700"
                          }`}
                      >
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-sm">
                      {new Date(order.createdAt).toLocaleString("vi-VN")}
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 bg-transparent"
                        onClick={() => handleViewDetail(order)}
                      >
                        👁️ Chi tiết
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
      {/* Detail Modal */}
      {showDetail && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    #{selectedOrder._id.slice(-6).toUpperCase()}
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {new Date(selectedOrder.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
                <button
                  onClick={() => setShowDetail(false)}
                  className="text-muted-foreground hover:text-foreground text-2xl"
                >
                  ✕
                </button>
              </div>
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Khách hàng</p>
                  <p className="text-foreground font-medium mt-1">{selectedOrder.userId?.name || "N/A"}</p>
                  <p className="text-sm text-muted-foreground mt-1">{selectedOrder.userId?.email}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.userId?.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nhà hàng</p>
                  <p className="text-foreground font-medium mt-1">{selectedOrder.restaurantId?.name || "N/A"}</p>
                  <p className="text-sm text-muted-foreground mt-1">{selectedOrder.restaurantId?.address}</p>
                </div>
              </div>
              {/* Shipping Address */}
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Địa chỉ giao hàng</h3>
                <p className="text-sm text-foreground">
                  {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.ward},{" "}
                  {selectedOrder.shippingAddress.district}, {selectedOrder.shippingAddress.city}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Tọa độ: {selectedOrder.shippingAddress.coordinates.latitude},{" "}
                  {selectedOrder.shippingAddress.coordinates.longitude}
                </p>
              </div>

              {/* Delivery Route Map */}
              {restaurantLocation ? (
                <div>
                  <h3 className="font-semibold text-foreground mb-3">🗺️ Bản đồ đường đi giao hàng</h3>
                  <DeliveryRouteMap
                    pickupLocation={{
                      name: selectedOrder.restaurantId?.name || "Nhà hàng",
                      coordinates: {
                        latitude: restaurantLocation.latitude,
                        longitude: restaurantLocation.longitude,
                      }
                    }}
                    deliveryLocation={{
                      name: selectedOrder.userId?.name || "Khách hàng",
                      coordinates: {
                        latitude: selectedOrder.shippingAddress.coordinates.latitude,
                        longitude: selectedOrder.shippingAddress.coordinates.longitude,
                      }
                    }}
                    height="400px"
                  />
                </div>
              ) : (
                <div className="bg-muted p-6 rounded-lg text-center">
                  <p className="text-muted-foreground animate-pulse">⏳ Đang tải bản đồ đường đi...</p>
                </div>
              )}

              {/* Payment & Delivery Info */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Phương thức giao</p>
                  <p className="text-foreground font-medium mt-1">
                    {deliveryMethodLabels[selectedOrder.deliveryMethod] || selectedOrder.deliveryMethod}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Thanh toán</p>
                  <p className="text-foreground font-medium mt-1">
                    {paymentMethodLabels[selectedOrder.paymentMethod] || selectedOrder.paymentMethod}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Trạng thái TT</p>
                  <p className="text-foreground font-medium mt-1">
                    {paymentStatusLabels[selectedOrder.paymentStatus] || selectedOrder.paymentStatus}
                  </p>
                </div>
              </div>
              {/* Items */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Các mặt hàng</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm bg-muted p-3 rounded">
                      <span className="text-foreground">
                        {item.productName} x{item.quantity}
                      </span>
                      <span className="font-medium text-foreground">
                        {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm bg-primary/10 p-3 rounded font-semibold">
                    <span>Tổng cộng</span>
                    <span>{selectedOrder.totalPrice.toLocaleString("vi-VN")}đ</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">Ghi chú</h3>
                  <p className="text-sm text-foreground">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Close Button */}
              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => setShowDetail(false)}
                  className="bg-gray-600 hover:bg-gray-700"
                >
                  Đóng
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}