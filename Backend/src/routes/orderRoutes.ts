import { Router } from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  cancelOrder,
} from '../controllers/orderController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../models/types';

const router = Router();

// Protected routes
router.post('/', authenticate, createOrder);
router.get('/', authenticate, getAllOrders);
router.get('/me', authenticate, getUserOrders);
router.get('/:id', authenticate, getOrderById);

// Update order status - admin and restaurant owner
router.put(
  '/:id/status',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.RESTAURANT_OWNER),
  updateOrderStatus
);

// Cancel order
router.delete('/:id', authenticate, cancelOrder);

export default router;
