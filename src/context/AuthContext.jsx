import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'pantrypal_user';
const TOKEN_KEY   = 'pantrypal_token';
const API_URL     = 'https://pantrypal-backend-bay.vercel.app/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const isAuthenticated = Boolean(user && token);

  // Helper used by PantryContext and other contexts
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
  });

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!data.success) return { success: false, error: data.message || 'Login failed' };

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
      localStorage.setItem(TOKEN_KEY, data.token);
      return { success: true };
    } catch {
      return { success: false, error: 'Network error. Please try again later.' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!data.success) return { success: false, error: data.message || 'Registration failed' };
      return { success: true, status: data.status, message: data.message };
    } catch {
      return { success: false, error: 'Network error. Please try again later.' };
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      const res = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (!data.success) return { success: false, error: data.message || 'Verification failed' };
      return { success: true, message: data.message };
    } catch {
      return { success: false, error: 'Network error. Please try again later.' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  // Update profile — calls API and syncs localStorage
  const updateProfile = async (updates) => {
    try {
      const res = await fetch(`${API_URL}/settings/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.success) {
        const updated = { ...user, ...data.user };
        setUser(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return { success: true };
      }
      return { success: false, error: data.message };
    } catch {
      // Fallback: update locally if API fails
      const updated = { ...user, ...updates };
      setUser(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { success: true };
    }
  };

  return (
    <AuthContext.Provider value={{
      user, token, isAuthenticated,
      login, register, verifyOTP, logout, updateProfile, getAuthHeaders
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
