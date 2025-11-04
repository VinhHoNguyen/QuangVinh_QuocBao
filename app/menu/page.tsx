"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Star, Clock, Search, Sliders } from "lucide-react"
import { restaurants } from "@/lib/restaurants-data"

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000])
  const [sortBy, setSortBy] = useState<"price-low" | "price-high" | "rating">("rating")

  // Flatten all menu items with restaurant info
  const allMenuItems = restaurants.flatMap((restaurant) =>
    restaurant.menu.map((item) => ({
      ...item,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      restaurantRating: restaurant.rating,
      restaurantImage: restaurant.image,
      restaurantDeliveryTime: restaurant.deliveryTime,
    })),
  )

  // Get all unique categories
  const categories = Array.from(new Set(allMenuItems.map((item) => item.category))).sort()

  // Filter and sort
  const filteredItems = useMemo(() => {
    const items = allMenuItems.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.restaurantName.toLowerCase().includes(searchQuery.toLowerCase())

      const matchCategory = !selectedCategory || item.category === selectedCategory
      const matchRestaurant = !selectedRestaurant || item.restaurantId === selectedRestaurant
      const matchPrice = item.price >= priceRange[0] && item.price <= priceRange[1]

      return matchSearch && matchCategory && matchRestaurant && matchPrice
    })

    // Sort
    if (sortBy === "price-low") {
      items.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      items.sort((a, b) => b.price - a.price)
    } else if (sortBy === "rating") {
      items.sort((a, b) => b.restaurantRating - a.restaurantRating)
    }

    return items
  }, [searchQuery, selectedCategory, selectedRestaurant, priceRange, sortBy])

  return (
    <div className="min-h-screen bg-background">
      <Header cartCount={0} onCartClick={() => {}} />

      {/* Page Title */}
      <div className="bg-gradient-to-b from-primary/10 to-background py-8">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Thực Đơn</h1>
          <p className="text-muted-foreground">Tìm kiếm và lọc các món ăn yêu thích của bạn</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {/* Search and Filters */}
        <div className="space-y-6 mb-8">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm món ăn hoặc nhà hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
            />
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="text-sm font-semibold mb-2 block">Danh Mục</label>
              <select
                value={selectedCategory || ""}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="w-full px-3 py-2 border rounded-lg bg-background"
              >
                <option value="">Tất Cả Danh Mục</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Restaurant Filter */}
            <div>
              <label className="text-sm font-semibold mb-2 block">Nhà Hàng</label>
              <select
                value={selectedRestaurant || ""}
                onChange={(e) => setSelectedRestaurant(e.target.value || null)}
                className="w-full px-3 py-2 border rounded-lg bg-background"
              >
                <option value="">Tất Cả Nhà Hàng</option>
                {restaurants.map((rest) => (
                  <option key={rest.id} value={rest.id}>
                    {rest.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="text-sm font-semibold mb-2 block">Giá Tối Đa</label>
              <Input
                type="number"
                placeholder="Nhập giá tối đa"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="h-10"
              />
            </div>

            {/* Sort By */}
            <div>
              <label className="text-sm font-semibold mb-2 block">Sắp Xếp</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "price-low" | "price-high" | "rating")}
                className="w-full px-3 py-2 border rounded-lg bg-background"
              >
                <option value="rating">Xếp Hạng Cao Nhất</option>
                <option value="price-low">Giá Thấp Nhất</option>
                <option value="price-high">Giá Cao Nhất</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Tìm thấy <span className="font-semibold text-foreground">{filteredItems.length}</span> món ăn
          </p>
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card
                key={`${item.restaurantId}-${item.id}`}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 overflow-hidden bg-muted">
                  <img
                    src={item.image || "/placeholder.svg?height=200&width=300&query=food"}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>

                <CardContent className="p-4">
                  <Link href={`/restaurants/${item.restaurantId}`}>
                    <div className="mb-3 pb-3 border-b cursor-pointer hover:bg-muted/50 -mx-4 px-4 py-2 rounded transition-colors">
                      <p className="font-semibold text-sm text-primary hover:underline">{item.restaurantName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-primary text-primary" />
                          <span className="text-xs font-medium">{item.restaurantRating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {item.restaurantDeliveryTime}
                        </div>
                      </div>
                    </div>
                  </Link>

                  <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{item.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">{item.price.toLocaleString("vi-VN")}đ</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{item.category}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Sliders className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="font-semibold text-lg mb-2">Không tìm thấy món ăn</h3>
            <p className="text-muted-foreground mb-6">Hãy thử thay đổi các bộ lọc của bạn</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory(null)
                setSelectedRestaurant(null)
                setPriceRange([0, 500000])
                setSortBy("rating")
              }}
            >
              Xóa Bộ Lọc
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
