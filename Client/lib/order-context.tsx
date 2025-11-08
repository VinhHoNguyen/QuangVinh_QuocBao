"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface RecipientInfo {
  fullName: string
  phone: string
  email: string
  address: string
  notes?: string
  saveForLater?: boolean
}

export interface Order {
  id: string
  items: OrderItem[]
  recipientInfo: RecipientInfo
  deliveryMethod: "drone" | "motorcycle"
  deliveryNote?: string
  paymentMethod: "cod" | "ewallet" | "bank" | "visa"
  totalPrice: number
  status: "preparing" | "on-the-way" | "delivered" | "cancelled"
  createdAt: Date
  estimatedDeliveryTime: string
  driverInfo?: {
    name: string
    phone: string
    vehicle: string
    latitude: number
    longitude: number
    rating?: number
    avatar?: string
  }
  droneInfo?: {
    batteryLevel: number
    altitude: number
    speed: number
    estimatedArrivalTime: string
  }
  timeline?: {
    status: "preparing" | "on-the-way" | "arrived"
    timestamp: Date
  }[]
  rating?: number
  review?: string
}

interface CartItem extends OrderItem {
  originalPrice?: number
}

interface OrderContextType {
  cart: CartItem[]
  orders: Order[]
  addToCart: (item: Omit<CartItem, "quantity">) => void
  removeFromCart: (itemId: string) => void
  updateCartQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  createOrder: (recipientInfo: RecipientInfo, deliveryMethod: "drone" | "motorcycle", paymentMethod: string) => Order
  getOrders: () => Order[]
  getOrderById: (orderId: string) => Order | undefined
  updateOrderStatus: (orderId: string, status: Order["status"]) => void
  getCartTotal: () => number
  getSavedAddresses: () => RecipientInfo[]
  saveAddress: (info: RecipientInfo) => void
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [savedAddresses, setSavedAddresses] = useState<RecipientInfo[]>([])

  const addToCart = useCallback((item: Omit<CartItem, "quantity">) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((itemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId))
  }, [])

  const updateCartQuantity = useCallback(
    (itemId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(itemId)
        return
      }
      setCart((prev) => prev.map((i) => (i.id === itemId ? { ...i, quantity } : i)))
    },
    [removeFromCart],
  )

  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }, [cart])

  const createOrder = useCallback(
    (recipientInfo: RecipientInfo, deliveryMethod: "drone" | "motorcycle", paymentMethod: string) => {
      if (cart.length === 0) {
        throw new Error("Giỏ hàng trống")
      }

      const now = new Date()
      const newOrder: Order = {
        id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        items: cart,
        recipientInfo,
        deliveryMethod,
        deliveryNote:
          deliveryMethod === "drone" ? "Giao bằng drone - nhanh chóng và an toàn" : "Giao bằng xe máy - tiết kiệm",
        paymentMethod: paymentMethod as any,
        totalPrice: getCartTotal(),
        status: "preparing",
        createdAt: now,
        estimatedDeliveryTime: deliveryMethod === "drone" ? "15-20 phút" : "30-45 phút",
        driverInfo: {
          name: deliveryMethod === "drone" ? "Drone #001" : "Nguyễn Văn A",
          phone: deliveryMethod === "drone" ? "N/A" : "0912345678",
          vehicle: deliveryMethod === "drone" ? "Drone DJI Pro" : "Honda Wave 110",
          latitude: 21.0285 + (Math.random() - 0.5) * 0.02,
          longitude: 105.8542 + (Math.random() - 0.5) * 0.02,
          rating: deliveryMethod === "drone" ? 4.8 : 4.5,
          avatar: deliveryMethod === "drone" ? "🚁" : "👨‍💼",
        },
        droneInfo:
          deliveryMethod === "drone"
            ? {
                batteryLevel: 95,
                altitude: 0,
                speed: 0,
                estimatedArrivalTime: "15-20 phút",
              }
            : undefined,
        timeline: [
          {
            status: "preparing",
            timestamp: now,
          },
        ],
      }

      setOrders((prev) => [newOrder, ...prev])
      clearCart()
      return newOrder
    },
    [cart, getCartTotal, clearCart],
  )

  const getOrders = useCallback(() => {
    return orders
  }, [orders])

  const getOrderById = useCallback(
    (orderId: string) => {
      return orders.find((o) => o.id === orderId)
    },
    [orders],
  )

  const updateOrderStatus = useCallback((orderId: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status,
              driverInfo: o.driverInfo
                ? {
                    ...o.driverInfo,
                    latitude: o.driverInfo.latitude + (Math.random() - 0.5) * 0.005,
                    longitude: o.driverInfo.longitude + (Math.random() - 0.5) * 0.005,
                  }
                : undefined,
              droneInfo: o.droneInfo
                ? {
                    ...o.droneInfo,
                    altitude: status === "on-the-way" ? 50 : status === "delivered" ? 0 : 0,
                    speed: status === "on-the-way" ? 15 : 0,
                    batteryLevel: Math.max(20, o.droneInfo.batteryLevel - 10),
                  }
                : undefined,
              timeline: [
                ...(o.timeline || []),
                {
                  status: status === "delivered" ? "arrived" : status === "on-the-way" ? "on-the-way" : "preparing",
                  timestamp: new Date(),
                },
              ],
            }
          : o,
      ),
    )
  }, [])

  const getSavedAddresses = useCallback(() => {
    return savedAddresses
  }, [savedAddresses])

  const saveAddress = useCallback((info: RecipientInfo) => {
    setSavedAddresses((prev) => [...prev, info])
  }, [])

  return (
    <OrderContext.Provider
      value={{
        cart,
        orders,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        createOrder,
        getOrders,
        getOrderById,
        updateOrderStatus,
        getCartTotal,
        getSavedAddresses,
        saveAddress,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export function useOrder() {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error("useOrder must be used within OrderProvider")
  }
  return context
}
