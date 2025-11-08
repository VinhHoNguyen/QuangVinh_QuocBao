"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"

const pendingOrders = [
  { id: "ĐH101", customer: "Nguyễn Văn A", location: "123 Phố Huế, Hà Nội", time: "10:30", distance: "2.5 km" },
  { id: "ĐH102", customer: "Trần Thị B", location: "456 Nguyễn Trãi, Hà Nội", time: "10:45", distance: "3.2 km" },
  { id: "ĐH103", customer: "Lê Văn C", location: "789 Láng Hạ, Hà Nội", time: "11:00", distance: "1.8 km" },
]

const shippers = [
  { id: 1, name: "Nguyễn Quân", status: "Sẵn sàng", distance: "0.5 km" },
  { id: 2, name: "Trần Minh", status: "Sẵn sàng", distance: "1.2 km" },
  { id: 3, name: "Lê Hùng", status: "Đang giao", distance: "Đang hoạt động" },
  { id: 4, name: "Phạm Sơn", status: "Sẵn sàng", distance: "0.8 km" },
]

export default function AssignmentPage() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [selectedShipper, setSelectedShipper] = useState<number | null>(null)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Phân công giao hàng</h1>
        <p className="text-muted-foreground mt-1">Gán đơn hàng cho shipper</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Orders */}
        <Card className="p-6 lg:col-span-1">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Zap size={20} className="text-primary" />
            Đơn chờ gán
          </h2>
          <div className="space-y-3">
            {pendingOrders.map((order) => (
              <button
                key={order.id}
                onClick={() => setSelectedOrder(order.id)}
                className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                  selectedOrder === order.id
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
            ))}
          </div>
        </Card>

        {/* Available Shippers */}
        <Card className="p-6 lg:col-span-1">
          <h2 className="text-xl font-bold text-foreground mb-4">Shipper sẵn sàng</h2>
          <div className="space-y-3">
            {shippers.map((shipper) => (
              <button
                key={shipper.id}
                onClick={() => setSelectedShipper(shipper.id)}
                disabled={shipper.status === "Đang giao"}
                className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                  selectedShipper === shipper.id
                    ? "border-primary bg-primary/10"
                    : shipper.status === "Đang giao"
                      ? "border-border bg-muted opacity-50 cursor-not-allowed"
                      : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <p className="font-semibold text-foreground">{shipper.name}</p>
                <p className="text-sm text-muted-foreground">{shipper.status}</p>
                <p className="text-xs text-muted-foreground mt-1">{shipper.distance}</p>
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
                <p className="text-sm text-muted-foreground mb-1">Shipper</p>
                <p className="text-lg font-bold text-foreground">
                  {selectedShipper ? shippers.find((s) => s.id === selectedShipper)?.name : "Chưa chọn"}
                </p>
              </div>
            </div>
          </div>
          <Button className="w-full bg-primary hover:bg-primary/90 mt-6" disabled={!selectedOrder || !selectedShipper}>
            Phân công ngay
          </Button>
        </Card>
      </div>
    </div>
  )
}
