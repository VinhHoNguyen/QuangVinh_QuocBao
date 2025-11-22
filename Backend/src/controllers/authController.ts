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
        role: newUser.role,
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
        role: user.role,
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
