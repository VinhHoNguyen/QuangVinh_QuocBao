"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Edit2, Eye, Check, X, AlertCircle, Pause } from "lucide-react"

const initialRestaurants = [
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

const TABS = ["Tất cả", "Chờ duyệt", "Hoạt động", "Vi phạm", "Tạm ngưng"]

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState(initialRestaurants)
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("Tất cả")
  const [selectedRestaurant, setSelectedRestaurant] = useState<(typeof restaurants)[0] | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const filteredRestaurants = restaurants.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase())
    const matchesTab =
      activeTab === "Tất cả" ||
      (activeTab === "Chờ duyệt" && r.verificationStatus === "Chờ duyệt") ||
      (activeTab === "Hoạt động" && r.status === "Hoạt động") ||
      (activeTab === "Vi phạm" && r.violations > 0) ||
      (activeTab === "Tạm ngưng" && r.status === "Tạm ngưng")
    return matchesSearch && matchesTab
  })

  const handleApprove = (id: number) => {
    setRestaurants(
      restaurants.map((r) => (r.id === id ? { ...r, status: "Hoạt động", verificationStatus: "Đã xác minh" } : r)),
    )
  }

  const handleReject = (id: number) => {
    setRestaurants(restaurants.filter((r) => r.id !== id))
  }

  const handleSuspend = (id: number) => {
    setRestaurants(restaurants.map((r) => (r.id === id ? { ...r, status: "Tạm ngưng" } : r)))
  }

  const handleResume = (id: number) => {
    setRestaurants(restaurants.map((r) => (r.id === id ? { ...r, status: "Hoạt động" } : r)))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý nhà hàng</h1>
          <p className="text-muted-foreground mt-1">Duyệt, quản lý menu, giám sát doanh thu và xử lý vi phạm</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus size={18} />
          Thêm nhà hàng
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
        {filteredRestaurants.map((restaurant) => (
          <Card key={restaurant.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Basic Info */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{restaurant.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{restaurant.address}</p>
                  </div>
                  <div className="flex gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        restaurant.status === "Hoạt động"
                          ? "bg-green-100 text-green-700"
                          : restaurant.status === "Chờ xác minh"
                            ? "bg-yellow-100 text-yellow-700"
                            : restaurant.status === "Tạm ngưng"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {restaurant.status}
                    </span>
                    {restaurant.violations > 0 && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {restaurant.violations} vi phạm
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Email:</span> {restaurant.email}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Điện thoại:</span> {restaurant.contact}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Xác minh:</span> {restaurant.verificationStatus}
                  </p>
                </div>
              </div>

              {/* Right Column - Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Doanh thu (tháng)</p>
                  <p className="text-lg font-bold text-foreground">
                    {restaurant.revenue > 0 ? `${(restaurant.revenue / 1000000).toFixed(1)}M` : "N/A"}
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Tỉ lệ huỷ</p>
                  <p className="text-lg font-bold text-foreground">
                    {restaurant.cancelRate > 0 ? `${restaurant.cancelRate}%` : "N/A"}
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Đánh giá</p>
                  <p className="text-lg font-bold text-foreground">
                    {restaurant.rating > 0 ? `${restaurant.rating}/5` : "N/A"}
                  </p>
                  {restaurant.reviewCount > 0 && (
                    <p className="text-xs text-muted-foreground">({restaurant.reviewCount} review)</p>
                  )}
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Menu</p>
                  <p className="text-lg font-bold text-foreground">
                    {restaurant.menu.items > 0 ? `${restaurant.menu.items} món` : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-6 border-t border-border">
              <Button
                size="sm"
                variant="outline"
                className="gap-1 bg-transparent"
                onClick={() => {
                  setSelectedRestaurant(restaurant)
                  setShowDetails(true)
                }}
              >
                <Eye size={16} />
                Chi tiết
              </Button>

              {restaurant.verificationStatus === "Chờ duyệt" && (
                <>
                  <Button
                    size="sm"
                    className="gap-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleApprove(restaurant.id)}
                  >
                    <Check size={16} />
                    Phê duyệt
                  </Button>
                  <Button
                    size="sm"
                    className="gap-1 bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => handleReject(restaurant.id)}
                  >
                    <X size={16} />
                    Từ chối
                  </Button>
                </>
              )}

              {restaurant.status === "Hoạt động" && (
                <Button
                  size="sm"
                  className="gap-1 bg-orange-600 hover:bg-orange-700 text-white"
                  onClick={() => handleSuspend(restaurant.id)}
                >
                  <Pause size={16} />
                  Tạm ngưng
                </Button>
              )}

              {restaurant.status === "Tạm ngưng" && (
                <Button
                  size="sm"
                  className="gap-1 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleResume(restaurant.id)}
                >
                  <Check size={16} />
                  Hoạt động lại
                </Button>
              )}

              <Button size="sm" variant="outline" className="gap-1 ml-auto bg-transparent">
                <Edit2 size={16} />
                Sửa
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Details Modal */}
      {showDetails && selectedRestaurant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold">{selectedRestaurant.name}</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowDetails(false)} className="text-xl">
                  ✕
                </Button>
              </div>

              {/* Menu Section */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Menu</h3>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm">
                    <span className="font-medium">Tổng số món:</span> {selectedRestaurant.menu.items}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Khoảng giá:</span> {selectedRestaurant.menu.priceRange}
                  </p>
                </div>
              </div>

              {/* Promotions Section */}
              {selectedRestaurant.promotions.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Khuyến mãi</h3>
                  <div className="space-y-2">
                    {selectedRestaurant.promotions.map((promo, idx) => (
                      <div key={idx} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <p className="font-medium text-blue-900">{promo.title}</p>
                        {promo.discount > 0 && <p className="text-sm text-blue-700">Giảm: {promo.discount}%</p>}
                        <p className="text-xs text-blue-600">Hết hạn: {promo.validTill}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Performance Section */}
              {selectedRestaurant.status === "Hoạt động" && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Hiệu suất</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-1">Doanh thu</p>
                      <p className="text-lg font-bold">{(selectedRestaurant.revenue / 1000000).toFixed(1)}M</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-1">Tỉ lệ huỷ</p>
                      <p className="text-lg font-bold">{selectedRestaurant.cancelRate}%</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-1">Đánh giá</p>
                      <p className="text-lg font-bold">{selectedRestaurant.rating}/5</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-1">Tổng review</p>
                      <p className="text-lg font-bold">{selectedRestaurant.reviewCount}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Violations Section */}
              {selectedRestaurant.violations > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
                  <p className="font-semibold text-red-900 flex items-center gap-2">
                    <AlertCircle size={18} />
                    Vi phạm: {selectedRestaurant.violations}
                  </p>
                  <p className="text-sm text-red-700">Cần giám sát kỹ lưỡng hoặc xem xét tạm ngưng hoạt động</p>
                </div>
              )}

              <Button onClick={() => setShowDetails(false)} className="w-full bg-primary hover:bg-primary/90">
                Đóng
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
