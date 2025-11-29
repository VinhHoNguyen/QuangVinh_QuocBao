import axios from 'axios';

interface DirectionsResponse {
    polyline: string;
    distance: {
        text: string;
        value: number; // in meters
    };
    duration: {
        text: string;
        value: number; // in seconds
    };
    steps?: any[];
}

class RouteService {
    private apiKey: string;
    private baseUrl = 'https://maps.googleapis.com/maps/api/directions/json';

    constructor() {
        // Google Maps API key - will be set from environment variable
        this.apiKey = process.env.GOOGLE_MAPS_API_KEY || '';
    }

    /**
     * Get directions between two points using Google Directions API
     */
    async getDirections(
        origin: { lat: number; lng: number },
        destination: { lat: number; lng: number }
    ): Promise<DirectionsResponse> {
        try {
            // If no API key, return straight line approximation
            if (!this.apiKey) {
                console.warn('⚠️ No Google Maps API key found. Using straight line approximation.');
                return this.getStraightLineRoute(origin, destination);
            }

            const params = {
                origin: `${origin.lat},${origin.lng}`,
                destination: `${destination.lat},${destination.lng}`,
                key: this.apiKey,
                mode: 'driving', // or 'walking', 'bicycling', 'transit'
            };

            const response = await axios.get(this.baseUrl, { params });

            if (response.data.status !== 'OK') {
                console.error('Google Directions API error:', response.data.status);
                return this.getStraightLineRoute(origin, destination);
            }

            const route = response.data.routes[0];
            const leg = route.legs[0];

            return {
                polyline: route.overview_polyline.points,
                distance: leg.distance,
                duration: leg.duration,
                steps: leg.steps,
            };
        } catch (error) {
            console.error('Error fetching directions:', error);
            // Fallback to straight line
            return this.getStraightLineRoute(origin, destination);
        }
    }

    /**
     * Fallback: Create a straight line route when API is unavailable
     */
    private getStraightLineRoute(
        origin: { lat: number; lng: number },
        destination: { lat: number; lng: number }
    ): DirectionsResponse {
        // Calculate approximate distance using Haversine formula
        const distance = this.calculateDistance(origin, destination);

        // Estimate duration (assuming 30 km/h average speed)
        const durationSeconds = (distance / 30000) * 3600;

        // Create simple polyline (just origin and destination)
        const polyline = this.encodePolyline([origin, destination]);

        return {
            polyline,
            distance: {
                text: `${(distance / 1000).toFixed(1)} km`,
                value: distance,
            },
            duration: {
                text: `${Math.ceil(durationSeconds / 60)} phút`,
                value: Math.ceil(durationSeconds),
            },
        };
    }

    /**
     * Calculate distance between two points using Haversine formula
     */
    private calculateDistance(
        point1: { lat: number; lng: number },
        point2: { lat: number; lng: number }
    ): number {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = (point1.lat * Math.PI) / 180;
        const φ2 = (point2.lat * Math.PI) / 180;
        const Δφ = ((point2.lat - point1.lat) * Math.PI) / 180;
        const Δλ = ((point2.lng - point1.lng) * Math.PI) / 180;

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance in meters
    }

    /**
     * Simple polyline encoding (basic implementation)
     */
    private encodePolyline(points: { lat: number; lng: number }[]): string {
        // For simplicity, we'll just return a marker string
        // In production, you'd use a proper polyline encoding library
        return points.map(p => `${p.lat},${p.lng}`).join('|');
    }

    /**
     * Decode Google's encoded polyline format
     */
    static decodePolyline(encoded: string): { latitude: number; longitude: number }[] {
        const points: { latitude: number; longitude: number }[] = [];
        let index = 0;
        let lat = 0;
        let lng = 0;

        while (index < encoded.length) {
            let b;
            let shift = 0;
            let result = 0;

            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);

            const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
            lat += dlat;

            shift = 0;
            result = 0;

            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);

            const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
            lng += dlng;

            points.push({
                latitude: lat / 1e5,
                longitude: lng / 1e5,
            });
        }

        return points;
    }
}

export const routeService = new RouteService();
export { RouteService };
