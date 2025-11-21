"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { orderAPI, deliveryAPI, Order as APIOrder } from "./api"

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  restaurantId?: string
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

  // Load user orders on mount
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await orderAPI.getUserOrders()
        if (response.success && response.data) {
          // Convert API orders to local format
          const convertedOrders: Order[] = response.data.map((apiOrder: APIOrder) => ({
            id: apiOrder._id,
            items: apiOrder.items.map((item) => ({
              id: item._id,
              name: item.productName,
              price: item.price,
              quantity: item.quantity,
              image: "/placeholder-dish.jpg",
            })),
            recipientInfo: {
              fullName: "User",
              phone: "0123456789",
              email: "user@example.com",
              address: `${apiOrder.shippingAddress.street}, ${apiOrder.shippingAddress.ward}, ${apiOrder.shippingAddress.district}, ${apiOrder.shippingAddress.city}`,
            },
            deliveryMethod: "drone",
            paymentMethod: apiOrder.paymentMethod === "cash" ? "cod" : "ewallet",
            totalPrice: apiOrder.totalPrice,
            status: apiOrder.status === "pending" ? "preparing" : apiOrder.status === "delivered" ? "delivered" : "on-the-way",
            createdAt: new Date(apiOrder.createdAt),
            estimatedDeliveryTime: "15-20 phút",
          }))
          setOrders(convertedOrders)
        }
      } catch (error) {
        console.error("Error loading orders:", error)
      }
    }

    loadOrders()
  }, [])

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
    async (recipientInfo: RecipientInfo, deliveryMethod: "drone" | "motorcycle", paymentMethod: string) => {
      if (cart.length === 0) {
        throw new Error("Giỏ hàng trống")
      }

      try {
        // Get restaurantId from first item in cart (assuming all items from same restaurant)
        const restaurantId = cart[0]?.restaurantId || ""
        
        // Parse address to get coordinates (mock for now)
        const shippingAddress = {
          street: recipientInfo.address,
          city: "Hồ Chí Minh",
          district: "Quận 1",
          ward: "Phường Bến Nghé",
          coordinates: {
            latitude: 10.762622,
            longitude: 106.660172,
          },
        }

        // Convert payment method to backend format
        const paymentMethodMap: { [key: string]: string } = {
          cod: "cash",
          ewallet: "e_wallet",
          bank: "bank_transfer",
          visa: "credit_card",
        }

        // Create order via API
        const response = await orderAPI.create({
          restaurantId,
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
          paymentMethod: paymentMethodMap[paymentMethod] || "cash",
          shippingAddress,
        })

        if (response.success && response.data) {
          const apiOrder = response.data

          // Convert API order to local format
          const now = new Date()
          const newOrder: Order = {
            id: apiOrder._id,
            items: cart,
            recipientInfo,
            deliveryMethod,
            deliveryNote:
              deliveryMethod === "drone"
                ? "Giao bằng drone - nhanh chóng và an toàn"
                : "Giao bằng xe máy - tiết kiệm",
            paymentMethod: paymentMethod as any,
            totalPrice: apiOrder.totalPrice,
            status: apiOrder.status === "pending" ? "preparing" : "preparing",
            createdAt: now,
            estimatedDeliveryTime: deliveryMethod === "drone" ? "15-20 phút" : "30-45 phút",
            driverInfo: {
              name: deliveryMethod === "drone" ? "Drone #001" : "Nguyễn Văn A",
              phone: deliveryMethod === "drone" ? "N/A" : "0912345678",
              vehicle: deliveryMethod === "drone" ? "Drone DJI Pro" : "Honda Wave 110",
              latitude: 10.762622 + (Math.random() - 0.5) * 0.02,
              longitude: 106.660172 + (Math.random() - 0.5) * 0.02,
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
        }

        throw new Error("Failed to create order")
      } catch (error) {
        console.error("Error creating order:", error)
        throw error
      }
    },
    [cart, clearCart],
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
