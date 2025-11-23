"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit2, Plus, Trash2, Upload, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { restaurantAPI, Restaurant } from "@/lib/api"
import { toast } from "@/hooks/use-toast"

export function AccountPage() {
  const { restaurantId } = useAuth()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditingInfo, setIsEditingInfo] = useState(false)
  const [saving, setSaving] = useState(false)

  const [editForm, setEditForm] = useState({
    name: "",
    address: "",
    phone: "",
    minOrder: 0,
    maxOrder: 0,
  })

  // Load restaurant info from MongoDB
  useEffect(() => {
    if (restaurantId) {
      loadRestaurantInfo()
    }
  }, [restaurantId])

  const loadRestaurantInfo = async () => {
    if (!restaurantId) return

    try {
      setLoading(true)
      const data = await restaurantAPI.getById(restaurantId)
      setRestaurant(data)
      setEditForm({
        name: data.name,
        address: data.address,
        phone: data.phone,
        minOrder: data.minOrder,
        maxOrder: data.maxOrder,
      })
    } catch (error: any) {
      console.error('Failed to load restaurant info:', error)
      toast({
        title: 'Lỗi',
        description: 'Không thể tải thông tin nhà hàng',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveChanges = async () => {
    if (!restaurantId || !restaurant) return

    try {
      setSaving(true)
      const updated = await restaurantAPI.update(restaurantId, editForm)
      setRestaurant(updated)
      setIsEditingInfo(false)
      toast({
        title: 'Thành công',
        description: 'Đã cập nhật thông tin nhà hàng',
      })
    } catch (error: any) {
      console.error('Failed to update restaurant:', error)
      toast({
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể cập nhật thông tin',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    if (restaurant) {
      setEditForm({
        name: restaurant.name,
        address: restaurant.address,
        phone: restaurant.phone,
        minOrder: restaurant.minOrder,
        maxOrder: restaurant.maxOrder,
      })
    }
    setIsEditingInfo(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Không tìm thấy thông tin nhà hàng</p>
      </div>
    )
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
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Số Điện Thoại</Label>
                      <Input
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Địa Chỉ</Label>
                      <Input
                        value={editForm.address}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Đơn Tối Thiểu (đ)</Label>
                      <Input
                        type="number"
                        value={editForm.minOrder}
                        onChange={(e) => setEditForm({ ...editForm, minOrder: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Đơn Tối Đa (đ)</Label>
                      <Input
                        type="number"
                        value={editForm.maxOrder}
                        onChange={(e) => setEditForm({ ...editForm, maxOrder: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={handleCancelEdit} disabled={saving}>
                      Hủy
                    </Button>
                    <Button className="bg-primary hover:bg-accent" onClick={handleSaveChanges} disabled={saving}>
                      {saving ? (
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
                      <p className="font-semibold text-foreground">{restaurant.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Số Điện Thoại</p>
                      <p className="font-semibold text-foreground">{restaurant.phone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">Địa Chỉ</p>
                      <p className="font-semibold text-foreground">{restaurant.address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Đơn Tối Thiểu</p>
                      <p className="font-semibold text-foreground">{restaurant.minOrder.toLocaleString('vi-VN')}đ</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Đơn Tối Đa</p>
                      <p className="font-semibold text-foreground">{restaurant.maxOrder.toLocaleString('vi-VN')}đ</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Đánh Giá</p>
                      <p className="font-semibold text-foreground">⭐ {restaurant.rating.toFixed(1)}/5</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Trạng Thái</p>
                      <p className="font-semibold text-foreground">
                        {restaurant.status === 'active' ? '🟢 Hoạt động' : 
                         restaurant.status === 'inactive' ? '🟡 Tạm nghỉ' : '🔴 Tạm khóa'}
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
