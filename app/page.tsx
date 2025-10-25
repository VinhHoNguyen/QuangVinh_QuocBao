"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Star, Clock } from "lucide-react"
import { restaurants } from "@/lib/restaurants-data"

export type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

export default function Home() {
  const router = useRouter()

  // Flatten all menu items with restaurant info
  const allMenuItems = restaurants.flatMap((restaurant) =>
    restaurant.menu.map((item) => ({
      ...item,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      restaurantRating: restaurant.rating,
      restaurantImage: restaurant.image,
      restaurantDeliveryTime: restaurant.deliveryTime,
      restaurantDeliveryFee: restaurant.deliveryFee,
    })),
  )

  return (
    <div className="min-h-screen bg-background">
      <Header cartCount={0} onCartClick={() => {}} />

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/10 to-background py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Đặt Đồ Ăn Nhanh Online</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Khám phá các nhà hàng tuyệt vời và đặt hàng với giao hàng nhanh chóng
          </p>
          <Button size="lg" onClick={() => router.push("/restaurants")}>
            Xem Các Nhà Hàng
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <h2 className="text-3xl font-bold mb-12 text-center">Tại Sao Chọn Chúng Tôi?</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-4xl mb-4">🏪</div>
              <h3 className="font-bold text-lg mb-2">Nhiều Nhà Hàng</h3>
              <p className="text-muted-foreground">Lựa chọn từ hàng chục nhà hàng với các loại ẩm thực khác nhau</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="font-bold text-lg mb-2">Giao Hàng Nhanh</h3>
              <p className="text-muted-foreground">Giao hàng trong 15-30 phút, hoặc chọn giao hàng bằng drone</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="font-bold text-lg mb-2">Giá Tốt</h3>
              <p className="text-muted-foreground">Giá cạnh tranh và các khuyến mãi hấp dẫn hàng ngày</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* All Menu Items Section */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <h2 className="text-3xl font-bold mb-12 text-center">Tất Cả Các Món Ăn</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allMenuItems.map((item) => (
            <Card key={`${item.restaurantId}-${item.id}`} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Food Image */}
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
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
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
                    </div>
                  </div>
                </Link>

                {/* Food Item Info */}
                <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{item.description}</p>

                {/* Price and Category */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-primary">{item.price.toLocaleString("vi-VN")}đ</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{item.category}</span>
                </div>

                {/* View Restaurant Button */}
                <Link href={`/restaurants/${item.restaurantId}`} className="w-full">
                  <Button variant="outline" className="w-full bg-transparent">
                    Xem Nhà Hàng
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/5 py-12 md:py-20">
        <div className="max-w-2xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Sẵn Sàng Đặt Hàng?</h2>
          <p className="text-muted-foreground mb-8">Chọn nhà hàng yêu thích của bạn và bắt đầu đặt hàng ngay bây giờ</p>
          <Button size="lg" onClick={() => router.push("/restaurants")}>
            Khám Phá Nhà Hàng
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
