import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';

interface UserSocket {
  userId: string;
  role: string;
  restaurantId?: string;
}

export const setupWebSocket = (httpServer: HTTPServer) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        process.env.CLIENT_URL || '',
        process.env.RESTAURANT_URL || '',
      ],
      credentials: true,
    },
  });

  // Store connected users by role and ID
  const connectedUsers = new Map<string, UserSocket>();

  // Authentication middleware - optional for development
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    const restaurantId = socket.handshake.auth.restaurantId;
    
    console.log('[WebSocket Auth] Connection attempt:', { 
      hasToken: !!token, 
      restaurantId: restaurantId || 'N/A' 
    });
    
    if (!token) {
      console.warn('[WebSocket Auth] No token provided, allowing anonymous connection');
      // Allow connection without auth for debugging
      (socket as any).userId = 'anonymous';
      (socket as any).role = 'restaurant_owner'; // Default for now
      (socket as any).restaurantId = restaurantId;
      return next();
    }

    try {
      const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
      console.log('[WebSocket Auth] Verifying token...');
      
      const decoded = jwt.verify(token, jwtSecret) as any;
      console.log('[WebSocket Auth] Token decoded successfully:', { 
        userId: decoded._id || decoded.id, 
        role: decoded.role,
        restaurantId: restaurantId 
      });
      
      (socket as any).userId = decoded._id || decoded.id;
      (socket as any).role = decoded.role;
      (socket as any).restaurantId = restaurantId;
      next();
    } catch (err: any) {
      console.error('[WebSocket Auth] Token verification failed:', err.message);
      // Allow connection anyway for debugging, but log the error
      console.warn('[WebSocket Auth] Allowing connection despite invalid token (development mode)');
      (socket as any).userId = 'anonymous';
      (socket as any).role = 'restaurant_owner';
      (socket as any).restaurantId = restaurantId;
      next();
    }
  });

  io.on('connection', (socket) => {
    const userId = (socket as any).userId;
    const role = (socket as any).role;
    const restaurantId = (socket as any).restaurantId;

    console.log(`User connected: ${userId}, Role: ${role}, RestaurantId: ${restaurantId || 'N/A'}`);

    // Store connection info
    connectedUsers.set(socket.id, { userId, role, restaurantId });

    // Join room based on role
    if (role === 'restaurant_owner' && restaurantId) {
      socket.join(`restaurant:${restaurantId}`);
      console.log(`Restaurant ${restaurantId} joined room`);
    } else if (role === 'customer') {
      socket.join(`customer:${userId}`);
      console.log(`Customer ${userId} joined room`);
    }

    // Handle order updates from restaurant
    socket.on('order:update', (data) => {
      const { orderId, status, customerId } = data;
      console.log(`Order update: ${orderId}, Status: ${status}, Customer: ${customerId}`);
      
      // Notify the customer about order update
      io.to(`customer:${customerId}`).emit('order:updated', {
        orderId,
        status,
        timestamp: new Date(),
      });

      // Notify all restaurants (for dashboard updates)
      if (restaurantId) {
        io.to(`restaurant:${restaurantId}`).emit('order:updated', {
          orderId,
          status,
          timestamp: new Date(),
        });
      }
    });

    // Handle new order from customer
    socket.on('order:new', (data) => {
      const { order, restaurantId: targetRestaurantId } = data;
      console.log(`New order for restaurant: ${targetRestaurantId}`);
      
      // Notify the restaurant about new order
      io.to(`restaurant:${targetRestaurantId}`).emit('order:new', {
        order,
        timestamp: new Date(),
      });
    });

    // Handle order cancellation
    socket.on('order:cancel', (data) => {
      const { orderId, restaurantId: targetRestaurantId, customerId } = data;
      console.log(`Order cancelled: ${orderId}`);
      
      // Notify restaurant
      io.to(`restaurant:${targetRestaurantId}`).emit('order:cancelled', {
        orderId,
        timestamp: new Date(),
      });

      // Notify customer
      io.to(`customer:${customerId}`).emit('order:cancelled', {
        orderId,
        timestamp: new Date(),
      });
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${userId}`);
      connectedUsers.delete(socket.id);
    });
  });

  return io;
};
