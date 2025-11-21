// Collection names constants
export const COLLECTIONS = {
  USERS: 'users',
  ROLES: 'roles',
  RESTAURANTS: 'restaurants',
  PRODUCTS: 'products',
  CARTS: 'carts',
  ORDERS: 'orders',
  PAYMENTS: 'payments',
  DELIVERIES: 'deliveries',
  DRONES: 'drones',
  LOCATIONS: 'locations',
};

// Default pagination
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

// Default values
export const DEFAULT_RESTAURANT_MIN_ORDER = 50000; // 50k VND
export const DEFAULT_RESTAURANT_MAX_ORDER = 10000000; // 10M VND
export const DEFAULT_DRONE_BATTERY = 100;
export const DEFAULT_DRONE_CURRENT_LOAD = 0;

// Error messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden access',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation error',
  INTERNAL_ERROR: 'Internal server error',
  USER_EXISTS: 'User already exists',
  INVALID_CREDENTIALS: 'Invalid credentials',
  RESTAURANT_NOT_FOUND: 'Restaurant not found',
  PRODUCT_NOT_FOUND: 'Product not found',
  ORDER_NOT_FOUND: 'Order not found',
  CART_EMPTY: 'Cart is empty',
  DRONE_NOT_AVAILABLE: 'No drone available',
};

// Success messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  LOGIN_SUCCESS: 'Login successful',
  REGISTER_SUCCESS: 'Registration successful',
};
