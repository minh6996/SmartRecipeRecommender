import { Link } from 'react-router-dom';
import RecipeGrid from '../components/RecipeGrid.jsx';
import { useSavedRecipes } from '../hooks/useAuth.js';
import { getRecommendations } from '../utils/recommendations.js';
import { mockRecipes } from '../data/recipes.js';

const Home = () => {
  const { savedIds, isAuthenticated } = useSavedRecipes();
  
  // Get recommendations based on saved recipes
  const recommendations = getRecommendations(savedIds, 6);
  
  // Get all recipes for the "All Recipes" section
  const allRecipes = mockRecipes.slice(0, 12); // Show first 12 recipes

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Smart Recipe Recommender
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Discover personalized recipes based on your preferences and saved favorites. 
          Our intelligent system learns from your taste to recommend dishes you'll love.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/recipes"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Browse All Recipes
          </Link>
          {isAuthenticated ? (
            <Link
              to="/recommendations"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              My Recommendations
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Sign In for Recommendations
            </Link>
          )}
        </div>
      </section>

      {/* Recommended for You Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isAuthenticated && savedIds.length > 0 
              ? "Recommended for You" 
              : "Popular Recipes"
            }
          </h2>
          {isAuthenticated && savedIds.length > 0 && (
            <Link
              to="/recommendations"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All →
            </Link>
          )}
        </div>
        
        {isAuthenticated && savedIds.length > 0 ? (
          <div>
            <p className="text-gray-600 mb-4">
              Based on your {savedIds.length} saved {savedIds.length === 1 ? 'recipe' : 'recipes'}
            </p>
            <RecipeGrid recipes={recommendations} showSaveButton={true} />
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-4">
              {isAuthenticated 
                ? "Start saving recipes to get personalized recommendations!"
                : "Sign in to save recipes and get personalized recommendations."
              }
            </p>
            <RecipeGrid recipes={recommendations} showSaveButton={true} />
          </div>
        )}
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
