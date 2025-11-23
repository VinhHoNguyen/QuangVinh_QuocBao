const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface CartItem {
  productId: {
    _id: string;
    name: string;
    price: number;
    image: string;
    available: boolean;
  };
  quantity: number;
  price: number;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

// Lấy giỏ hàng
export const getCart = async (token: string): Promise<Cart> => {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch cart');
  }

  return response.json();
};

// Thêm sản phẩm vào giỏ
export const addToCart = async (
  token: string,
  productId: string,
  quantity: number = 1
): Promise<{ message: string; cart: Cart }> => {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, quantity }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to add to cart');
  }

  return response.json();
};

// Cập nhật số lượng sản phẩm
export const updateCartItem = async (
  token: string,
  productId: string,
  quantity: number
): Promise<{ message: string; cart: Cart }> => {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, quantity }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update cart');
  }

  return response.json();
};

// Xóa sản phẩm khỏi giỏ
export const removeFromCart = async (
  token: string,
  productId: string
): Promise<{ message: string; cart: Cart }> => {
  const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to remove from cart');
  }

  return response.json();
};

// Xóa toàn bộ giỏ hàng
export const clearCart = async (
  token: string
): Promise<{ message: string; cart: Cart }> => {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to clear cart');
  }

  return response.json();
};

// Đồng bộ giỏ hàng
export const syncCart = async (
  token: string,
  items: { productId: string; quantity: number }[]
): Promise<{ message: string; cart: Cart }> => {
  const response = await fetch(`${API_BASE_URL}/cart/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ items }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to sync cart');
  }

  return response.json();
};

export const cartAPI = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  syncCart,
};
