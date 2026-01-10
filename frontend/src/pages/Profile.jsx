import { useAuth } from '../hooks/useAuth.js';
import { useSavedRecipes } from '../hooks/useAuth.js';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useEffect, useMemo, useState } from 'react';
import { apiGetRecipes } from '../utils/api.js';
import { getRecommendationDiagnostics } from '../utils/recommendations.js';

const Profile = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { savedIds, clearSaved, isLoading: savedIdsLoading } = useSavedRecipes();
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [recipesLoading, setRecipesLoading] = useState(true);
  const [recipesError, setRecipesError] = useState('');
  const [isPrinting, setIsPrinting] = useState(false);

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

  const handlePrintSimilarity = async () => {
    if (!savedIds || savedIds.length === 0) {
      window.alert('You have no saved recipes yet. Save a few recipes first to generate similarity scores.');
      return;
    }

    try {
      setIsPrinting(true);
      const data = await apiGetRecipes({ limit: 500 });
      const all = Array.isArray(data?.items) ? data.items : [];
      const rows = getRecommendationDiagnostics(all, savedIds, 50);

      const csvEscape = (v) => {
        const s = v == null ? '' : String(v);
        return `"${s.replace(/"/g, '""')}"`;
      };

      const header = [
        'rank',
        'recipeTitle',
        'recipeId',
        'recipeMongoId',
        'cosineSim',
        'popScore',
        'ctxScore',
        'finalScore',
        'finalScoreFormula',
      ];

      const lines = [header.join(',')];
      rows.forEach((r, idx) => {
        const recipe = r?.recipe;
        const line = [
          idx + 1,
          csvEscape(recipe?.title),
          recipe?.id ?? '',
          csvEscape(recipe?._id),
          Number(r?.cosineSim ?? 0).toFixed(6),
          Number(r?.popScore ?? 0).toFixed(6),
          Number(r?.ctxScore ?? 0).toFixed(6),
          Number(r?.finalScore ?? 0).toFixed(6),
          csvEscape(r?.finalScoreFormula),
        ].join(',');
        lines.push(line);
      });

      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      const filename = `similarity_${y}${m}${d}.csv`;

      const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      window.alert(err?.message || 'Failed to generate similarity report');
    } finally {
      setIsPrinting(false);
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
    <div className="space-y-10">
      {/* Profile Header */}
      <div className="glass rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl -z-10 opacity-50 translate-x-1/2 -translate-y-1/2" />

        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center ring-4 ring-white shadow-lg">
              <svg className="w-10 h-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{user?.name || 'Chef'}</h1>
              <p className="text-slate-500 font-medium">{user?.email}</p>
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                Member since {new Date().getFullYear()}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all border border-slate-200 hover:border-red-200"
          >
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>

      {/* Saved Recipes Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-slate-100 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Saved Recipes</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{savedIds.length}</p>
            </div>
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-slate-100 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Cuisines Explored</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {cuisinesExploredCount}
              </p>
            </div>
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-slate-100 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Favorite Tags</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {favoriteTagsCount}
              </p>
            </div>
            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Recipes Section */}
      <div>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Your Cookbook</h2>
            <p className="text-slate-500 mt-1">Collection of your favorite discoveries</p>
          </div>
          {savedIds.length > 0 && (
            <button
              onClick={handleClearSaved}
              className="text-red-500 hover:text-red-700 font-semibold text-sm transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear All
            </button>
          )}
        </div>

        {savedIds.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No saved recipes yet</h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">Start exploring the culinary world and save recipes you want to cook later!</p>
            <Link
              to="/recipes"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-1"
            >
              Discover Recipes
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

      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Account Actions</h3>
        <div className="space-y-3">
          <button
            onClick={handlePrintSimilarity}
            disabled={isPrinting}
            className="w-full text-left px-5 py-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed shadow-sm group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 group-hover:text-primary-600 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <span className="font-semibold text-slate-800 block">Expert Data Export</span>
                <span className="text-xs text-slate-500">Download diagnostics CSV for recommendation engine</span>
              </div>
            </div>
            <span className="text-sm font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full group-hover:bg-primary-100 transition-colors">
              {isPrinting ? 'Generating...' : 'Download'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
