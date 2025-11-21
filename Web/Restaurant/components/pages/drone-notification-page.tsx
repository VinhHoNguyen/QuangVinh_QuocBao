"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bone as Drone, CheckCircle2, Clock } from "lucide-react"

export function DroneNotificationPage() {
  const [droneNotifications, setDroneNotifications] = useState([
    {
      id: 1,
      droneId: "DRONE-001",
      droneName: "Drone Alpha",
      licensePlate: "DRN-001",
      status: "Đã Gán",
      orderIds: "#ORD001, #ORD002",
      eta: "14:45",
      pickup: "Chưa lấy hàng",
    },
    {
      id: 2,
      droneId: "DRONE-002",
      droneName: "Drone Beta",
      licensePlate: "DRN-002",
      status: "Đang Giao",
      orderIds: "#ORD003",
      eta: "15:00",
      pickup: "Đã lấy hàng",
    },
  ])

  const getStatistics = () => {
    return {
      ready: droneNotifications.filter((d) => d.pickup === "Chưa lấy hàng").length,
      delivering: droneNotifications.filter((d) => d.status === "Đang Giao").length,
      completed: droneNotifications.filter((d) => d.pickup === "Đã xác nhận").length,
    }
  }

  const handleConfirmPickup = (id: number) => {
    setDroneNotifications(
      droneNotifications.map((notif) => (notif.id === id ? { ...notif, pickup: "Đã xác nhận" } : notif)),
    )
  }

  const stats = getStatistics()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Drone Sẵn Sàng", count: stats.ready, icon: Drone, color: "bg-green-100" },
          { label: "Đang Giao", count: stats.delivering, icon: Clock, color: "bg-blue-100" },
          { label: "Hoàn Thành", count: stats.completed, icon: CheckCircle2, color: "bg-green-200" },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className={`${stat.color} border-border`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold text-primary mt-2">{stat.count}</p>
                  </div>
                  <Icon className="text-primary opacity-20" size={40} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông Báo Drone</CardTitle>
          <CardDescription>Theo dõi các drone được gán và trạng thái giao hàng</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {droneNotifications.map((notif) => (
            <div key={notif.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Drone className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{notif.droneName}</p>
                    <p className="text-sm text-muted-foreground">ID: {notif.droneId}</p>
                    <p className="text-sm text-muted-foreground">Biển số: {notif.licensePlate}</p>
                  </div>
                </div>
                <Badge className="bg-primary/10 text-primary">{notif.status}</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-3 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Đơn Hàng</p>
                  <p className="font-semibold text-foreground">{notif.orderIds}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Thời Gian Ước Tính</p>
                  <p className="font-semibold text-foreground">{notif.eta}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">Trạng Thái Lấy Hàng</p>
                  <p className="font-semibold text-foreground">{notif.pickup}</p>
                </div>
              </div>

              {notif.pickup === "Chưa lấy hàng" && (
                <Button className="w-full bg-primary hover:bg-accent" onClick={() => handleConfirmPickup(notif.id)}>
                  <Drone size={16} className="mr-2" /> Xác Nhận Drone Đã Tới Lấy Hàng
                </Button>
              )}
              {notif.pickup === "Đã lấy hàng" && (
                <div className="w-full p-2 bg-green-100 text-green-800 rounded-lg flex items-center justify-center">
                  <CheckCircle2 size={16} className="mr-2" /> Drone Đã Lấy Hàng
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
