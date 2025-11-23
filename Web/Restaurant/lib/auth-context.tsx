'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, AuthResponse } from './api';

interface AuthContextType {
  user: AuthResponse | null;
  restaurantId: string | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedToken = localStorage.getItem('restaurant_token');
    const storedUser = localStorage.getItem('restaurant_user');
    const storedRestaurantId = localStorage.getItem('restaurant_id');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setRestaurantId(storedRestaurantId);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('[Restaurant Auth] Logging in with:', email);
      const response = await authAPI.login({ email, password });
      
      console.log('[Restaurant Auth] Login response:', response);

      // Response is already the AuthResponse object (flat structure)
      const authToken = response.token;

      if (!authToken) {
        throw new Error('Không nhận được token từ server. Vui lòng thử lại.');
      }

      // Check if user is restaurant_owner role
      if (response.role !== 'restaurant_owner') {
        throw new Error('Tài khoản này không phải là tài khoản nhà hàng. Vui lòng sử dụng tài khoản nhà hàng để đăng nhập.');
      }

      // Get restaurantId - should be in response
      const restId = response.restaurantId;
      if (!restId) {
        throw new Error('Không tìm thấy thông tin nhà hàng cho tài khoản này. Vui lòng liên hệ admin.');
      }

      // Save to state
      setToken(authToken);
      setUser(response);
      setRestaurantId(restId);

      // Save to localStorage
      localStorage.setItem('restaurant_token', authToken);
      localStorage.setItem('restaurant_user', JSON.stringify(response));
      localStorage.setItem('restaurant_id', restId);

      console.log('[Restaurant Auth] Login successful, restaurant ID:', restId);
    } catch (error: any) {
      console.error('[Restaurant Auth] Login error:', error);
      
      // Enhanced error messages based on status code
      if (error.response) {
        const status = error.response.status;
        const serverMessage = error.response.data?.message;
        
        if (status === 401) {
          throw new Error('Email hoặc mật khẩu không đúng. Bạn chưa có tài khoản hoặc thông tin đăng nhập không chính xác.');
        } else if (status === 404) {
          throw new Error('Tài khoản không tồn tại trong hệ thống. Vui lòng đăng ký tài khoản mới.');
        } else if (status === 403) {
          throw new Error('Tài khoản của bạn đã bị khóa hoặc chưa được kích hoạt. Vui lòng liên hệ admin.');
        } else if (status === 500) {
          throw new Error('Lỗi server. Vui lòng thử lại sau hoặc liên hệ admin.');
        } else if (serverMessage) {
          throw new Error(serverMessage);
        }
      }
      
      // Network or other errors
      if (error.message && !error.response) {
        throw error; // Re-throw custom errors from above
      }
      
      throw new Error('Đăng nhập thất bại. Vui lòng kiểm tra kết nối internet và thử lại.');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRestaurantId(null);
    localStorage.removeItem('restaurant_token');
    localStorage.removeItem('restaurant_user');
    localStorage.removeItem('restaurant_id');
    console.log('[Restaurant Auth] Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, restaurantId, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
