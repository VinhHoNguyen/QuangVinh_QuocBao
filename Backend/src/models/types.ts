// import type { Timestamp } from 'firebase-admin/firestore';

// Enums
export enum UserRole {
  ADMIN = 'admin',
  RESTAURANT_OWNER = 'restaurant_owner',
  CUSTOMER = 'customer',
  DELIVERY = 'delivery',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export enum RestaurantStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  CLOSED = 'closed',
}

export enum ProductCategory {
  FOOD = 'food',
  DRINK = 'drink',
  DESSERT = 'dessert',
  APPETIZER = 'appetizer',
  MAIN_COURSE = 'main_course',
  SIDE_DISH = 'side_dish',
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  DELIVERING = 'delivering',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  E_WALLET = 'e_wallet',
  BANK_TRANSFER = 'bank_transfer',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum DeliveryStatus {
  ASSIGNED = 'assigned',
  PICKING_UP = 'picking_up',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  FAILED = 'failed',
}

export enum DroneStatus {
  AVAILABLE = 'available',
  BUSY = 'busy',
  MAINTENANCE = 'maintenance',
  OFFLINE = 'offline',
}

export enum LocationType {
  RESTAURANT = 'restaurant',
  CUSTOMER = 'customer',
  WAREHOUSE = 'warehouse',
  DRONE_STATION = 'drone_station',
}

// Base timestamp interface
export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

// Location coordinates
export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Role Model
export interface Role extends Timestamps {
  _id: string;
  name: string;
  permissions: string[];
}

// User Model
export interface User extends Timestamps {
  _id: string;
  email: string;
  name: string;
  password: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
}

// Restaurant Model
export interface Restaurant extends Timestamps {
  _id: string;
  ownerId: string; // Reference to User
  name: string;
  phone: string;
  address: string;
  locationId: string; // Reference to Location
  image: string;
  imagePublicId: string;
  minOrder: number;
  maxOrder: number;
  rating: number;
  status: RestaurantStatus;
}

// Product Model
export interface Product extends Timestamps {
  _id: string;
  restaurantId: string; // Reference to Restaurant
  name: string;
  description: string;
  price: number;
  image: string;
  imagePublicId: string;
  available: boolean;
  category: ProductCategory;
}

// Cart Item
export interface CartItem {
  productId: string; // Reference to Product
  quantity: number;
  price: number;
}

// Cart Model
export interface Cart extends Timestamps {
  _id: string;
  userId: string; // Reference to User
  items: CartItem[];
  totalPrice: number;
}

// Order Item
export interface OrderItem {
  _id: string;
  productName: string;
  quantity: number;
  price: number;
}

// Shipping Address
export interface ShippingAddress {
  street: string;
  city: string;
  district: string;
  ward: string;
  coordinates: Coordinates;
}

// Order Model
export interface Order extends Timestamps {
  _id: string;
  userId: string; // Reference to User
  restaurantId: string; // Reference to Restaurant
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingAddress: ShippingAddress;
}

// Payment Model
export interface Payment extends Timestamps {
  _id: string;
  orderIds: string[]; // References to Orders
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
}

// Delivery Model
export interface Delivery extends Timestamps {
  _id: string;
  orderId: string; // Reference to Order
  droneId: string; // Reference to Drone
  driverId?: string; // Reference to User (optional)
  dropoffLocationId: string; // Reference to Location
  status: DeliveryStatus;
  estimatedTime: Date;
  actualTime?: Date;
}

// Drone Model
export interface Drone extends Timestamps {
  _id: string;
  code: string;
  name: string;
  restaurantId?: string; // Reference to Restaurant (optional)
  status: DroneStatus;
  battery: number;
  capacity: number;
  currentLoad: number;
  currentLocationId: string; // Reference to Location
}

// Location Model
export interface Location {
  _id: string;
  type: LocationType;
  coords: Coordinates;
  address: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Request body types
export interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
  phone: string;
  role?: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateRestaurantRequest {
  name: string;
  phone: string;
  address: string;
  image?: string;
  minOrder?: number;
  maxOrder?: number;
  location: Coordinates;
}

export interface CreateProductRequest {
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: ProductCategory;
  available?: boolean;
}

export interface CreateOrderRequest {
  restaurantId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
  paymentMethod: PaymentMethod;
  shippingAddress: ShippingAddress;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface CreateDroneRequest {
  code: string;
  name: string;
  capacity: number;
  restaurantId?: string;
}
