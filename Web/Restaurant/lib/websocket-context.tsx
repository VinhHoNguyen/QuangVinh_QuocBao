"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from './auth-context'

interface WebSocketContextType {
  socket: Socket | null
  isConnected: boolean
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
})

export const useWebSocket = () => useContext(WebSocketContext)

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const { token, restaurantId } = useAuth()

  useEffect(() => {
    // Only connect if we have a token and restaurantId
    if (!token || !restaurantId) {
      console.log('[Restaurant WebSocket] No token or restaurantId, skipping connection', { token: !!token, restaurantId })
      return
    }

    console.log('[Restaurant WebSocket] Connecting to:', SOCKET_URL)
    console.log('[Restaurant WebSocket] Auth data:', { hasToken: !!token, restaurantId })

    // Create socket connection with auth
    const newSocket = io(SOCKET_URL, {
      auth: {
        token,
        restaurantId,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    newSocket.on('connect', () => {
      console.log('[Restaurant WebSocket] Connected:', newSocket.id)
      setIsConnected(true)

      // Join restaurant room
      newSocket.emit('restaurant:join', restaurantId)
      console.log('[Restaurant WebSocket] Joined restaurant room:', restaurantId)
    })

    newSocket.on('disconnect', (reason) => {
      console.log('[Restaurant WebSocket] Disconnected:', reason)
      setIsConnected(false)
    })

    newSocket.on('connect_error', (error) => {
      console.error('[Restaurant WebSocket] Connection error:', error)
      setIsConnected(false)
    })

    newSocket.on('error', (error) => {
      console.error('[Restaurant WebSocket] Error:', error)
    })

    // Listen for order events
    newSocket.on('order:new', (order) => {
      console.log('[Restaurant WebSocket] New order received:', order)
    })

    newSocket.on('order:updated', (order) => {
      console.log('[Restaurant WebSocket] Order updated:', order)
    })

    setSocket(newSocket)

    // Cleanup
    return () => {
      console.log('[Restaurant WebSocket] Cleaning up connection')
      newSocket.emit('restaurant:leave', restaurantId)
      newSocket.disconnect()
    }
  }, [token, restaurantId])

  return (
    <WebSocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  )
}
