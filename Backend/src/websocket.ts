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

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
      (socket as any).userId = decoded._id || decoded.id;
      (socket as any).role = decoded.role;
      (socket as any).restaurantId = socket.handshake.auth.restaurantId;
      next();
    } catch (err) {
      console.error('WebSocket auth error:', err);
      next(new Error('Authentication error'));
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
