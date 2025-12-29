import { useState, useEffect } from 'react';

// localStorage keys
const USER_KEY = 'sr-user';
const SAVED_KEY = 'sr-saved';

/**
 * Authentication hook
 * In production: would connect to POST /api/auth/login and DELETE /api/auth/logout
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function - mock accepts any non-empty email/password
  const login = (email, password) => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    const userData = { email };
    setUser(userData);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    
    // In production: would call POST /api/auth/login
    // return await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
    
    // In production: would call DELETE /api/auth/logout
    // return await fetch('/api/auth/logout', { method: 'DELETE' });
  };

  return {
    user,
    isLoading,
    login,
    logout,
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
