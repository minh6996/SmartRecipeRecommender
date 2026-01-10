import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import RecipeGrid from '../components/RecipeGrid.jsx';
import { useAuth, useSavedRecipes } from '../hooks/useAuth.js';
import { getRecommendations } from '../utils/recommendations.js';
import { apiGetRecipes } from '../utils/api.js';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { savedIds } = useSavedRecipes();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const data = await apiGetRecipes({ limit: 500 });
        if (!mounted) return;
        setRecipes(data.items || []);
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || 'Failed to load recipes');
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Get recommendations based on saved recipes
  const recommendations = getRecommendations(recipes, savedIds, 6);

  // Get all recipes for the "All Recipes" section
  const allRecipes = recipes.slice(0, 12); // Show first 12 recipes

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-48 bg-gray-200 rounded-lg mb-8"></div>
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-gray-200 h-64 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Failed to load recipes</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-600/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-40" />

        <div className="relative px-8 py-24 text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 drop-shadow-lg text-white">
            Discover Your Next <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-300 to-secondary-500">
              Favorite Meal
            </span>
          </h1>
          <p className="text-xl text-slate-100 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Personalized recipe recommendations tailored to your unique taste.
            Build your cookbook and explore culinary delights.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/recipes"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-xl text-white bg-primary-600 hover:bg-primary-500 shadow-lg shadow-primary-600/40 transition-all hover:-translate-y-1"
            >
              Start Exploring
            </Link>
            {!isAuthenticated && (
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-xl text-primary-100 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all hover:-translate-y-1"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Recommended for You Section */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              {isAuthenticated && savedIds.length > 0
                ? "Picked Just For You"
                : "Trending Now"
              }
            </h2>
            <p className="text-slate-500">
              {isAuthenticated && savedIds.length > 0
                ? `Curated based on your ${savedIds.length} saved favorites`
                : "Popular recipes from our community"
              }
            </p>
          </div>
          {isAuthenticated && savedIds.length > 0 && (
            <Link
              to="/recommendations"
              className="group flex items-center gap-1 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
            >
              View Full List
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          )}
        </div>

        <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
          <RecipeGrid recipes={recommendations} showSaveButton={true} />
        </div>
      </section>

      {/* All Recipes Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">All Recipes</h2>
          <Link
            to="/recipes"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Browse All →
          </Link>
        </div>

        <RecipeGrid recipes={allRecipes} showSaveButton={true} />
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Why Choose Smart Recipe Recommender?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Recommendations</h3>
            <p className="text-gray-600">
              Our AI analyzes your saved recipes to suggest dishes you'll love
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Diverse Collection</h3>
            <p className="text-gray-600">
              Explore recipes from various cuisines and cooking styles
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Save Your Favorites</h3>
            <p className="text-gray-600">
              Build your personal cookbook and access your favorite recipes anytime
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
