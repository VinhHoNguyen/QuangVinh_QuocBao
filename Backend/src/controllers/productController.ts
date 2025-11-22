import type { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { CreateProductRequest } from '../models/types';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../models/constants';
import Product from '../models/Product';
import Restaurant from '../models/Restaurant';

// Create product
export const createProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    const {
      restaurantId,
      name,
      description,
      price,
      image = '',
      category,
      available = true,
    }: CreateProductRequest = req.body;

    // Verify restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      throw new AppError(ERROR_MESSAGES.RESTAURANT_NOT_FOUND, 404);
    }

    const newProduct = await Product.create({
      restaurantId,
      name,
      description,
      price,
      image,
      imagePublicId: '',
      available,
      category,
    });

    res.status(201).json({
      success: true,
      message: SUCCESS_MESSAGES.CREATED,
      data: newProduct,
    });
  } catch (error) {
    next(error);
  }
};

// Get all products
export const getAllProducts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { category, available, restaurantId } = req.query;

    let query: any = {};

    if (restaurantId) {
      query.restaurantId = restaurantId;
    }

    if (category) {
      query.category = category;
    }

    if (available !== undefined) {
      query.available = available === 'true';
    }

    const products = await Product.find(query).populate('restaurantId', 'name address');

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// Get product by ID
export const getProductById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate('restaurantId', 'name address');

    if (!product) {
      throw new AppError(ERROR_MESSAGES.PRODUCT_NOT_FOUND, 404);
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Get products by restaurant
export const getProductsByRestaurant = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { restaurantId } = req.params;

    const products = await Product.find({ restaurantId });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// Update product
export const updateProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );

    if (!product) {
      throw new AppError(ERROR_MESSAGES.PRODUCT_NOT_FOUND, 404);
    }

    res.status(200).json({
      success: true,
      message: SUCCESS_MESSAGES.UPDATED,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Delete product
export const deleteProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      throw new AppError(ERROR_MESSAGES.PRODUCT_NOT_FOUND, 404);
    }

    res.status(200).json({
      success: true,
      message: SUCCESS_MESSAGES.DELETED,
    });
  } catch (error) {
    next(error);
  }
};
