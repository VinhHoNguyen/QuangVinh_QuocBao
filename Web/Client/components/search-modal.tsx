"use client"

import { useState, useMemo } from "react"
import { Search, X } from "lucide-react"
import Link from "next/link"
import { restaurants, dishes } from "@/lib/restaurant-data"

interface SearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [query, setQuery] = useState("")

  const results = useMemo(() => {
    if (!query.trim()) return { restaurants: [], dishes: [] }

    const lowerQuery = query.toLowerCase()

    const foundRestaurants = restaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(lowerQuery) || r.categories.some((cat) => cat.toLowerCase().includes(lowerQuery)),
    )

    const foundDishes = dishes.filter(
      (d) =>
        d.name.toLowerCase().includes(lowerQuery) ||
        d.description.toLowerCase().includes(lowerQuery) ||
        d.category.toLowerCase().includes(lowerQuery),
    )

    return { restaurants: foundRestaurants, dishes: foundDishes }
  }, [query])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            autoFocus
            type="text"
            placeholder="Tìm nhà hàng, món ăn..."
            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={() => onOpenChange(false)} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {query.trim() ? (
            <>
              {/* Restaurants Section */}
              {results.restaurants.length > 0 && (
                <div className="px-4 py-4 border-b border-border">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">Nhà hàng</h3>
                  <div className="space-y-2">
                    {results.restaurants.map((restaurant) => (
                      <Link
                        key={restaurant.id}
                        href={`/restaurant/${restaurant.id}`}
                        onClick={() => onOpenChange(false)}
                      >
                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                          <img
                            src={restaurant.image || "/placeholder.svg"}
                            alt={restaurant.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground truncate">{restaurant.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {restaurant.categories.join(" • ")} • {restaurant.deliveryTime} phút
                            </p>
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            <span className="text-sm font-semibold">{restaurant.rating}</span>
                            <span className="text-xs text-muted-foreground">⭐</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Dishes Section */}
              {results.dishes.length > 0 && (
                <div className="px-4 py-4">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">Món ăn</h3>
                  <div className="space-y-2">
                    {results.dishes.slice(0, 8).map((dish) => {
                      const dishRestaurant = restaurants.find((r) => r.id === dish.restaurantId)
                      return (
                        <Link
                          key={dish.id}
                          href={`/restaurant/${dish.restaurantId}`}
                          onClick={() => onOpenChange(false)}
                        >
                          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                            <img
                              src={dish.image || "/placeholder.svg"}
                              alt={dish.name}
                              className="w-12 h-12 rounded object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-foreground truncate">{dish.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {dishRestaurant?.name} • {dish.category}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 ml-2">
                              <span className="text-sm font-semibold text-primary">
                                {dish.price.toLocaleString("vi-VN")}đ
                              </span>
                              {dish.discount && (
                                <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded font-semibold">
                                  -{dish.discount}%
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* No results */}
              {results.restaurants.length === 0 && results.dishes.length === 0 && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground">Không tìm thấy kết quả cho "{query}"</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">Nhập từ khóa để tìm kiếm</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
