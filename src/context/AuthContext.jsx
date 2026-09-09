/* eslint-disable react/only-export-components */
import { createContext, useState, useEffect, useCallback } from 'react';
import { registerUser as apiRegisterUser } from '../services/api';

export const AuthContext = createContext(null);

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

/**
 * AuthProvider component
 * Manages user session, JWT storage, and authentication state.
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session from localStorage on startup
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      const savedUser = localStorage.getItem(USER_KEY);

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.error('[AuthContext] Failed to restore session:', err.message);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Log in user, store credentials in localStorage, update state
   */
  const login = useCallback((newToken, newUser) => {
    try {
      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
    } catch (err) {
      console.error('[AuthContext] Failed to save login session:', err.message);
    }
  }, []);

  /**
   * Log out user, remove credentials from localStorage, clear state
   */
  const logout = useCallback(() => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (err) {
      console.error('[AuthContext] Failed to clear session:', err.message);
    } finally {
      setToken(null);
      setUser(null);
    }
  }, []);

  /**
   * Helper for user registration
   */
  const register = useCallback(async (userData) => {
    return await apiRegisterUser(userData);
  }, []);

  // Listen for auth expiration events dispatched by API service
  useEffect(() => {
    const handleAuthExpired = () => {
      logout();
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    return () => {
      window.removeEventListener('auth:expired', handleAuthExpired);
    };
  }, [logout]);

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token && user),
    loading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { useAuth } from './useAuth';
export default AuthProvider;
