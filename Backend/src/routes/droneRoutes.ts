import { Router } from 'express';
import {
  createDrone,
  getAllDrones,
  getDroneById,
  getAvailableDrones,
  updateDrone,
  updateDroneStatus,
  deleteDrone,
} from '../controllers/droneController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../models/types';

const router = Router();

// Public/Protected routes
router.get('/', getAllDrones);
router.get('/available', getAvailableDrones);
router.get('/:id', getDroneById);

// Admin only routes
router.post('/', authenticate, authorize(UserRole.ADMIN), createDrone);
router.put('/:id', authenticate, authorize(UserRole.ADMIN), updateDrone);
router.put('/:id/status', authenticate, authorize(UserRole.ADMIN), updateDroneStatus);
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), deleteDrone);

export default router;
