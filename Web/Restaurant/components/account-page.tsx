"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit2, Plus, Trash2, Upload } from "lucide-react"

export function AccountPage() {
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "Nhà Hàng Tuyệt Vời",
    address: "123 Đường ABC, Quận 1, TPHCM",
    phone: "0123 456 789",
    email: "contact@restaurant.com",
    openTime: "09:00",
    closeTime: "22:00",
  })

  const [staff, setStaff] = useState([
    { id: 1, name: "Nguyễn Văn A", role: "Quản lý", email: "a@restaurant.com", image: "/male-staff-manager.jpg" },
    { id: 2, name: "Trần Thị B", role: "Đầu bếp", email: "b@restaurant.com", image: "/female-chef.png" },
  ])

  const [isEditingInfo, setIsEditingInfo] = useState(false)
  const [newStaff, setNewStaff] = useState({ name: "", role: "", email: "", image: "" })

  const handleAddStaff = () => {
    if (newStaff.name && newStaff.role && newStaff.email) {
      setStaff([...staff, { id: staff.length + 1, ...newStaff }])
      setNewStaff({ name: "", role: "", email: "", image: "" })
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="info" className="w-full">
        

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông Tin Nhà Hàng</CardTitle>
              <CardDescription>Cập nhật thông tin cơ bản về nhà hàng</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditingInfo ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tên Nhà Hàng</Label>
                      <Input
                        value={restaurantInfo.name}
                        onChange={(e) => setRestaurantInfo({ ...restaurantInfo, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Số Điện Thoại</Label>
                      <Input
                        value={restaurantInfo.phone}
                        onChange={(e) => setRestaurantInfo({ ...restaurantInfo, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Địa Chỉ</Label>
                      <Input
                        value={restaurantInfo.address}
                        onChange={(e) => setRestaurantInfo({ ...restaurantInfo, address: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={restaurantInfo.email}
                        onChange={(e) => setRestaurantInfo({ ...restaurantInfo, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Giờ Mở Cửa</Label>
                      <Input
                        type="time"
                        value={restaurantInfo.openTime}
                        onChange={(e) => setRestaurantInfo({ ...restaurantInfo, openTime: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Giờ Đóng Cửa</Label>
                      <Input
                        type="time"
                        value={restaurantInfo.closeTime}
                        onChange={(e) => setRestaurantInfo({ ...restaurantInfo, closeTime: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setIsEditingInfo(false)}>
                      Hủy
                    </Button>
                    <Button className="bg-primary hover:bg-accent" onClick={() => setIsEditingInfo(false)}>
                      Lưu Thay Đổi
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Tên Nhà Hàng</p>
                      <p className="font-semibold text-foreground">{restaurantInfo.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Số Điện Thoại</p>
                      <p className="font-semibold text-foreground">{restaurantInfo.phone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">Địa Chỉ</p>
                      <p className="font-semibold text-foreground">{restaurantInfo.address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-semibold text-foreground">{restaurantInfo.email}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Giờ Hoạt Động</p>
                      <p className="font-semibold text-foreground">
                        {restaurantInfo.openTime} - {restaurantInfo.closeTime}
                      </p>
                    </div>
                  </div>
                  <Button className="bg-primary hover:bg-accent" onClick={() => setIsEditingInfo(true)}>
                    <Edit2 size={16} className="mr-2" /> Chỉnh Sửa
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          
        </TabsContent>
      </Tabs>
    </div>
  )
}
