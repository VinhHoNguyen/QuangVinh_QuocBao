"use client"

import { ShoppingCart, User, Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState } from "react"

type HeaderProps = {
  cartCount: number
  onCartClick: () => void
}

export function Header({ cartCount, onCartClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4 md:gap-8">
          <Link href="/">
            <h1 className="text-xl md:text-2xl font-bold text-primary hover:opacity-80 transition-opacity">FastFood</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <Link href="/menu" className="text-sm font-medium hover:text-primary transition-colors">
              Thực đơn
            </Link>
            <Link href="/restaurants" className="text-sm font-medium hover:text-primary transition-colors">
              Nhà Hàng
            </Link>
            <Link href="/order-history" className="text-sm font-medium hover:text-primary transition-colors">
              Đơn Hàng
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden lg:flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input type="search" placeholder="Tìm món ăn..." className="w-64" />
          </div>
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <User className="w-5 h-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="relative" onClick={onCartClick}>
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t bg-card">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
            <Link
              href="/"
              className="text-sm font-medium hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Trang chủ
            </Link>
            <Link
              href="/menu"
              className="text-sm font-medium hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Thực đơn
            </Link>
            <Link
              href="/restaurants"
              className="text-sm font-medium hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Nhà Hàng
            </Link>
            <Link
              href="/order-history"
              className="text-sm font-medium hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Đơn Hàng
            </Link>
            <Link
              href="/profile"
              className="text-sm font-medium hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Hồ Sơ
            </Link>
            <div className="flex items-center gap-2 pt-2 border-t">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input type="search" placeholder="Tìm món ăn..." className="flex-1" />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
