import { Router } from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  cancelOrder,
  getRestaurantOrders,
  assignDroneToDelivery,
} from '../controllers/orderController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole, PaymentStatus } from '../models/types';
import Order from '../models/Order';

const router = Router();

// Protected routes
router.post('/', authenticate, createOrder);
router.get('/', authenticate, getAllOrders);

// Admin only - update all payment status (MUST BE BEFORE /:id)
router.patch(
  '/admin/payment-status',
  authenticate,
  authorize(UserRole.ADMIN),
  async (_req, res, next) => {
    try {
      const result = await Order.updateMany(
        {},
        { $set: { paymentStatus: PaymentStatus.COMPLETED } }
      );
      res.status(200).json({
        success: true,
        message: `Đã cập nhật ${result.modifiedCount} đơn hàng thành đã thanh toán`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

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

// Assign drone to delivery - admin only
router.post(
  '/delivery/assign-drone',
  authenticate,
  authorize(UserRole.ADMIN),
  assignDroneToDelivery
);

// Cancel order - allow both patch and delete
router.patch('/:id/cancel', authenticate, cancelOrder);
router.delete('/:id', authenticate, cancelOrder);

export default router;
