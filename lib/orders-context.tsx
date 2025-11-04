"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type Order = {
  id: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    image: string
  }>
  subtotal: number
  deliveryFee: number
  total: number
  customerInfo: {
    name: string
    phone: string
    address: string
    notes?: string
  }
  restaurantName: string
  deliveryMethod: "standard" | "fast" | "drone"
  status: "pending" | "confirmed" | "preparing" | "on-the-way" | "delivered"
  createdAt: Date
  estimatedDelivery?: Date
}

type OrdersContextType = {
  orders: Order[]
  addOrder: (order: Omit<Order, "id" | "createdAt">) => Order
  updateOrderStatus: (id: string, status: Order["status"]) => void
}

export const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])

  const addOrder = (orderData: Omit<Order, "id" | "createdAt">) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}`,
      createdAt: new Date(),
    }
    setOrders((prev) => [newOrder, ...prev])
    return newOrder
  }

  const updateOrderStatus = (id: string, status: Order["status"]) => {
    setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status } : order)))
  }

  return <OrdersContext.Provider value={{ orders, addOrder, updateOrderStatus }}>{children}</OrdersContext.Provider>
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (!context) {
    throw new Error("useOrders must be used within OrdersProvider")
  }
  return context
}
