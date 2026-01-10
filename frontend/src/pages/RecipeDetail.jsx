import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import TagPill from '../components/TagPill.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useSavedRecipes } from '../hooks/useAuth.js';
import { apiGetRecipeById, apiDeleteRecipe } from '../utils/api.js';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { toggleSave, isSaved } = useSavedRecipes();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiGetRecipeById(id);
        if (!mounted) return;
        setRecipe(data.item);
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || 'Recipe not found');
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleSaveClick = async () => {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      navigate(`/login?redirect=${encodeURIComponent(`/recipes/${id}`)}`);
      return;
    }

    try {
      await toggleSave(recipe);
    } catch (err) {
      console.error(err);
      window.alert(err?.message || 'Failed to save recipe');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
      return;
    }

    try {
      await apiDeleteRecipe(recipe.id);
      navigate('/recipes');
    } catch (err) {
      console.error(err);
      window.alert(err?.message || 'Failed to delete recipe');
    }
  };

  // Generate placeholder color
  const colors = [
    'bg-red-200', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200',
    'bg-purple-200', 'bg-pink-200', 'bg-indigo-200', 'bg-orange-200'
  ];
  const placeholderColor = recipe ? colors[recipe.id % colors.length] : 'bg-gray-200';

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recipe Not Found</h2>
        <p className="text-gray-600 mb-6">The recipe you're looking for doesn't exist.</p>
        <Link
          to="/recipes"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Browse All Recipes
        </Link>
      </div>
    );
  }

  const saved = isSaved(recipe);

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Breadcrumb */}
      <nav className="flex mb-8 text-sm font-medium text-slate-500">
        <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
        <span className="mx-2 text-slate-300">/</span>
        <Link to="/recipes" className="hover:text-primary-600 transition-colors">Recipes</Link>
        <span className="mx-2 text-slate-300">/</span>
        <span className="text-slate-900 truncate max-w-xs">{recipe.title}</span>
      </nav>

      {/* Hero Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-10 group relative">
        {/* Image */}
        <div className="relative h-96 bg-slate-100 overflow-hidden">
          {recipe?.imageUrl ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </>
          ) : (
            <div className={`h-full ${placeholderColor} flex items-center justify-center`}>
              <div className="text-center">
                <svg
                  className="w-24 h-24 mx-auto mb-4 text-slate-600/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            </div>
          )}
          {/* Title Overlay (Mobile/Tablet) or Bottom Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8 z-20 text-white">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-sm font-semibold">
                {recipe.cuisine}
              </span>
              <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-sm font-semibold flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {recipe.cookingTime} min
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-md mb-2">
              {recipe.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content (Ingredients + Steps) */}
        <div className="lg:col-span-2 space-y-10">

          {/* Action Bar (Mobile only, or secondary) */}
          <div className="flex items-center justify-between lg:hidden mb-6">
            {/* ... responsive actions ... */}
          </div>

          {/* Ingredients */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </span>
              Ingredients
            </h2>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center gap-3 text-slate-700 py-2 border-b border-slate-50 last:border-0 hover:bg-slate-50 rounded-lg px-2 -mx-2 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-primary-400 flex-shrink-0" />
                  <span className="font-medium">{ingredient}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Instructions */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </span>
              Instructions
            </h2>
            <div className="space-y-8 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-100">
              {recipe.steps.map((step, index) => (
                <div key={index} className="relative pl-12 group">
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-white border-2 border-primary-100 text-primary-600 font-bold flex items-center justify-center text-sm shadow-sm group-hover:border-primary-500 group-hover:bg-primary-50 transition-colors z-10">
                    {index + 1}
                  </div>
                  <p className="text-slate-700 leading-relaxed text-lg group-hover:text-slate-900 transition-colors">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Actions</h3>

            <button
              onClick={handleSaveClick}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-all transform active:scale-[0.98] mb-3 ${saved
                ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'
                : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/30'
                }`}
            >
              <svg
                className={`w-5 h-5 ${saved ? 'fill-current' : 'none'}`}
                fill={saved ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {saved ? 'Saved to Cookbook' : 'Save Recipe'}
            </button>

            {user?.role === 'admin' && (
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <Link
                  to={`/recipes/${recipe.id}/edit`}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors w-full"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Recipe
                </Link>
                <button
                  onClick={handleDelete}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium bg-white text-red-600 hover:bg-red-50 border border-dashed border-red-200 hover:border-red-300 transition-colors w-full"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Recipe
                </button>
              </div>
            )}

            <div className="mt-6">
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag, index) => (
                  <TagPill key={index} tag={tag} size="md" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default RecipeDetail;
