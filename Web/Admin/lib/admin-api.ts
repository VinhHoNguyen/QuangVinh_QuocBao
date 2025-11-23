import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types
export interface AdminUser {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'admin' | 'customer' | 'restaurant_owner';
  restaurantId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  userId: string;
  restaurantId: string;
  items: Array<{
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: any;
  customerName: string;
  customerPhone: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

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
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Drone {
  _id: string;
  model: string;
  serialNumber: string;
  status: 'available' | 'in_use' | 'maintenance' | 'offline';
  batteryLevel: number;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  maxPayload: number;
  maxDistance: number;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  activeOrders: number;
  totalUsers: number;
  totalRestaurants: number;
  activeDrones: number;
  pendingOrders: number;
  completedOrders: number;
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  me: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Admin Orders API
export const adminOrdersAPI = {
  getAll: async (): Promise<Order[]> => {
    const response = await api.get('/orders');
    return response.data;
  },

  getById: async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  updateStatus: async (id: string, status: Order['status']): Promise<Order> => {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },
};

// Admin Users API
export const adminUsersAPI = {
  getAll: async (): Promise<AdminUser[]> => {
    const response = await api.get('/auth/users');
    return response.data;
  },

  getById: async (id: string): Promise<AdminUser> => {
    const response = await api.get(`/auth/users/${id}`);
    return response.data;
  },

  update: async (id: string, data: Partial<AdminUser>): Promise<AdminUser> => {
    const response = await api.put(`/auth/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/auth/users/${id}`);
  },
};

// Admin Restaurants API
export const adminRestaurantsAPI = {
  getAll: async (): Promise<Restaurant[]> => {
    const response = await api.get<{ success: boolean; data: Restaurant[] }>('/restaurants');
    return response.data.data;
  },

  getById: async (id: string): Promise<Restaurant> => {
    const response = await api.get<{ success: boolean; data: Restaurant }>(`/restaurants/${id}`);
    return response.data.data;
  },

  update: async (id: string, data: Partial<Restaurant>): Promise<Restaurant> => {
    const response = await api.put<{ success: boolean; data: Restaurant }>(`/restaurants/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/restaurants/${id}`);
  },
};

// Admin Drones API
export const adminDronesAPI = {
  getAll: async (): Promise<Drone[]> => {
    const response = await api.get<{ success: boolean; data: Drone[] }>('/drones');
    return response.data.data;
  },

  getById: async (id: string): Promise<Drone> => {
    const response = await api.get<{ success: boolean; data: Drone }>(`/drones/${id}`);
    return response.data.data;
  },

  create: async (data: Partial<Drone>): Promise<Drone> => {
    const response = await api.post<{ success: boolean; data: Drone }>('/drones', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<Drone>): Promise<Drone> => {
    const response = await api.put<{ success: boolean; data: Drone }>(`/drones/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/drones/${id}`);
  },
};

// Admin Dashboard API (basic stats from existing data)
export const adminDashboardAPI = {
  getStats: async (): Promise<DashboardStats> => {
    // Parallel requests to get all stats
    const [orders, restaurants, drones] = await Promise.all([
      adminOrdersAPI.getAll(),
      adminRestaurantsAPI.getAll(),
      adminDronesAPI.getAll(),
    ]);

    const totalRevenue = orders
      .filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    return {
      totalOrders: orders.length,
      totalRevenue,
      activeOrders: orders.filter(o => ['pending', 'confirmed', 'preparing', 'ready', 'delivering'].includes(o.status)).length,
      totalUsers: 0, // Would need users API
      totalRestaurants: restaurants.length,
      activeDrones: drones.filter(d => d.status === 'available').length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      completedOrders: orders.filter(o => o.status === 'delivered').length,
    };
  },
};

export default api;
