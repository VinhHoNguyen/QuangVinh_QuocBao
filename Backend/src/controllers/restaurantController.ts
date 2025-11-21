import type { Response, NextFunction } from 'express';
import { db } from '../config/firebase';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import {
  Restaurant,
  RestaurantStatus,
  CreateRestaurantRequest,
  Location,
  LocationType,
} from '../models/types';
import {
  COLLECTIONS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  DEFAULT_RESTAURANT_MIN_ORDER,
  DEFAULT_RESTAURANT_MAX_ORDER,
} from '../models/constants';

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
    const locationData: Omit<Location, '_id'> = {
      type: LocationType.RESTAURANT,
      coords: location,
      address,
    };

    const locationRef = await db.collection(COLLECTIONS.LOCATIONS).add(locationData);

    // Create restaurant
    const newRestaurant: Omit<Restaurant, '_id'> = {
      ownerId: req.user.uid,
      name,
      phone,
      address,
      locationId: locationRef.id,
      image,
      imagePublicId: '',
      minOrder,
      maxOrder,
      rating: 0,
      status: RestaurantStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const restaurantRef = await db.collection(COLLECTIONS.RESTAURANTS).add(newRestaurant);

    res.status(201).json({
      success: true,
      message: SUCCESS_MESSAGES.CREATED,
      data: {
        _id: restaurantRef.id,
        ...newRestaurant,
      },
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

    let query = db.collection(COLLECTIONS.RESTAURANTS);

    if (status) {
      query = query.where('status', '==', status) as any;
    }

    const restaurantsSnapshot = await query.get();

    const restaurants = restaurantsSnapshot.docs.map((doc) => ({
      _id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      data: restaurants,
    });
  } catch (error) {
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

    const restaurantDoc = await db.collection(COLLECTIONS.RESTAURANTS).doc(id).get();

    if (!restaurantDoc.exists) {
      throw new AppError(ERROR_MESSAGES.RESTAURANT_NOT_FOUND, 404);
    }

    res.status(200).json({
      success: true,
      data: {
        _id: restaurantDoc.id,
        ...restaurantDoc.data(),
      },
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

    const restaurantDoc = await db.collection(COLLECTIONS.RESTAURANTS).doc(id).get();

    if (!restaurantDoc.exists) {
      throw new AppError(ERROR_MESSAGES.RESTAURANT_NOT_FOUND, 404);
    }

    const restaurant = restaurantDoc.data() as Restaurant;

    // Check if user is owner or admin
    if (restaurant.ownerId !== req.user.uid && req.user.role !== 'admin') {
      throw new AppError(ERROR_MESSAGES.FORBIDDEN, 403);
    }

    await db
      .collection(COLLECTIONS.RESTAURANTS)
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

    const restaurantDoc = await db.collection(COLLECTIONS.RESTAURANTS).doc(id).get();

    if (!restaurantDoc.exists) {
      throw new AppError(ERROR_MESSAGES.RESTAURANT_NOT_FOUND, 404);
    }

    await db.collection(COLLECTIONS.RESTAURANTS).doc(id).delete();

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

    const restaurantsSnapshot = await db
      .collection(COLLECTIONS.RESTAURANTS)
      .where('ownerId', '==', req.user.uid)
      .get();

    const restaurants = restaurantsSnapshot.docs.map((doc) => ({
      _id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      data: restaurants,
    });
  } catch (error) {
    next(error);
  }
};
