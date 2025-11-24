import { Router } from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/authController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../models/types';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

// Admin only - User management
router.get('/users', authenticate, authorize(UserRole.ADMIN), getAllUsers);
router.post('/users', authenticate, authorize(UserRole.ADMIN), createUser);
router.put('/users/:id', authenticate, authorize(UserRole.ADMIN), updateUser);
router.delete('/users/:id', authenticate, authorize(UserRole.ADMIN), deleteUser);

export default router;
