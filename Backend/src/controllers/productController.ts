import type { Response, NextFunction } from 'express';
import { db } from '../config/firebase';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { Product, CreateProductRequest } from '../models/types';
import { COLLECTIONS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../models/constants';

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
    const restaurantDoc = await db.collection(COLLECTIONS.RESTAURANTS).doc(restaurantId).get();

    if (!restaurantDoc.exists) {
      throw new AppError(ERROR_MESSAGES.RESTAURANT_NOT_FOUND, 404);
    }

    const newProduct: Omit<Product, '_id'> = {
      restaurantId,
      name,
      description,
      price,
      image,
      imagePublicId: '',
      available,
      category,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const productRef = await db.collection(COLLECTIONS.PRODUCTS).add(newProduct);

    res.status(201).json({
      success: true,
      message: SUCCESS_MESSAGES.CREATED,
      data: {
        _id: productRef.id,
        ...newProduct,
      },
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

    let query = db.collection(COLLECTIONS.PRODUCTS);

    if (restaurantId) {
      query = query.where('restaurantId', '==', restaurantId) as any;
    }

    if (category) {
      query = query.where('category', '==', category) as any;
    }

    if (available !== undefined) {
      query = query.where('available', '==', available === 'true') as any;
    }

    const productsSnapshot = await query.get();

    const products = productsSnapshot.docs.map((doc) => ({
      _id: doc.id,
      ...doc.data(),
    }));

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

    const productDoc = await db.collection(COLLECTIONS.PRODUCTS).doc(id).get();

    if (!productDoc.exists) {
      throw new AppError(ERROR_MESSAGES.PRODUCT_NOT_FOUND, 404);
    }

    res.status(200).json({
      success: true,
      data: {
        _id: productDoc.id,
        ...productDoc.data(),
      },
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

    const productsSnapshot = await db
      .collection(COLLECTIONS.PRODUCTS)
      .where('restaurantId', '==', restaurantId)
      .get();

    const products = productsSnapshot.docs.map((doc: any) => ({
      _id: doc.id,
      ...doc.data(),
    }));

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

    const productDoc = await db.collection(COLLECTIONS.PRODUCTS).doc(id).get();

    if (!productDoc.exists) {
      throw new AppError(ERROR_MESSAGES.PRODUCT_NOT_FOUND, 404);
    }

    await db
      .collection(COLLECTIONS.PRODUCTS)
      .doc(id)
      .update({
        ...updates,
        updatedAt: new Date(),
      });

    res.status(200).json({
      success: true,
      message: SUCCESS_MESSAGES.UPDATED,
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

    const productDoc = await db.collection(COLLECTIONS.PRODUCTS).doc(id).get();

    if (!productDoc.exists) {
      throw new AppError(ERROR_MESSAGES.PRODUCT_NOT_FOUND, 404);
    }

    await db.collection(COLLECTIONS.PRODUCTS).doc(id).delete();

    res.status(200).json({
      success: true,
      message: SUCCESS_MESSAGES.DELETED,
    });
  } catch (error) {
    next(error);
  }
};
