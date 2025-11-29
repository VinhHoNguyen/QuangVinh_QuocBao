import { Request, Response } from 'express';
import { routeService } from '../services/route.service';

/**
 * Get directions between two points
 * GET /api/routes/directions?origin=lat,lng&destination=lat,lng
 */
export const getDirections = async (req: Request, res: Response) => {
    try {
        const { origin, destination } = req.query;

        if (!origin || !destination) {
            return res.status(400).json({
                success: false,
                message: 'Origin and destination are required',
            });
        }

        // Parse coordinates
        const [originLat, originLng] = (origin as string).split(',').map(Number);
        const [destLat, destLng] = (destination as string).split(',').map(Number);

        if (isNaN(originLat) || isNaN(originLng) || isNaN(destLat) || isNaN(destLng)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid coordinates format. Use: lat,lng',
            });
        }

        const directions = await routeService.getDirections(
            { lat: originLat, lng: originLng },
            { lat: destLat, lng: destLng }
        );

        return res.json({
            success: true,
            data: directions,
        });
    } catch (error: any) {
        console.error('Get directions error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get directions',
            error: error.message,
        });
    }
};
