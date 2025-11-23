"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI, Cart as APICart, CartItem as APICartItem } from './cart-api';
import { useAuth } from './auth-context';
import { toast } from '@/hooks/use-toast';

export interface CartItem {
  id: string;
  productId: string;
  restaurantId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  available: boolean;
}

interface CartContextType {
  cart: CartItem[];
  loading: boolean;
  error: string | null;
  totalItems: number;
  totalPrice: number;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convert API cart to local format
  const convertAPICart = (apiCart: APICart): CartItem[] => {
    return apiCart.items.map(item => ({
      id: item.productId._id,
      productId: item.productId._id,
      restaurantId: (item.productId as any).restaurantId || '',
      name: item.productId.name,
      price: item.price,
      quantity: item.quantity,
      image: item.productId.image,
      available: item.productId.available,
    }));
  };

  // Load cart from localStorage for non-authenticated users
  const loadLocalCart = useCallback(() => {
    try {
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        const parsed = JSON.parse(localCart);
        setCart(parsed);
      }
    } catch (err) {
      console.error('Error loading local cart:', err);
    }
  }, []);

  // Save cart to localStorage for non-authenticated users
  const saveLocalCart = useCallback((cartItems: CartItem[]) => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (err) {
      console.error('Error saving local cart:', err);
    }
  }, []);

  // Fetch cart from API
  const refreshCart = useCallback(async () => {
    // Get fresh token from localStorage if not in state
    const authToken = token || localStorage.getItem('foodfast_token');

    if (!user || !authToken) {
      loadLocalCart();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiCart = await cartAPI.getCart(authToken);
      const cartItems = convertAPICart(apiCart);
      setCart(cartItems);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to load cart');
      loadLocalCart(); // Fallback to local cart
    } finally {
      setLoading(false);
    }
  }, [user, token, loadLocalCart]);

  // Add item to cart
  const addToCart = useCallback(async (productId: string, quantity: number = 1) => {
    setError(null);

    // Get fresh token from localStorage if not in state
    const authToken = token || localStorage.getItem('foodfast_token');
    
    // Debug logging
    console.log('Add to cart - User:', user ? 'exists' : 'null');
    console.log('Add to cart - Token:', authToken ? 'exists' : 'null');

    if (!user) {
      const errorMsg = 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng';
      setError(errorMsg);
      toast({
        title: 'Chưa đăng nhập',
        description: errorMsg,
        variant: 'destructive',
      });
      throw new Error(errorMsg);
    }

    if (!authToken) {
      const errorMsg = 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại';
      setError(errorMsg);
      toast({
        title: 'Phiên hết hạn',
        description: errorMsg,
        variant: 'destructive',
      });
      throw new Error(errorMsg);
    }

    setLoading(true);

    try {
      // Fetch product details to get restaurant info
      const productResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products/${productId}`);
      if (!productResponse.ok) {
        throw new Error('Không thể lấy thông tin sản phẩm');
      }
      const product = await productResponse.json();
      
      // Check if cart has items from different restaurant
      if (cart.length > 0) {
        const existingRestaurantId = cart[0].restaurantId;
        if (existingRestaurantId && product.restaurantId !== existingRestaurantId) {
          const errorMsg = 'Bạn chỉ có thể đặt món từ một nhà hàng. Vui lòng xóa giỏ hàng hiện tại để đặt từ nhà hàng khác.';
          setError(errorMsg);
          toast({
            title: 'Không thể thêm món',
            description: errorMsg,
            variant: 'destructive',
          });
          throw new Error(errorMsg);
        }
      }

      const response = await cartAPI.addToCart(authToken, productId, quantity);
      const cartItems = convertAPICart(response.cart);
      setCart(cartItems);
      
      // Show success toast
      toast({
        title: '✓ Đã thêm vào giỏ hàng',
        description: `${product.name} đã được thêm vào giỏ hàng`,
      });
    } catch (err) {
      console.error('Error adding to cart:', err);
      const errorMessage = err instanceof Error ? err.message : 'Không thể thêm vào giỏ hàng';
      setError(errorMessage);
      
      // Only show toast if we haven't already shown one
      if (!errorMessage.includes('đăng nhập') && !errorMessage.includes('một nhà hàng')) {
        toast({
          title: 'Lỗi',
          description: errorMessage,
          variant: 'destructive',
        });
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, token, cart]);

  // Update quantity
  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    setError(null);

    // Get fresh token from localStorage if not in state
    const authToken = token || localStorage.getItem('foodfast_token');

    if (!user || !authToken) {
      const errorMsg = 'Vui lòng đăng nhập để cập nhật giỏ hàng';
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    setLoading(true);

    try {
      const response = await cartAPI.updateCartItem(authToken, productId, quantity);
      const cartItems = convertAPICart(response.cart);
      setCart(cartItems);
    } catch (err) {
      console.error('Error updating cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to update cart');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, token, saveLocalCart]);

  // Remove from cart
  const removeFromCart = useCallback(async (productId: string) => {
    setError(null);

    // Get fresh token from localStorage if not in state
    const authToken = token || localStorage.getItem('foodfast_token');

    if (!user || !authToken) {
      const errorMsg = 'Vui lòng đăng nhập để xóa sản phẩm khỏi giỏ hàng';
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    setLoading(true);

    try {
      const response = await cartAPI.removeFromCart(authToken, productId);
      const cartItems = convertAPICart(response.cart);
      setCart(cartItems);
    } catch (err) {
      console.error('Error removing from cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove from cart');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, token, saveLocalCart]);

  // Clear cart
  const clearCart = useCallback(async () => {
    setError(null);

    if (!user || !token) {
      setCart([]);
      localStorage.removeItem('cart');
      return;
    }

    setLoading(true);

    try {
      await cartAPI.clearCart(token);
      setCart([]);
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to clear cart');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  // Sync local cart to server when user logs in
  useEffect(() => {
    if (user && token) {
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        try {
          const parsed = JSON.parse(localCart) as CartItem[];
          if (parsed.length > 0) {
            const items = parsed.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
            }));
            
            cartAPI.syncCart(token, items)
              .then(response => {
                const cartItems = convertAPICart(response.cart);
                setCart(cartItems);
                localStorage.removeItem('cart'); // Clear local cart after sync
              })
              .catch(err => {
                console.error('Error syncing cart:', err);
              });
          } else {
            refreshCart();
          }
        } catch (err) {
          console.error('Error parsing local cart:', err);
          refreshCart();
        }
      } else {
        refreshCart();
      }
    } else {
      loadLocalCart();
    }
  }, [user, token, refreshCart, loadLocalCart]);

  // Calculate totals
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value: CartContextType = {
    cart,
    loading,
    error,
    totalItems,
    totalPrice,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
