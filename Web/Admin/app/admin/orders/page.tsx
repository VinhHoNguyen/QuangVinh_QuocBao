"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const mockOrders = [
  {
    id: "ĐH001",
    customer: "Nguyễn Văn A",
    restaurant: "KFC Hà Nội",
    total: 250000,
    date: "2024-11-07 10:30",
    status: "Đã giao",
    shippingMethod: "Drone",
    drone: "D001",
    droneStatus: "Trở về",
    shipper: null,
    distance: 3.5,
    estimatedTime: 15,
    actualTime: 18,
    phone: "0123456789",
    address: "123 Phố Huế, Hà Nội",
    items: [{ name: "Combo gà rán", qty: 2, price: 120000 }],
    delayReason: "Giao thông",
    complaint: null,
  },
  {
    id: "ĐH002",
    customer: "Trần Thị B",
    restaurant: "Pizza Hut",
    total: 350000,
    date: "2024-11-07 11:15",
    status: "Đang giao",
    shippingMethod: "Shipper xe máy",
    drone: null,
    droneStatus: null,
    shipper: { name: "Trần Minh Tuấn", phone: "0987654321", vehicle: "Yamaha Exciter" },
    distance: 4.2,
    estimatedTime: 20,
    actualTime: 8,
    phone: "0987654321",
    address: "456 Phố Trần, Hà Nội",
    items: [{ name: "Pizza rau cải", qty: 1, price: 250000 }],
    delayReason: null,
    complaint: null,
  },
  {
    id: "ĐH003",
    customer: "Lê Văn C",
    restaurant: "Jollibee",
    total: 180000,
    date: "2024-11-07 12:00",
    status: "Chờ xác nhận",
    shippingMethod: "Chưa chọn",
    drone: null,
    droneStatus: null,
    shipper: null,
    distance: 2.1,
    estimatedTime: 12,
    actualTime: 0,
    phone: "0912345678",
    address: "789 Phố Lý, Hà Nội",
    items: [
      { name: "Gà quay", qty: 1, price: 85000 },
      { name: "Khoai tây chiên", qty: 2, price: 95000 },
    ],
    delayReason: null,
    complaint: null,
  },
  {
    id: "ĐH004",
    customer: "Phạm Thị D",
    restaurant: "Lotteria",
    total: 420000,
    date: "2024-11-07 13:30",
    status: "Đã hủy",
    shippingMethod: "Shipper đi bộ",
    drone: null,
    droneStatus: null,
    shipper: { name: "Nguyễn Văn Huy", phone: "0945678901", vehicle: "Đi bộ" },
    distance: 1.2,
    estimatedTime: 15,
    actualTime: 0,
    phone: "0945678901",
    address: "321 Phố Nguyễn, Hà Nội",
    items: [{ name: "Burger bò", qty: 2, price: 200000 }],
    delayReason: null,
    complaint: { type: "Khách hủy", reason: "Thay đổi ý định", date: "2024-11-07 13:35" },
  },
  {
    id: "ĐH005",
    customer: "Hoàng Văn E",
    restaurant: "KFC",
    total: 290000,
    date: "2024-11-07 14:00",
    status: "Đã giao",
    shippingMethod: "Drone",
    drone: "D004",
    droneStatus: "Trở về",
    shipper: null,
    distance: 3.2,
    estimatedTime: 14,
    actualTime: 22,
    phone: "0978901234",
    address: "654 Phố Hàng, Hà Nội",
    items: [{ name: "Combo gà", qty: 1, price: 180000 }],
    delayReason: "Pin drone yếu",
    complaint: { type: "Giao chậm", reason: "Giao trễ 8 phút", date: "2024-11-07 14:22" },
  },
  {
    id: "ĐH006",
    customer: "Đỗ Thị F",
    restaurant: "Pizza Hut",
    total: 320000,
    date: "2024-11-07 15:45",
    status: "Đang giao",
    shippingMethod: "Shipper xe máy",
    drone: null,
    droneStatus: null,
    shipper: { name: "Lê Văn Sơn", phone: "0934567890", vehicle: "Honda Wave" },
    distance: 5.5,
    estimatedTime: 25,
    actualTime: 12,
    phone: "0934567890",
    address: "987 Phố Tây, Hà Nội",
    items: [{ name: "Pizza hải sản", qty: 1, price: 320000 }],
    delayReason: null,
    complaint: null,
  },
]

const statusColors = {
  "Đã giao": "bg-green-100 text-green-700",
  "Đang giao": "bg-blue-100 text-blue-700",
  "Chờ xác nhận": "bg-yellow-100 text-yellow-700",
  "Đã hủy": "bg-red-100 text-red-700",
}

const droneStatusColors = {
  "Đang giao": "text-blue-600",
  "Trở về": "text-gray-600",
  "Trạm sạc": "text-orange-600",
}

const shippingMethodColors = {
  Drone: "bg-blue-100 text-blue-700 border-blue-300",
  "Shipper xe máy": "bg-orange-100 text-orange-700 border-orange-300",
  "Shipper đi bộ": "bg-green-100 text-green-700 border-green-300",
  "Chưa chọn": "bg-gray-100 text-gray-700 border-gray-300",
}

export default function OrdersPage() {
  const [orders, setOrders] = useState(mockOrders)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("Tất cả")
  const [shippingFilter, setShippingFilter] = useState("Tất cả")
  const [selectedOrder, setSelectedOrder] = useState<(typeof mockOrders)[0] | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [reassignDrone, setReassignDrone] = useState(false)
  const [selectShipping, setSelectShipping] = useState(false)
  const [handleComplaint, setHandleComplaint] = useState(false)

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.includes(search) ||
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.restaurant.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "Tất cả" || order.status === statusFilter
    const matchesShipping = shippingFilter === "Tất cả" || order.shippingMethod === shippingFilter
    return matchesSearch && matchesStatus && matchesShipping
  })

  const handleViewDetail = (order: (typeof mockOrders)[0]) => {
    setSelectedOrder(order)
    setShowDetail(true)
    setReassignDrone(false)
    setSelectShipping(false)
    setHandleComplaint(false)
  }

  const handleSelectShipping = (method: string) => {
    if (!selectedOrder) return
    const updatedOrders = orders.map((o) => {
      if (o.id === selectedOrder.id) {
        const updated = { ...o, shippingMethod: method }
        if (method === "Drone") {
          updated.drone = "D001"
          updated.droneStatus = "Đang giao"
          updated.shipper = null
        } else if (method === "Shipper xe máy") {
          updated.shipper = { name: "Trần Minh Tuấn", phone: "0987654321", vehicle: "Yamaha Exciter" }
          updated.drone = null
          updated.droneStatus = null
        } else if (method === "Shipper đi bộ") {
          updated.shipper = { name: "Nguyễn Văn Huy", phone: "0945678901", vehicle: "Đi bộ" }
          updated.drone = null
          updated.droneStatus = null
        }
        setSelectedOrder(updated)
        return updated
      }
      return o
    })
    setOrders(updatedOrders)
    setSelectShipping(false)
    alert(`Đã chọn phương thức giao hàng: ${method}`)
  }

  const handleReassignDrone = (orderId: string) => {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, drone: "D001", droneStatus: "Đang giao" } : o)))
    alert("Đã điều phối lại drone D001 cho đơn hàng này")
  }

  const handleCancelOrder = (orderId: string) => {
    setOrders(
      orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "Đã hủy",
              complaint: { type: "Admin hủy", reason: "Theo yêu cầu", date: new Date().toLocaleString("vi-VN") },
            }
          : o,
      ),
    )
    alert("Đã hủy đơn hàng")
  }

  const handleRefund = (orderId: string) => {
    alert(`Đã hoàn tiền ${orders.find((o) => o.id === orderId)?.total.toLocaleString("vi-VN")}đ cho đơn ${orderId}`)
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
          <p className="text-2xl font-bold text-foreground mt-1">6</p>
        </Card>
        <Card className="p-4">
          <p className="text-muted-foreground text-sm font-medium">Đang giao</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">2</p>
        </Card>
        <Card className="p-4">
          <p className="text-muted-foreground text-sm font-medium">Đã giao</p>
          <p className="text-2xl font-bold text-green-600 mt-1">3</p>
        </Card>
        <Card className="p-4">
          <p className="text-muted-foreground text-sm font-medium">Khiếu nại</p>
          <p className="text-2xl font-bold text-red-600 mt-1">1</p>
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
            <option>Tất cả</option>
            <option>Đã giao</option>
            <option>Đang giao</option>
            <option>Chờ xác nhận</option>
            <option>Đã hủy</option>
          </select>
          <select
            className="px-4 py-2 border border-border rounded-lg bg-card text-foreground"
            value={shippingFilter}
            onChange={(e) => setShippingFilter(e.target.value)}
          >
            <option>Tất cả phương thức</option>
            <option>Drone</option>
            <option>Shipper xe máy</option>
            <option>Shipper đi bộ</option>
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
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Phương thức</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Người giao</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Trạng thái</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Thời gian</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-foreground font-medium text-primary">{order.id}</td>
                  <td className="px-6 py-4 text-foreground">{order.customer}</td>
                  <td className="px-6 py-4 text-muted-foreground">{order.restaurant}</td>
                  <td className="px-6 py-4 text-foreground font-semibold">{order.total.toLocaleString("vi-VN")}đ</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${shippingMethodColors[order.shippingMethod as keyof typeof shippingMethodColors] || "bg-gray-100"}`}
                    >
                      {order.shippingMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">
                      {order.drone ? (
                        <span className="text-blue-600 font-medium">{order.drone}</span>
                      ) : order.shipper ? (
                        <div className="text-foreground">
                          <p className="font-medium">{order.shipper.name}</p>
                          <p className="text-xs text-muted-foreground">{order.shipper.vehicle}</p>
                        </div>
                      ) : (
                        <span className="text-gray-400">Chưa gán</span>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm ${statusColors[order.status as keyof typeof statusColors]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-sm">
                    <div className="flex items-center gap-1">
                      <span>⏱️</span>
                      {order.actualTime ? `${order.actualTime}/${order.estimatedTime}` : order.estimatedTime}p
                    </div>
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
              ))}
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
                  <h2 className="text-2xl font-bold text-foreground">{selectedOrder.id}</h2>
                  <p className="text-muted-foreground mt-1">{selectedOrder.date}</p>
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
                  <p className="text-foreground font-medium mt-1">{selectedOrder.customer}</p>
                  <p className="text-sm text-muted-foreground mt-1">{selectedOrder.phone}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.address}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nhà hàng</p>
                  <p className="text-foreground font-medium mt-1">{selectedOrder.restaurant}</p>
                  <p className="text-sm text-muted-foreground mt-3">
                    Tổng tiền: {selectedOrder.total.toLocaleString("vi-VN")}đ
                  </p>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg space-y-3">
                <h3 className="font-semibold text-foreground">Thông tin giao hàng</h3>
                <div className="mb-3">
                  <p className="text-sm text-muted-foreground">Phương thức giao</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium border mt-1 ${shippingMethodColors[selectedOrder.shippingMethod as keyof typeof shippingMethodColors]}`}
                  >
                    {selectedOrder.shippingMethod}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {selectedOrder.shippingMethod === "Drone" ? (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">Drone giao</p>
                        <p className="text-foreground font-medium">{selectedOrder.drone || "Chưa gán"}</p>
                        {selectedOrder.droneStatus && (
                          <p
                            className={`text-sm mt-1 font-medium ${droneStatusColors[selectedOrder.droneStatus as keyof typeof droneStatusColors]}`}
                          >
                            {selectedOrder.droneStatus}
                          </p>
                        )}
                      </div>
                    </>
                  ) : selectedOrder.shipper ? (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">Người giao hàng</p>
                        <p className="text-foreground font-medium">{selectedOrder.shipper.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">{selectedOrder.shipper.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phương tiện</p>
                        <p className="text-foreground font-medium">{selectedOrder.shipper.vehicle}</p>
                      </div>
                    </>
                  ) : null}
                  <div>
                    <p className="text-sm text-muted-foreground">Khoảng cách</p>
                    <p className="text-foreground font-medium">{selectedOrder.distance} km</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Thời gian dự tính</p>
                    <p className="text-foreground font-medium">{selectedOrder.estimatedTime} phút</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Thời gian thực tế</p>
                    <p className="text-foreground font-medium">
                      {selectedOrder.actualTime ? `${selectedOrder.actualTime} phút` : "Đang giao"}
                    </p>
                  </div>
                </div>
                {selectedOrder.delayReason && (
                  <div className="flex items-start gap-2 pt-2 border-t border-border">
                    <span className="text-orange-600 mt-0.5 flex-shrink-0">⚠️</span>
                    <div>
                      <p className="text-sm font-medium text-orange-600">Lý do trễ</p>
                      <p className="text-sm text-muted-foreground">{selectedOrder.delayReason}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Các mặt hàng</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm bg-muted p-3 rounded">
                      <span>
                        {item.name} x{item.qty}
                      </span>
                      <span className="font-medium">{item.price.toLocaleString("vi-VN")}đ</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Complaint */}
              {selectedOrder.complaint && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-700 mb-2">⚠️ Khiếu nại / Vấn đề</h3>
                  <p className="text-sm text-red-600 font-medium">{selectedOrder.complaint.type}</p>
                  <p className="text-sm text-muted-foreground mt-1">{selectedOrder.complaint.reason}</p>
                  <p className="text-xs text-muted-foreground mt-2">{selectedOrder.complaint.date}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-border flex-wrap">
                {selectedOrder.status === "Chờ xác nhận" && selectedOrder.shippingMethod === "Chưa chọn" && (
                  <Button onClick={() => setSelectShipping(true)} className="bg-primary hover:bg-primary/90">
                    Chọn phương thức giao
                  </Button>
                )}
                {selectedOrder.status === "Chờ xác nhận" && selectedOrder.shippingMethod !== "Chưa chọn" && (
                  <Button onClick={() => setReassignDrone(true)} className="bg-primary hover:bg-primary/90">
                    {selectedOrder.shippingMethod === "Drone" ? "Gán Drone" : "Gán Shipper"}
                  </Button>
                )}
                {["Đang giao", "Chờ xác nhận"].includes(selectedOrder.status) && (
                  <Button
                    onClick={() => handleCancelOrder(selectedOrder.id)}
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Hủy đơn
                  </Button>
                )}
                {selectedOrder.status === "Đang giao" && (
                  <Button onClick={() => setReassignDrone(true)} variant="outline">
                    Điều phối lại
                  </Button>
                )}
                {selectedOrder.complaint && (
                  <>
                    <Button onClick={() => setHandleComplaint(true)} className="bg-orange-600 hover:bg-orange-700">
                      Xử lý khiếu nại
                    </Button>
                    <Button
                      onClick={() => handleRefund(selectedOrder.id)}
                      variant="outline"
                      className="text-green-600 border-green-200"
                    >
                      Hoàn tiền
                    </Button>
                  </>
                )}
                <Button onClick={() => setShowDetail(false)} variant="outline" className="ml-auto">
                  Đóng
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {selectShipping && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-bold text-foreground">Chọn phương thức giao hàng</h2>
              <p className="text-sm text-muted-foreground">Đơn hàng: {selectedOrder.id}</p>

              <div className="space-y-3">
                <button
                  onClick={() => handleSelectShipping("Drone")}
                  className="w-full p-4 border-2 border-blue-300 rounded-lg hover:bg-blue-50 transition text-left"
                >
                  <p className="font-semibold text-blue-700">Drone</p>
                  <p className="text-sm text-blue-600">Giao nhanh trong 15-20 phút</p>
                </button>

                <button
                  onClick={() => handleSelectShipping("Shipper xe máy")}
                  className="w-full p-4 border-2 border-orange-300 rounded-lg hover:bg-orange-50 transition text-left"
                >
                  <p className="font-semibold text-orange-700">Shipper xe máy</p>
                  <p className="text-sm text-orange-600">Giao trong 20-30 phút, linh hoạt hơn</p>
                </button>

                <button
                  onClick={() => handleSelectShipping("Shipper đi bộ")}
                  className="w-full p-4 border-2 border-green-300 rounded-lg hover:bg-green-50 transition text-left"
                >
                  <p className="font-semibold text-green-700">Shipper đi bộ</p>
                  <p className="text-sm text-green-600">Giao trong 15-25 phút, khu vực gần</p>
                </button>
              </div>

              <Button onClick={() => setSelectShipping(false)} variant="outline" className="w-full">
                Hủy
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
