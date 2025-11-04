"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { User, Phone, MapPin, Mail, Edit2, Check, X } from "lucide-react"

interface UserProfile {
  name: string
  email: string
  phone: string
  address: string
  avatar: string
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0901234567",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    avatar: "/diverse-user-avatars.png",
  })

  const [formData, setFormData] = useState<UserProfile>(profile)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Tên không được bỏ trống"
    }
    if (!formData.email.includes("@")) {
      newErrors.email = "Email không hợp lệ"
    }
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Số điện thoại phải có 10 chữ số"
    }
    if (!formData.address.trim()) {
      newErrors.address = "Địa chỉ không được bỏ trống"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleEdit = () => {
    setIsEditing(true)
    setFormData(profile)
    setErrors({})
  }

  const handleSave = () => {
    if (validateForm()) {
      setProfile(formData)
      setIsEditing(false)
      // In a real app, this would call an API to save the profile
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData(profile)
    setErrors({})
  }

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      <Header cartCount={0} onCartClick={() => {}} />

      {/* Page Title */}
      <div className="bg-gradient-to-b from-primary/10 to-background py-8">
        <div className="max-w-2xl mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Hồ Sơ Người Dùng</h1>
          <p className="text-muted-foreground">Quản lý thông tin cá nhân của bạn</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8">
        {/* Avatar Section */}
        <Card className="mb-6">
          <CardContent className="pt-6 text-center">
            <img
              src={profile.avatar || "/placeholder.svg"}
              alt="Avatar"
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-primary"
            />
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            <p className="text-muted-foreground">{profile.email}</p>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <h3 className="text-xl font-semibold">Thông Tin Cá Nhân</h3>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit2 className="w-4 h-4 mr-2" />
                Chỉnh Sửa
              </Button>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                <User className="w-4 h-4" />
                Họ Tên
              </label>
              {isEditing ? (
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={errors.name ? "border-red-500" : ""}
                />
              ) : (
                <p className="px-3 py-2 bg-muted rounded">{profile.name}</p>
              )}
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              {isEditing ? (
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                />
              ) : (
                <p className="px-3 py-2 bg-muted rounded">{profile.email}</p>
              )}
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Số Điện Thoại
              </label>
              {isEditing ? (
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="0901234567"
                  className={errors.phone ? "border-red-500" : ""}
                />
              ) : (
                <p className="px-3 py-2 bg-muted rounded">{profile.phone}</p>
              )}
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Địa Chỉ
              </label>
              {isEditing ? (
                <Input
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className={errors.address ? "border-red-500" : ""}
                />
              ) : (
                <p className="px-3 py-2 bg-muted rounded">{profile.address}</p>
              )}
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  <Check className="w-4 h-4 mr-2" />
                  Lưu Thay Đổi
                </Button>
                <Button onClick={handleCancel} variant="outline" className="flex-1 bg-transparent">
                  <X className="w-4 h-4 mr-2" />
                  Hủy
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
