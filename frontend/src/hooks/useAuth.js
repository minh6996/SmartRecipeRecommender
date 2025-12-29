import { useState, useEffect, useCallback } from 'react';

// localStorage keys
const USER_KEY = 'sr-user';
const TOKEN_KEY = 'sr-token';
const SAVED_KEY = 'sr-saved';
const AUTH_EVENT = 'sr-auth';

const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
};

const readStoredUser = () => {
  const storedUser = localStorage.getItem(USER_KEY);
  return storedUser ? JSON.parse(storedUser) : null;
};

/**
 * Authentication hook
 * In production: would connect to POST /api/auth/login and DELETE /api/auth/logout
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing user on mount
  useEffect(() => {
    setUser(readStoredUser());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const syncAuth = () => setUser(readStoredUser());
    window.addEventListener('storage', syncAuth);
    window.addEventListener(AUTH_EVENT, syncAuth);
    return () => {
      window.removeEventListener('storage', syncAuth);
      window.removeEventListener(AUTH_EVENT, syncAuth);
    };
  }, []);

  // Login function - mock accepts any non-empty email/password
  const login = useCallback((email, password) => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    const userData = { email };
    setUser(userData);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    localStorage.setItem(TOKEN_KEY, 'mock');
    window.dispatchEvent(new Event(AUTH_EVENT));
    
    // In production: would call POST /api/auth/login
    // return await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  }, []);

  const googleLogin = useCallback(async (credential) => {
    if (!credential) {
      throw new Error('Missing Google credential');
    }

    const res = await fetch(`${getApiBaseUrl()}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.message || 'Google login failed');
    }

    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
    window.dispatchEvent(new Event(AUTH_EVENT));
    return data;
  }, []);

  // Logout function
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    window.dispatchEvent(new Event(AUTH_EVENT));
    
    // In production: would call DELETE /api/auth/logout
    // return await fetch('/api/auth/logout', { method: 'DELETE' });
  }, []);

  const token = localStorage.getItem(TOKEN_KEY);

  return {
    user,
    isLoading,
    login,
    googleLogin,
    logout,
    token,
    isAuthenticated: !!user
  };
};

/**
 * Saved recipes hook
 * In production: would connect to POST /api/interactions/save and GET /api/interactions/saved
 */
export const useSavedRecipes = () => {
  const [savedIds, setSavedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved recipes from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(SAVED_KEY);
    if (stored) {
      setSavedIds(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  // Toggle save/unsave recipe
  const toggleSave = (recipeId) => {
    setSavedIds(prev => {
      const newSaved = prev.includes(recipeId)
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId];
      
      localStorage.setItem(SAVED_KEY, JSON.stringify(newSaved));
      
      // In production: would call POST /api/interactions/save
      // await fetch('/api/interactions/save', { 
      //   method: 'POST', 
      //   body: JSON.stringify({ recipeId, action: newSaved.includes(recipeId) ? 'save' : 'unsave' })
      // });
      
      return newSaved;
    });
  };

  // Check if recipe is saved
  const isSaved = (recipeId) => {
    return savedIds.includes(recipeId);
  };

  // Clear all saved recipes
  const clearSaved = () => {
    setSavedIds([]);
    localStorage.removeItem(SAVED_KEY);
    
    // In production: would call DELETE /api/interactions/saved
    // await fetch('/api/interactions/saved', { method: 'DELETE' });
  };

  return {
    savedIds,
    isLoading,
    toggleSave,
    isSaved,
    clearSaved,
    savedCount: savedIds.length
  };
};
