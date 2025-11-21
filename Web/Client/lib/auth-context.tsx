"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { authAPI, saveAuthToken, removeAuthToken } from "./api"

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role?: string
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
      const response = await authAPI.login(email, password)
      
      if (response.success && response.data) {
        // Note: In a real Firebase setup, you'd get a token from signInWithEmailAndPassword
        // For now, we'll create a mock token. You should implement proper Firebase Auth
        const mockToken = `mock_token_${response.data.uid}`
        saveAuthToken(mockToken)

        const user: User = {
          id: response.data.uid,
          name: response.data.name,
          email: response.data.email,
          phone: "098 765 4321", // Would come from backend
          role: response.data.role,
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

        setUser(user)
        localStorage.setItem("foodfast_user", JSON.stringify(user))
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name: string, email: string, phone: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await authAPI.register(name, email, password, phone)
      
      if (response.success && response.data) {
        // Auto login after successful registration
        const mockToken = `mock_token_${response.data.uid}`
        saveAuthToken(mockToken)

        const user: User = {
          id: response.data.uid,
          name: response.data.name,
          email: response.data.email,
          phone,
          role: response.data.role,
          addresses: [],
        }

        setUser(user)
        localStorage.setItem("foodfast_user", JSON.stringify(user))
      }
    } catch (error) {
      console.error("Signup error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("foodfast_user")
    removeAuthToken()
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (user) {
      try {
        // Call backend API to update profile
        if (updates.name || updates.phone) {
          await authAPI.updateProfile({
            name: updates.name,
            phone: updates.phone,
          })
        }
        
        const updatedUser = { ...user, ...updates }
        setUser(updatedUser)
        localStorage.setItem("foodfast_user", JSON.stringify(updatedUser))
      } catch (error) {
        console.error("Update profile error:", error)
        throw error
      }
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
