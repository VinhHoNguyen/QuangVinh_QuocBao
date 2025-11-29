import { Router } from 'express';
import { getDirections } from '../controllers/route.controller';

const router = Router();

/**
 * @route   GET /api/routes/directions
 * @desc    Get directions between two points
 * @access  Public
 * @query   origin - Origin coordinates (lat,lng)
 * @query   destination - Destination coordinates (lat,lng)
 */
router.get('/directions', getDirections);

export default router;
