"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  addresses: Address[]
}

export interface Address {
  id: string
  name: string
  phone: string
  address: string
  district: string
  city: string
  isDefault: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, phone: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (user: Partial<User>) => void
  addAddress: (address: Address) => void
  removeAddress: (addressId: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check localStorage for saved user on mount
    const savedUser = localStorage.getItem("foodfast_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Failed to parse user:", error)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Mock login - in production this would call an API
      await new Promise((resolve) => setTimeout(resolve, 800))

      const mockUser: User = {
        id: `user_${Date.now()}`,
        name: email.split("@")[0],
        email,
        phone: "098 765 4321",
        addresses: [
          {
            id: "addr_1",
            name: "Nhà riêng",
            phone: "098 765 4321",
            address: "123 Nguyễn Huệ",
            district: "Quận 1",
            city: "Hồ Chí Minh",
            isDefault: true,
          },
        ],
      }

      setUser(mockUser)
      localStorage.setItem("foodfast_user", JSON.stringify(mockUser))
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name: string, email: string, phone: string, password: string) => {
    setIsLoading(true)
    try {
      // Mock signup - in production this would call an API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUser: User = {
        id: `user_${Date.now()}`,
        name,
        email,
        phone,
        addresses: [],
      }

      setUser(mockUser)
      localStorage.setItem("foodfast_user", JSON.stringify(mockUser))
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("foodfast_user")
  }

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem("foodfast_user", JSON.stringify(updatedUser))
    }
  }

  const addAddress = (address: Address) => {
    if (user) {
      const updatedUser = {
        ...user,
        addresses: [...user.addresses, address],
      }
      setUser(updatedUser)
      localStorage.setItem("foodfast_user", JSON.stringify(updatedUser))
    }
  }

  const removeAddress = (addressId: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        addresses: user.addresses.filter((addr) => addr.id !== addressId),
      }
      setUser(updatedUser)
      localStorage.setItem("foodfast_user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateProfile, addAddress, removeAddress }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
