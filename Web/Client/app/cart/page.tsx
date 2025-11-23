"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useCart } from '@/lib/cart-context'
import { Trash2, Plus, Minus, ShoppingBag, ShoppingCart, LogOut, UserIcon, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HeaderSearch } from '@/components/header-search'

export default function CartPage() {
  const router = useRouter()
  const { user, isLoading, logout } = useAuth()
  const { 
    cart, 
    loading, 
    error, 
    totalItems, 
    totalPrice, 
    updateQuantity, 
    removeFromCart, 
    clearCart 
  } = useCart()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/?auth=login')
    }
  }, [user, isLoading, router])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  // Redirect if not logged in (handled by useEffect)
  if (!user) {
    return null
  }

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    try {
      if (newQuantity <= 0) {
        await removeFromCart(productId)
      } else {
        await updateQuantity(productId, newQuantity)
      }
    } catch (err) {
      console.error('Error updating quantity:', err)
    }
  }

  const handleRemoveItem = async (productId: string) => {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      try {
        await removeFromCart(productId)
      } catch (err) {
        console.error('Error removing item:', err)
      }
    }
  }

  const handleClearCart = async () => {
    if (confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
      try {
        await clearCart()
      } catch (err) {
        console.error('Error clearing cart:', err)
      }
    }
  }

  const handleCheckout = () => {
    router.push('/checkout')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Same as home page */}
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
            ) : null}

            <Link href="/orders">
              <Button variant="ghost" size="icon" title="Đơn hàng của tôi">
                <ShoppingBag className="w-5 h-5" />
              </Button>
            </Link>

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
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden px-4 pb-3">
          <HeaderSearch />
        </div>
      </header>

      {/* Page Title Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Giỏ hàng của bạn</h1>
            {cart.length > 0 && (
              <button
                onClick={handleClearCart}
                className="text-white hover:bg-white/20 px-4 py-2 rounded-lg font-medium text-sm flex items-center space-x-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xóa tất cả</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cart.length === 0 ? (
          // Empty Cart
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Giỏ hàng trống
            </h2>
            <p className="text-gray-600 mb-6">
              Hãy thêm một số món ăn ngon vào giỏ hàng của bạn!
            </p>
            <Link
              href="/"
              className="inline-block bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Khám phá món ăn
            </Link>
          </div>
        ) : (
          // Cart Items
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      {!item.available && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">
                            Hết hàng
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-orange-500 font-semibold">
                        {item.price.toLocaleString('vi-VN')}đ
                      </p>
                      {!item.available && (
                        <p className="text-red-600 text-sm mt-1">
                          Sản phẩm hiện không có sẵn
                        </p>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center space-x-2 bg-gray-100 rounded-lg">
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                          disabled={loading || !item.available}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-semibold w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                          disabled={loading || !item.available}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-gray-600">Tổng cộng:</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Tóm tắt đơn hàng
                </h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Số lượng món:</span>
                    <span className="font-medium">{totalItems}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính:</span>
                    <span className="font-medium">
                      {totalPrice.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển:</span>
                    <span className="font-medium text-green-600">Miễn phí</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      Tổng cộng:
                    </span>
                    <span className="text-2xl font-bold text-orange-500">
                      {totalPrice.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading || cart.length === 0 || cart.some(item => !item.available)}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {cart.some(item => !item.available) 
                    ? 'Có món không khả dụng' 
                    : 'Tiến hành thanh toán'}
                </button>

                <Link
                  href="/"
                  className="block text-center text-orange-500 hover:text-orange-600 font-medium mt-4"
                >
                  ← Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer - Same as home page */}
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
    </div>
  )
}
