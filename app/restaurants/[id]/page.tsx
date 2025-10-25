"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star, Clock, Truck, Plus, Minus } from "lucide-react"
import { restaurants } from "@/lib/restaurants-data"
import type { CartItem } from "@/app/page"

export default function RestaurantDetailPage() {
  const router = useRouter()
  const params = useParams()
  const restaurantId = params.id as string

  const restaurant = restaurants.find((r) => r.id === restaurantId)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả")

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartCount={0} onCartClick={() => {}} />
        <div className="max-w-6xl mx-auto p-4 text-center py-12">
          <p className="text-muted-foreground">Không tìm thấy nhà hàng</p>
        </div>
      </div>
    )
  }

  const categories = ["Tất cả", ...new Set(restaurant.menu.map((item) => item.category))]
  const filteredMenu =
    selectedCategory === "Tất cả"
      ? restaurant.menu
      : restaurant.menu.filter((item) => item.category === selectedCategory)

  const addToCart = (item: (typeof restaurant.menu)[0]) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          image: item.image,
        },
      ]
    })
    setIsCartOpen(true)
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems((prev) => prev.filter((i) => i.id !== id))
    } else {
      setCartItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)))
    }
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Vui lòng chọn ít nhất một món ăn")
      return
    }

    if (subtotal < restaurant.minOrder) {
      alert(`Đơn hàng tối thiểu là ${restaurant.minOrder.toLocaleString("vi-VN")}đ`)
      return
    }

    // Save cart and restaurant info to sessionStorage
    sessionStorage.setItem("cartItems", JSON.stringify(cartItems))
    sessionStorage.setItem("restaurantId", restaurant.id)
    sessionStorage.setItem("restaurantName", restaurant.name)
    sessionStorage.setItem("deliveryFee", restaurant.deliveryFee.toString())

    router.push("/checkout")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header cartCount={totalItems} onCartClick={() => setIsCartOpen(true)} />

      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Back Button */}
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>

        {/* Restaurant Header */}
        <div className="mb-8">
          <div className="relative h-64 md:h-80 bg-muted rounded-lg overflow-hidden mb-6">
            <img
              src={restaurant.image || "/placeholder.svg"}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurant.name}</h1>
              <p className="text-muted-foreground mb-4">{restaurant.description}</p>

              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-primary text-primary" />
                  <span className="font-semibold">{restaurant.rating}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <span>{restaurant.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-muted-foreground" />
                  <span>Phí giao: {restaurant.deliveryFee.toLocaleString("vi-VN")}đ</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Menu */}
          <div className="lg:col-span-2">
            {/* Categories */}
            <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Menu Items */}
            <div className="space-y-4">
              {filteredMenu.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">{item.price.toLocaleString("vi-VN")}đ</span>
                          <Button size="sm" onClick={() => addToCart(item)}>
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h2 className="font-bold text-lg mb-4">Giỏ hàng</h2>

                {cartItems.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Giỏ hàng trống</p>
                ) : (
                  <>
                    <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.price.toLocaleString("vi-VN")}đ</p>
                          </div>

                          <div className="flex items-center gap-1 bg-muted rounded">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-6 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 border-t pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tạm tính</span>
                        <span>{subtotal.toLocaleString("vi-VN")}đ</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Phí giao hàng</span>
                        <span>{restaurant.deliveryFee.toLocaleString("vi-VN")}đ</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <span>Tổng cộng</span>
                        <span className="text-primary">
                          {(subtotal + restaurant.deliveryFee).toLocaleString("vi-VN")}đ
                        </span>
                      </div>

                      {subtotal > 0 && subtotal < restaurant.minOrder && (
                        <p className="text-xs text-destructive mt-2">
                          Đơn tối thiểu {restaurant.minOrder.toLocaleString("vi-VN")}đ
                        </p>
                      )}

                      <Button
                        className="w-full mt-4"
                        onClick={handleCheckout}
                        disabled={subtotal < restaurant.minOrder}
                      >
                        Thanh toán
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
