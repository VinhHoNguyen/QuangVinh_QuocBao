import { Router } from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByRestaurant,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../models/types';

const router = Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/restaurant/:restaurantId', getProductsByRestaurant);

// Protected routes - Restaurant owner and admin
router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.RESTAURANT_OWNER),
  createProduct
);

router.put(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.RESTAURANT_OWNER),
  updateProduct
);

router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.RESTAURANT_OWNER),
  deleteProduct
);

export default router;
