import type { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import {
  OrderStatus,
  PaymentStatus,
  CreateOrderRequest,
  LocationType,
} from '../models/types';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../models/constants';
import OrderModel from '../models/Order';
import ProductModel from '../models/Product';
import RestaurantModel from '../models/Restaurant';
import DeliveryModel, { DeliveryStatus } from '../models/Delivery';
import DroneModel, { DroneStatus } from '../models/Drone';
import LocationModel from '../models/Location';

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
    const restaurant = await RestaurantModel.findById(restaurantId);
    if (!restaurant) {
      throw new AppError(ERROR_MESSAGES.RESTAURANT_NOT_FOUND, 404);
    }

    // Calculate order items and total
    const orderItems: any[] = [];
    let totalPrice = 0;

    for (const item of items) {
      const product = await ProductModel.findById(item.productId);

      if (!product) {
        throw new AppError(`Product ${item.productId} not found`, 404);
      }

      if (!product.available) {
        throw new AppError(`Product ${product.name} is not available`, 400);
      }

      const orderItem = {
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
      };

      orderItems.push(orderItem);
      totalPrice += product.price * item.quantity;
    }

    // Create order
    const newOrder = await OrderModel.create({
      userId: req.user._id,
      restaurantId,
      items: orderItems,
      totalPrice,
      status: OrderStatus.PENDING,
      paymentMethod,
      paymentStatus: PaymentStatus.COMPLETED,
      shippingAddress,
    });

    // Create delivery location
    const deliveryLocation = await LocationModel.create({
      type: LocationType.CUSTOMER,
      coords: shippingAddress.coordinates,
      address: `${shippingAddress.street}, ${shippingAddress.ward}, ${shippingAddress.district}, ${shippingAddress.city}`,
    });

    // Get restaurant location or create a default one
    let restaurantLocation = await LocationModel.findOne({
      type: LocationType.RESTAURANT,
      address: restaurant.address
    });

    // If restaurant location doesn't exist, create one with default coordinates
    if (!restaurantLocation) {
      restaurantLocation = await LocationModel.create({
        type: LocationType.RESTAURANT,
        coords: { latitude: 10.762622, longitude: 106.660172 }, // Default Saigon coordinates
        address: restaurant.address,
      });
    }

    // Create delivery record WITHOUT auto-assigning drone
    // Admin will assign drone later from assignment page
    const deliveryData: any = {
      orderId: newOrder._id,
      pickupLocationId: restaurantLocation._id,
      dropoffLocationId: deliveryLocation._id,
      status: DeliveryStatus.ASSIGNED, // Will be updated when drone picks up
      estimatedTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    };

    await DeliveryModel.create(deliveryData);

    res.status(201).json({
      success: true,
      message: SUCCESS_MESSAGES.CREATED,
      data: newOrder,
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

    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (userId) {
      filter.userId = userId;
    }

    if (restaurantId) {
      filter.restaurantId = restaurantId;
    }

    const orders = await OrderModel.find(filter)
      .populate('userId', 'name email phone')
      .populate({
        path: 'restaurantId',
        select: 'name address locationId',
        populate: {
          path: 'locationId',
          select: 'coords address'
        }
      })
      .sort({ createdAt: -1 });

    // Transform orders to ensure productName is available
    const transformedOrders = await Promise.all(orders.map(async (order) => {
      const orderObj = order.toObject();

      orderObj.items = await Promise.all(orderObj.items.map(async (item: any) => {
        if (!item.productName && item.productId) {
          try {
            const product = await ProductModel.findById(item.productId).select('name');
            return {
              ...item,
              productName: product?.name || 'Sản phẩm không xác định'
            };
          } catch (err) {
            return {
              ...item,
              productName: 'Sản phẩm không xác định'
            };
          }
        }
        return {
          ...item,
          productName: item.productName || 'Sản phẩm không xác định'
        };
      }));

      return orderObj;
    }));

    res.status(200).json({
      success: true,
      data: transformedOrders,
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

    const order = await OrderModel.findById(id)
      .populate('userId', 'name email phone')
      .populate({
        path: 'restaurantId',
        select: 'name address locationId',
        populate: {
          path: 'locationId',
          select: 'coords address'
        }
      });

    if (!order) {
      throw new AppError(ERROR_MESSAGES.ORDER_NOT_FOUND, 404);
    }

    res.status(200).json({
      success: true,
      data: order,
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

    const orders = await OrderModel.find({ userId: req.user._id })
      .populate('userId', 'name email phone')
      .populate({
        path: 'restaurantId',
        select: 'name address locationId',
        populate: {
          path: 'locationId',
          select: 'coords address'
        }
      })
      .sort({ createdAt: -1 });

    // Transform orders to ensure productName is available
    const transformedOrders = await Promise.all(orders.map(async (order) => {
      const orderObj = order.toObject();

      orderObj.items = await Promise.all(orderObj.items.map(async (item: any) => {
        if (!item.productName && item.productId) {
          try {
            const product = await ProductModel.findById(item.productId).select('name');
            return {
              ...item,
              productName: product?.name || 'Sản phẩm không xác định'
            };
          } catch (err) {
            return {
              ...item,
              productName: 'Sản phẩm không xác định'
            };
          }
        }
        return {
          ...item,
          productName: item.productName || 'Sản phẩm không xác định'
        };
      }));

      return orderObj;
    }));

    res.status(200).json({
      success: true,
      data: transformedOrders,
    });
  } catch (error) {
    next(error);
  }
};

// Assign drone to delivery
export const assignDroneToDelivery = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    const { orderId, droneId } = req.body;

    const delivery = await DeliveryModel.findOne({ orderId });
    if (!delivery) {
      throw new AppError('Delivery not found', 404);
    }

    const drone = await DroneModel.findById(droneId);
    if (!drone) {
      throw new AppError('Drone not found', 404);
    }

    if (drone.status !== DroneStatus.AVAILABLE) {
      throw new AppError('Drone is not available', 400);
    }

    delivery.droneId = droneId;
    delivery.status = DeliveryStatus.ASSIGNED;
    await delivery.save();

    drone.status = DroneStatus.IN_TRANSIT;
    await drone.save();

    res.status(200).json({
      success: true,
      message: 'Drone assigned successfully',
      data: delivery,
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

    const order = await OrderModel.findById(id);

    if (!order) {
      throw new AppError(ERROR_MESSAGES.ORDER_NOT_FOUND, 404);
    }

    // 🚁 Check if drone is assigned before allowing "delivering" status
    if (status === OrderStatus.DELIVERING) {
      const delivery = await DeliveryModel.findOne({ orderId: id });
      if (!delivery) {
        throw new AppError('Delivery record not found', 404);
      }
      if (!delivery.droneId) {
        throw new AppError('Vui lòng gán drone trước khi bắt đầu giao hàng (Assign Drone first)', 400);
      }
    }

    order.status = status;
    await order.save();

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
    const { reason } = req.body;

    const order = await OrderModel.findById(id);

    if (!order) {
      throw new AppError(ERROR_MESSAGES.ORDER_NOT_FOUND, 404);
    }

    // Only allow cancellation if order is still pending or confirmed
    if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.CONFIRMED) {
      throw new AppError('Cannot cancel order at this stage', 400);
    }

    order.status = OrderStatus.CANCELLED;
    if (reason) {
      order.notes = `Cancelled: ${reason}. ${order.notes || ''}`;
    }
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// Get restaurant orders
export const getRestaurantOrders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params; // restaurantId

    const orders = await OrderModel.find({ restaurantId: id })
      .populate('userId', 'name email phone')
      .populate({
        path: 'restaurantId',
        select: 'name address locationId',
        populate: {
          path: 'locationId',
          select: 'coords address'
        }
      })
      .sort({ createdAt: -1 });

    // Transform orders to ensure productName is available
    const transformedOrders = await Promise.all(orders.map(async (order) => {
      const orderObj = order.toObject();

      // For each item, if productName is missing, fetch it from Product collection
      orderObj.items = await Promise.all(orderObj.items.map(async (item: any) => {
        if (!item.productName && item.productId) {
          try {
            const product = await ProductModel.findById(item.productId).select('name');
            return {
              ...item,
              productName: product?.name || 'Sản phẩm không xác định'
            };
          } catch (err) {
            return {
              ...item,
              productName: 'Sản phẩm không xác định'
            };
          }
        }
        return {
          ...item,
          productName: item.productName || 'Sản phẩm không xác định'
        };
      }));

      return orderObj;
    }));

    res.status(200).json({
      success: true,
      data: transformedOrders,
    });
  } catch (error) {
    next(error);
  }
};
