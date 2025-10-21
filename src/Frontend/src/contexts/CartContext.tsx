import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../services/api';

interface CartItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  addedAt: string;
}

interface Cart {
  userId: string;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  createdAt: string;
  updatedAt: string;
}

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  addToCart: (productId: string, productName: string, unitPrice: number, quantity: number) => Promise<boolean>;
  updateCartItem: (productId: string, quantity: number) => Promise<boolean>;
  removeFromCart: (productId: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = async () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem('userId') || 'anonymous';
      const response = await apiClient.get(`/cart/${userId}`);
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const addToCart = async (productId: string, productName: string, unitPrice: number, quantity: number): Promise<boolean> => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem('userId') || 'anonymous';
      const response = await apiClient.post('/cart/items', {
        userId,
        productId,
        productName,
        unitPrice,
        quantity,
      });
      
      if (response.data) {
        setCart(response.data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItem = async (productId: string, quantity: number): Promise<boolean> => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem('userId') || 'anonymous';
      const response = await apiClient.put(`/cart/items/${productId}`, { quantity });
      
      if (response.data) {
        setCart(response.data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating cart item:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem('userId') || 'anonymous';
      const response = await apiClient.delete(`/cart/items/${productId}?userId=${userId}`);
      
      if (response.data) {
        setCart(response.data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem('userId') || 'anonymous';
      await apiClient.delete(`/cart/${userId}`);
      setCart(null);
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value: CartContextType = {
    cart,
    isLoading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
