'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  addresses: any[];
  wishlist: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, password: string) => Promise<any>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<any>;
  addToWishlist: (productId: string) => Promise<any>;
  removeFromWishlist: (productId: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { API_URL } from '@/config';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('nextskin_token');
    const storedUser = localStorage.getItem('nextskin_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      
      setUser(data);
      setToken(data.token);
      localStorage.setItem('nextskin_token', data.token);
      localStorage.setItem('nextskin_user', JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        addresses: data.addresses || [],
        wishlist: data.wishlist || []
      }));
      return data;
    } catch (err: any) {
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      
      setUser(data);
      setToken(data.token);
      localStorage.setItem('nextskin_token', data.token);
      localStorage.setItem('nextskin_user', JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        addresses: [],
        wishlist: []
      }));
      return data;
    } catch (err: any) {
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('nextskin_token');
    localStorage.removeItem('nextskin_user');
  };

  const updateProfile = async (userData: Partial<User>) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update profile');
      
      setUser(data);
      localStorage.setItem('nextskin_user', JSON.stringify(data));
      return data;
    } catch (err: any) {
      throw err;
    }
  };

  const addToWishlist = async (productId: string) => {
    if (!user) return;
    const currentWishlist = user.wishlist || [];
    if (currentWishlist.includes(productId)) return;
    
    const updatedWishlist = [...currentWishlist, productId];
    await updateProfile({ wishlist: updatedWishlist });
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;
    const currentWishlist = user.wishlist || [];
    const updatedWishlist = currentWishlist.filter(id => id !== productId);
    await updateProfile({ wishlist: updatedWishlist });
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile, addToWishlist, removeFromWishlist }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
