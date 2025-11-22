import type { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { DroneStatus } from '../models/types';
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  DEFAULT_DRONE_BATTERY,
  DEFAULT_DRONE_CURRENT_LOAD,
} from '../models/constants';
import Drone from '../models/Drone';

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

    const { code, name, capacity } = req.body;
    const { currentLocationId } = req.body;

    const newDrone = await Drone.create({
      code,
      name,
      status: DroneStatus.AVAILABLE,
      battery: DEFAULT_DRONE_BATTERY,
      capacity,
      currentLoad: DEFAULT_DRONE_CURRENT_LOAD,
      currentLocationId,
    });

    res.status(201).json({
      success: true,
      message: SUCCESS_MESSAGES.CREATED,
      data: newDrone,
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
    const { status } = req.query;

    let query: any = {};
    if (status) {
      query.status = status;
    }

    const drones = await Drone.find(query).populate('currentLocationId');

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

    const drone = await Drone.findById(id).populate('currentLocationId');

    if (!drone) {
      throw new AppError('Drone not found', 404);
    }

    res.status(200).json({
      success: true,
      data: drone,
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
    const drones = await Drone.find({ status: DroneStatus.AVAILABLE }).populate('currentLocationId');

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

    const drone = await Drone.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );

    if (!drone) {
      throw new AppError('Drone not found', 404);
    }

    res.status(200).json({
      success: true,
      message: SUCCESS_MESSAGES.UPDATED,
      data: drone,
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

    const drone = await Drone.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!drone) {
      throw new AppError('Drone not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Drone status updated successfully',
      data: drone,
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

    const drone = await Drone.findByIdAndDelete(id);

    if (!drone) {
      throw new AppError('Drone not found', 404);
    }

    res.status(200).json({
      success: true,
      message: SUCCESS_MESSAGES.DELETED,
    });
  } catch (error) {
    next(error);
  }
};
