import type { Response, NextFunction } from 'express';
import { db, auth } from '../config/firebase';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import {
  User,
  UserRole,
  UserStatus,
  CreateUserRequest,
  LoginRequest,
} from '../models/types';
import { COLLECTIONS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../models/constants';

// Register new user
export const register = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, name, password, phone, role = UserRole.CUSTOMER }: CreateUserRequest = req.body;

    // Check if user exists
    const existingUser = await db
      .collection(COLLECTIONS.USERS)
      .where('email', '==', email)
      .get();

    if (!existingUser.empty) {
      throw new AppError(ERROR_MESSAGES.USER_EXISTS, 400);
    }

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    // Set custom claims for role
    await auth.setCustomUserClaims(userRecord.uid, { role });

    // Create user document in Firestore
    const newUser: Omit<User, '_id'> = {
      email,
      name,
      password: '', // Don't store password in Firestore
      phone,
      role,
      status: UserStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection(COLLECTIONS.USERS).doc(userRecord.uid).set(newUser);

    res.status(201).json({
      success: true,
      message: SUCCESS_MESSAGES.REGISTER_SUCCESS,
      data: {
        uid: userRecord.uid,
        email,
        name,
        role,
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
    const { email }: LoginRequest = req.body;

    // Get user from Firestore
    const userSnapshot = await db
      .collection(COLLECTIONS.USERS)
      .where('email', '==', email)
      .get();

    if (userSnapshot.empty) {
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
    }

    const userData = userSnapshot.docs[0].data() as User;

    res.status(200).json({
      success: true,
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      data: {
        uid: userSnapshot.docs[0].id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
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

    const userDoc = await db.collection(COLLECTIONS.USERS).doc(req.user.uid).get();

    if (!userDoc.exists) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    const userData = userDoc.data() as User;

    res.status(200).json({
      success: true,
      data: {
        _id: userDoc.id,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        role: userData.role,
        status: userData.status,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
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
    const updates: Partial<User> = {
      updatedAt: new Date(),
    };

    if (name) updates.name = name;
    if (phone) updates.phone = phone;

    await db.collection(COLLECTIONS.USERS).doc(req.user.uid).update(updates);

    res.status(200).json({
      success: true,
      message: SUCCESS_MESSAGES.UPDATED,
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
    const usersSnapshot = await db.collection(COLLECTIONS.USERS).get();

    const users = usersSnapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        _id: doc.id,
        email: data.email,
        name: data.name,
        phone: data.phone,
        role: data.role,
        status: data.status,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    });

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
