import { Router } from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  cancelOrder,
  getRestaurantOrders,
} from '../controllers/orderController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../models/types';

const router = Router();

// Protected routes
router.post('/', authenticate, createOrder);
router.get('/', authenticate, getAllOrders);
router.get('/me', authenticate, getUserOrders);

// Restaurant orders
router.get('/restaurant/:id', authenticate, getRestaurantOrders);

router.get('/:id', authenticate, getOrderById);

// Update order status - admin and restaurant owner
router.patch(
  '/:id/status',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.RESTAURANT_OWNER),
  updateOrderStatus
);

// Cancel order - allow both patch and delete
router.patch('/:id/cancel', authenticate, cancelOrder);
router.delete('/:id', authenticate, cancelOrder);

export default router;
