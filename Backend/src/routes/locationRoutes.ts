import { Router } from 'express';
import {
  getLocationById,
  getAllLocations,
  createLocation,
  updateLocation,
} from '../controllers/locationController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../models/types';

const router = Router();

// Public routes
router.get('/:id', getLocationById);
router.get('/', getAllLocations);

// Admin only routes
router.post('/', authenticate, authorize(UserRole.ADMIN), createLocation);
router.put('/:id', authenticate, authorize(UserRole.ADMIN), updateLocation);

export default router;
