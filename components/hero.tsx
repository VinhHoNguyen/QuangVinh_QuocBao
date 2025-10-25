import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-background overflow-hidden">
      <div className="container mx-auto px-4 py-12 md:py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-4 md:space-y-6">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight">
              Đặt món ngon,
              <span className="text-primary"> giao nhanh</span> đến tận nhà
            </h2>
            <p className="text-base md:text-lg text-muted-foreground text-pretty max-w-xl">
              Thưởng thức những món ăn nhanh yêu thích với chất lượng tuyệt vời. Giao hàng trong 30 phút hoặc miễn phí!
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                Đặt hàng ngay
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Xem thực đơn
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-4 md:gap-8 pt-4 md:pt-8">
              <div>
                <div className="text-2xl md:text-3xl font-bold text-primary">500+</div>
                <div className="text-xs md:text-sm text-muted-foreground">Món ăn</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-primary">50K+</div>
                <div className="text-xs md:text-sm text-muted-foreground">Khách hàng</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-primary">4.8★</div>
                <div className="text-xs md:text-sm text-muted-foreground">Đánh giá</div>
              </div>
            </div>
          </div>
          <div className="relative hidden sm:block">
            <div className="relative z-10">
              <img
                src="/delicious-burger-with-fries-and-drink-on-wooden-ta.jpg"
                alt="Burger ngon"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
            <div className="absolute -top-8 -right-8 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
