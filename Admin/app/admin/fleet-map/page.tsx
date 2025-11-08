"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Zap } from "lucide-react"

const shippersLocation = [
  { id: 1, name: "Nguyễn Quân", status: "Hoạt động", lat: "21.0285", lng: "105.8542", orders: 2 },
  { id: 2, name: "Trần Minh", status: "Hoạt động", lat: "21.0348", lng: "105.8628", orders: 1 },
  { id: 3, name: "Lê Hùng", status: "Hoạt động", lat: "21.0293", lng: "105.8488", orders: 3 },
  { id: 4, name: "Phạm Sơn", status: "Offline", lat: "21.0174", lng: "105.8439", orders: 0 },
]

export default function FleetMapPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Bản đồ giao hàng</h1>
        <p className="text-muted-foreground mt-1">Theo dõi vị trí shipper theo thời gian thực</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Placeholder */}
        <Card className="lg:col-span-3 h-96 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center rounded-lg overflow-hidden">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-muted-foreground">
              Bản đồ sẽ hiển thị tại đây
              <br />
              <span className="text-sm">(Tích hợp Google Maps)</span>
            </p>
          </div>
        </Card>

        {/* Shippers List */}
        <Card className="p-6 h-96 overflow-y-auto">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Zap size={20} className="text-primary" />
            Shipper hoạt động
          </h3>
          <div className="space-y-3">
            {shippersLocation.map((shipper) => (
              <div
                key={shipper.id}
                className="p-3 rounded-lg bg-muted hover:bg-muted/70 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-foreground">{shipper.name}</p>
                  <Badge variant={shipper.status === "Hoạt động" ? "default" : "secondary"}>{shipper.status}</Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Lat: {shipper.lat}</p>
                  <p>Lng: {shipper.lng}</p>
                  <p className="font-semibold text-foreground mt-2">
                    Đơn: <span className="text-primary">{shipper.orders}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Legend */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Huyền thoại</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500" />
            <span className="text-sm text-foreground">Hoạt động</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-500" />
            <span className="text-sm text-foreground">Offline</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
