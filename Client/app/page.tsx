"use client"

import { useState, useMemo } from "react"
import {
  ShoppingCart,
  MapPin,
  Star,
  TrendingUp,
  ShoppingBag,
  LogOut,
  UserIcon,
  Search,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Heart,
  Clock,
  Navigation,
  Crown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useOrder } from "@/lib/order-context"
import { useAuth } from "@/lib/auth-context"
import { AuthModal } from "@/components/auth-modal"
import { restaurants } from "@/lib/restaurant-data"

interface MenuItem {
  id: string
  name: string
  category: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image: string
  discount?: number
  badge?: string
}

const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Bún Chả Hà Nội",
    category: "Bún & Cơm",
    price: 45000,
    originalPrice: 55000,
    rating: 4.8,
    reviews: 342,
    image: "/vietnamese-pork-grilled-with-rice-noodles.jpg",
    discount: 18,
    badge: "Bestseller",
  },
  {
    id: "2",
    name: "Bánh Mì Thập Cẩm",
    category: "Bánh & Bánh Mì",
    price: 28000,
    rating: 4.7,
    reviews: 256,
    image: "/vietnamese-sandwich-with-pork-p-t-.jpg",
    badge: "Bestseller",
  },
  {
    id: "3",
    name: "Cơm Tấm Sườn Nướng",
    category: "Bún & Cơm",
    price: 52000,
    originalPrice: 65000,
    rating: 4.9,
    reviews: 418,
    image: "/vietnamese-grilled-pork-chop-rice.jpg",
    discount: 20,
  },
  {
    id: "4",
    name: "Tàu Hủ Non Chiên",
    category: "Đặc Biệt",
    price: 35000,
    rating: 4.6,
    reviews: 189,
    image: "/vietnamese-fried-tofu.jpg",
  },
  {
    id: "5",
    name: "Bánh Xèo Hải Phòng",
    category: "Bánh & Bánh Mì",
    price: 38000,
    rating: 4.8,
    reviews: 301,
    image: "/vietnamese-sizzling-crepe.jpg",
    badge: "Hot",
  },
  {
    id: "6",
    name: "Bún Thang Gà",
    category: "Bún & Cơm",
    price: 42000,
    originalPrice: 50000,
    rating: 4.7,
    reviews: 267,
    image: "/vietnamese-chicken-noodle-soup.jpg",
    discount: 16,
  },
  {
    id: "7",
    name: "Phở Bò Truyền Thống",
    category: "Bún & Cơm",
    price: 48000,
    rating: 4.9,
    reviews: 502,
    image: "/vietnamese-beef-pho-soup.jpg",
  },
  {
    id: "8",
    name: "Gà Nướng Vàng",
    category: "Gà & Thịt",
    price: 65000,
    originalPrice: 80000,
    rating: 4.8,
    reviews: 289,
    image: "/vietnamese-grilled-yellow-chicken.jpg",
    discount: 19,
  },
]

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"rating" | "price-asc" | "price-desc" | "trending">("trending")
  const [visibleCount, setVisibleCount] = useState(6)
  const [authOpen, setAuthOpen] = useState(false)

  const [showFavorites, setShowFavorites] = useState(false)
  const [showFeatured, setShowFeatured] = useState(false)
  const [showOpenNow, setShowOpenNow] = useState(false)
  const [showNearMe, setShowNearMe] = useState(false)

  const { cart, addToCart } = useOrder()
  const { user, logout } = useAuth()

  const categories = ["Tất cả", "Bún & Cơm", "Bánh & Bánh Mì", "Gà & Thịt", "Đặc Biệt"]

  const filteredAndSorted = useMemo(() => {
    let result = menuItems

    if (selectedCategory !== "all") {
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
  }, [searchQuery, selectedCategory, sortBy])

  const filteredRestaurants = useMemo(() => {
    let result = [...restaurants]

    if (showFavorites) {
      result = result.filter((r) => r.isFavorite)
    }

    if (showFeatured) {
      result = result.filter((r) => r.isFeatured)
    }

    if (showOpenNow) {
      result = result.filter((r) => r.isOpen)
    }

    if (showNearMe) {
      result = result.sort((a, b) => (a.distance || 999) - (b.distance || 999))
    } else {
      result = result.sort((a, b) => b.rating - a.rating)
    }

    return result
  }, [showFavorites, showFeatured, showOpenNow, showNearMe])

  const visibleItems = filteredAndSorted.slice(0, visibleCount)

  const handleAddToCart = (item: MenuItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            
            <h1 className="text-xl font-bold text-primary">FoodFast</h1>
          </Link>
          <div className="hidden md:flex items-center gap-3">
            
            
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
                <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={() => setAuthOpen(true)}>
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
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setAuthOpen(true)}
                title="Giỏ hàng (đăng nhập để dùng)"
                className="relative opacity-50 cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cart.length}
                  </span>
                )}
              </Button>
            )}
          </div>
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

          {/* Search bar */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              
              
            </div>
            <div className="flex gap-3">
              <div className="flex-1 bg-white rounded-lg flex items-center px-4 py-3 shadow-lg">
                <Search className="w-5 h-5 text-muted-foreground mr-3" />
                <input
                  type="text"
                  placeholder="Tìm nhà hàng, món ăn..."
                  className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 font-semibold shadow-lg"
              >
                Tìm kiếm
              </Button>
            </div>
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
              variant={showOpenNow ? "default" : "outline"}
              onClick={() => setShowOpenNow(!showOpenNow)}
              className="gap-2"
            >
              <Clock className="w-4 h-4" />
              Mở cửa hiện tại
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

        {filteredRestaurants.length > 0 ? (
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
                    {!restaurant.isOpen && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold">Đóng cửa</span>
                      </div>
                    )}
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
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                      asChild
                    >
                      <span>Xem menu</span>
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
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

      {/* Floating cart for small screens */}
      {user && cart.length > 0 && (
        <Link href="/checkout">
          <div className="fixed bottom-4 right-4 md:hidden">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full w-14 h-14 p-0 flex items-center justify-center shadow-lg"
            >
              <ShoppingCart className="w-6 h-6" />
            </Button>
          </div>
        </Link>
      )}
    </div>
  )
}
