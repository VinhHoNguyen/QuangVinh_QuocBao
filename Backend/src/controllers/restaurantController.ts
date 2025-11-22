import type { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import {
  RestaurantStatus,
  CreateRestaurantRequest,
  LocationType,
} from '../models/types';
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  DEFAULT_RESTAURANT_MIN_ORDER,
  DEFAULT_RESTAURANT_MAX_ORDER,
} from '../models/constants';
import Restaurant from '../models/Restaurant';
import Location from '../models/Location';

// Create restaurant
export const createRestaurant = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    const {
      name,
      phone,
      address,
      image = '',
      minOrder = DEFAULT_RESTAURANT_MIN_ORDER,
      maxOrder = DEFAULT_RESTAURANT_MAX_ORDER,
      location,
    }: CreateRestaurantRequest = req.body;

    // Create location first
    const newLocation = await Location.create({
      type: LocationType.RESTAURANT,
      coords: location,
      address,
    });

    // Create restaurant
    const newRestaurant = await Restaurant.create({
      ownerId: req.user._id,
      name,
      phone,
      address,
      locationId: newLocation._id,
      image,
      imagePublicId: '',
      minOrder,
      maxOrder,
      rating: 0,
      status: RestaurantStatus.PENDING,
    });

    res.status(201).json({
      success: true,
      message: SUCCESS_MESSAGES.CREATED,
      data: newRestaurant,
    });
  } catch (error) {
    next(error);
  }
};

// Get all restaurants
export const getAllRestaurants = async (
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

    const restaurants = await Restaurant.find(query)
      .populate('ownerId', 'name email')
      .populate('locationId')
      .populate('products');

    res.status(200).json({
      success: true,
      data: restaurants,
    });
  } catch (error) {
    console.error('❌ Error in getAllRestaurants:', error);
    next(error);
  }
};

// Get restaurant by ID
export const getRestaurantById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new AppError('Invalid restaurant ID format', 400);
    }

    const restaurant = await Restaurant.findById(id)
      .populate('ownerId', 'name email')
      .populate('locationId')
      .populate('products');

    if (!restaurant) {
      throw new AppError(ERROR_MESSAGES.RESTAURANT_NOT_FOUND, 404);
    }

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};

// Update restaurant
export const updateRestaurant = async (
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

    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      throw new AppError(ERROR_MESSAGES.RESTAURANT_NOT_FOUND, 404);
    }

    // Check if user is owner or admin
    if (restaurant.ownerId.toString() !== req.user._id && req.user.role !== 'admin') {
      throw new AppError(ERROR_MESSAGES.FORBIDDEN, 403);
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: SUCCESS_MESSAGES.UPDATED,
      data: updatedRestaurant,
    });
  } catch (error) {
    next(error);
  }
};

// Delete restaurant
export const deleteRestaurant = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    const { id } = req.params;

    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      throw new AppError(ERROR_MESSAGES.RESTAURANT_NOT_FOUND, 404);
    }

    await Restaurant.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: SUCCESS_MESSAGES.DELETED,
    });
  } catch (error) {
    next(error);
  }
};

// Get restaurants by owner
export const getRestaurantsByOwner = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    const restaurants = await Restaurant.find({ ownerId: req.user._id })
      .populate('locationId')
      .populate('products');

    res.status(200).json({
      success: true,
      data: restaurants,
    });
  } catch (error) {
    next(error);
  }
};
