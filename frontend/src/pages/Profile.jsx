import { useAuth } from '../hooks/useAuth.js';
import { useSavedRecipes } from '../hooks/useAuth.js';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useEffect, useMemo, useState } from 'react';
import { apiGetRecipes } from '../utils/api.js';

const Profile = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { savedIds, clearSaved, isLoading: savedIdsLoading } = useSavedRecipes();
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [recipesLoading, setRecipesLoading] = useState(true);
  const [recipesError, setRecipesError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setRecipesLoading(true);
        setRecipesError('');

        if (!savedIds || savedIds.length === 0) {
          if (!mounted) return;
          setSavedRecipes([]);
          return;
        }

        const hasObjectIds = savedIds.some((x) => /^[a-f0-9]{24}$/i.test(String(x)));
        if (hasObjectIds) {
          const data = await apiGetRecipes({ limit: 500 });
          if (!mounted) return;
          const savedSet = new Set(savedIds.map(String));
          const all = Array.isArray(data.items) ? data.items : [];
          setSavedRecipes(all.filter((r) => savedSet.has(String(r?._id))));
        } else {
          const data = await apiGetRecipes({ ids: savedIds });
          if (!mounted) return;
          setSavedRecipes(data.items || []);
        }
      } catch (err) {
        if (!mounted) return;
        setRecipesError(err?.message || 'Failed to load saved recipes');
      } finally {
        if (!mounted) return;
        setRecipesLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [savedIds]);

  const cuisinesExploredCount = useMemo(() => {
    return new Set(savedRecipes.map((r) => r.cuisine)).size;
  }, [savedRecipes]);

  const favoriteTagsCount = useMemo(() => {
    return new Set(savedRecipes.flatMap((r) => r.tags)).size;
  }, [savedRecipes]);

  const handleLogout = () => {
    logout();
    // Navigation will be handled by Layout component
  };

  const handleClearSaved = () => {
    if (window.confirm('Are you sure you want to clear all saved recipes? This action cannot be undone.')) {
      clearSaved();
    }
  };

  if (!isAuthenticated) {
    return (
      <EmptyState
        title="Sign In to View Your Profile"
        description="Login to manage your account and save recipes."
        buttonText="Sign In"
        buttonLink="/login"
        icon="login"
      />
    );
  }

  if (savedIdsLoading || recipesLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-gray-200 h-64 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (recipesError) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Failed to load saved recipes</h2>
        <p className="text-gray-600 mb-6">{recipesError}</p>
        <Link
          to="/recipes"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Browse Recipes
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
            <p className="text-gray-600">Manage your account and saved recipes</p>
          </div>
          
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>

        {/* User Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500 mt-1">Member since December 2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Recipes Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Saved Recipes</p>
              <p className="text-2xl font-bold text-gray-900">{savedIds.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cuisines Explored</p>
              <p className="text-2xl font-bold text-gray-900">
                {cuisinesExploredCount}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Favorite Tags</p>
              <p className="text-2xl font-bold text-gray-900">
                {favoriteTagsCount}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Recipes Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Saved Recipes</h2>
          {savedIds.length > 0 && (
            <button
              onClick={handleClearSaved}
              className="text-red-600 hover:text-red-800 font-medium text-sm"
            >
              Clear All
            </button>
          )}
        </div>

        {savedIds.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No saved recipes yet</h3>
            <p className="text-gray-500 mb-6">Start exploring and save recipes you love!</p>
            <Link
              to="/recipes"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse Recipes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} showSaveButton={true} />
            ))}
          </div>
        )}
      </div>

      <div />
    </div>
  );
};

export default Profile;
