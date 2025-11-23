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

      // Extract token from response.data if nested
      const authToken = response.token;
      const userData = response;

      if (!authToken) {
        throw new Error('No token received from server');
      }

      // Check if user is restaurant role
      if (userData.role !== 'restaurant') {
        throw new Error('This account is not a restaurant account');
      }

      // Get restaurantId - should be in userData
      const restId = userData.restaurantId;
      if (!restId) {
        throw new Error('Restaurant ID not found for this account');
      }

      // Save to state
      setToken(authToken);
      setUser(userData);
      setRestaurantId(restId);

      // Save to localStorage
      localStorage.setItem('restaurant_token', authToken);
      localStorage.setItem('restaurant_user', JSON.stringify(userData));
      localStorage.setItem('restaurant_id', restId);

      console.log('[Restaurant Auth] Login successful, restaurant ID:', restId);
    } catch (error: any) {
      console.error('[Restaurant Auth] Login error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
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
