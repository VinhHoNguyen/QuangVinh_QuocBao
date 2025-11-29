import type { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../models/constants';
import DeliveryModel from '../models/Delivery';
import DroneModel, { DroneStatus } from '../models/Drone';
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

    // Get pickup location info (restaurant)
    const pickupLocation = await LocationModel.findById(delivery.pickupLocationId);

    // Get dropoff location info (customer)
    const dropoffLocation = await LocationModel.findById(delivery.dropoffLocationId);

    res.status(200).json({
      success: true,
      data: {
        ...delivery.toObject(),
        drone: drone ? drone.toObject() : null,
        pickupLocation: pickupLocation ? pickupLocation.toObject() : null,
        dropoffLocation: dropoffLocation ? dropoffLocation.toObject() : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Assign drone to delivery (Admin only)
export const assignDroneToDelivery = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    const { deliveryId } = req.params;
    const { droneId } = req.body;

    if (!droneId) {
      throw new AppError('Drone ID is required', 400);
    }

    // Validate drone exists and is available
    const drone = await DroneModel.findById(droneId);
    if (!drone) {
      throw new AppError('Drone not found', 404);
    }
    if (drone.status !== DroneStatus.AVAILABLE) {
      throw new AppError('Drone is not available', 400);
    }

    // Find and update delivery
    const delivery = await DeliveryModel.findById(deliveryId);
    if (!delivery) {
      throw new AppError('Delivery not found', 404);
    }

    // If there was a previously assigned drone, free it up
    if (delivery.droneId) {
      const oldDrone = await DroneModel.findById(delivery.droneId);
      if (oldDrone) {
        oldDrone.status = DroneStatus.AVAILABLE;
        await oldDrone.save();
      }
    }

    // Assign new drone
    delivery.droneId = drone._id as any;
    await delivery.save();

    // Update drone status to in_transit (assigned to delivery)
    // Set drone's current location to pickup location (restaurant)
    drone.status = DroneStatus.IN_TRANSIT;
    drone.currentLocationId = delivery.pickupLocationId;
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

    console.log('📦 [updateDeliveryStatus] Called with:', { deliveryId: id, newStatus: status, statusType: typeof status });

    const delivery = await DeliveryModel.findById(id);

    if (!delivery) {
      throw new AppError('Delivery not found', 404);
    }

    console.log('📦 [updateDeliveryStatus] Current delivery:', { 
      id: delivery._id, 
      orderId: delivery.orderId,
      droneId: delivery.droneId,
      currentStatus: delivery.status 
    });

    delivery.status = status;

    // If delivered, set actual time and free up the drone
    console.log('🔍 [updateDeliveryStatus] Checking if status is delivered:', { status, isDelivered: status === 'delivered' });
    
    if (status === 'delivered') {
      console.log('✅ [updateDeliveryStatus] Status is DELIVERED - freeing up drone:', delivery.droneId);
      delivery.actualTime = new Date();

      // Free up the drone - set status back to available
      if (delivery.droneId) {
        console.log('🚁 [updateDeliveryStatus] Found droneId, looking up drone...');
        const drone = await DroneModel.findById(delivery.droneId);
        if (drone) {
          console.log('🚁 [updateDeliveryStatus] Drone status BEFORE:', drone.status);
          drone.status = DroneStatus.AVAILABLE;
          await drone.save();
          console.log('🚁 [updateDeliveryStatus] Drone status AFTER:', drone.status);
        } else {
          console.log('❌ [updateDeliveryStatus] Drone not found!');
        }
      } else {
        console.log('⚠️ [updateDeliveryStatus] No droneId in delivery');
      }
    } else {
      console.log('⏭️ [updateDeliveryStatus] Status is NOT delivered, skipping drone update');
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
