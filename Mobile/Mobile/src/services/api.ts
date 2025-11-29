// src/services/api.ts
import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/api.config';

const API_URL = API_CONFIG.BASE_URL;


class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      timeout: 30000, // Tăng từ 10s lên 30s
    });

    console.log('🔌 API Service initialized with URL:', API_URL);

    // Add token to requests
    this.api.interceptors.request.use(async (config) => {
      const token = await AsyncStorage.getItem('authToken');
      console.log('🔑 Token for request:', config.url, token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Log responses
    this.api.interceptors.response.use(
      (response) => {
        console.log('✅ API Response:', response.config.url, response.status);
        return response;
      },
      (error) => {
        console.log('❌ API Error:', error.config?.url, error.message);
        return Promise.reject(error);
      }
    );
  }

  // ============ AUTH ============
  async register(email: string, password: string, name: string, phone: string) {
    const response = await this.api.post('/auth/register', {
      email,
      password,
      name,
      phone,
    });
    // Backend returns: { success: true, data: { token: "...", ... } }
    // So token is in response.data.data.token
    if (response.data.data?.token) {
      await AsyncStorage.setItem('authToken', response.data.data.token);
      console.log('💾 Token saved (register):', response.data.data.token.substring(0, 20) + '...');
    } else {
      console.log('⚠️ No token in register response!', response.data);
    }
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.api.post('/auth/login', { email, password });
    // Backend returns: { success: true, data: { token: "...", ... } }
    // So token is in response.data.data.token
    if (response.data.data?.token) {
      await AsyncStorage.setItem('authToken', response.data.data.token);
      console.log('💾 Token saved (login):', response.data.data.token.substring(0, 20) + '...');
    } else {
      console.log('⚠️ No token in login response!', response.data);
    }
    return response.data;
  }

  async logout() {
    await AsyncStorage.removeItem('authToken');
  }

  async getProfile() {
    const response = await this.api.get('/auth/profile');
    return response.data;
  }

  // ============ RESTAURANTS ============
  async getRestaurants() {
    const response = await this.api.get('/restaurants');
    return response.data;
  }

  async getRestaurantById(id: string) {
    const response = await this.api.get(`/restaurants/${id}`);
    return response.data;
  }

  // ============ PRODUCTS ============
  async getProducts() {
    const response = await this.api.get('/products');
    return response.data;
  }

  async getProductsByRestaurant(restaurantId: string) {
    const response = await this.api.get(`/products/restaurant/${restaurantId}`);
    return response.data;
  }

  async getProductById(id: string) {
    const response = await this.api.get(`/products/${id}`);
    return response.data;
  }

  // ============ CART ============
  async getCart() {
    const response = await this.api.get('/cart');
    return response.data;
  }

  async addToCart(productId: string, quantity: number) {
    const response = await this.api.post('/cart', { productId, quantity });
    return response.data;
  }

  async updateCartItem(productId: string, quantity: number) {
    const response = await this.api.put('/cart', { productId, quantity });
    return response.data;
  }

  async removeFromCart(productId: string) {
    const response = await this.api.delete(`/cart/${productId}`);
    return response.data;
  }

  async clearCart() {
    const response = await this.api.delete('/cart');
    return response.data;
  }

  async syncCart(items: any[]) {
    const response = await this.api.post('/cart/sync', { items });
    return response.data;
  }

  // ============ ORDERS ============
  async createOrder(orderData: {
    restaurantId: string;
    items: Array<{ productId: string; quantity: number; price: number }>;
    paymentMethod: string;
    shippingAddress: any;
  }) {
    const response = await this.api.post('/orders', orderData);
    return response.data;
  }

  async getOrders() {
    const response = await this.api.get('/orders/me');
    return response.data;
  }

  async getOrderById(id: string) {
    const response = await this.api.get(`/orders/${id}`);
    return response.data;
  }

  async updateOrderStatus(orderId: string, status: string) {
    const response = await this.api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  }

  // ============ DELIVERIES ============
  async getDeliveries() {
    const response = await this.api.get('/deliveries');
    return response.data;
  }

  async getDeliveryByOrderId(orderId: string) {
    const response = await this.api.get(`/deliveries/order/${orderId}`);
    return response.data;
  }

  // ============ ROUTES ============
  async getDirections(origin: { lat: number; lng: number }, destination: { lat: number; lng: number }) {
    const response = await this.api.get('/routes/directions', {
      params: {
        origin: `${origin.lat},${origin.lng}`,
        destination: `${destination.lat},${destination.lng}`,
      },
    });
    return response.data;
  }

  // ============ DRONES ============
  async getAvailableDrones() {
    const response = await this.api.get('/drones/available');
    return response.data;
  }

  async getAllDrones() {
    const response = await this.api.get('/drones');
    return response.data;
  }
}

export const apiService = new ApiService();
