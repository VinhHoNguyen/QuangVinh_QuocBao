import { Router } from 'express';
import {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantsByOwner,
} from '../controllers/restaurantController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../models/types';

const router = Router();

// Public routes
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);

// Protected routes - Restaurant owner and admin
router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.RESTAURANT_OWNER),
  createRestaurant
);

router.put(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.RESTAURANT_OWNER),
  updateRestaurant
);

router.delete('/:id', authenticate, authorize(UserRole.ADMIN), deleteRestaurant);

// Get restaurants by owner
router.get(
  '/owner/me',
  authenticate,
  authorize(UserRole.RESTAURANT_OWNER),
  getRestaurantsByOwner
);

export default router;
