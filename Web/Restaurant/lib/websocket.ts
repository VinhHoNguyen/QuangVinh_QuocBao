"use client"

import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './auth-context';
import { toast } from '@/hooks/use-toast';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

export const useWebSocket = () => {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('restaurant_token');
    
    if (!token || !user) {
      return;
    }

    // Connect to WebSocket server
    const socket = io(SOCKET_URL, {
      auth: {
        token,
      },
    });

    socket.on('connect', () => {
      console.log('✅ WebSocket connected (Restaurant)');
    });

    socket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected (Restaurant)');
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    // Listen for new orders
    socket.on('order:new', (data) => {
      console.log('🎉 New order received:', data);
      toast({
        title: '🎉 Đơn hàng mới!',
        description: 'Bạn có đơn hàng mới cần xử lý',
      });
      
      // Play notification sound (optional)
      try {
        const audio = new Audio('/notification.mp3');
        audio.play().catch(console.error);
      } catch (err) {
        console.error('Cannot play notification sound:', err);
      }
      
      // Trigger custom event for order refresh
      window.dispatchEvent(new CustomEvent('order:refresh'));
    });

    // Listen for order updates
    socket.on('order:updated', (data) => {
      console.log('📦 Order updated:', data);
      
      // Trigger custom event for order refresh
      window.dispatchEvent(new CustomEvent('order:refresh'));
    });

    // Listen for order cancellation
    socket.on('order:cancelled', (data) => {
      console.log('🚫 Order cancelled:', data);
      toast({
        title: 'Đơn hàng đã bị hủy',
        description: `Đơn hàng ${data.orderId} đã bị khách hàng hủy`,
        variant: 'destructive',
      });
      
      // Trigger custom event for order refresh
      window.dispatchEvent(new CustomEvent('order:refresh'));
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const updateOrderStatus = useCallback((orderId: string, status: string, customerId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('order:update', {
        orderId,
        status,
        customerId,
      });
    }
  }, []);

  return {
    socket: socketRef.current,
    updateOrderStatus,
  };
};
