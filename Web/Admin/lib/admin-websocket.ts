"use client"

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAdminAuth } from './admin-auth-context';
import { toast } from 'sonner';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

export function useAdminWebSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, isAuthenticated } = useAdminAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const token = localStorage.getItem('admin_token');
    if (!token) return;

    // Connect to WebSocket
    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('🔌 Admin WebSocket connected:', socket.id);
      setIsConnected(true);
      
      // Join admin room
      socket.emit('join', `admin:${user._id}`);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Admin WebSocket disconnected');
      setIsConnected(false);
    });

    // Listen for new orders
    socket.on('order:new', (data: any) => {
      console.log('📦 New order received:', data);
      toast.success(`Đơn hàng mới #${data.orderId}`, {
        description: `Từ ${data.restaurantName || 'nhà hàng'}`,
      });
      // Trigger refresh event
      window.dispatchEvent(new CustomEvent('admin:order:refresh'));
    });

    // Listen for order updates
    socket.on('order:update', (data: any) => {
      console.log('🔄 Order updated:', data);
      toast.info(`Đơn hàng #${data.orderId} đã cập nhật`, {
        description: `Trạng thái: ${getStatusText(data.status)}`,
      });
      // Trigger refresh event
      window.dispatchEvent(new CustomEvent('admin:order:refresh'));
    });

    // Listen for order cancellations
    socket.on('order:cancel', (data: any) => {
      console.log('❌ Order cancelled:', data);
      toast.error(`Đơn hàng #${data.orderId} đã hủy`, {
        description: data.reason || 'Khách hàng đã hủy đơn',
      });
      // Trigger refresh event
      window.dispatchEvent(new CustomEvent('admin:order:refresh'));
    });

    // Listen for restaurant updates
    socket.on('restaurant:update', (data: any) => {
      console.log('🏪 Restaurant updated:', data);
      // Trigger refresh event
      window.dispatchEvent(new CustomEvent('admin:restaurant:refresh'));
    });

    // Listen for drone status changes
    socket.on('drone:status', (data: any) => {
      console.log('🚁 Drone status changed:', data);
      // Trigger refresh event
      window.dispatchEvent(new CustomEvent('admin:drone:refresh'));
    });

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, user]);

  // Helper to emit events
  const emit = (event: string, data: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn('⚠️ Socket not connected, cannot emit:', event);
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    emit,
  };
}

// Helper function to translate status
function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    preparing: 'Đang chuẩn bị',
    ready: 'Sẵn sàng',
    delivering: 'Đang giao',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy',
  };
  return statusMap[status] || status;
}
