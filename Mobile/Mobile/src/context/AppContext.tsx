// src/context/AppContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { apiService } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
}

interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  total: number;
  deliveryType: 'standard' | 'drone';
  status: 'pending' | 'preparing' | 'shipping' | 'delivered';
  createdAt: string;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  cart: CartItem[];
  orders: Record<string, Order[]>; // orders[userId] = [...]
  addToCart: (item: Omit<CartItem, 'quantity'>, force?: boolean) => void;
  updateCart: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
  loadRestaurants: () => Promise<any[]>;
  loadProductsByRestaurant: (restaurantId: string) => Promise<any[]>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Record<string, Order[]>>({}); // userId → orders

  // Load dữ liệu khi khởi động
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const u = await AsyncStorage.getItem('user');
      if (u) {
        const parsed = JSON.parse(u);
        setUserState(parsed);
        // Load đơn hàng riêng của user
        const userOrdersKey = `orders_${parsed.id}`;
        const userOrders = await AsyncStorage.getItem(userOrdersKey);
        if (userOrders) {
          setOrders(prev => ({ ...prev, [parsed.id]: JSON.parse(userOrders) }));
        }
      }
      const c = await AsyncStorage.getItem('cart');
      if (c) setCart(JSON.parse(c));
    } catch (e) {
      console.error('Load data error:', e);
    }
  };

  // === USER ===
  const setUser = async (newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
    } else {
      await AsyncStorage.removeItem('user');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login(email, password);
      const userData: User = {
        id: response.data._id || response.data.id,
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone || '',
        address: response.data.address || '',
      };
      await setUser(userData);
    } catch (error: any) {
      Alert.alert('Lỗi đăng nhập', error.response?.data?.message || 'Đăng nhập thất bại');
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string, phone: string) => {
    try {
      const response = await apiService.register(email, password, name, phone);
      const userData: User = {
        id: response.data._id || response.data.id,
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone,
        address: '',
      };
      await setUser(userData);
    } catch (error: any) {
      Alert.alert('Lỗi đăng ký', error.response?.data?.message || 'Đăng ký thất bại');
      throw error;
    }
  };

  const logout = async () => {
    await apiService.logout();
    await setUser(null);
    clearCart();
  };

  const loadRestaurants = async () => {
    try {
      const response = await apiService.getRestaurants();
      return response.data || [];
    } catch (error) {
      console.error('Load restaurants error:', error);
      return [];
    }
  };

  const loadProductsByRestaurant = async (restaurantId: string) => {
    try {
      const response = await apiService.getProductsByRestaurant(restaurantId);
      return response.data || [];
    } catch (error) {
      console.error('Load products error:', error);
      return [];
    }
  };

  // === CART ===
  const saveCart = async (newCart: CartItem[]) => {
    await AsyncStorage.setItem('cart', JSON.stringify(newCart));
    setCart(newCart);
  };

  const addToCart = (item: Omit<CartItem, 'quantity'>, force: boolean = false) => {
    const currentRestaurantId = cart.length > 0 ? cart[0].restaurantId : null;

    if (force) {
      const newCart: CartItem[] = [{ ...item, quantity: 1 }];
      saveCart(newCart);
      return;
    }

    if (currentRestaurantId && currentRestaurantId !== item.restaurantId) {
      Alert.alert(
        'Chỉ đặt từ 1 nhà hàng',
        `Giỏ hàng đang có món từ "${cart[0].restaurantName}".\n\nBạn muốn xóa để đặt từ "${item.restaurantName}" không?`,
        [
          { text: 'Hủy', style: 'cancel' },
          {
            text: 'Xóa & Thêm',
            style: 'destructive',
            onPress: () => addToCart(item, true),
          },
        ]
      );
      return;
    }

    const existing = cart.find(i => i.id === item.id);
    const newCart = existing
      ? cart.map(i => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      : [...cart, { ...item, quantity: 1 }];

    saveCart(newCart);
  };

  const updateCart = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    const newCart = cart.map(i => (i.id === id ? { ...i, quantity } : i));
    saveCart(newCart);
  };

  const removeFromCart = (id: string) => {
    const newCart = cart.filter(i => i.id !== id);
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  // === ORDERS – LƯU RIÊNG THEO USER.ID ===
  const saveOrders = async (userId: string, userOrders: Order[]) => {
    const key = `orders_${userId}`;
    await AsyncStorage.setItem(key, JSON.stringify(userOrders));
    setOrders(prev => ({ ...prev, [userId]: userOrders }));
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    if (!user) return;

    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const userOrders = orders[user.id] || [];
    const updated = [newOrder, ...userOrders];

    saveOrders(user.id, updated);
    clearCart(); // Xóa giỏ sau khi đặt
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        cart,
        orders,
        addToCart,
        updateCart,
        removeFromCart,
        clearCart,
        createOrder,
        login,
        register,
        logout,
        loadRestaurants,
        loadProductsByRestaurant,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};