import { Router } from 'express';
import { getRestaurantAnalytics } from '../controllers/analyticsController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Get analytics for a specific restaurant
router.get('/restaurant/:id', authenticate, getRestaurantAnalytics);

export default router;
