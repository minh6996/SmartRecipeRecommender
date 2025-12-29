import { useAuth } from '../hooks/useAuth.js';
import { useSavedRecipes } from '../hooks/useAuth.js';
import { getRecommendations } from '../utils/recommendations.js';
import RecipeGrid from '../components/RecipeGrid.jsx';
import EmptyState from '../components/EmptyState.jsx';

const Recommendations = () => {
  const { isAuthenticated } = useAuth();
  const { savedIds, isLoading: savedLoading } = useSavedRecipes();

  // Get personalized recommendations
  const recommendations = getRecommendations(savedIds, 10);

  if (!isAuthenticated) {
    return (
      <EmptyState
        title="Sign In for Personalized Recommendations"
        description="Login to save your favorite recipes and get personalized recommendations based on your taste preferences."
        buttonText="Sign In"
        buttonLink="/login"
        icon="login"
      />
    );
  }

  if (savedLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-gray-200 h-64 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (savedIds.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Personalized Recommendations</h1>
          <p className="text-gray-600 mb-6">
            Recommendations are personalized based on your saved recipes.
          </p>
        </div>
        
        <EmptyState
          title="No Saved Recipes Yet"
          description="Start saving recipes you like to get personalized recommendations based on your taste preferences."
          buttonText="Browse Recipes"
          buttonLink="/recipes"
          icon="recipes"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Personalized Recommendations</h1>
        <p className="text-gray-600 mb-2">
          Recommendations are personalized based on your saved recipes.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-blue-800">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">
              Based on your {savedIds.length} saved {savedIds.length === 1 ? 'recipe' : 'recipes'}
            </span>
          </div>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Top {recommendations.length} Recommendations for You
        </h2>
        <RecipeGrid recipes={recommendations} showSaveButton={true} />
      </div>

      {/* How it works */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">How Recommendations Work</h3>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">1. Save Recipes</h4>
            <p className="text-gray-600">
              Save recipes you like to build your taste profile
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">2. Analyze Preferences</h4>
            <p className="text-gray-600">
              We analyze cuisines, ingredients, and cooking styles you prefer
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">3. Get Recommendations</h4>
            <p className="text-gray-600">
              Receive personalized suggestions based on your unique taste
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
