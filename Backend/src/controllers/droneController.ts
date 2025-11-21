import type { Response, NextFunction } from 'express';
import { db } from '../config/firebase';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { Drone, DroneStatus, CreateDroneRequest, Location } from '../models/types';
import {
  COLLECTIONS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  DEFAULT_DRONE_BATTERY,
  DEFAULT_DRONE_CURRENT_LOAD,
} from '../models/constants';

// Create drone
export const createDrone = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    const { code, name, capacity, restaurantId }: CreateDroneRequest = req.body;

    // Create default location for drone
    const defaultLocation: Omit<Location, '_id'> = {
      type: 'drone_station' as any,
      coords: { latitude: 0, longitude: 0 },
      address: 'Default Station',
    };

    const locationRef = await db.collection(COLLECTIONS.LOCATIONS).add(defaultLocation);

    const newDrone: Omit<Drone, '_id'> = {
      code,
      name,
      restaurantId,
      status: DroneStatus.AVAILABLE,
      battery: DEFAULT_DRONE_BATTERY,
      capacity,
      currentLoad: DEFAULT_DRONE_CURRENT_LOAD,
      currentLocationId: locationRef.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const droneRef = await db.collection(COLLECTIONS.DRONES).add(newDrone);

    res.status(201).json({
      success: true,
      message: SUCCESS_MESSAGES.CREATED,
      data: {
        _id: droneRef.id,
        ...newDrone,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all drones
export const getAllDrones = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, restaurantId } = req.query;

    let query = db.collection(COLLECTIONS.DRONES);

    if (status) {
      query = query.where('status', '==', status) as any;
    }

    if (restaurantId) {
      query = query.where('restaurantId', '==', restaurantId) as any;
    }

    const dronesSnapshot = await query.get();

    const drones = dronesSnapshot.docs.map((doc: any) => ({
      _id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      data: drones,
    });
  } catch (error) {
    next(error);
  }
};

// Get drone by ID
export const getDroneById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const droneDoc = await db.collection(COLLECTIONS.DRONES).doc(id).get();

    if (!droneDoc.exists) {
      throw new AppError('Drone not found', 404);
    }

    res.status(200).json({
      success: true,
      data: {
        _id: droneDoc.id,
        ...droneDoc.data(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get available drones
export const getAvailableDrones = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const dronesSnapshot = await db
      .collection(COLLECTIONS.DRONES)
      .where('status', '==', DroneStatus.AVAILABLE)
      .get();

    const drones = dronesSnapshot.docs.map((doc: any) => ({
      _id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      data: drones,
    });
  } catch (error) {
    next(error);
  }
};

// Update drone
export const updateDrone = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    const { id } = req.params;
    const updates = req.body;

    const droneDoc = await db.collection(COLLECTIONS.DRONES).doc(id).get();

    if (!droneDoc.exists) {
      throw new AppError('Drone not found', 404);
    }

    await db
      .collection(COLLECTIONS.DRONES)
      .doc(id)
      .update({
        ...updates,
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

// Update drone status
export const updateDroneStatus = async (
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

    const droneDoc = await db.collection(COLLECTIONS.DRONES).doc(id).get();

    if (!droneDoc.exists) {
      throw new AppError('Drone not found', 404);
    }

    await db.collection(COLLECTIONS.DRONES).doc(id).update({
      status,
      updatedAt: new Date(),
    });

    res.status(200).json({
      success: true,
      message: 'Drone status updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Delete drone
export const deleteDrone = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    const { id } = req.params;

    const droneDoc = await db.collection(COLLECTIONS.DRONES).doc(id).get();

    if (!droneDoc.exists) {
      throw new AppError('Drone not found', 404);
    }

    await db.collection(COLLECTIONS.DRONES).doc(id).delete();

    res.status(200).json({
      success: true,
      message: SUCCESS_MESSAGES.DELETED,
    });
  } catch (error) {
    next(error);
  }
};
