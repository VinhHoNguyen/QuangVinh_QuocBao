"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit2, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { restaurantAPI } from "@/lib/api"
import { toast } from "sonner"

export function AccountPage() {
  const { restaurantId } = useAuth()
  const [loading, setLoading] = useState(true)
  const [isEditingInfo, setIsEditingInfo] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    openingHours: { open: "09:00", close: "22:00" },
  })

  useEffect(() => {
    if (restaurantId) {
      loadRestaurantInfo()
    }
  }, [restaurantId])

  const loadRestaurantInfo = async () => {
    try {
      setLoading(true)
      const data = await restaurantAPI.getById(restaurantId!)
      console.log('Loaded restaurant data:', data)
      setRestaurantInfo({
        name: data.name || "",
        address: data.address || "",
        phone: data.phone || "",
        email: data.email || "",
        openingHours: data.openingHours || { open: "09:00", close: "22:00" },
      })
    } catch (error) {
      console.error('Error loading restaurant info:', error)
      toast.error('Không thể tải thông tin nhà hàng')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true)
      await restaurantAPI.update(restaurantId!, restaurantInfo)
      toast.success('✅ Đã cập nhật thông tin nhà hàng')
      setIsEditingInfo(false)
    } catch (error) {
      console.error('Error updating restaurant:', error)
      toast.error('Không thể cập nhật thông tin')
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
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
                    value={restaurantInfo.openingHours.open}
                    onChange={(e) => setRestaurantInfo({ 
                      ...restaurantInfo, 
                      openingHours: { ...restaurantInfo.openingHours, open: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Giờ Đóng Cửa</Label>
                  <Input
                    type="time"
                    value={restaurantInfo.openingHours.close}
                    onChange={(e) => setRestaurantInfo({ 
                      ...restaurantInfo, 
                      openingHours: { ...restaurantInfo.openingHours, close: e.target.value }
                    })}
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsEditingInfo(false)
                    loadRestaurantInfo() // Reset to original data
                  }}
                  disabled={isSaving}
                >
                  Hủy
                </Button>
                <Button 
                  className="bg-primary hover:bg-accent" 
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    'Lưu Thay Đổi'
                  )}
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
                    {restaurantInfo.openingHours.open} - {restaurantInfo.openingHours.close}
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
    </div>
  )
}
