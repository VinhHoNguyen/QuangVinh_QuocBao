"use client"

import { useState, useMemo, useEffect } from "react"
import {
  ShoppingCart,
  Star,
  TrendingUp,
  ShoppingBag,
  LogOut,
  UserIcon,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Heart,
  Navigation,
  Crown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useOrder } from "@/lib/order-context"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { AuthModal } from "@/components/auth-modal"
import { useRestaurants, useProducts } from "@/lib/hooks"
import { SearchModal } from "@/components/search-modal"
import { HeaderSearch } from "@/components/header-search"
import type { Dish } from "@/lib/restaurant-data"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"rating" | "price-asc" | "price-desc" | "trending">("trending")
  const [visibleCount, setVisibleCount] = useState(6)
  const [authOpen, setAuthOpen] = useState(false)

  const [showFavorites, setShowFavorites] = useState(false)
  const [showFeatured, setShowFeatured] = useState(false)
  const [showNearMe, setShowNearMe] = useState(false)

  const { cart: orderCart } = useOrder() // Keep for backward compatibility if needed
  const { user, logout } = useAuth()
  const { cart, addToCart: addToCartAPI, totalItems } = useCart()
  
  // Fetch real data from backend API
  const { restaurants, loading: restaurantsLoading, error: restaurantsError } = useRestaurants("active")
  const { products: allProducts, loading: productsLoading } = useProducts({ available: true })

  // Debug: Log restaurants data
  useEffect(() => {
    console.log('Restaurants loaded:', restaurants.length, restaurants)
  }, [restaurants])

  // Get unique categories from products
  const categories = useMemo(() => {
    const cats = new Set(allProducts.map(p => p.category))
    return ["Tất cả", ...Array.from(cats)]
  }, [allProducts])

  const filteredAndSorted = useMemo(() => {
    let result = allProducts

    if (selectedCategory !== "all" && selectedCategory !== "Tất cả") {
      result = result.filter((item) => item.category === selectedCategory)
    }

    if (searchQuery) {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    const sorted = [...result]
    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price)
        break
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating)
        break
      case "trending":
      default:
        sorted.sort((a, b) => b.reviews - a.reviews)
    }

    return sorted
  }, [allProducts, searchQuery, selectedCategory, sortBy])

  const filteredRestaurants = useMemo(() => {
    let result = [...restaurants]

    if (showFavorites) {
      result = result.filter((r) => r.isFavorite)
    }

    if (showFeatured) {
      result = result.filter((r) => r.isFeatured)
    }

    if (showNearMe) {
      result = result.sort((a, b) => (a.distance || 999) - (b.distance || 999))
    } else {
      result = result.sort((a, b) => b.rating - a.rating)
    }

    return result
  }, [restaurants, showFavorites, showFeatured, showNearMe])

  const visibleItems = filteredAndSorted.slice(0, visibleCount)

  const handleAddToCart = async (item: Dish) => {
    if (!user) {
      setAuthOpen(true)
      return
    }
    
    try {
      await addToCartAPI(item.id, 1)
      // Optional: Show success toast
    } catch (error) {
      console.error('Error adding to cart:', error)
      // Optional: Show error toast
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <h1 className="text-xl font-bold text-primary">FoodFast</h1>
          </Link>

          <div className="hidden md:flex flex-1 max-w-md">
            <HeaderSearch />
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                    <UserIcon className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">{user.name}</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={logout} title="Đăng xuất">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setAuthOpen(true)}>
                  Đăng nhập
                </Button>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => setAuthOpen(true)}>
                  Đăng ký
                </Button>
              </div>
            )}

            <Link href="/orders">
              <Button variant="ghost" size="icon" title="Đơn hàng của tôi">
                <ShoppingBag className="w-5 h-5" />
              </Button>
            </Link>

            {user ? (
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </Link>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setAuthOpen(true)}
                title="Giỏ hàng (đăng nhập để dùng)"
                className="relative opacity-50 cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden px-4 pb-3">
          <HeaderSearch />
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-orange-500 to-red-500 text-primary-foreground py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
            {/* Left: Text content */}
            <div className="space-y-6">
              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight text-balance">
                  Khám phá nhà hàng tuyệt vời
                </h1>
                <p className="text-lg text-primary-foreground/95 text-balance">
                  Đặt hàng ngay từ các nhà hàng yêu thích. Nhanh, an toàn, và luôn đúng giờ.
                </p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <div className="bg-primary-foreground/20 px-4 py-2 rounded-lg">
                  <span className="text-sm font-semibold">⚡ Giao trong 30 phút</span>
                </div>
                <div className="bg-primary-foreground/20 px-4 py-2 rounded-lg">
                  <span className="text-sm font-semibold">✓ 100% An toàn</span>
                </div>
              </div>
            </div>

            {/* Right: Hero image */}
            <div className="relative h-80 md:h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-foreground/10 to-transparent rounded-2xl" />
              <img
                src="/vietnamese-pork-grilled-with-rice-noodles.jpg"
                alt="Featured food"
                className="w-full h-full object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2"></div>
          </div>
        </div>
      </section>

      <div className="bg-muted/50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Lọc nhà hàng</h2>
          <div className="flex flex-wrap gap-3">
            <Button
              variant={showFavorites ? "default" : "outline"}
              onClick={() => setShowFavorites(!showFavorites)}
              className="gap-2"
            >
              <Heart className={`w-4 h-4 ${showFavorites ? "fill-current" : ""}`} />
              Quán yêu thích
            </Button>
            <Button
              variant={showFeatured ? "default" : "outline"}
              onClick={() => setShowFeatured(!showFeatured)}
              className="gap-2"
            >
              <Crown className="w-4 h-4" />
              Quán đối tác chính
            </Button>
            <Button
              variant={showNearMe ? "default" : "outline"}
              onClick={() => setShowNearMe(!showNearMe)}
              className="gap-2"
            >
              <Navigation className="w-4 h-4" />
              Gần bạn
            </Button>
          </div>
        </div>
      </div>

      {/* Restaurants Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-primary" />
            Nhà hàng phổ biến
            {filteredRestaurants.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground ml-auto">
                ({filteredRestaurants.length} quán)
              </span>
            )}
          </h2>
        </div>

        {restaurantsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card rounded-lg overflow-hidden shadow-md border border-border/50 h-full animate-pulse">
                <div className="h-48 bg-muted"></div>
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                  <div className="h-10 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRestaurants.map((restaurant) => (
              <Link key={restaurant.id} href={`/restaurant/${restaurant.id}`}>
                <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all border border-border/50 cursor-pointer h-full relative">
                  {/* Image */}
                  <div className="relative h-48 bg-muted overflow-hidden">
                    <img
                      src={restaurant.image || "/placeholder.svg"}
                      alt={restaurant.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                    {restaurant.isFeatured && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        Đối tác chính
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-bold text-foreground flex-1">{restaurant.name}</h3>
                      {restaurant.isFavorite && <Heart className="w-5 h-5 fill-red-500 text-red-500 flex-shrink-0" />}
                    </div>

                    {/* Info */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-primary text-primary" />
                        <span className="font-semibold">{restaurant.rating}</span>
                        <span className="text-muted-foreground">({restaurant.reviews})</span>
                      </div>
                      <div className="text-muted-foreground">
                        {restaurant.deliveryTime} phút • {restaurant.deliveryFee.toLocaleString("vi-VN")}đ ship
                      </div>
                      <div className="text-muted-foreground">
                        Đơn tối thiểu: {restaurant.minOrder.toLocaleString("vi-VN")}đ
                      </div>
                      {restaurant.distance && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Navigation className="w-3 h-3" />
                          {restaurant.distance} km
                        </div>
                      )}
                    </div>

                    <Button
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                      asChild
                    >
                      <span>Xem menu</span>
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : restaurantsError ? (
          <div className="text-center py-12">
            <p className="text-destructive text-lg mb-4">❌ Lỗi khi tải danh sách nhà hàng</p>
            <p className="text-muted-foreground text-sm mb-4">{restaurantsError.message}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Thử lại
            </Button>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Không tìm thấy nhà hàng phù hợp với tiêu chí lọc của bạn</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground mt-20">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-xl">FoodFast</h3>
              </div>
              <p className="text-primary-foreground/95 text-sm leading-relaxed">
                Nền tảng giao đồ ăn nhanh chóng, an toàn, và đáng tin cậy cho bạn.
              </p>
            </div>

            {/* About */}
            <div className="space-y-4">
              <h4 className="font-bold text-base">Về FoodFast</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="text-primary-foreground/90 hover:text-white transition-colors">
                    Về chúng tôi
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary-foreground/90 hover:text-white transition-colors">
                    Tuyển dụng
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary-foreground/90 hover:text-white transition-colors">
                    Bài viết blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary-foreground/90 hover:text-white transition-colors">
                    Chính sách bảo mật
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h4 className="font-bold text-base">Hỗ trợ</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="text-primary-foreground/90 hover:text-white transition-colors">
                    Liên hệ chúng tôi
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary-foreground/90 hover:text-white transition-colors">
                    Câu hỏi thường gặp
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary-foreground/90 hover:text-white transition-colors">
                    Theo dõi đơn hàng
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary-foreground/90 hover:text-white transition-colors">
                    Điều khoản sử dụng
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact & Social */}
            <div className="space-y-4">
              <h4 className="font-bold text-base">Liên lạc</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4" />
                  <a href="tel:1900123456" className="text-primary-foreground/90 hover:text-white transition-colors">
                    1900 123 456
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4" />
                  <a
                    href="mailto:support@foodfast.vn"
                    className="text-primary-foreground/90 hover:text-white transition-colors"
                  >
                    support@foodfast.vn
                  </a>
                </li>
              </ul>

              {/* Social media */}
              <div className="flex gap-3 mt-4 pt-4 border-t border-primary-foreground/20">
                <a href="#" className="text-primary-foreground/90 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-primary-foreground/90 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-primary-foreground/90 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom divider and copyright */}
          <div className="border-t border-primary-foreground/20 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-primary-foreground/90 text-sm">© 2025 FoodFast. Tất cả quyền được bảo lưu.</p>
              <div className="flex gap-6 text-sm">
                <a href="#" className="text-primary-foreground/90 hover:text-white transition-colors">
                  Chính sách quyền riêng tư
                </a>
                <a href="#" className="text-primary-foreground/90 hover:text-white transition-colors">
                  Điều khoản dịch vụ
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />

      {/* Search Modal */}
      <SearchModal open={searchModalOpen} onOpenChange={setSearchModalOpen} />

      {/* Floating cart for small screens */}
      {user && totalItems > 0 && (
        <Link href="/cart">
          <div className="fixed bottom-4 right-4 md:hidden">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full w-14 h-14 p-0 flex items-center justify-center shadow-lg"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {totalItems}
              </span>
            </Button>
          </div>
        </Link>
      )}
    </div>
  )
}
