"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { Search, X } from "lucide-react"
import Link from "next/link"
import { restaurants, dishes } from "@/lib/restaurant-data"

export function HeaderSearch() {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => {
    if (!query.trim()) return { dishes: [], restaurants: [] }

    const lowerQuery = query.toLowerCase()

    const foundDishes = dishes.filter(
      (d) =>
        d.name.toLowerCase().includes(lowerQuery) ||
        d.description.toLowerCase().includes(lowerQuery) ||
        d.category.toLowerCase().includes(lowerQuery),
    )

    const foundRestaurants = restaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(lowerQuery) || r.categories.some((cat) => cat.toLowerCase().includes(lowerQuery)),
    )

    return { dishes: foundDishes, restaurants: foundRestaurants }
  }, [query])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const hasResults = results.dishes.length > 0 || results.restaurants.length > 0

  return (
    <div ref={searchRef} className="flex-1 relative">
      {/* Search Input */}
      <div
        className="flex items-center gap-3 px-4 py-2.5 bg-white rounded-lg shadow-sm border border-border/20 hover:shadow-md transition-shadow cursor-text"
        onClick={() => setIsOpen(true)}
      >
        <Search className="w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Tìm nhà hàng, món ăn..."
          className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
        />
        {query && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setQuery("")
            }}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background rounded-lg shadow-lg border border-border z-50 max-h-96 overflow-y-auto">
          {query.trim() ? (
            <>
              {/* Dishes Section - Prioritized at top */}
              {results.dishes.length > 0 && (
                <div className="border-b border-border/50">
                  <div className="px-4 py-3 bg-muted/30 sticky top-0">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Món ăn ({results.dishes.length})
                    </h3>
                  </div>
                  <div className="divide-y divide-border/30">
                    {results.dishes.slice(0, 5).map((dish) => {
                      const dishRestaurant = restaurants.find((r) => r.id === dish.restaurantId)
                      return (
                        <Link
                          key={dish.id}
                          href={`/restaurant/${dish.restaurantId}`}
                          onClick={() => {
                            setIsOpen(false)
                            setQuery("")
                          }}
                        >
                          <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer">
                            <img
                              src={dish.image || "/placeholder.svg"}
                              alt={dish.name}
                              className="w-10 h-10 rounded object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-foreground truncate text-sm">{dish.name}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {dishRestaurant?.name} • {dish.category}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 ml-2 flex-shrink-0">
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

              {/* Restaurants Section */}
              {results.restaurants.length > 0 && (
                <div>
                  <div className="px-4 py-3 bg-muted/30 sticky top-0">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Nhà hàng ({results.restaurants.length})
                    </h3>
                  </div>
                  <div className="divide-y divide-border/30">
                    {results.restaurants.slice(0, 5).map((restaurant) => (
                      <Link
                        key={restaurant.id}
                        href={`/restaurant/${restaurant.id}`}
                        onClick={() => {
                          setIsOpen(false)
                          setQuery("")
                        }}
                      >
                        <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer">
                          <img
                            src={restaurant.image || "/placeholder.svg"}
                            alt={restaurant.name}
                            className="w-10 h-10 rounded object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground truncate text-sm">{restaurant.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {restaurant.categories.join(" • ")} • {restaurant.deliveryTime} phút
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="text-sm font-semibold">{restaurant.rating}</span>
                            <span className="text-xs text-muted-foreground">⭐</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* No results */}
              {!hasResults && (
                <div className="px-4 py-8 text-center">
                  <Search className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-muted-foreground text-sm">Không tìm thấy kết quả cho "{query}"</p>
                </div>
              )}
            </>
          ) : (
            <div className="px-4 py-8 text-center">
              <Search className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-muted-foreground text-sm">Nhập từ khóa để tìm kiếm</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
