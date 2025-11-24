"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, Check, X, Pause, Play, Loader2, RefreshCw } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface Restaurant {
  _id: string
  name: string
  phone: string
  address: string
  image: string
  minOrder: number
  maxOrder: number
  rating: number
  status: string
  ownerId: {
    _id: string
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

const TABS = ["Tất cả", "Chờ duyệt", "Hoạt động", "Tạm ngưng"]

const statusMapping: { [key: string]: string } = {
  pending: "Chờ duyệt",
  active: "Hoạt động",
  inactive: "Không hoạt động",
  suspended: "Tạm ngưng",
}

const OLD_initialRestaurants = [
  {
    id: 1,
    name: "KFC Hà Nội",
    address: "123 Phố Huế, Hà Nội",
    contact: "024.1234.5678",
    email: "kfc.hanoi@restaurant.com",
    status: "Hoạt động",
    verificationStatus: "Đã xác minh",
    revenue: 450000000,
    cancelRate: 2.5,
    rating: 4.7,
    reviewCount: 1250,
    menu: { items: 45, priceRange: "50.000 - 250.000đ" },
    promotions: [
      { title: "Giảm 20% combo", discount: 20, validTill: "2025-12-31" },
      { title: "Miễn phí giao hàng", discount: 0, validTill: "2025-11-30" },
    ],
    violations: 0,
  },
  {
    id: 2,
    name: "Jollibee Quận 1",
    address: "456 Nguyễn Huệ, TP.HCM",
    contact: "028.1111.1111",
    email: "jollibee.q1@restaurant.com",
    status: "Hoạt động",
    verificationStatus: "Đã xác minh",
    revenue: 520000000,
    cancelRate: 1.8,
    rating: 4.8,
    reviewCount: 2100,
    menu: { items: 38, priceRange: "45.000 - 180.000đ" },
    promotions: [{ title: "Mua 2 tặng 1 nước", discount: 0, validTill: "2025-11-25" }],
    violations: 0,
  },
  {
    id: 3,
    name: "Pizza Hut Đà Nẵng",
    address: "789 Hải Phòng, Đà Nẵng",
    contact: "0236.2222.2222",
    email: "pizzahut.dn@restaurant.com",
    status: "Chờ xác minh",
    verificationStatus: "Chờ duyệt",
    revenue: 0,
    cancelRate: 0,
    rating: 0,
    reviewCount: 0,
    menu: { items: 0, priceRange: "N/A" },
    promotions: [],
    violations: 0,
  },
  {
    id: 4,
    name: "Lotteria Hạ Long",
    address: "321 Tràng An, Hạ Long",
    contact: "0203.3333.3333",
    email: "lotteria.halong@restaurant.com",
    status: "Tạm ngưng",
    verificationStatus: "Đã xác minh",
    revenue: 280000000,
    cancelRate: 5.2,
    rating: 3.9,
    reviewCount: 450,
    menu: { items: 32, priceRange: "40.000 - 150.000đ" },
    promotions: [],
    violations: 2,
  },
]

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("Tất cả")
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    loadRestaurants()
  }, [])

  const loadRestaurants = async () => {
    try {
      const token = localStorage.getItem("admin_token") || localStorage.getItem("token")
      if (!token) {
        console.error("❌ No token found")
        alert("Bạn chưa đăng nhập. Đang chuyển đến trang đăng nhập...")
        window.location.href = "/login"
        return
      }

      console.log("Fetching restaurants from:", `${API_URL}/restaurants`)
      const response = await fetch(`${API_URL}/restaurants`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("Response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("Restaurants data:", data)
        if (data.success && data.data) {
          setRestaurants(data.data)
          console.log(`✅ Loaded ${data.data.length} restaurants successfully`)
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
        alert(error.message || "Không thể tải danh sách nhà hàng")
      }
    } catch (error) {
      console.error("Error loading restaurants:", error)
      alert("Lỗi kết nối đến server. Vui lòng kiểm tra xem backend có đang chạy không.")
    } finally {
      setLoading(false)
    }
  }

  const filteredRestaurants = restaurants.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.address.toLowerCase().includes(search.toLowerCase())
    const matchesTab =
      activeTab === "Tất cả" ||
      (activeTab === "Chờ duyệt" && r.status === "pending") ||
      (activeTab === "Hoạt động" && r.status === "active") ||
      (activeTab === "Tạm ngưng" && r.status === "suspended")
    return matchesSearch && matchesTab
  })

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Đang tải danh sách nhà hàng...</p>
      </div>
    )
  }

  const handleApprove = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn duyệt nhà hàng này?")) {
      return
    }

    try {
      const token = localStorage.getItem("admin_token") || localStorage.getItem("token")
      const response = await fetch(`${API_URL}/restaurants/${id}/approve`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        await loadRestaurants()
        alert("Đã duyệt nhà hàng thành công!")
      } else {
        const error = await response.json()
        alert(error.message || "Có lỗi xảy ra")
      }
    } catch (error) {
      console.error("Error approving restaurant:", error)
      alert("Có lỗi xảy ra khi duyệt nhà hàng")
    }
  }

  const handleReject = async (id: string) => {
    const reason = prompt("Nhập lý do từ chối (không bắt buộc):")
    if (reason === null) return

    try {
      const token = localStorage.getItem("admin_token") || localStorage.getItem("token")
      const response = await fetch(`${API_URL}/restaurants/${id}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      })

      if (response.ok) {
        await loadRestaurants()
        alert("Đã từ chối nhà hàng")
      } else {
        const error = await response.json()
        alert(error.message || "Có lỗi xảy ra")
      }
    } catch (error) {
      console.error("Error rejecting restaurant:", error)
      alert("Có lỗi xảy ra khi từ chối nhà hàng")
    }
  }

  const handleSuspend = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn tạm ngưng nhà hàng này?")) {
      return
    }

    try {
      const token = localStorage.getItem("admin_token") || localStorage.getItem("token")
      const response = await fetch(`${API_URL}/restaurants/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "suspended" }),
      })

      if (response.ok) {
        await loadRestaurants()
        alert("Đã tạm ngưng nhà hàng")
      } else {
        const error = await response.json()
        alert(error.message || "Có lỗi xảy ra")
      }
    } catch (error) {
      console.error("Error suspending restaurant:", error)
      alert("Có lỗi xảy ra")
    }
  }

  const handleResume = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn kích hoạt lại nhà hàng này?")) {
      return
    }

    try {
      const token = localStorage.getItem("admin_token") || localStorage.getItem("token")
      const response = await fetch(`${API_URL}/restaurants/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "active" }),
      })

      if (response.ok) {
        await loadRestaurants()
        alert("Đã kích hoạt lại nhà hàng")
      } else {
        const error = await response.json()
        alert(error.message || "Có lỗi xảy ra")
      }
    } catch (error) {
      console.error("Error resuming restaurant:", error)
      alert("Có lỗi xảy ra")
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý nhà hàng</h1>
          <p className="text-muted-foreground mt-1">
            Duyệt, quản lý và giám sát nhà hàng ({restaurants.length} nhà hàng)
          </p>
        </div>
        <Button 
          onClick={() => {
            setLoading(true)
            loadRestaurants()
          }} 
          variant="outline" 
          className="gap-2"
        >
          <RefreshCw size={18} />
          Làm mới
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Input
            placeholder="Tìm theo tên hoặc địa chỉ nhà hàng..."
            className="pl-4"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all ${
              activeTab === tab ? "bg-primary text-white" : "bg-muted text-foreground hover:bg-muted/70"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Restaurants List */}
      <div className="space-y-4">
        {filteredRestaurants.length === 0 ? (
          <Card className="p-12 text-center text-muted-foreground">
            {restaurants.length === 0 ? (
              <div className="space-y-2">
                <p className="text-lg">Chưa có nhà hàng nào trong hệ thống</p>
              </div>
            ) : (
              <p>Không tìm thấy nhà hàng phù hợp với bộ lọc</p>
            )}
          </Card>
        ) : (
          filteredRestaurants.map((restaurant) => (
            <Card key={restaurant._id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Basic Info */}
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{restaurant.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{restaurant.address}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        restaurant.status === "active"
                          ? "bg-green-100 text-green-700"
                          : restaurant.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : restaurant.status === "suspended"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {statusMapping[restaurant.status] || restaurant.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Chủ sở hữu:</span>{" "}
                      {restaurant.ownerId?.name || "N/A"}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Email:</span>{" "}
                      {restaurant.ownerId?.email || "N/A"}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Điện thoại:</span> {restaurant.phone}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Đơn hàng tối thiểu:</span>{" "}
                      {restaurant.minOrder.toLocaleString()}đ
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Ngày đăng ký:</span>{" "}
                      {new Date(restaurant.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>

                {/* Right Column - Actions */}
                <div className="flex flex-col justify-between">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-1">Đánh giá</p>
                      <p className="text-lg font-bold text-foreground">
                        {restaurant.rating > 0 ? `${restaurant.rating}/5` : "Chưa có"}
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-1">Đơn tối đa</p>
                      <p className="text-lg font-bold text-foreground">
                        {restaurant.maxOrder.toLocaleString()}đ
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      onClick={() => {
                        setSelectedRestaurant(restaurant)
                        setShowDetails(true)
                      }}
                    >
                      <Eye size={16} />
                      Chi tiết
                    </Button>

                    {restaurant.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(restaurant._id)}
                          className="gap-1 bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Check size={16} />
                          Duyệt
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleReject(restaurant._id)}
                          variant="outline"
                          className="gap-1 bg-red-50 text-red-600 hover:bg-red-100"
                        >
                          <X size={16} />
                          Từ chối
                        </Button>
                      </>
                    )}

                    {restaurant.status === "active" && (
                      <Button
                        size="sm"
                        onClick={() => handleSuspend(restaurant._id)}
                        variant="outline"
                        className="gap-1 bg-orange-50 text-orange-600 hover:bg-orange-100"
                      >
                        <Pause size={16} />
                        Tạm ngưng
                      </Button>
                    )}

                    {restaurant.status === "suspended" && (
                      <Button
                        size="sm"
                        onClick={() => handleResume(restaurant._id)}
                        className="gap-1 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Play size={16} />
                        Kích hoạt
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Details Modal */}
      {showDetails && selectedRestaurant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{selectedRestaurant.name}</h2>
                <p className="text-muted-foreground mt-1">{selectedRestaurant.address}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setShowDetails(false)
                  setSelectedRestaurant(null)
                }}
              >
                <X size={20} />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Thông tin liên hệ</h3>
                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground">
                    <span className="font-medium">Chủ sở hữu:</span> {selectedRestaurant.ownerId?.name}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium">Email:</span> {selectedRestaurant.ownerId?.email}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium">Điện thoại:</span> {selectedRestaurant.phone}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Chi tiết kinh doanh</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Đơn tối thiểu</p>
                    <p className="font-bold">{selectedRestaurant.minOrder.toLocaleString()}đ</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Đơn tối đa</p>
                    <p className="font-bold">{selectedRestaurant.maxOrder.toLocaleString()}đ</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Đánh giá</p>
                    <p className="font-bold">
                      {selectedRestaurant.rating > 0 ? `${selectedRestaurant.rating}/5` : "Chưa có"}
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Trạng thái</p>
                    <p className="font-bold">
                      {statusMapping[selectedRestaurant.status] || selectedRestaurant.status}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Thông tin khác</h3>
                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground">
                    <span className="font-medium">Ngày đăng ký:</span>{" "}
                    {new Date(selectedRestaurant.createdAt).toLocaleString("vi-VN")}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium">Cập nhật lần cuối:</span>{" "}
                    {new Date(selectedRestaurant.updatedAt).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button
                onClick={() => {
                  setShowDetails(false)
                  setSelectedRestaurant(null)
                }}
                className="w-full"
              >
                Đóng
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
