"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, AdminUser } from './admin-api';
import { useRouter } from 'next/navigation';

interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token');
      const savedUser = localStorage.getItem('admin_user');

      if (token && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          
          // Verify token is still valid
          const response = await authAPI.me();
          const currentUser = response.data; // Backend returns { success, data: { _id, email, name, role } }
          
          // Make sure user is admin
          if (currentUser.role === 'admin') {
            setUser(currentUser);
          } else {
            // Not admin, clear storage
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            router.push('/login');
          }
        } catch (error) {
          // Token invalid, clear storage
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          setUser(null);
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      
      // Backend returns: { success, message, data: { token, _id, email, name, role, restaurantId } }
      const { token, role, _id, email: userEmail, name } = response.data;
      
      // Check if user is admin
      if (role !== 'admin') {
        throw new Error('Không có quyền truy cập. Vui lòng đăng nhập với tài khoản admin.');
      }

      const user = {
        _id,
        email: userEmail,
        name,
        role,
      };

      // Save token and user info
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify(user));
      
      setUser(user as any);
      
      // Redirect to dashboard
      router.push('/admin');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Đăng nhập thất bại');
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
}
