import { Router } from 'express';
import {
  getAllDeliveries,
  getDeliveryById,
  trackDelivery,
  updateDeliveryStatus,
  assignDroneToDelivery,
} from '../controllers/deliveryController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../models/types';

const router = Router();

// Protected routes
router.get('/', authenticate, getAllDeliveries);
router.get('/:id', authenticate, getDeliveryById);
router.get('/track/:orderId', authenticate, trackDelivery);
router.get('/order/:orderId', authenticate, trackDelivery); // Alias for mobile app

// Update delivery status - admin, delivery, and restaurant owner
router.put(
  '/:id/status',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.DELIVERY, UserRole.RESTAURANT_OWNER),
  updateDeliveryStatus
);

// Assign drone to delivery - admin only
router.patch(
  '/:deliveryId/assign-drone',
  authenticate,
  authorize(UserRole.ADMIN),
  assignDroneToDelivery
);

export default router;
