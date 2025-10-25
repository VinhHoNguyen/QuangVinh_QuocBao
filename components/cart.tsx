"use client"

import { X, Minus, Plus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { CartItem } from "@/app/page"
import Link from "next/link"

type CartProps = {
  items: CartItem[]
  isOpen: boolean
  onClose: () => void
  onUpdateQuantity: (id: string, quantity: number) => void
}

export function Cart({ items, isOpen, onClose, onUpdateQuantity }: CartProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = subtotal > 0 ? 20000 : 0
  const total = subtotal + deliveryFee

  if (!isOpen) return null

  const handleCheckout = () => {
    // Save cart items to sessionStorage for checkout page
    if (typeof window !== "undefined") {
      sessionStorage.setItem("cartItems", JSON.stringify(items))
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 animate-in fade-in" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-card z-50 shadow-2xl animate-in slide-in-from-right">
        <Card className="h-full flex flex-col border-0 rounded-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 md:pb-4 px-4 md:px-6">
            <CardTitle className="text-xl md:text-2xl font-bold">Giỏ hàng</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 md:h-10 md:w-10">
              <X className="w-4 md:w-5 h-4 md:h-5" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto px-4 md:px-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8 md:py-12">
                <ShoppingBag className="w-12 md:w-16 h-12 md:h-16 text-muted-foreground mb-3 md:mb-4" />
                <p className="text-base md:text-lg font-medium mb-1 md:mb-2">Giỏ hàng trống</p>
                <p className="text-xs md:text-sm text-muted-foreground">Thêm món ăn vào giỏ hàng để tiếp tục</p>
              </div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 md:gap-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 md:w-20 h-16 md:h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm md:text-base mb-1 line-clamp-2">{item.name}</h4>
                      <p className="text-sm md:text-base font-bold text-primary mb-2">
                        {item.price.toLocaleString("vi-VN")}đ
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 md:h-7 w-6 md:w-7 bg-transparent flex-shrink-0"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-6 md:w-8 text-center font-semibold text-sm md:text-base">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 md:h-7 w-6 md:w-7 bg-transparent flex-shrink-0"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>

          {items.length > 0 && (
            <CardFooter className="flex-col gap-3 md:gap-4 border-t pt-3 md:pt-4 px-4 md:px-6 pb-4 md:pb-6">
              <div className="w-full space-y-2">
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span className="font-medium">{subtotal.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-muted-foreground">Phí giao hàng</span>
                  <span className="font-medium">{deliveryFee.toLocaleString("vi-VN")}đ</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base md:text-lg font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{total.toLocaleString("vi-VN")}đ</span>
                </div>
              </div>
              <Link href="/checkout" className="w-full" onClick={handleCheckout}>
                <Button className="w-full" size="lg">
                  Thanh toán
                </Button>
              </Link>
            </CardFooter>
          )}
        </Card>
      </div>
    </>
  )
}
