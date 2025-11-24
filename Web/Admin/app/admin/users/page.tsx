"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Lock, Unlock, CheckCircle, XCircle, Search, Loader2, X, RefreshCw } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface User {
  _id: string
  name: string
  email: string
  phone?: string
  role: string
  status: string
  createdAt: string
  updatedAt: string
}

const roleMapping: { [key: string]: string } = {
  admin: "Admin",
  restaurant_owner: "Nhà hàng",
  customer: "Khách hàng",
  delivery: "Người giao hàng",
}

const statusMapping: { [key: string]: string } = {
  active: "Hoạt động",
  inactive: "Không hoạt động",
  suspended: "Tạm khóa",
}

const rolePermissions: { [key: string]: string[] } = {
  customer: ["Đặt hàng", "Xem lịch sử", "Quản lý địa chỉ"],
  restaurant_owner: ["Quản lý menu", "Xem đơn hàng", "Quản lý nhân viên"],
  delivery: ["Xem đơn giao hàng", "Cập nhật trạng thái", "Xem thu nhập"],
  admin: ["Quản lý toàn bộ", "Duyệt nhà hàng", "Khóa tài khoản", "Xem báo cáo"],
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showPermissions, setShowPermissions] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "customer",
    status: "active",
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem("admin_token") || localStorage.getItem("token")
      if (!token) {
        console.error("❌ No token found in localStorage")
        console.log("Available localStorage keys:", Object.keys(localStorage))
        alert("Bạn chưa đăng nhập. Đang chuyển đến trang đăng nhập...")
        window.location.href = "/login"
        return
      }
      
      console.log("✅ Token found:", token.substring(0, 20) + "...")

      console.log("Fetching users from:", `${API_URL}/auth/users`)
      const response = await fetch(`${API_URL}/auth/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("Response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("Users data:", data)
        if (data.success && data.data) {
          setUsers(data.data)
          console.log(`✅ Loaded ${data.data.length} users successfully`)
        } else {
          console.error("Invalid data format:", data)
          alert("Lỗi định dạng dữ liệu")
        }
      } else if (response.status === 401) {
        alert("Token hết hạn. Vui lòng đăng nhập lại")
        localStorage.removeItem("admin_token")
        localStorage.removeItem("token")
        localStorage.removeItem("admin_user")
        window.location.href = "/login"
      } else {
        const error = await response.json()
        console.error("Error response:", error)
        alert(error.message || "Không thể tải danh sách người dùng")
      }
    } catch (error) {
      console.error("Error loading users:", error)
      alert("Lỗi kết nối đến server. Vui lòng kiểm tra xem backend có đang chạy không.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc")
      return
    }

    setSubmitting(true)
    try {
      const token = localStorage.getItem("admin_token")
      const response = await fetch(`${API_URL}/auth/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await loadUsers()
        setShowAddDialog(false)
        setFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
          role: "customer",
          status: "active",
        })
        alert("Thêm người dùng thành công!")
      } else {
        const error = await response.json()
        alert(error.message || "Có lỗi xảy ra")
      }
    } catch (error) {
      console.error("Error adding user:", error)
      alert("Có lỗi xảy ra khi thêm người dùng")
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleLock = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "suspended" ? "active" : "suspended"
    
    try {
      const token = localStorage.getItem("admin_token")
      const response = await fetch(`${API_URL}/auth/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        await loadUsers()
        alert(newStatus === "suspended" ? "Đã khóa người dùng" : "Đã mở khóa người dùng")
      } else {
        const error = await response.json()
        alert(error.message || "Có lỗi xảy ra")
      }
    } catch (error) {
      console.error("Error toggling lock:", error)
      alert("Có lỗi xảy ra")
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      return
    }

    try {
      const token = localStorage.getItem("admin_token")
      const response = await fetch(`${API_URL}/auth/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        await loadUsers()
        alert("Xóa người dùng thành công!")
      } else {
        const error = await response.json()
        alert(error.message || "Có lỗi xảy ra")
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      alert("Có lỗi xảy ra khi xóa người dùng")
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) || 
      user.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Đang tải danh sách người dùng...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý người dùng</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý tài khoản người dùng trong hệ thống ({users.length} người dùng)
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => {
              setLoading(true)
              loadUsers()
            }} 
            variant="outline" 
            className="gap-2"
          >
            <RefreshCw size={18} />
            Làm mới
          </Button>
          <Button onClick={() => setShowAddDialog(true)} className="gap-2 bg-primary hover:bg-primary/90">
            <Plus size={18} />
            Thêm người dùng
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
            <Input
              placeholder="Tìm theo tên hoặc email..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-border rounded-lg bg-card text-foreground"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="all">Tất cả vai trò</option>
            <option value="customer">Khách hàng</option>
            <option value="restaurant_owner">Nhà hàng</option>
            <option value="delivery">Người giao hàng</option>
            <option value="admin">Admin</option>
          </select>
          <select
            className="px-4 py-2 border border-border rounded-lg bg-card text-foreground"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
            <option value="suspended">Tạm khóa</option>
          </select>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Tên / Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Số điện thoại</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Vai trò</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Trạng thái</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Ngày tạo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Quyền</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    {users.length === 0 ? (
                      <div className="space-y-2">
                        <p className="text-lg">Chưa có người dùng nào trong hệ thống</p>
                        <p className="text-sm">Nhấn nút "Thêm người dùng" để tạo người dùng mới</p>
                      </div>
                    ) : (
                      <p>Không tìm thấy người dùng phù hợp với bộ lọc</p>
                    )}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {user.phone || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 rounded-full text-sm bg-secondary text-secondary-foreground">
                      {roleMapping[user.role] || user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                        user.status === "active"
                          ? "bg-green-100 text-green-700"
                          : user.status === "suspended"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {user.status === "active" && <CheckCircle size={14} />}
                      {user.status === "suspended" && <XCircle size={14} />}
                      {statusMapping[user.status] || user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedUser(user)
                        setShowPermissions(true)
                      }}
                    >
                      Xem quyền
                    </Button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {/* Lock/Unlock button */}
                      <Button
                        size="sm"
                        onClick={() => handleToggleLock(user._id, user.status)}
                        variant="outline"
                        className={`gap-1 ${
                          user.status === "suspended"
                            ? "bg-orange-50 text-orange-600 hover:bg-orange-100"
                            : "bg-red-50 text-red-600 hover:bg-red-100"
                        }`}
                      >
                        {user.status === "suspended" ? <Unlock size={16} /> : <Lock size={16} />}
                        {user.status === "suspended" ? "Mở khóa" : "Khóa"}
                      </Button>

                      {/* Delete button */}
                      <Button
                        size="sm"
                        onClick={() => handleDeleteUser(user._id)}
                        variant="outline"
                        className="gap-1 bg-red-50 text-red-600 hover:bg-red-100"
                      >
                        <Trash2 size={16} />
                        Xóa
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add User Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-8 max-w-md w-full space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-foreground">Thêm người dùng mới</h2>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowAddDialog(false)}
              >
                <X size={20} />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0912345678"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Vai trò</Label>
                <select
                  id="role"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="customer">Khách hàng</option>
                  <option value="restaurant_owner">Nhà hàng</option>
                  <option value="delivery">Người giao hàng</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowAddDialog(false)}
                variant="outline"
                className="flex-1"
                disabled={submitting}
              >
                Hủy
              </Button>
              <Button
                onClick={handleAddUser}
                className="flex-1 bg-primary hover:bg-primary/90"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang thêm...
                  </>
                ) : (
                  "Thêm người dùng"
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissions && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-8 max-w-md w-full space-y-4">
            <h2 className="text-xl font-bold text-foreground">Quyền hạn: {selectedUser.name}</h2>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-muted-foreground">
                Vai trò: {roleMapping[selectedUser.role] || selectedUser.role}
              </p>
              <div className="space-y-2">
                {(rolePermissions[selectedUser.role] || []).map((permission, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-muted rounded">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-sm text-foreground">{permission}</span>
                  </div>
                ))}
              </div>
            </div>
            <Button onClick={() => setShowPermissions(false)} className="w-full bg-primary hover:bg-primary/90">
              Đóng
            </Button>
          </Card>
        </div>
      )}
    </div>
  )
}
