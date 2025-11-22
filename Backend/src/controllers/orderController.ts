import type { Response, NextFunction } from 'express';
import { db } from '../config/firebase';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import {
  Order,
  OrderStatus,
  PaymentStatus,
  CreateOrderRequest,
  OrderItem,
  Product,
  Delivery,
  DeliveryStatus,
  DroneStatus,
  Location,
  LocationType,
} from '../models/types';
import { COLLECTIONS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../models/constants';

// Create order
export const createOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    const {
      restaurantId,
      items,
      paymentMethod,
      shippingAddress,
    }: CreateOrderRequest = req.body;

    // Verify restaurant exists
    const restaurantDoc = await db.collection(COLLECTIONS.RESTAURANTS).doc(restaurantId).get();
    if (!restaurantDoc.exists) {
      throw new AppError(ERROR_MESSAGES.RESTAURANT_NOT_FOUND, 404);
    }

    // Calculate order items and total
    const orderItems: OrderItem[] = [];
    let totalPrice = 0;

    for (const item of items) {
      const productDoc = await db.collection(COLLECTIONS.PRODUCTS).doc(item.productId).get();

      if (!productDoc.exists) {
        throw new AppError(`Product ${item.productId} not found`, 404);
      }

      const product = productDoc.data() as Product;

      if (!product.available) {
        throw new AppError(`Product ${product.name} is not available`, 400);
      }

      const orderItem: OrderItem = {
        _id: item.productId,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
      };

      orderItems.push(orderItem);
      totalPrice += product.price * item.quantity;
    }

    // Create order
    const newOrder: Omit<Order, '_id'> = {
      userId: req.user._id,
      restaurantId,
      items: orderItems,
      totalPrice,
      status: OrderStatus.PENDING,
      paymentMethod,
      paymentStatus: PaymentStatus.PENDING,
      shippingAddress,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const orderRef = await db.collection(COLLECTIONS.ORDERS).add(newOrder);

    // Create delivery location
    const deliveryLocation: Omit<Location, '_id'> = {
      type: LocationType.CUSTOMER,
      coords: shippingAddress.coordinates,
      address: `${shippingAddress.street}, ${shippingAddress.ward}, ${shippingAddress.district}, ${shippingAddress.city}`,
    };

    const locationRef = await db.collection(COLLECTIONS.LOCATIONS).add(deliveryLocation);

    // Find available drone
    const availableDroneSnapshot = await db
      .collection(COLLECTIONS.DRONES)
      .where('status', '==', DroneStatus.AVAILABLE)
      .limit(1)
      .get();

    if (!availableDroneSnapshot.empty) {
      const droneDoc = availableDroneSnapshot.docs[0];

      // Create delivery
      const newDelivery: Omit<Delivery, '_id'> = {
        orderId: orderRef.id,
        droneId: droneDoc.id,
        dropoffLocationId: locationRef.id,
        status: DeliveryStatus.ASSIGNED,
        estimatedTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection(COLLECTIONS.DELIVERIES).add(newDelivery);

      // Update drone status
      await db.collection(COLLECTIONS.DRONES).doc(droneDoc.id).update({
        status: DroneStatus.BUSY,
        updatedAt: new Date(),
      });
    }

    res.status(201).json({
      success: true,
      message: SUCCESS_MESSAGES.CREATED,
      data: {
        _id: orderRef.id,
        ...newOrder,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all orders
export const getAllOrders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, userId, restaurantId } = req.query;

    let query = db.collection(COLLECTIONS.ORDERS);

    if (status) {
      query = query.where('status', '==', status) as any;
    }

    if (userId) {
      query = query.where('userId', '==', userId) as any;
    }

    if (restaurantId) {
      query = query.where('restaurantId', '==', restaurantId) as any;
    }

    const ordersSnapshot = await query.orderBy('createdAt', 'desc').get();

    const orders = ordersSnapshot.docs.map((doc) => ({
      _id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// Get order by ID
export const getOrderById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const orderDoc = await db.collection(COLLECTIONS.ORDERS).doc(id).get();

    if (!orderDoc.exists) {
      throw new AppError(ERROR_MESSAGES.ORDER_NOT_FOUND, 404);
    }

    res.status(200).json({
      success: true,
      data: {
        _id: orderDoc.id,
        ...orderDoc.data(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get user orders
export const getUserOrders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    const ordersSnapshot = await db
      .collection(COLLECTIONS.ORDERS)
      .where('userId', '==', req.user._id)
      .orderBy('createdAt', 'desc')
      .get();

    const orders = ordersSnapshot.docs.map((doc: any) => ({
      _id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// Update order status
export const updateOrderStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    const { id } = req.params;
    const { status } = req.body;

    const orderDoc = await db.collection(COLLECTIONS.ORDERS).doc(id).get();

    if (!orderDoc.exists) {
      throw new AppError(ERROR_MESSAGES.ORDER_NOT_FOUND, 404);
    }

    await db.collection(COLLECTIONS.ORDERS).doc(id).update({
      status,
      updatedAt: new Date(),
    });

    res.status(200).json({
      success: true,
      message: SUCCESS_MESSAGES.UPDATED,
    });
  } catch (error) {
    next(error);
  }
};

// Cancel order
export const cancelOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    const { id } = req.params;

    const orderDoc = await db.collection(COLLECTIONS.ORDERS).doc(id).get();

    if (!orderDoc.exists) {
      throw new AppError(ERROR_MESSAGES.ORDER_NOT_FOUND, 404);
    }

    const order = orderDoc.data() as Order;

    // Only allow cancellation if order is still pending
    if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.CONFIRMED) {
      throw new AppError('Cannot cancel order at this stage', 400);
    }

    await db.collection(COLLECTIONS.ORDERS).doc(id).update({
      status: OrderStatus.CANCELLED,
      updatedAt: new Date(),
    });

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
    });
  } catch (error) {
    next(error);
  }
};
