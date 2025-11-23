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
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';
  paymentMethod: 'cash' | 'credit_card' | 'debit_card' | 'e_wallet' | 'bank_transfer';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: {
    street: string;
    district: string;
    city: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  customerName: string;
  customerPhone: string;
  notes?: string;
  estimatedDeliveryTime?: Date;
  deliveryId?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
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
    const response = await api.get<Order[]>(`/orders/restaurant/${restaurantId}`);
    return response.data;
  },

  // Get single order details
  getById: async (orderId: string): Promise<Order> => {
    const response = await api.get<Order>(`/orders/${orderId}`);
    return response.data;
  },

  // Update order status (restaurant confirms, prepares, etc.)
  updateStatus: async (orderId: string, status: Order['status']): Promise<Order> => {
    const response = await api.patch<Order>(`/orders/${orderId}/status`, { status });
    return response.data;
  },

  // Cancel order with reason
  cancelOrder: async (orderId: string, reason: string): Promise<Order> => {
    const response = await api.patch<Order>(`/orders/${orderId}/cancel`, { reason });
    return response.data;
  },
};

// Restaurant types
export interface Restaurant {
  _id: string;
  name: string;
  phone: string;
  address: string;
  image: string;
  minOrder: number;
  maxOrder: number;
  rating: number;
  status: 'active' | 'inactive' | 'suspended';
  locationId: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

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
