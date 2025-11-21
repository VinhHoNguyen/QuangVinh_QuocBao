import { Router } from 'express';
import {
  getAllDeliveries,
  getDeliveryById,
  trackDelivery,
  updateDeliveryStatus,
} from '../controllers/deliveryController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../models/types';

const router = Router();

// Protected routes
router.get('/', authenticate, getAllDeliveries);
router.get('/:id', authenticate, getDeliveryById);
router.get('/track/:orderId', authenticate, trackDelivery);

// Update delivery status - admin and delivery
router.put(
  '/:id/status',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.DELIVERY),
  updateDeliveryStatus
);

export default router;
