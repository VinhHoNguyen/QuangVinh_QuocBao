"use client"

import { useState, useMemo } from "react"
import { ArrowLeft, Star, Search, ChevronRight, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useOrder } from "@/lib/order-context"
import { useAuth } from "@/lib/auth-context"
import { AuthModal } from "@/components/auth-modal"
import { restaurants, dishes, type Dish } from "@/lib/restaurant-data"

interface PageProps {
  params: Promise<{ id: string }>
}

async function RestaurantPage({ params }: PageProps) {
  const { id } = await params

  return <RestaurantContent restaurantId={id} />
}

function RestaurantContent({ restaurantId }: { restaurantId: string }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "rating">("default")
  const [authOpen, setAuthOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(6)

  const { addToCart, cart } = useOrder()
  const { user } = useAuth()

  const restaurant = restaurants.find((r) => r.id === restaurantId)
  const restaurantDishes = dishes.filter((d) => d.restaurantId === restaurantId)

  const categories = ["Tất cả", ...new Set(restaurantDishes.map((d) => d.category))]

  const filteredAndSorted = useMemo(() => {
    let result = restaurantDishes

    if (selectedCategory !== "all") {
      result = result.filter((dish) => dish.category === selectedCategory)
    }

    if (searchQuery) {
      result = result.filter(
        (dish) =>
          dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dish.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price)
    } else if (sortBy === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating)
    }

    return result
  }, [searchQuery, selectedCategory, sortBy])

  const visibleDishes = filteredAndSorted.slice(0, visibleCount)

  const handleAddToCart = (dish: Dish) => {
    if (!user) {
      setAuthOpen(true)
      return
    }
    addToCart({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      image: dish.image,
      restaurantId: dish.restaurantId,
    })
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Nhà hàng không tồn tại</h2>
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90">Quay lại trang chủ</Button>
          </Link>
        </div>
      </div>
    )
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
          <h1 className="text-xl font-bold text-primary hidden md:block">{restaurant.name}</h1>
          <Link href="/checkout">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </header>

      {/* Restaurant Banner */}
      <section className="relative h-64 bg-muted overflow-hidden">
        <img
          src={restaurant.image || "/placeholder.svg"}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="w-full p-6">
            <h2 className="text-3xl font-bold text-white mb-2">{restaurant.name}</h2>
            <div className="flex items-center gap-4 text-white">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-white" />
                <span className="font-semibold">{restaurant.rating}</span>
              </div>
              <span>{restaurant.deliveryTime} phút</span>
              <span>{restaurant.deliveryFee.toLocaleString("vi-VN")}đ ship</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <div className="max-w-7xl mx-auto px-4 py-6 border-b border-border">
        <div className="space-y-4">
          {/* Search */}
          <div className="bg-muted rounded-lg flex items-center px-4 py-2 gap-3">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm món ăn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Category filter and Sort */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            {/* Category filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 flex-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat === "Tất cả" ? "all" : cat)}
                  className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                    (cat === "Tất cả" ? selectedCategory === "all" : selectedCategory === cat)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-border"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort dropdown */}
            <div className="flex gap-2 w-full sm:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-4 py-2 rounded-lg bg-muted text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary font-medium"
              >
                <option value="default">Mặc định</option>
                <option value="price-asc">Giá: Thấp - Cao</option>
                <option value="price-desc">Giá: Cao - Thấp</option>
                <option value="rating">Đánh giá cao nhất</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Dishes Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleDishes.map((dish) => (
            <div
              key={dish.id}
              className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-border/50"
            >
              {/* Image with badges */}
              <div className="relative h-48 bg-muted overflow-hidden">
                <img
                  src={dish.image || "/placeholder.svg"}
                  alt={dish.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
                {dish.discount && (
                  <div className="absolute top-3 left-3 bg-accent text-accent-foreground font-bold px-3 py-1 rounded">
                    -{dish.discount}%
                  </div>
                )}
                {dish.badge && (
                  <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
                    {dish.badge}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{dish.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{dish.description}</p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span className="font-semibold text-foreground">{dish.rating}</span>
                  <span className="text-sm text-muted-foreground">({dish.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-primary">{dish.price.toLocaleString("vi-VN")}đ</span>
                  {dish.originalPrice && (
                    <span className="text-sm line-through text-muted-foreground">
                      {dish.originalPrice.toLocaleString("vi-VN")}đ
                    </span>
                  )}
                </div>

                {/* Order button */}
                <Button
                  onClick={() => handleAddToCart(dish)}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                >
                  Đặt món
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Load more button */}
        {visibleCount < filteredAndSorted.length && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => setVisibleCount((prev) => prev + 3)}
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary/10"
            >
              Xem thêm
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Empty state */}
        {visibleDishes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">Không tìm thấy món ăn nào</p>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  )
}

export default RestaurantPage
