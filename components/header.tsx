"use client"

import { ShoppingCart, User, Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
          <h1 className="text-xl md:text-2xl font-bold text-primary">FastFood</h1>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Trang chủ
            </a>
            <a href="#menu" className="text-sm font-medium hover:text-primary transition-colors">
              Thực đơn
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Khuyến mãi
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Liên hệ
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden lg:flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input type="search" placeholder="Tìm món ăn..." className="w-64" />
          </div>
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <User className="w-5 h-5" />
          </Button>
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
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors py-2">
              Trang chủ
            </a>
            <a href="#menu" className="text-sm font-medium hover:text-primary transition-colors py-2">
              Thực đơn
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors py-2">
              Khuyến mãi
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors py-2">
              Liên hệ
            </a>
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
