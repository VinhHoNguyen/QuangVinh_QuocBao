"use client"

import { useState } from "react"
import { ArrowLeft, Edit2, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function ProfilePage() {
  const { user, updateProfile, addAddress, removeAddress, logout } = useAuth()
  const [editMode, setEditMode] = useState(false)
  const [addAddressOpen, setAddAddressOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  })
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    address: "",
    district: "",
    city: "",
  })

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Link href="/">
          <Button className="bg-primary hover:bg-primary/90">Về trang chủ</Button>
        </Link>
      </div>
    )
  }

  const handleSaveProfile = () => {
    updateProfile({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    } as any)
    setEditMode(false)
  }

  const handleAddAddress = () => {
    if (newAddress.name && newAddress.address && newAddress.city) {
      addAddress({
        id: `addr_${Date.now()}`,
        ...newAddress,
        isDefault: user.addresses.length === 0,
      })
      setNewAddress({
        name: "",
        phone: "",
        address: "",
        district: "",
        city: "",
      })
      setAddAddressOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">Quay lại</span>
          </Link>
          <h1 className="text-xl font-bold text-primary">Tài khoản của tôi</h1>
          <Button variant="ghost" size="sm" onClick={logout} className="text-red-500 hover:bg-red-50">
            Đăng xuất
          </Button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Profile Section */}
        <div className="bg-card rounded-lg border border-border/50 p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Thông tin cá nhân</h2>
            {!editMode && (
              <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Họ và tên</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!editMode}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!editMode}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!editMode}
                className="mt-1"
              />
            </div>

            {editMode && (
              <div className="flex gap-2 pt-4">
                <Button className="bg-primary hover:bg-primary/90" onClick={handleSaveProfile}>
                  Lưu thay đổi
                </Button>
                <Button variant="outline" onClick={() => setEditMode(false)}>
                  Hủy
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Addresses Section */}
        <div className="bg-card rounded-lg border border-border/50 p-6">
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Địa chỉ giao hàng</h2>
            <Button variant="outline" size="sm" onClick={() => setAddAddressOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm địa chỉ
            </Button>
          </div>

          <div className="space-y-4">
            {user.addresses.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">Chưa có địa chỉ nào</p>
            ) : (
              user.addresses.map((address) => (
                <div key={address.id} className="border border-border rounded-lg p-4 flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-foreground">{address.name}</h3>
                    <p className="text-sm text-muted-foreground">{address.address}</p>
                    <p className="text-sm text-muted-foreground">
                      {address.district}, {address.city}
                    </p>
                    <p className="text-sm text-muted-foreground">{address.phone}</p>
                    {address.isDefault && <p className="text-xs text-primary font-medium mt-2">Địa chỉ mặc định</p>}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAddress(address.id)}
                    className="text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Address Dialog */}
      <Dialog open={addAddressOpen} onOpenChange={setAddAddressOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Thêm địa chỉ mới</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="addr-name">Tên địa chỉ (nhà, văn phòng, ...)</Label>
              <Input
                id="addr-name"
                value={newAddress.name}
                onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                placeholder="Nhà riêng"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="addr-phone">Số điện thoại</Label>
              <Input
                id="addr-phone"
                value={newAddress.phone}
                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                placeholder="098 765 4321"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="addr-address">Địa chỉ chi tiết</Label>
              <Input
                id="addr-address"
                value={newAddress.address}
                onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                placeholder="Số nhà, đường phố"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="addr-district">Quận/Huyện</Label>
              <Input
                id="addr-district"
                value={newAddress.district}
                onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                placeholder="Quận 1"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="addr-city">Thành phố/Tỉnh</Label>
              <Input
                id="addr-city"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                placeholder="Hồ Chí Minh"
                className="mt-1"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={handleAddAddress}>
                Lưu địa chỉ
              </Button>
              <Button className="flex-1 bg-transparent" variant="outline" onClick={() => setAddAddressOpen(false)}>
                Hủy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
