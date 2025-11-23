"use client"

import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './auth-context';
import { toast } from '@/hooks/use-toast';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

export const useWebSocket = () => {
  const { token, user } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
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
      console.log('✅ WebSocket connected');
    });

    socket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    // Listen for order updates
    socket.on('order:updated', (data) => {
      console.log('📦 Order updated:', data);
      toast({
        title: 'Cập nhật đơn hàng',
        description: `Đơn hàng ${data.orderId} đã được cập nhật`,
      });
      
      // Trigger custom event for order refresh
      window.dispatchEvent(new CustomEvent('order:refresh'));
    });

    // Listen for order cancellation
    socket.on('order:cancelled', (data) => {
      console.log('🚫 Order cancelled:', data);
      toast({
        title: 'Đơn hàng đã bị hủy',
        description: `Đơn hàng ${data.orderId} đã bị hủy`,
        variant: 'destructive',
      });
      
      // Trigger custom event for order refresh
      window.dispatchEvent(new CustomEvent('order:refresh'));
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [token, user]);

  const notifyNewOrder = useCallback((orderId: string, restaurantId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('order:new', {
        order: { _id: orderId },
        restaurantId,
      });
    }
  }, []);

  const cancelOrder = useCallback((orderId: string, restaurantId: string, customerId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('order:cancel', {
        orderId,
        restaurantId,
        customerId,
      });
    }
  }, []);

  return {
    socket: socketRef.current,
    notifyNewOrder,
    cancelOrder,
  };
};
