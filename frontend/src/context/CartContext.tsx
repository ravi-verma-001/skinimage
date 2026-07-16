'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  image: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
}

interface CartContextType {
  cart: CartItem[];
  coupon: Coupon | null;
  addToCart: (item: CartItem) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  totals: {
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    grandTotal: number;
  };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    const storedCart = localStorage.getItem('nextskin_cart');
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('nextskin_cart', JSON.stringify(newCart));
  };

  const addToCart = (item: CartItem) => {
    const existing = cart.find(i => i.productId === item.productId);
    let newCart = [];
    if (existing) {
      newCart = cart.map(i => 
        i.productId === item.productId 
          ? { ...i, quantity: i.quantity + item.quantity } 
          : i
      );
    } else {
      newCart = [...cart, item];
    }
    saveCart(newCart);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const newCart = cart.map(i => i.productId === productId ? { ...i, quantity } : i);
    saveCart(newCart);
  };

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter(i => i.productId !== productId);
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
    setCoupon(null);
  };

  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch(`${API_URL}/coupons/validate/${code.toUpperCase()}`);
      const data = await res.json();
      if (!res.ok) {
        return false;
      }
      setCoupon(data);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => {
    const activePrice = item.discountPrice || item.price;
    return sum + (activePrice * item.quantity);
  }, 0);

  let discount = 0;
  if (coupon) {
    if (coupon.discountType === 'percentage') {
      discount = subtotal * (coupon.discountValue / 100);
    } else {
      discount = coupon.discountValue;
    }
  }

  const shipping = subtotal > 0 && (subtotal - discount) < 50 ? 5.00 : 0.00;
  const tax = parseFloat(((subtotal - discount) * 0.08).toFixed(2));
  const grandTotal = parseFloat((subtotal - discount + shipping + tax).toFixed(2));

  const totals = {
    subtotal: parseFloat(subtotal.toFixed(2)),
    discount: parseFloat(discount.toFixed(2)),
    shipping,
    tax,
    grandTotal: Math.max(0, grandTotal),
  };

  return (
    <CartContext.Provider value={{ cart, coupon, addToCart, updateQuantity, removeFromCart, clearCart, applyCoupon, removeCoupon, totals }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error('useCart must be used within a CartProvider');
  return context;
};
