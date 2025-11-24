import type { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import {
  UserRole,
  UserStatus,
  CreateUserRequest,
  LoginRequest,
} from '../models/types';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../models/constants';
import User from '../models/User';

const JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Register new user
export const register = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, name, password, phone, role = UserRole.CUSTOMER }: CreateUserRequest = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new AppError(ERROR_MESSAGES.USER_EXISTS, 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user document
    const newUser = await User.create({
      email,
      name,
      password: hashedPassword,
      phone,
      role,
      status: UserStatus.ACTIVE,
    });

    // Generate JWT token
    const payload = {
      _id: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: SUCCESS_MESSAGES.REGISTER_SUCCESS,
      data: {
        _id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        phone: newUser.phone,
        role: newUser.role,
        restaurantId: newUser.restaurantId,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login user
export const login = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Get user from database
    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
    }

    // Check if user account is suspended
    if (user.status === UserStatus.SUSPENDED) {
      throw new AppError('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.', 403);
    }

    // Check if user is restaurant owner and restaurant is pending approval
    if (user.role === UserRole.RESTAURANT_OWNER) {
      const Restaurant = (await import('../models/Restaurant')).default;
      const restaurant = await Restaurant.findOne({ ownerId: user._id });
      
      if (restaurant && restaurant.status === 'pending') {
        throw new AppError('Tài khoản nhà hàng của bạn đang chờ admin phê duyệt. Vui lòng đợi thông báo từ admin.', 403);
      }
      
      if (restaurant && restaurant.status === 'inactive') {
        throw new AppError('Tài khoản nhà hàng của bạn đã bị từ chối. Vui lòng liên hệ admin để biết thêm chi tiết.', 403);
      }
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
    }

    // Generate JWT token
    const payload = {
      _id: user._id.toString(),
      email: user.email,
      role: user.role
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      success: true,
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      data: {
        _id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        restaurantId: user.restaurantId,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get user profile
export const getProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        status: user.status,
        restaurantId: user.restaurantId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    const { name, phone } = req.body;
    const updates: any = {};

    if (name) updates.name = name;
    if (phone) updates.phone = phone;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    ).select('-password');

    if (!user) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    res.status(200).json({
      success: true,
      message: SUCCESS_MESSAGES.UPDATED,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Get all users (admin only)
export const getAllUsers = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// Create user (admin only)
export const createUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, name, password, phone, role = UserRole.CUSTOMER }: CreateUserRequest = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new AppError(ERROR_MESSAGES.USER_EXISTS, 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user document
    const newUser = await User.create({
      email,
      name,
      password: hashedPassword,
      phone,
      role,
      status: UserStatus.ACTIVE,
    });

    const userResponse = await User.findById(newUser._id).select('-password');

    res.status(201).json({
      success: true,
      message: SUCCESS_MESSAGES.CREATED,
      data: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

// Update user (admin only)
export const updateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, phone, role, status } = req.body;

    const updates: any = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (role) updates.role = role;
    if (status) updates.status = status;

    const user = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    ).select('-password');

    if (!user) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    res.status(200).json({
      success: true,
      message: SUCCESS_MESSAGES.UPDATED,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Delete user (admin only)
export const deleteUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
