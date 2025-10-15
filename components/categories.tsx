import { Pizza, Sandwich, Coffee, IceCream, Salad, Drumstick } from "lucide-react"
import { Button } from "@/components/ui/button"

const categories = [
  { name: "Burger", icon: Sandwich },
  { name: "Pizza", icon: Pizza },
  { name: "Gà rán", icon: Drumstick },
  { name: "Đồ uống", icon: Coffee },
  { name: "Salad", icon: Salad },
  { name: "Tráng miệng", icon: IceCream },
]

export function Categories() {
  return (
    <section className="py-12 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Button
                key={category.name}
                variant="outline"
                className="flex-shrink-0 gap-2 hover:bg-primary hover:text-primary-foreground transition-colors bg-transparent"
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </Button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
