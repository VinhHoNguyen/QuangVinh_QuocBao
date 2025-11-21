"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, LogOut, Users, Store, Package, CreditCard, BarChart2, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const authData = localStorage.getItem("adminAuth")
    if (authData) {
      try {
        const { authenticated } = JSON.parse(authData)
        setIsAuthenticated(authenticated)
      } catch {
        router.push("/login")
      }
    } else {
      router.push("/login")
    }
    setLoading(false)
  }, [router])

  const menuItems = [
    { href: "/admin", label: "Bảng điều khiển", icon: Users },
    { href: "/admin/users", label: "Quản lý người dùng", icon: Users },
    { href: "/admin/restaurants", label: "Quản lý nhà hàng", icon: Store },
    { href: "/admin/drones", label: "Quản lý Drone", icon: Package },
    { href: "/admin/orders", label: "Quản lý đơn hàng", icon: Package },
    { href: "/admin/payments", label: "Quản lý thanh toán", icon: CreditCard },
    { href: "/admin/reports", label: "Báo cáo & thống kê", icon: BarChart2 },
    { href: "/admin/support", label: "Phản hồi & hỗ trợ", icon: MessageCircle },
  ]

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin">
            <Store className="text-primary" size={32} />
          </div>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 border-b border-sidebar-border flex items-center justify-center">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-xl text-primary">
            <Store size={24} />
            {sidebarOpen && <span>FastFood Admin</span>}
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Toggle Button */}
        <div className="border-t border-sidebar-border p-4">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="w-full">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">FastFood Admin</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-2 bg-transparent hover:bg-muted text-foreground"
          >
            <LogOut size={18} />
            Đăng xuất
          </Button>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-background">{children}</div>
      </main>
    </div>
  )
}
