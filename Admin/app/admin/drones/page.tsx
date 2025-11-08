"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Edit2, Eye, AlertTriangle, Wrench, MapPin, Battery } from "lucide-react"

const initialDrones = [
  {
    id: "DR001",
    model: "DJI Matrice 300 RTK",
    status: "Hoạt động",
    battery: 85,
    location: "Base A - Hà Nội",
    coordinates: { lat: 21.0285, lng: 105.8542 },
    payload: { current: 4.2, max: 5.5 },
    lastMaintenance: "2024-10-15",
    nextMaintenance: "2024-11-15",
    flightHours: 245,
    incidents: 0,
  },
  {
    id: "DR002",
    model: "DJI Air 3",
    status: "Hoạt động",
    battery: 72,
    location: "Base B - Hà Đông",
    coordinates: { lat: 20.9719, lng: 105.7872 },
    payload: { current: 2.1, max: 2.7 },
    lastMaintenance: "2024-10-22",
    nextMaintenance: "2024-11-22",
    flightHours: 180,
    incidents: 0,
  },
  {
    id: "DR003",
    model: "DJI Matrice 300 RTK",
    status: "Bảo trì",
    battery: 15,
    location: "Service Center",
    coordinates: { lat: 21.0163, lng: 105.8689 },
    payload: { current: 0, max: 5.5 },
    lastMaintenance: "2024-11-01",
    nextMaintenance: "2024-12-01",
    flightHours: 312,
    incidents: 1,
  },
  {
    id: "DR004",
    model: "DJI Mini 3",
    status: "Hoạt động",
    battery: 92,
    location: "Base C - Ba Đình",
    coordinates: { lat: 21.0529, lng: 105.8277 },
    payload: { current: 1.8, max: 2.0 },
    lastMaintenance: "2024-10-28",
    nextMaintenance: "2024-11-28",
    flightHours: 156,
    incidents: 0,
  },
  {
    id: "DR005",
    model: "DJI Air 3",
    status: "Cảnh báo",
    battery: 35,
    location: "Base A - Hà Nội",
    coordinates: { lat: 21.0285, lng: 105.8542 },
    payload: { current: 2.3, max: 2.7 },
    lastMaintenance: "2024-09-15",
    nextMaintenance: "2024-11-15",
    flightHours: 298,
    incidents: 2,
  },
]

const initialOrders = [
  { id: "ĐH001", customer: "Nguyễn Văn A", restaurant: "KFC Hà Nội", status: "Chờ giao", distance: 3.2, weight: 1.5 },
  { id: "ĐH002", customer: "Trần Thị B", restaurant: "Pizza Hut", status: "Chờ giao", distance: 2.8, weight: 2.1 },
  { id: "ĐH003", customer: "Lê Văn C", restaurant: "Jollibee", status: "Chờ giao", distance: 4.5, weight: 1.2 },
]

const maintenanceLogs = [
  {
    id: "ML001",
    droneId: "DR001",
    date: "2024-10-15",
    type: "Định kỳ",
    description: "Thay dầu, kiểm tra pin",
    cost: "500.000đ",
  },
  {
    id: "ML002",
    droneId: "DR003",
    date: "2024-11-01",
    type: "Sự cố",
    description: "Sửa cánh quạt hư",
    cost: "1.200.000đ",
  },
  { id: "ML003", droneId: "DR005", date: "2024-10-20", type: "Sự cố", description: "Thay camera", cost: "2.500.000đ" },
]

export default function DronesPage() {
  const [drones, setDrones] = useState(initialDrones)
  const [orders] = useState(initialOrders)
  const [activeTab, setActiveTab] = useState("list")
  const [selectedDrone, setSelectedDrone] = useState<(typeof initialDrones)[0] | null>(null)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("Tất cả")

  const filteredDrones = drones.filter((drone) => {
    const matchesSearch = drone.id.includes(search) || drone.model.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "Tất cả" || drone.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAssignOrder = (droneId: string, orderId: string) => {
    console.log(`[v0] Assigned order ${orderId} to drone ${droneId}`)
    setShowAssignModal(false)
    setSelectedOrder(null)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      "Hoạt động": "bg-green-100 text-green-700",
      "Bảo trì": "bg-yellow-100 text-yellow-700",
      "Cảnh báo": "bg-red-100 text-red-700",
      "Ngoại tuyến": "bg-gray-100 text-gray-700",
    }
    return colors[status] || "bg-gray-100 text-gray-700"
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý Drone & Đội Vận Hành</h1>
          <p className="text-muted-foreground mt-1">Theo dõi, gán công việc và quản lý bảo trì drone</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus size={18} />
          Thêm Drone
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("list")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "list"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Danh sách Drone
        </button>
        <button
          onClick={() => setActiveTab("map")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "map"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Bản đồ Thời gian thực
        </button>
        <button
          onClick={() => setActiveTab("assignment")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "assignment"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Gán công việc
        </button>
        <button
          onClick={() => setActiveTab("maintenance")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "maintenance"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Bảo trì & Sự cố
        </button>
      </div>

      {/* Tab: Danh sách Drone */}
      {activeTab === "list" && (
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Input
                    placeholder="Tìm theo mã drone hoặc model..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-4"
                  />
                </div>
              </div>
              <select
                className="px-4 py-2 border border-border rounded-lg bg-card text-foreground"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>Tất cả</option>
                <option>Hoạt động</option>
                <option>Bảo trì</option>
                <option>Cảnh báo</option>
                <option>Ngoại tuyến</option>
              </select>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDrones.map((drone) => (
              <Card key={drone.id} className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{drone.id}</h3>
                    <p className="text-sm text-muted-foreground">{drone.model}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(drone.status)}`}>
                    {drone.status}
                  </span>
                </div>

                {/* Battery */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Battery size={14} /> Pin
                    </span>
                    <span className="text-sm font-semibold text-foreground">{drone.battery}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${drone.battery > 60 ? "bg-green-500" : drone.battery > 30 ? "bg-yellow-500" : "bg-red-500"}`}
                      style={{ width: `${drone.battery}%` }}
                    />
                  </div>
                </div>

                {/* Payload */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-muted p-2 rounded">
                    <p className="text-xs text-muted-foreground">Tải trọng</p>
                    <p className="font-semibold text-foreground">
                      {drone.payload.current}/{drone.payload.max} kg
                    </p>
                  </div>
                  <div className="bg-muted p-2 rounded">
                    <p className="text-xs text-muted-foreground">Giờ Bay</p>
                    <p className="font-semibold text-foreground">{drone.flightHours} h</p>
                  </div>
                </div>

                {/* Location */}
                <div className="text-sm flex items-start gap-2">
                  <MapPin size={14} className="text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-muted-foreground text-xs">Vị trí</p>
                    <p className="text-foreground">{drone.location}</p>
                  </div>
                </div>

                {/* Incidents */}
                {drone.incidents > 0 && (
                  <div className="bg-red-50 p-2 rounded flex items-center gap-2">
                    <AlertTriangle size={14} className="text-red-600" />
                    <span className="text-xs text-red-700">{drone.incidents} sự cố</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-1 bg-transparent"
                    onClick={() => setSelectedDrone(drone)}
                  >
                    <Eye size={14} />
                    Chi tiết
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 gap-1 bg-transparent">
                    <Edit2 size={14} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Bản đồ Thời gian thực */}
      {activeTab === "map" && (
        <Card className="p-6">
          <div className="bg-muted rounded-lg h-96 flex items-center justify-center mb-4">
            <div className="text-center">
              <MapPin size={48} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Bản đồ theo dõi thời gian thực (Google Maps Integration)</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {filteredDrones.map((drone) => (
              <div key={drone.id} className="bg-muted p-2 rounded text-sm">
                <p className="font-semibold text-foreground">{drone.id}</p>
                <p className="text-xs text-muted-foreground">
                  Tọa độ: {drone.coordinates.lat.toFixed(4)}, {drone.coordinates.lng.toFixed(4)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab: Gán công việc */}
      {activeTab === "assignment" && (
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold text-foreground mb-4">Đơn hàng chờ giao</h3>
            <div className="space-y-2">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-semibold text-foreground">{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.customer} - {order.restaurant} ({order.distance}km, {order.weight}kg)
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedOrder(order.id)
                      setShowAssignModal(true)
                    }}
                  >
                    Gán drone
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Available Drones */}
          <Card className="p-4">
            <h3 className="font-semibold text-foreground mb-4">Drone sẵn sàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {drones
                .filter((d) => d.status === "Hoạt động" && d.battery > 30)
                .map((drone) => (
                  <div key={drone.id} className="p-3 border border-border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-foreground">{drone.id}</p>
                        <p className="text-sm text-muted-foreground">{drone.model}</p>
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded">
                        {drone.battery}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{drone.location}</p>
                    {selectedOrder && (
                      <Button size="sm" className="w-full" onClick={() => handleAssignOrder(drone.id, selectedOrder)}>
                        Gán cho {selectedOrder}
                      </Button>
                    )}
                  </div>
                ))}
            </div>
          </Card>
        </div>
      )}

      {/* Tab: Bảo trì & Sự cố */}
      {activeTab === "maintenance" && (
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Mã Drone</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Ngày</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Loại</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Mô tả</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Chi phí</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenanceLogs.map((log) => (
                    <tr key={log.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 text-foreground font-medium">{log.droneId}</td>
                      <td className="px-6 py-4 text-muted-foreground">{log.date}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            log.type === "Sự cố" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {log.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-foreground">{log.description}</td>
                      <td className="px-6 py-4 font-semibold text-foreground">{log.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Maintenance Schedule */}
          <Card className="p-4">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Wrench size={18} />
              Lịch bảo trì sắp tới
            </h3>
            <div className="space-y-2">
              {drones
                .filter((d) => new Date(d.nextMaintenance) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
                .map((drone) => (
                  <div
                    key={drone.id}
                    className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{drone.id}</p>
                      <p className="text-sm text-muted-foreground">Bảo trì dự kiến: {drone.nextMaintenance}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Wrench size={14} className="mr-1" />
                      Lên lịch
                    </Button>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      )}

      {/* Detail Modal */}
      {selectedDrone && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-96 overflow-y-auto">
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{selectedDrone.id}</h2>
                  <p className="text-muted-foreground">{selectedDrone.model}</p>
                </div>
                <button
                  onClick={() => setSelectedDrone(null)}
                  className="text-muted-foreground hover:text-foreground text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted rounded">
                    <p className="text-xs text-muted-foreground">Trạng thái</p>
                    <p className="font-semibold text-foreground">{selectedDrone.status}</p>
                  </div>
                  <div className="p-3 bg-muted rounded">
                    <p className="text-xs text-muted-foreground">Pin</p>
                    <p className="font-semibold text-foreground">{selectedDrone.battery}%</p>
                  </div>
                  <div className="p-3 bg-muted rounded">
                    <p className="text-xs text-muted-foreground">Tải trọng</p>
                    <p className="font-semibold text-foreground">
                      {selectedDrone.payload.current}/{selectedDrone.payload.max} kg
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded">
                    <p className="text-xs text-muted-foreground">Giờ bay</p>
                    <p className="font-semibold text-foreground">{selectedDrone.flightHours} h</p>
                  </div>
                </div>

                <div className="p-3 bg-muted rounded">
                  <p className="text-xs text-muted-foreground mb-1">Vị trí</p>
                  <p className="font-semibold text-foreground">{selectedDrone.location}</p>
                  <p className="text-xs text-muted-foreground">
                    ({selectedDrone.coordinates.lat.toFixed(4)}, {selectedDrone.coordinates.lng.toFixed(4)})
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted rounded">
                    <p className="text-xs text-muted-foreground">Bảo trì cuối</p>
                    <p className="font-semibold text-foreground text-sm">{selectedDrone.lastMaintenance}</p>
                  </div>
                  <div className="p-3 bg-muted rounded">
                    <p className="text-xs text-muted-foreground">Bảo trì tiếp</p>
                    <p className="font-semibold text-foreground text-sm">{selectedDrone.nextMaintenance}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-border">
                <Button className="flex-1" onClick={() => setSelectedDrone(null)}>
                  Đóng
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Edit2 size={14} className="mr-1" />
                  Sửa
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
