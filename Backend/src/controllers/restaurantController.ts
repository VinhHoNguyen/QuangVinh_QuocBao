import type { Response, NextFunction, Request } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import {
  CreateRestaurantRequest,
  LocationType,
  UserRole,
} from '../models/types';
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  DEFAULT_RESTAURANT_MIN_ORDER,
  DEFAULT_RESTAURANT_MAX_ORDER,
} from '../models/constants';
import Restaurant, { RestaurantStatus } from '../models/Restaurant';
import Location from '../models/Location';
import User, { UserStatus } from '../models/User';
import bcrypt from 'bcryptjs';

// Register restaurant (public endpoint)
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name, phone, address } = req.body;

    // Validate required fields
    if (!email || !password || !name || !phone || !address) {
      throw new AppError('Vui lòng điền đầy đủ thông tin', 400);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email đã được sử dụng', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user account with PENDING status
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      phone,
      role: UserRole.RESTAURANT_OWNER,
      status: UserStatus.ACTIVE, // User is active but restaurant is pending
    });

    // Create location with default coordinates
    const newLocation = await Location.create({
      type: LocationType.RESTAURANT,
      coords: { latitude: 21.0285, longitude: 105.8542 }, // Default Hanoi coordinates
      address,
    });

    // Create restaurant with PENDING status
    const newRestaurant = await Restaurant.create({
      ownerId: newUser._id,
      name,
      phone,
      address,
      locationId: newLocation._id,
      image: '',
      imagePublicId: '',
      minOrder: DEFAULT_RESTAURANT_MIN_ORDER,
      maxOrder: DEFAULT_RESTAURANT_MAX_ORDER,
      rating: 0,
      status: RestaurantStatus.PENDING, // Waiting for admin approval
    });

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công! Vui lòng đợi admin phê duyệt tài khoản của bạn.',
      data: {
        user: {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name,
        },
        restaurant: {
          id: newRestaurant._id,
          name: newRestaurant.name,
          status: newRestaurant.status,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

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

// Approve restaurant (Admin only)
export const approveRestaurant = async (
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

    if (restaurant.status !== RestaurantStatus.PENDING) {
      throw new AppError('Restaurant is not in pending status', 400);
    }

    restaurant.status = RestaurantStatus.ACTIVE;
    await restaurant.save();

    res.status(200).json({
      success: true,
      message: 'Restaurant approved successfully',
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};

// Reject restaurant (Admin only)
export const rejectRestaurant = async (
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

    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      throw new AppError(ERROR_MESSAGES.RESTAURANT_NOT_FOUND, 404);
    }

    restaurant.status = RestaurantStatus.INACTIVE;
    await restaurant.save();

    res.status(200).json({
      success: true,
      message: `Restaurant rejected${reason ? `: ${reason}` : ''}`,
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};
