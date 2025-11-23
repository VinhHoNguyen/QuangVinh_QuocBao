import type { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../models/constants';
import DeliveryModel from '../models/Delivery';
import DroneModel from '../models/Drone';
import LocationModel from '../models/Location';

// Get all deliveries
export const getAllDeliveries = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, droneId, orderId } = req.query;

    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (droneId) {
      filter.droneId = droneId;
    }

    if (orderId) {
      filter.orderId = orderId;
    }

    const deliveries = await DeliveryModel.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: deliveries,
    });
  } catch (error) {
    next(error);
  }
};

// Get delivery by ID
export const getDeliveryById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const delivery = await DeliveryModel.findById(id);

    if (!delivery) {
      throw new AppError('Delivery not found', 404);
    }

    res.status(200).json({
      success: true,
      data: delivery,
    });
  } catch (error) {
    next(error);
  }
};

// Track delivery by order ID
export const trackDelivery = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.params;

    const delivery = await DeliveryModel.findOne({ orderId });

    if (!delivery) {
      throw new AppError('Delivery not found for this order', 404);
    }

    // Get drone info
    const drone = await DroneModel.findById(delivery.droneId);

    // Get location info
    const location = await LocationModel.findById(delivery.dropoffLocationId);

    res.status(200).json({
      success: true,
      data: {
        ...delivery.toObject(),
        drone: drone ? drone.toObject() : null,
        dropoffLocation: location ? location.toObject() : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update delivery status
export const updateDeliveryStatus = async (
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

    const delivery = await DeliveryModel.findById(id);

    if (!delivery) {
      throw new AppError('Delivery not found', 404);
    }

    delivery.status = status;

    // If delivered, set actual time
    if (status === 'delivered') {
      delivery.actualTime = new Date();
    }

    await delivery.save();

    res.status(200).json({
      success: true,
      message: SUCCESS_MESSAGES.UPDATED,
    });
  } catch (error) {
    next(error);
  }
};
