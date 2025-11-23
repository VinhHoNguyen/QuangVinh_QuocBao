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
  token: string | null
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
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check localStorage for saved user on mount
    const savedUser = localStorage.getItem("foodfast_user")
    const savedToken = localStorage.getItem("foodfast_token")
    
    console.log('Auth init - savedUser:', savedUser ? 'exists' : 'null');
    console.log('Auth init - savedToken:', savedToken ? 'exists' : 'null');
    
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser))
        setToken(savedToken)
        console.log('Auth init - User and token restored from localStorage');
      } catch (error) {
        console.error("Failed to parse user:", error)
        // Clear corrupted data
        localStorage.removeItem("foodfast_user")
        localStorage.removeItem("foodfast_token")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await authAPI.login(email, password)
      
      console.log('Login response:', response);
      
      if (response.success && response.data) {
        // Token is inside response.data, not response.token
        const authToken = response.data.token
        
        console.log('Login - authToken:', authToken ? 'exists' : 'null');
        
        saveAuthToken(authToken)
        localStorage.setItem("foodfast_token", authToken)

        const user: User = {
          id: response.data._id || response.data.uid,
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone || "098 765 4321",
          role: response.data.role,
          addresses: [
            {
              id: "addr_1",
              name: "Nhà riêng",
              phone: response.data.phone || "098 765 4321",
              address: "123 Nguyễn Huệ",
              district: "Quận 1",
              city: "Hồ Chí Minh",
              isDefault: true,
            },
          ],
        }

        setUser(user)
        setToken(authToken)
        
        console.log('Login - User and token set successfully');
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
      
      console.log('Signup response:', response);
      
      if (response.success && response.data) {
        // Token is inside response.data, not response.token
        const authToken = response.data.token
        
        console.log('Signup - authToken:', authToken ? 'exists' : 'null');
        
        saveAuthToken(authToken)
        localStorage.setItem("foodfast_token", authToken)

        const user: User = {
          id: response.data._id || response.data.uid,
          name: response.data.name,
          email: response.data.email,
          phone,
          role: response.data.role,
          addresses: [],
        }

        setUser(user)
        setToken(authToken)
        localStorage.setItem("foodfast_user", JSON.stringify(user))
        
        console.log('Signup - User and token set successfully');
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
    setToken(null)
    localStorage.removeItem("foodfast_user")
    localStorage.removeItem("foodfast_token")
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
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout, updateProfile, addAddress, removeAddress }}>
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
