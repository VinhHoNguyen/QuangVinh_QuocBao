"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Star } from "lucide-react"

type MenuItem = {
  id: string
  name: string
  description: string
  price: number
  image: string
  rating: number
  category: string
}

const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Burger Bò Phô Mai",
    description: "Burger bò Úc 100% với phô mai cheddar tan chảy",
    price: 89000,
    image: "/delicious-cheeseburger-with-melted-cheese.jpg",
    rating: 4.8,
    category: "Burger",
  },
  {
    id: "2",
    name: "Pizza Hải Sản",
    description: "Pizza với tôm, mực, nghêu tươi ngon",
    price: 159000,
    image: "/seafood-pizza-with-shrimp-and-squid.jpg",
    rating: 4.9,
    category: "Pizza",
  },
  {
    id: "3",
    name: "Gà Rán Giòn",
    description: "6 miếng gà rán giòn tan với sốt đặc biệt",
    price: 129000,
    image: "/crispy-fried-chicken-pieces-golden-brown.jpg",
    rating: 4.7,
    category: "Gà rán",
  },
  {
    id: "4",
    name: "Combo Burger Đôi",
    description: "2 burger + khoai tây + 2 nước ngọt",
    price: 149000,
    image: "/double-burger-combo-with-fries-and-drinks.jpg",
    rating: 4.8,
    category: "Combo",
  },
  {
    id: "5",
    name: "Pizza Pepperoni",
    description: "Pizza với xúc xích pepperoni Ý",
    price: 139000,
    image: "/pepperoni-pizza-with-lots-of-cheese.jpg",
    rating: 4.9,
    category: "Pizza",
  },
  {
    id: "6",
    name: "Gà Sốt Cay",
    description: "Gà rán phủ sốt cay Hàn Quốc đặc biệt",
    price: 139000,
    image: "/spicy-korean-fried-chicken-with-sauce.jpg",
    rating: 4.6,
    category: "Gà rán",
  },
  {
    id: "7",
    name: "Burger Gà Giòn",
    description: "Burger gà giòn với rau xanh tươi",
    price: 79000,
    image: "/crispy-chicken-burger-with-fresh-lettuce.jpg",
    rating: 4.7,
    category: "Burger",
  },
  {
    id: "8",
    name: "Khoai Tây Chiên",
    description: "Khoai tây chiên giòn size lớn",
    price: 39000,
    image: "/crispy-golden-french-fries-in-basket.jpg",
    rating: 4.5,
    category: "Món phụ",
  },
]

type MenuSectionProps = {
  onAddToCart: (item: { id: string; name: string; price: number; image: string }) => void
}

export function MenuSection({ onAddToCart }: MenuSectionProps) {
  return (
    <section id="menu" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Thực đơn đặc biệt</h2>
          <p className="text-muted-foreground text-lg">Những món ăn được yêu thích nhất</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item) => (
            <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative overflow-hidden">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-card/95 backdrop-blur px-2 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-accent text-accent" />
                  <span className="text-xs font-semibold">{item.rating}</span>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="mb-2">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                    {item.category}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2 text-balance">{item.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 text-pretty">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary">{item.price.toLocaleString("vi-VN")}đ</span>
                  <Button
                    size="sm"
                    className="gap-1"
                    onClick={() =>
                      onAddToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                      })
                    }
                  >
                    <Plus className="w-4 h-4" />
                    Thêm
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
