"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"

export default function AssignmentPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [drones, setDrones] = useState<any[]>([])
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [selectedDrone, setSelectedDrone] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [assigning, setAssigning] = useState(false)

  useEffect(() => {
    loadOrders()
    loadDrones()
  }, [])

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem("admin_token") || localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/orders?status=ready", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })

      if (response.ok) {
        const data = await response.json()
        const mappedOrders = (data.data || []).map((order: any) => ({
          id: order._id,
          customer: order.userId?.name || "Khách hàng",
          location: `${order.shippingAddress.street}, ${order.shippingAddress.ward}`,
          time: new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          distance: "N/A",
          _order: order,
        }))
        setOrders(mappedOrders)
      }
    } catch (error) {
      console.error("Error loading orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadDrones = async () => {
    try {
      const token = localStorage.getItem("admin_token") || localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/drones", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })

      if (response.ok) {
        const data = await response.json()
        const mappedDrones = (data.data || []).map((drone: any) => ({
          id: drone._id,
          name: `${drone.code} - ${drone.name}`,
          status: drone.status === 'available' ? 'Sẵn sàng' : 'Đang bay',
          distance: `Pin: ${drone.battery}%`,
          battery: drone.battery,
          _drone: drone,
        }))
        setDrones(mappedDrones)
      }
    } catch (error) {
      console.error("Error loading drones:", error)
    }
  }

  const handleAssign = async () => {
    if (!selectedOrder || !selectedDrone) return

    try {
      setAssigning(true)
      const token = localStorage.getItem("admin_token") || localStorage.getItem("token")

      // Get delivery for order
      const deliveryRes = await fetch(`http://localhost:5000/api/deliveries/order/${selectedOrder}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })

      if (!deliveryRes.ok) {
        alert('Chưa có thông tin giao hàng')
        return
      }

      const deliveryData = await deliveryRes.json()
      const deliveryId = deliveryData.data._id

      // Assign drone
      const assignRes = await fetch(`http://localhost:5000/api/deliveries/${deliveryId}/assign-drone`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ droneId: selectedDrone }),
      })

      if (!assignRes.ok) {
        const error = await assignRes.json()
        alert(`Lỗi: ${error.message}`)
        return
      }

      alert('✅ Đã gán drone thành công!')
      setSelectedOrder(null)
      setSelectedDrone(null)
      // Reload data
      await loadOrders()
      await loadDrones()
    } catch (error: any) {
      console.error('Error assigning:', error)
      alert(`Lỗi: ${error.message}`)
    } finally {
      setAssigning(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Phân công giao hàng</h1>
        <p className="text-muted-foreground mt-1">Gán đơn hàng cho drone</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Orders */}
        <Card className="p-6 lg:col-span-1">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Zap size={20} className="text-primary" />
            Đơn chờ gán
          </h2>
          <div className="space-y-3">
            {loading ? (
              <p className="text-muted-foreground">Đang tải...</p>
            ) : orders.length === 0 ? (
              <p className="text-muted-foreground">Không có đơn hàng</p>
            ) : (
              orders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => setSelectedOrder(order.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${selectedOrder === order.id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/50"
                    }`}
                >
                  <p className="font-semibold text-foreground">{order.id}</p>
                  <p className="text-sm text-muted-foreground">{order.customer}</p>
                  <p className="text-xs text-muted-foreground mt-1">{order.location}</p>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs bg-muted px-2 py-1 rounded">{order.time}</span>
                    <span className="text-xs bg-muted px-2 py-1 rounded">{order.distance}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </Card>

        {/* Available Drones */}
        <Card className="p-6 lg:col-span-1">
          <h2 className="text-xl font-bold text-foreground mb-4">Drone sẵn sàng</h2>
          <div className="space-y-3">
            {drones.map((drone) => (
              <button
                key={drone.id}
                onClick={() => setSelectedDrone(drone.id)}
                disabled={drone._drone?.status !== 'available'}
                className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${selectedDrone === drone.id
                  ? "border-primary bg-primary/10"
                  : drone._drone?.status !== 'available'
                    ? "border-border bg-muted opacity-50 cursor-not-allowed"
                    : "border-border bg-card hover:border-primary/50"
                  }`}
              >
                <p className="font-semibold text-foreground">{drone.name}</p>
                <p className="text-sm text-muted-foreground">{drone.status}</p>
                <p className="text-xs text-muted-foreground mt-1">{drone.distance}</p>
              </button>
            ))}
          </div>
        </Card>

        {/* Assignment Confirmation */}
        <Card className="p-6 lg:col-span-1 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Xác nhận phân công</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Đơn hàng</p>
                <p className="text-lg font-bold text-foreground">{selectedOrder || "Chưa chọn"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Drone</p>
                <p className="text-lg font-bold text-foreground">
                  {selectedDrone ? drones.find((d) => d.id === selectedDrone)?.name : "Chưa chọn"}
                </p>
              </div>
            </div>
          </div>
          <Button
            className="w-full bg-primary hover:bg-primary/90 mt-6"
            disabled={!selectedOrder || !selectedDrone || assigning}
            onClick={handleAssign}
          >
            {assigning ? "Đang gán..." : "Phân công ngay"}
          </Button>
        </Card>
      </div>
    </div>
  )
}
