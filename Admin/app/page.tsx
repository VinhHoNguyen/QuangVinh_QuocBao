"use client"

import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogIn, Store } from "lucide-react"

export default function Home() {
  redirect("/login")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-2xl text-primary">
            <Store size={32} />
            FastFood
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Trang chủ
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Thực đơn
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Nhà hàng
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Đơn hàng
            </a>
          </nav>
          <Link href="/login">
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <LogIn size={18} />
              Admin
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">Đặt Đồ Ăn Nhanh Online</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Khám phá các nhà hàng tuyệt vời và đặt hàng với giao hàng nhanh chóng
          </p>
          <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-lg px-8 py-6">
            Xem Các Nhà Hàng
            <span>→</span>
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="text-center space-y-3 p-6">
            <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
              <Store size={32} />
            </div>
            <h3 className="text-xl font-bold text-foreground">Nhiều Nhà Hàng</h3>
            <p className="text-muted-foreground">Lựa chọn từ hàng chục nhà hàng với các loại hình khác nhau</p>
          </div>

          <div className="text-center space-y-3 p-6">
            <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-bold text-foreground">Giao Hàng Nhanh</h3>
            <p className="text-muted-foreground">Giao hàng trong 15-30 phút, hoặc chọn giao hàng bằng drone</p>
          </div>

          <div className="text-center space-y-3 p-6">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="text-xl font-bold text-foreground">Giá Tốt</h3>
            <p className="text-muted-foreground">Giá cạnh tranh và các khuyến mãi hấp dẫn hàng ngày</p>
          </div>
        </div>
      </main>
    </div>
  )
}
