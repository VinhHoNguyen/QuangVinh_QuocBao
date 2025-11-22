"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI, Cart as APICart, CartItem as APICartItem } from './cart-api';
import { useAuth } from './auth-context';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  isAvailable: boolean;
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
      name: item.productId.name,
      price: item.price,
      quantity: item.quantity,
      image: item.productId.image,
      isAvailable: item.productId.isAvailable,
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
    if (!user || !token) {
      loadLocalCart();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiCart = await cartAPI.getCart(token);
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

    if (!user || !token) {
      // Handle local cart for non-authenticated users
      setCart(prev => {
        const existingIndex = prev.findIndex(item => item.productId === productId);
        let newCart;
        
        if (existingIndex > -1) {
          newCart = [...prev];
          newCart[existingIndex].quantity += quantity;
        } else {
          // Note: For local cart, we need product info from somewhere
          // This is a simplified version - you may need to fetch product details
          console.warn('Adding to local cart requires product details');
          return prev;
        }
        
        saveLocalCart(newCart);
        return newCart;
      });
      return;
    }

    setLoading(true);

    try {
      const response = await cartAPI.addToCart(token, productId, quantity);
      const cartItems = convertAPICart(response.cart);
      setCart(cartItems);
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to add to cart');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, token, saveLocalCart]);

  // Update quantity
  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    setError(null);

    if (!user || !token) {
      // Handle local cart
      setCart(prev => {
        let newCart;
        if (quantity === 0) {
          newCart = prev.filter(item => item.productId !== productId);
        } else {
          newCart = prev.map(item =>
            item.productId === productId ? { ...item, quantity } : item
          );
        }
        saveLocalCart(newCart);
        return newCart;
      });
      return;
    }

    setLoading(true);

    try {
      const response = await cartAPI.updateCartItem(token, productId, quantity);
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

    if (!user || !token) {
      // Handle local cart
      setCart(prev => {
        const newCart = prev.filter(item => item.productId !== productId);
        saveLocalCart(newCart);
        return newCart;
      });
      return;
    }

    setLoading(true);

    try {
      const response = await cartAPI.removeFromCart(token, productId);
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
