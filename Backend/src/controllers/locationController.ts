import Location from '../models/Location';
import { AppError } from '../middleware/errorHandler';

export const getLocationById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    console.log(`📍 Fetching location: ${id}`);
    
    if (!id) {
      throw new AppError('Location ID is required', 400);
    }

    const location = await Location.findById(id);
    
    if (!location) {
      console.log(`❌ Location not found: ${id}`);
      throw new AppError('Location not found', 404);
    }

    console.log(`✅ Location found: ${location.address}`);
    res.json({ 
      success: true, 
      data: location 
    });
  } catch (error: any) {
    console.error(`❌ Error fetching location:`, error.message);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Error fetching location'
    });
  }
};

export const getAllLocations = async (_req: any, res: any) => {
  try {
    console.log(`📍 Fetching all locations`);
    
    const locations = await Location.find();
    
    console.log(`✅ Found ${locations.length} locations`);
    res.json({ 
      success: true, 
      data: locations 
    });
  } catch (error: any) {
    console.error(`❌ Error fetching locations:`, error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching locations'
    });
  }
};

export const createLocation = async (req: any, res: any) => {
  try {
    const { type, address, coords, ward, district, city } = req.body;
    console.log(`📍 Creating new location: ${address}`);
    
    if (!type || !address || !coords) {
      throw new AppError('Type, address, and coordinates are required', 400);
    }

    const location = new Location({
      type,
      address,
      coords,
      ward,
      district,
      city,
    });

    await location.save();
    console.log(`✅ Location created: ${location._id}`);
    
    res.status(201).json({
      success: true,
      data: location
    });
  } catch (error: any) {
    console.error(`❌ Error creating location:`, error.message);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Error creating location'
    });
  }
};

export const updateLocation = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    console.log(`📍 Updating location: ${id}`);
    
    const location = await Location.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!location) {
      throw new AppError('Location not found', 404);
    }

    console.log(`✅ Location updated: ${location.address}`);
    res.json({
      success: true,
      data: location
    });
  } catch (error: any) {
    console.error(`❌ Error updating location:`, error.message);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Error updating location'
    });
  }
};
