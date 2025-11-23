"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import {
  Menu,
  X,
  LogOut,
  Home,
  UtensilsCrossed,
  PackageOpen,
  BarChart3,
  Users,
  TrendingUp,
  ShoppingCart,
  AlertCircle as AlertBell,
  Activity,
} from "lucide-react"
import { AccountPage } from "@/components/pages/account-page"
import { MenuPage } from "@/components/pages/menu-page"
import { OrderPage } from "@/components/pages/order-page"
import { AnalyticsPage } from "@/components/pages/analytics-page"

type PageType = "dashboard" | "account" | "menu" | "orders" | "analytics"

interface DashboardLayoutProps {
  restaurantName: string
  onLogout: () => void
}

interface DashboardStats {
  todayOrders: number
  pendingOrders: number
  activeMenuItems: number
  monthlyRevenue: string
  avgRating: number
}

export function DashboardLayout({ restaurantName, onLogout }: DashboardLayoutProps) {
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const dashboardStats: DashboardStats = {
    todayOrders: 24,
    pendingOrders: 3,
    activeMenuItems: 42,
    monthlyRevenue: "28,500,000 VND",
    avgRating: 4.8,
  }

  const menuItems = [
    { id: "dashboard", label: "Tổng Quan", icon: Home },
    { id: "account", label: "Tài Khoản & Nhân Viên", icon: Users },
    { id: "menu", label: "Quản Lý Thực Đơn", icon: UtensilsCrossed },
    { id: "orders", label: "Quản Lý Đơn Hàng", icon: PackageOpen },
    { id: "analytics", label: "Thống Kê", icon: BarChart3 },
  ] as const

  const featureOverview = [
    {
      title: "Đơn Hàng Hôm Nay",
      value: dashboardStats.todayOrders,
      icon: ShoppingCart,
      color: "from-blue-500 to-cyan-500",
      subtitle: `${dashboardStats.pendingOrders} đang chờ xử lý`,
      page: "orders" as PageType,
    },
    {
      title: "Thực Đơn Hoạt Động",
      value: dashboardStats.activeMenuItems,
      icon: UtensilsCrossed,
      color: "from-orange-500 to-red-500",
      subtitle: "Sản phẩm có sẵn",
      page: "menu" as PageType,
    },
    {
      title: "Doanh Thu Tháng",
      value: dashboardStats.monthlyRevenue,
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
      subtitle: "Tăng 12% so với tháng trước",
      page: "analytics" as PageType,
    },
    {
      title: "Đánh Giá Trung Bình",
      value: `${dashboardStats.avgRating} ⭐`,
      icon: Activity,
      color: "from-purple-500 to-pink-500",
      subtitle: "Từ khách hàng",
      page: "analytics" as PageType,
    },
  ]

  const renderPage = () => {
    switch (currentPage) {
      case "account":
        return <AccountPage />
      case "menu":
        return <MenuPage />
      case "orders":
        return <OrderPage />
      case "analytics":
        return <AnalyticsPage />
      default:
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Chào mừng, {restaurantName}</h1>
              <p className="text-muted-foreground">Tổng quan hoạt động hôm nay</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {featureOverview.map((feature, idx) => {
                const Icon = feature.icon
                return (
                  <Card
                    key={idx}
                    className="p-5 cursor-pointer hover:shadow-lg border-slate-200 dark:border-slate-700 transition-all hover:scale-105 bg-white dark:bg-slate-800 group"
                    onClick={() => setCurrentPage(feature.page)}
                  >
                    <div className="space-y-3">
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}
                      >
                        <Icon size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">{feature.title}</p>
                        <p className="text-2xl font-bold text-foreground mt-1">{feature.value}</p>
                        <p className="text-xs text-muted-foreground mt-2">{feature.subtitle}</p>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <AlertBell size={20} className="text-orange-500" />
                  Đơn Hàng Cần Chú Ý
                </h3>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {dashboardStats.pendingOrders} đơn hàng đang chờ xác nhận
                  </p>
                  <button
                    onClick={() => setCurrentPage("orders")}
                    className="text-sm text-red-500 hover:text-red-600 font-semibold"
                  >
                    Xem chi tiết →
                  </button>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <UtensilsCrossed size={20} className="text-orange-500" />
                  Quản Lý Thực Đơn
                </h3>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Cập nhật hoặc thêm các món ăn mới</p>
                  <button
                    onClick={() => setCurrentPage("menu")}
                    className="text-sm text-orange-500 hover:text-orange-600 font-semibold"
                  >
                    Quản lý →
                  </button>
                </div>
              </Card>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 transition-all duration-300 overflow-y-auto text-slate-100`}
      >
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className={`${sidebarOpen ? "flex" : "hidden"} items-center gap-3`}>
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                🍜
              </div>
              <span className="font-bold text-white text-sm">Quản lý nhà hàng</span>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 hover:bg-slate-700 rounded-lg text-slate-300"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id as PageType)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  currentPage === item.id
                    ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-700"
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm sticky top-0 z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-muted rounded-lg md:hidden text-foreground"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl font-semibold text-foreground">
                {menuItems.find((item) => item.id === currentPage)?.label || "Tổng Quan"}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-foreground hidden sm:block">{restaurantName}</span>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
              >
                <LogOut size={18} />
                Đăng Xuất
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">{renderPage()}</div>
      </main>
    </div>
  )
}
