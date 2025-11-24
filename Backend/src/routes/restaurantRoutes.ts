import { Router } from 'express';
import {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantsByOwner,
  approveRestaurant,
  rejectRestaurant,
} from '../controllers/restaurantController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../models/types';

const router = Router();

// Public routes
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);

// Restaurant registration (public)
router.post('/register', async (req, res, next) => {
  try {
    const { register } = await import('../controllers/restaurantController');
    register(req, res, next);
  } catch (error) {
    next(error);
  }
});

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

// Admin only - Approve/Reject restaurant
router.post(
  '/:id/approve',
  authenticate,
  authorize(UserRole.ADMIN),
  approveRestaurant
);

router.post(
  '/:id/reject',
  authenticate,
  authorize(UserRole.ADMIN),
  rejectRestaurant
);

export default router;
