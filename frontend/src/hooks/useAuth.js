import { useState, useEffect, useCallback, useRef } from 'react';
import {
  apiCreateInteraction,
  apiDeleteInteraction,
  apiGetMyInteractions,
  apiGetRecipes,
} from '../utils/api.js';

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
    void email;
    void password;
    throw new Error('Email/password login is disabled. Please sign in with Google.');
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
  const savedIdsRef = useRef([]);
  const opQueueRef = useRef(Promise.resolve());
  const [savedStorageKey, setSavedStorageKey] = useState(() => {
    const u = readStoredUser();
    const userKey = u?._id || u?.id || u?.email || u?.googleSub;
    return userKey ? `${SAVED_KEY}:${String(userKey)}` : '';
  });

  const getSavedKey = useCallback((recipeOrId) => {
    if (recipeOrId == null) return '';
    if (typeof recipeOrId === 'object') {
      if (recipeOrId._id != null) return String(recipeOrId._id);
      if (recipeOrId.id != null) return String(recipeOrId.id);
      return '';
    }
    return String(recipeOrId);
  }, []);

  useEffect(() => {
    const syncKey = () => {
      const u = readStoredUser();
      const userKey = u?._id || u?.id || u?.email || u?.googleSub;
      setSavedStorageKey(userKey ? `${SAVED_KEY}:${String(userKey)}` : '');
    };

    window.addEventListener('storage', syncKey);
    window.addEventListener(AUTH_EVENT, syncKey);
    syncKey();

    return () => {
      window.removeEventListener('storage', syncKey);
      window.removeEventListener(AUTH_EVENT, syncKey);
    };
  }, []);

  useEffect(() => {
    if (!savedStorageKey) {
      setSavedIds([]);
      setIsLoading(false);
      return;
    }

    try {
      const legacy = localStorage.getItem(SAVED_KEY);
      const existing = localStorage.getItem(savedStorageKey);
      if (legacy && !existing) {
        localStorage.setItem(savedStorageKey, legacy);
        localStorage.removeItem(SAVED_KEY);
      }

      const stored = localStorage.getItem(savedStorageKey);
      setSavedIds(stored ? JSON.parse(stored) : []);
    } catch {
      setSavedIds([]);
    } finally {
      setIsLoading(false);
    }
  }, [savedStorageKey]);

  // Sync saved recipes from backend interactions so saved list persists across devices/browsers.
  useEffect(() => {
    if (!savedStorageKey) return;

    let cancelled = false;

    const syncFromBackend = async () => {
      try {
        const data = await apiGetMyInteractions({ type: 'save' });
        const items = Array.isArray(data?.items) ? data.items : [];

        const idsFromDb = items
          .map((x) => x?.recipeId)
          .filter(Boolean)
          .map(String);

        if (idsFromDb.length === 0) return;

        let local = [];
        try {
          const stored = localStorage.getItem(savedStorageKey);
          local = stored ? JSON.parse(stored) : [];
          if (!Array.isArray(local)) local = [];
        } catch {
          local = [];
        }

        const merged = Array.from(new Set([...local.map(String), ...idsFromDb]));
        if (cancelled) return;

        setSavedIds(merged);
        localStorage.setItem(savedStorageKey, JSON.stringify(merged));
      } catch {
        // If user is not logged in (missing token) or backend is down, keep local state.
      }
    };

    // Avoid blocking UI: run in background.
    void syncFromBackend();

    return () => {
      cancelled = true;
    };
  }, [savedStorageKey]);

  useEffect(() => {
    savedIdsRef.current = Array.isArray(savedIds) ? savedIds : [];
  }, [savedIds]);

  // One-time migration: numeric recipe.id -> recipe._id (ObjectId string)
  useEffect(() => {
    let cancelled = false;

    const migrate = async () => {
      const current = Array.isArray(savedIds) ? savedIds : [];
      if (current.length === 0) return;

      const hasLegacyNumeric = current.some((x) => {
        if (x == null) return false;
        const s = String(x);
        const isObjectId = /^[a-f0-9]{24}$/i.test(s);
        const asNum = Number(s);
        return !isObjectId && Number.isFinite(asNum);
      });

      if (!hasLegacyNumeric) return;

      try {
        const data = await apiGetRecipes({ limit: 500 });
        const recipes = Array.isArray(data?.items) ? data.items : [];
        const idToObjectId = new Map(recipes.map((r) => [String(r?.id), String(r?._id)]));

        const migrated = current
          .map((x) => {
            const key = String(x);
            const mapped = idToObjectId.get(key);
            return mapped || key;
          })
          .filter(Boolean);

        const unique = Array.from(new Set(migrated));
        if (cancelled) return;

        setSavedIds(unique);
        if (savedStorageKey) {
          localStorage.setItem(savedStorageKey, JSON.stringify(unique));
        }
      } catch {
        // If migration fails, keep legacy ids; app continues to work.
      }
    };

    migrate();

    return () => {
      cancelled = true;
    };
  }, [savedIds, savedStorageKey]);

  // Toggle save/unsave recipe
  const toggleSave = useCallback(async (recipe) => {
    const key = getSavedKey(recipe);
    if (!key) {
      throw new Error('Invalid recipe');
    }

    if (!savedStorageKey) {
      throw new Error('Missing user');
    }

    const run = async () => {
      let prevSaved = savedIdsRef.current;
      try {
        const stored = localStorage.getItem(savedStorageKey);
        prevSaved = stored ? JSON.parse(stored) : savedIdsRef.current;
        if (!Array.isArray(prevSaved)) prevSaved = [];
      } catch {
        prevSaved = savedIdsRef.current;
      }

      const wasSaved = prevSaved.includes(key);
      const nextSaved = wasSaved
        ? prevSaved.filter((id) => id !== key)
        : [...prevSaved, key];

      setSavedIds(nextSaved);
      localStorage.setItem(savedStorageKey, JSON.stringify(nextSaved));

      try {
        if (!wasSaved) {
          await apiCreateInteraction({
            recipeId: recipe?._id ? String(recipe._id) : key,
            type: 'save',
            weight: 3,
          });
        } else {
          await apiDeleteInteraction({
            recipeId: recipe?._id ? String(recipe._id) : key,
            type: 'save',
          });
        }
      } catch (err) {
        setSavedIds(prevSaved);
        localStorage.setItem(savedStorageKey, JSON.stringify(prevSaved));
        throw err;
      }
    };

    opQueueRef.current = opQueueRef.current.then(run, run);
    return opQueueRef.current;
  }, [getSavedKey, savedStorageKey]);

  // Check if recipe is saved
  const isSaved = (recipe) => {
    const key = getSavedKey(recipe);
    if (!key) return false;
    return savedIds.includes(key);
  };

  // Clear all saved recipes
  const clearSaved = () => {
    setSavedIds([]);
    if (savedStorageKey) {
      localStorage.removeItem(savedStorageKey);
    }
    
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
