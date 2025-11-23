// API Configuration
// @ts-ignore - Next.js provides process.env
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Types from backend
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  phone: string;
  role: 'admin' | 'restaurant_owner' | 'customer' | 'delivery';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  role: string;
  token: string;
}

export interface Restaurant {
  _id: string;
  ownerId: string;
  name: string;
  phone: string;
  address: string;
  locationId: string;
  image: string;
  imagePublicId: string;
  minOrder: number;
  maxOrder: number;
  rating: number;
  status: 'active' | 'inactive' | 'pending' | 'closed';
  products?: Product[]; // Virtual populate from backend
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  imagePublicId: string;
  available: boolean;
  category: 'food' | 'drink' | 'dessert' | 'appetizer' | 'main_course' | 'side_dish';
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  _id: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  district: string;
  ward: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface Order {
  _id: string;
  userId: string;
  restaurantId: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';
  paymentMethod: 'cash' | 'credit_card' | 'debit_card' | 'e_wallet' | 'bank_transfer';
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt: string;
}

export interface Delivery {
  _id: string;
  orderId: string;
  droneId: string;
  driverId?: string;
  dropoffLocationId: string;
  status: 'assigned' | 'picking_up' | 'in_transit' | 'delivered' | 'failed';
  estimatedTime: string;
  actualTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Drone {
  _id: string;
  code: string;
  name: string;
  restaurantId?: string;
  status: 'available' | 'busy' | 'maintenance' | 'offline';
  battery: number;
  capacity: number;
  currentLoad: number;
  currentLocationId: string;
  createdAt: string;
  updatedAt: string;
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('foodfast_token');
};

// Helper function to make API requests
const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token = getAuthToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`API Error ${response.status}:`, data);
      throw new Error(data.error || data.message || `HTTP ${response.status}: API request failed`);
    }

    return data;
  } catch (error: any) {
    // Network error or fetch failed
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.error('Network Error: Cannot connect to backend at', API_URL);
      throw new Error(`Cannot connect to server at ${API_URL}. Is the backend running?`);
    }
    console.error('API Error:', error);
    throw error;
  }
};

// Auth APIs
export const authAPI = {
  register: async (name: string, email: string, password: string, phone: string) => {
    return apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, phone, role: 'customer' }),
    });
  },

  login: async (email: string, password: string) => {
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  getProfile: async () => {
    return apiRequest<User>('/auth/profile');
  },

  updateProfile: async (updates: { name?: string; phone?: string }) => {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
};

// Restaurant APIs
export const restaurantAPI = {
  getAll: async (status?: string) => {
    const query = status ? `?status=${status}` : '';
    return apiRequest<Restaurant[]>(`/restaurants${query}`);
  },

  getById: async (id: string) => {
    return apiRequest<Restaurant>(`/restaurants/${id}`);
  },

  create: async (data: {
    name: string;
    phone: string;
    address: string;
    image?: string;
    minOrder?: number;
    maxOrder?: number;
    location: { latitude: number; longitude: number };
  }) => {
    return apiRequest<Restaurant>('/restaurants', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, updates: Partial<Restaurant>) => {
    return apiRequest(`/restaurants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/restaurants/${id}`, {
      method: 'DELETE',
    });
  },

  getByOwner: async () => {
    return apiRequest<Restaurant[]>('/restaurants/owner/me');
  },
};

// Product APIs
export const productAPI = {
  getAll: async (params?: { category?: string; available?: boolean; restaurantId?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.available !== undefined) query.append('available', String(params.available));
    if (params?.restaurantId) query.append('restaurantId', params.restaurantId);
    
    const queryString = query.toString();
    return apiRequest<Product[]>(`/products${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id: string) => {
    return apiRequest<Product>(`/products/${id}`);
  },

  getByRestaurant: async (restaurantId: string) => {
    return apiRequest<Product[]>(`/products/restaurant/${restaurantId}`);
  },

  create: async (data: {
    restaurantId: string;
    name: string;
    description: string;
    price: number;
    image?: string;
    category: string;
    available?: boolean;
  }) => {
    return apiRequest<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, updates: Partial<Product>) => {
    return apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// Order APIs
export const orderAPI = {
  create: async (data: {
    restaurantId: string;
    items: { productId: string; quantity: number }[];
    paymentMethod: string;
    shippingAddress: ShippingAddress;
  }) => {
    return apiRequest<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getAll: async (params?: { status?: string; userId?: string; restaurantId?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.userId) query.append('userId', params.userId);
    if (params?.restaurantId) query.append('restaurantId', params.restaurantId);
    
    const queryString = query.toString();
    return apiRequest<Order[]>(`/orders${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id: string) => {
    return apiRequest<Order>(`/orders/${id}`);
  },

  getUserOrders: async () => {
    return apiRequest<Order[]>('/orders/me');
  },

  updateStatus: async (id: string, status: string) => {
    return apiRequest(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  cancel: async (id: string) => {
    return apiRequest(`/orders/${id}`, {
      method: 'DELETE',
    });
  },
};

// Delivery APIs
export const deliveryAPI = {
  getAll: async (params?: { status?: string; droneId?: string; orderId?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.droneId) query.append('droneId', params.droneId);
    if (params?.orderId) query.append('orderId', params.orderId);
    
    const queryString = query.toString();
    return apiRequest<Delivery[]>(`/deliveries${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id: string) => {
    return apiRequest<Delivery>(`/deliveries/${id}`);
  },

  track: async (orderId: string) => {
    return apiRequest<Delivery>(`/deliveries/track/${orderId}`);
  },

  updateStatus: async (id: string, status: string) => {
    return apiRequest(`/deliveries/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

// Drone APIs
export const droneAPI = {
  getAll: async (params?: { status?: string; restaurantId?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.restaurantId) query.append('restaurantId', params.restaurantId);
    
    const queryString = query.toString();
    return apiRequest<Drone[]>(`/drones${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id: string) => {
    return apiRequest<Drone>(`/drones/${id}`);
  },

  getAvailable: async () => {
    return apiRequest<Drone[]>('/drones/available');
  },

  create: async (data: {
    code: string;
    name: string;
    capacity: number;
    restaurantId?: string;
  }) => {
    return apiRequest<Drone>('/drones', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, updates: Partial<Drone>) => {
    return apiRequest(`/drones/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  updateStatus: async (id: string, status: string) => {
    return apiRequest(`/drones/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/drones/${id}`, {
      method: 'DELETE',
    });
  },
};

// Helper to save auth token
export const saveAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('foodfast_token', token);
  }
};

// Helper to remove auth token
export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('foodfast_token');
  }
};
