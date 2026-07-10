import { useState, useEffect, useCallback } from 'react';

export interface AuthUser {
  email: string;
  name: string;
  avatarUrl?: string | null;
}

const AUTH_STORAGE_KEY = 'erp_auth_user';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // Load auth state from sessionStorage on mount
  useEffect(() => {
    try {
      const storedAuth = sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (storedAuth) {
        const user = JSON.parse(storedAuth) as AuthUser;
        setCurrentUser(user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
    }
  }, []);

  const login = useCallback((email: string, name: string, avatarUrl?: string | null) => {
    const user: AuthUser = { email, name, avatarUrl };
    setCurrentUser(user);
    setIsAuthenticated(true);
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const register = useCallback((email: string, name: string, avatarUrl?: string | null) => {
    const user: AuthUser = { email, name, avatarUrl };
    setCurrentUser(user);
    setIsAuthenticated(true);
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }, []);

  return {
    isAuthenticated,
    currentUser,
    login,
    logout,
    register,
  };
}
