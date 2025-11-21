import type { Response, NextFunction } from 'express';
import { db } from '../config/firebase';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { Delivery } from '../models/types';
import { COLLECTIONS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../models/constants';

// Get all deliveries
export const getAllDeliveries = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, droneId, orderId } = req.query;

    let query = db.collection(COLLECTIONS.DELIVERIES);

    if (status) {
      query = query.where('status', '==', status) as any;
    }

    if (droneId) {
      query = query.where('droneId', '==', droneId) as any;
    }

    if (orderId) {
      query = query.where('orderId', '==', orderId) as any;
    }

    const deliveriesSnapshot = await query.orderBy('createdAt', 'desc').get();

    const deliveries = deliveriesSnapshot.docs.map((doc) => ({
      _id: doc.id,
      ...doc.data(),
    }));

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

    const deliveryDoc = await db.collection(COLLECTIONS.DELIVERIES).doc(id).get();

    if (!deliveryDoc.exists) {
      throw new AppError('Delivery not found', 404);
    }

    res.status(200).json({
      success: true,
      data: {
        _id: deliveryDoc.id,
        ...deliveryDoc.data(),
      },
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

    const deliverySnapshot = await db
      .collection(COLLECTIONS.DELIVERIES)
      .where('orderId', '==', orderId)
      .get();

    if (deliverySnapshot.empty) {
      throw new AppError('Delivery not found for this order', 404);
    }

    const deliveryDoc = deliverySnapshot.docs[0];
    const delivery = deliveryDoc.data() as Delivery;

    // Get drone info
    const droneDoc = await db.collection(COLLECTIONS.DRONES).doc(delivery.droneId).get();

    // Get location info
    const locationDoc = await db
      .collection(COLLECTIONS.LOCATIONS)
      .doc(delivery.dropoffLocationId)
      .get();

    res.status(200).json({
      success: true,
      data: {
        ...delivery,
        _id: deliveryDoc.id,
        drone: droneDoc.exists ? { _id: droneDoc.id, ...droneDoc.data() } : null,
        dropoffLocation: locationDoc.exists
          ? { _id: locationDoc.id, ...locationDoc.data() }
          : null,
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

    const deliveryDoc = await db.collection(COLLECTIONS.DELIVERIES).doc(id).get();

    if (!deliveryDoc.exists) {
      throw new AppError('Delivery not found', 404);
    }

    const updates: any = {
      status,
      updatedAt: new Date(),
    };

    // If delivered, set actual time
    if (status === 'delivered') {
      updates.actualTime = new Date();
    }

    await db.collection(COLLECTIONS.DELIVERIES).doc(id).update(updates);

    res.status(200).json({
      success: true,
      message: SUCCESS_MESSAGES.UPDATED,
    });
  } catch (error) {
    next(error);
  }
};
