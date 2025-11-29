// src/services/geocoding.ts
/**
 * Geocoding Service
 * Converts addresses to geographic coordinates using OpenStreetMap Nominatim (Free)
 * No API key required - Perfect for educational projects!
 */

export interface GeocodingResult {
    latitude: number;
    longitude: number;
    formattedAddress?: string;
}

/**
 * Convert an address string to geographic coordinates using Nominatim
 * @param address - Full address string (e.g., "123 Nguyen Hue, District 1, Ho Chi Minh City")
 * @returns Coordinates object or null if geocoding fails
 */
export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
    if (!address || address.trim().length === 0) {
        console.warn('Geocoding: Empty address provided');
        return null;
    }

    try {
        // Add "Vietnam" to improve accuracy
        const searchAddress = address.includes('Vietnam') || address.includes('Việt Nam')
            ? address
            : `${address}, Vietnam`;

        const encodedAddress = encodeURIComponent(searchAddress.trim());

        // OpenStreetMap Nominatim API - FREE forever!
        const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1&countrycodes=vn`;

        console.log(`🗺️ Geocoding address (Nominatim): ${address}`);

        const response = await fetch(url, {
            headers: {
                // User-Agent is required by Nominatim usage policy
                'User-Agent': 'FoodDeliveryDroneApp/1.0 (Educational Project)'
            }
        });

        if (!response.ok) {
            console.error(`❌ Nominatim API error: ${response.status}`);
            return null;
        }

        const data = await response.json();

        if (data && data.length > 0) {
            const result = data[0];
            const geocodingResult: GeocodingResult = {
                latitude: parseFloat(result.lat),
                longitude: parseFloat(result.lon),
                formattedAddress: result.display_name,
            };

            console.log(`✅ Geocoded successfully:`, geocodingResult);
            return geocodingResult;
        } else {
            console.warn(`⚠️ No results found for address: ${address}`);
            return null;
        }
    } catch (error) {
        console.error('❌ Geocoding error:', error);
        return null;
    }
}

/**
 * Get default coordinates for Ho Chi Minh City center
 * Used as fallback when geocoding fails
 */
export function getDefaultCoordinates(): GeocodingResult {
    return {
        latitude: 10.762622,
        longitude: 106.660172,
        formattedAddress: 'Ho Chi Minh City, Vietnam',
    };
}

/**
 * Validate if coordinates are valid
 */
export function isValidCoordinates(lat: number, lng: number): boolean {
    return (
        typeof lat === 'number' &&
        typeof lng === 'number' &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180 &&
        !isNaN(lat) &&
        !isNaN(lng)
    );
}
