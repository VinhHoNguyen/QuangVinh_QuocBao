"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Edit2, Lock, Unlock, CheckCircle, XCircle, Search, Filter } from "lucide-react"

const initialUsers = [
  // Customers
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "a@example.com",
    phone: "0912345678",
    role: "Khách hàng",
    status: "Hoạt động",
    joinDate: "2024-01-15",
    verified: true,
    locked: false,
    orders: 12,
    totalSpent: 2400000,
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "b@example.com",
    phone: "0923456789",
    role: "Khách hàng",
    status: "Hoạt động",
    joinDate: "2024-02-20",
    verified: true,
    locked: false,
    orders: 8,
    totalSpent: 1800000,
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "c@example.com",
    phone: "0934567890",
    role: "Khách hàng",
    status: "Hoạt động",
    joinDate: "2024-03-10",
    verified: true,
    locked: false,
    orders: 15,
    totalSpent: 3200000,
  },
  {
    id: 4,
    name: "Phạm Thị D",
    email: "d@example.com",
    phone: "0945678901",
    role: "Khách hàng",
    status: "Tạm khóa",
    joinDate: "2024-01-05",
    verified: true,
    locked: true,
    orders: 3,
    totalSpent: 650000,
    lockReason: "Vi phạm chính sách",
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    email: "e@example.com",
    phone: "0956789012",
    role: "Khách hàng",
    status: "Chờ xác minh",
    joinDate: "2024-11-05",
    verified: false,
    locked: false,
    orders: 0,
    totalSpent: 0,
  },

  // Restaurants
  {
    id: 6,
    name: "Nhà hàng Bình Dân",
    email: "restaurant1@example.com",
    phone: "0967890123",
    role: "Nhà hàng",
    status: "Hoạt động",
    joinDate: "2024-01-20",
    verified: true,
    locked: false,
    orders: 245,
    totalRevenue: 125000000,
    verification: "Đã xác minh",
    license: "Có",
  },
  {
    id: 7,
    name: "Quán Cơm Tây Bắc",
    email: "restaurant2@example.com",
    phone: "0978901234",
    role: "Nhà hàng",
    status: "Hoạt động",
    joinDate: "2024-02-15",
    verified: true,
    locked: false,
    orders: 187,
    totalRevenue: 98500000,
    verification: "Đã xác minh",
    license: "Có",
  },
  {
    id: 8,
    name: "Pizza Plus",
    email: "restaurant3@example.com",
    phone: "0989012345",
    role: "Nhà hàng",
    status: "Chờ xác minh",
    joinDate: "2024-11-01",
    verified: false,
    locked: false,
    orders: 0,
    totalRevenue: 0,
    verification: "Chờ xác minh",
    license: "Chờ kiểm tra",
  },
  {
    id: 9,
    name: "Burger King Local",
    email: "restaurant4@example.com",
    phone: "0990123456",
    role: "Nhà hàng",
    status: "Tạm khóa",
    joinDate: "2024-01-10",
    verified: true,
    locked: true,
    orders: 45,
    totalRevenue: 15000000,
    verification: "Đã xác minh",
    license: "Hết hạn",
    lockReason: "Giấy phép hết hạn",
  },
  {
    id: 10,
    name: "Bánh Mì Saigon",
    email: "restaurant5@example.com",
    phone: "0901234567",
    role: "Nhà hàng",
    status: "Hoạt động",
    joinDate: "2024-03-05",
    verified: true,
    locked: false,
    orders: 312,
    totalRevenue: 156000000,
    verification: "Đã xác minh",
    license: "Có",
  },

  // Drone Operators
  {
    id: 11,
    name: "Ngô Quốc Anh",
    email: "operator1@example.com",
    phone: "0912111111",
    role: "Người điều khiển drone",
    status: "Hoạt động",
    joinDate: "2024-01-25",
    verified: true,
    locked: false,
    droneId: "DRONE-001",
    certificates: "A1, A2",
    experience: "3 năm",
  },
  {
    id: 12,
    name: "Trương Thị Hương",
    email: "operator2@example.com",
    phone: "0912222222",
    role: "Người điều khiển drone",
    status: "Hoạt động",
    joinDate: "2024-02-10",
    verified: true,
    locked: false,
    droneId: "DRONE-002",
    certificates: "A1",
    experience: "1.5 năm",
  },
  {
    id: 13,
    name: "Phan Văn Nam",
    email: "operator3@example.com",
    phone: "0912333333",
    role: "Người điều khiển drone",
    status: "Chờ xác minh",
    joinDate: "2024-11-03",
    verified: false,
    locked: false,
    droneId: null,
    certificates: "A1",
    experience: "Không có",
  },
  {
    id: 14,
    name: "Võ Thị Linh",
    email: "operator4@example.com",
    phone: "0912444444",
    role: "Người điều khiển drone",
    status: "Tạm khóa",
    joinDate: "2024-01-15",
    verified: true,
    locked: true,
    droneId: "DRONE-003",
    certificates: "A1, A2",
    experience: "2 năm",
    lockReason: "Sự cố an toàn",
  },

  // Admin Staff
  {
    id: 15,
    name: "Admin Chính",
    email: "admin@example.com",
    phone: "0913333333",
    role: "Admin",
    status: "Hoạt động",
    joinDate: "2023-12-01",
    verified: true,
    locked: false,
    permissions: ["Quản lý toàn bộ", "Duyệt nhà hàng", "Khóa tài khoản"],
    lastLogin: "Hôm nay",
  },
  {
    id: 16,
    name: "Quản lý Nhà hàng",
    email: "manager@example.com",
    phone: "0914444444",
    role: "Admin phụ",
    status: "Hoạt động",
    joinDate: "2024-01-10",
    verified: true,
    locked: false,
    permissions: ["Duyệt nhà hàng", "Xem báo cáo"],
    lastLogin: "2 giờ trước",
  },
  {
    id: 17,
    name: "Hỗ trợ Khách hàng",
    email: "support@example.com",
    phone: "0915555555",
    role: "Admin phụ",
    status: "Hoạt động",
    joinDate: "2024-01-20",
    verified: true,
    locked: false,
    permissions: ["Hỗ trợ khách hàng", "Xem báo cáo"],
    lastLogin: "30 phút trước",
  },
]

const rolePermissions = {
  "Khách hàng": ["Đặt hàng", "Xem lịch sử", "Quản lý địa chỉ"],
  "Nhà hàng": ["Quản lý menu", "Xem đơn hàng", "Quản lý nhân viên"],
  "Người điều khiển drone": ["Xem đơn giao hàng", "Cập nhật trạng thái", "Xem thu nhập"],
  Admin: ["Quản lý toàn bộ", "Duyệt nhà hàng", "Khóa tài khoản", "Xem báo cáo"],
  "Admin phụ": ["Duyệt nhà hàng", "Xem báo cáo", "Hỗ trợ khách hàng"],
}

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState("")
  const [selectedRole, setSelectedRole] = useState("Tất cả")
  const [selectedStatus, setSelectedStatus] = useState("Tất cả")
  const [showPermissions, setShowPermissions] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = selectedRole === "Tất cả" || user.role === selectedRole
    const matchesStatus = selectedStatus === "Tất cả" || user.status === selectedStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleToggleLock = (userId, currentLocked) => {
    setUsers(
      users.map((u) =>
        u.id === userId ? { ...u, locked: !currentLocked, status: !currentLocked ? "Tạm khóa" : "Hoạt động" } : u,
      ),
    )
  }

  const handleVerifyRestaurant = (userId) => {
    setUsers(
      users.map((u) =>
        u.id === userId ? { ...u, verified: true, status: "Hoạt động", verification: "Đã xác minh" } : u,
      ),
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý người dùng & Phân quyền</h1>
          <p className="text-muted-foreground mt-1">Quản lý tài khoản, phân quyền và xác minh người dùng</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus size={18} />
          Thêm người dùng
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1 md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
              <Input
                placeholder="Tìm theo tên, email hoặc số điện thoại..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <select
            className="px-4 py-2 border border-border rounded-lg bg-card text-foreground"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="Tất cả">Tất cả vai trò</option>
            <option value="Khách hàng">Khách hàng</option>
            <option value="Nhà hàng">Nhà hàng</option>
            <option value="Người điều khiển drone">Người điều khiển drone</option>
            <option value="Admin">Admin</option>
            <option value="Admin phụ">Admin phụ</option>
          </select>
          <select
            className="px-4 py-2 border border-border rounded-lg bg-card text-foreground"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="Tất cả">Tất cả trạng thái</option>
            <option value="Hoạt động">Hoạt động</option>
            <option value="Tạm khóa">Tạm khóa</option>
            <option value="Chờ xác minh">Chờ xác minh</option>
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
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Vai trò</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Trạng thái</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Xác minh</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Thông tin</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 rounded-full text-sm bg-secondary text-secondary-foreground">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                        user.status === "Hoạt động"
                          ? "bg-green-100 text-green-700"
                          : user.status === "Tạm khóa"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {user.status === "Hoạt động" && <CheckCircle size={14} />}
                      {user.status === "Tạm khóa" && <XCircle size={14} />}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.verified ? (
                      <span className="inline-flex items-center gap-1 text-green-700">
                        <CheckCircle size={16} />
                        <span className="text-sm">Đã xác minh</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-yellow-700">
                        <Filter size={16} />
                        <span className="text-sm">Chờ xác minh</span>
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {user.role === "Khách hàng" && `${user.orders} đơn • ${user.totalSpent.toLocaleString()}đ`}
                    {user.role === "Nhà hàng" && `${user.orders} đơn • ${user.totalRevenue.toLocaleString()}đ`}
                    {user.role === "Người điều khiển drone" && `${user.droneId || "Chưa có drone"}`}
                    {user.role === "Admin" && user.lastLogin}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    {/* Verify button for pending restaurants */}
                    {user.role === "Nhà hàng" && !user.verified && (
                      <Button
                        size="sm"
                        onClick={() => handleVerifyRestaurant(user.id)}
                        className="gap-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle size={16} />
                        Xác minh
                      </Button>
                    )}

                    {/* Lock/Unlock button */}
                    <Button
                      size="sm"
                      onClick={() => handleToggleLock(user.id, user.locked)}
                      variant="outline"
                      className={`gap-1 ${
                        user.locked
                          ? "bg-orange-50 text-orange-600 hover:bg-orange-100"
                          : "bg-red-50 text-red-600 hover:bg-red-100"
                      }`}
                    >
                      {user.locked ? <Unlock size={16} /> : <Lock size={16} />}
                      {user.locked ? "Mở khóa" : "Khóa"}
                    </Button>

                    {/* View Permissions button */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 bg-transparent"
                      onClick={() => {
                        setSelectedUser(user)
                        setShowPermissions(true)
                      }}
                    >
                      <Edit2 size={16} />
                      Quyền
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Permissions Modal */}
      {showPermissions && selectedUser && (
        <Card className="p-6 fixed inset-0 bg-black/50 flex items-center justify-center z-50 rounded-none">
          <div className="bg-card p-8 rounded-lg max-w-md w-full space-y-4">
            <h2 className="text-xl font-bold text-foreground">Quyền hạn: {selectedUser.name}</h2>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-muted-foreground">Vai trò: {selectedUser.role}</p>
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
          </div>
        </Card>
      )}
    </div>
  )
}
