"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Star, Search, Truck, Clock } from "lucide-react"
import { restaurants } from "@/lib/restaurants-data"

export default function RestaurantsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"rating" | "delivery-time" | "delivery-fee">("rating")

  const filteredRestaurants = restaurants
    .filter((r) => r.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating
      if (sortBy === "delivery-time") {
        const timeA = Number.parseInt(a.deliveryTime.split("-")[0])
        const timeB = Number.parseInt(b.deliveryTime.split("-")[0])
        return timeA - timeB
      }
      if (sortBy === "delivery-fee") return a.deliveryFee - b.deliveryFee
      return 0
    })

  return (
    <div className="min-h-screen bg-background">
      <Header cartCount={0} onCartClick={() => {}} />

      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Các Nhà Hàng</h1>
          <p className="text-muted-foreground">Chọn nhà hàng yêu thích và đặt hàng ngay</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm nhà hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button variant={sortBy === "rating" ? "default" : "outline"} onClick={() => setSortBy("rating")} size="sm">
              Xếp hạng cao
            </Button>
            <Button
              variant={sortBy === "delivery-time" ? "default" : "outline"}
              onClick={() => setSortBy("delivery-time")}
              size="sm"
            >
              Giao nhanh
            </Button>
            <Button
              variant={sortBy === "delivery-fee" ? "default" : "outline"}
              onClick={() => setSortBy("delivery-fee")}
              size="sm"
            >
              Phí giao rẻ
            </Button>
          </div>
        </div>

        {/* Restaurants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <Card
              key={restaurant.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/restaurants/${restaurant.id}`)}
            >
              <div className="relative h-48 bg-muted overflow-hidden">
                <img
                  src={restaurant.image || "/placeholder.svg"}
                  alt={restaurant.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
                <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-semibold">{restaurant.rating}</span>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2">{restaurant.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{restaurant.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Truck className="w-4 h-4" />
                    <span>Phí giao: {restaurant.deliveryFee.toLocaleString("vi-VN")}đ</span>
                  </div>
                  <div className="text-muted-foreground">
                    Đơn tối thiểu: {restaurant.minOrder.toLocaleString("vi-VN")}đ
                  </div>
                </div>

                <Button className="w-full mt-4">Xem Menu</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Không tìm thấy nhà hàng nào</p>
          </div>
        )}
      </div>
    </div>
  )
}
