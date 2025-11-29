import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('restaurant_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth types
export interface AuthResponse {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  role: string;
  restaurantId?: string;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Order types (matching backend Order model)
export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  userId: string;
  restaurantId: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'completed' | 'cancelled';
  deliveryMethod?: 'drone' | 'bike' | 'car';
  paymentMethod: 'cash' | 'credit_card' | 'debit_card' | 'e_wallet' | 'bank_transfer';
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  shippingAddress: {
    street: string;
    district: string;
    city: string;
    ward: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  customerName?: string;
  customerPhone?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<{ success: boolean; data: AuthResponse }>('/auth/login', credentials);
    return response.data.data; // Extract data from { success, data: { token, ... } }
  },

  me: async (): Promise<AuthResponse> => {
    const response = await api.get<AuthResponse>('/auth/me');
    return response.data;
  },
};

// Order API for Restaurant
export const orderAPI = {
  // Get all orders for a restaurant
  getRestaurantOrders: async (restaurantId: string): Promise<Order[]> => {
    const response = await api.get<{ success: boolean; data: Order[] }>(`/orders/restaurant/${restaurantId}`);
    return response.data.data || [];
  },

  // Get single order details
  getById: async (orderId: string): Promise<Order> => {
    const response = await api.get<{ success: boolean; data: Order }>(`/orders/${orderId}`);
    return response.data.data;
  },

  // Update order status (restaurant confirms, prepares, etc.)
  updateStatus: async (orderId: string, status: Order['status']): Promise<Order> => {
    const response = await api.patch<{ success: boolean; data: Order }>(`/orders/${orderId}/status`, { status });
    return response.data.data;
  },

  // Cancel order with reason
  cancelOrder: async (orderId: string, reason: string): Promise<Order> => {
    const response = await api.patch<{ success: boolean; data: Order }>(`/orders/${orderId}/cancel`, { reason });
    return response.data.data;
  },
};

// Restaurant types
export interface Restaurant {
  _id: string;
  name: string;
  phone: string;
  address: string;
  email?: string;
  image: string;
  minOrder: number;
  maxOrder: number;
  rating: number;
  status: 'active' | 'inactive' | 'suspended';
  locationId: string;
  ownerId: string;
  openingHours?: {
    open: string;
    close: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Product types
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  restaurantId: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available?: boolean;
}

// Product API
export const productAPI = {
  // Get all products for a restaurant
  getByRestaurant: async (restaurantId: string): Promise<Product[]> => {
    const response = await api.get<{ success: boolean; data: Product[] }>(`/products/restaurant/${restaurantId}`);
    return response.data.data || [];
  },

  // Create new product
  create: async (data: CreateProductData): Promise<Product> => {
    const response = await api.post<{ success: boolean; data: Product }>('/products', data);
    return response.data.data;
  },

  // Update product
  update: async (productId: string, data: Partial<CreateProductData>): Promise<Product> => {
    const response = await api.put<{ success: boolean; data: Product }>(`/products/${productId}`, data);
    return response.data.data;
  },

  // Delete product
  delete: async (productId: string): Promise<void> => {
    await api.delete(`/products/${productId}`);
  },

  // Toggle product availability
  toggleAvailability: async (productId: string): Promise<Product> => {
    const response = await api.patch<{ success: boolean; data: Product }>(`/products/${productId}/availability`);
    return response.data.data;
  },
};

// Restaurant API
export const restaurantAPI = {
  // Get restaurant by ID
  getById: async (restaurantId: string): Promise<Restaurant> => {
    const response = await api.get<{ success: boolean; data: Restaurant }>(`/restaurants/${restaurantId}`);
    return response.data.data;
  },

  // Update restaurant info
  update: async (restaurantId: string, data: Partial<Restaurant>): Promise<Restaurant> => {
    const response = await api.put<{ success: boolean; data: Restaurant }>(`/restaurants/${restaurantId}`, data);
    return response.data.data;
  },
};

export default api;
