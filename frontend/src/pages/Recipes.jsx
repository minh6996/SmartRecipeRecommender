import { useState, useMemo, useEffect } from 'react';
import RecipeGrid from '../components/RecipeGrid.jsx';
import TagPill from '../components/TagPill.jsx';
import { filterRecipes } from '../utils/recommendations.js';
import { apiGetRecipes } from '../utils/api.js';

const Recipes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await apiGetRecipes({ limit: 500 });
        if (!mounted) return;
        setRecipes(data.items || []);
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || 'Failed to load recipes');
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Available filter tags
  const filterTags = ['Quick', 'Healthy', 'Vegetarian', 'Vietnamese', 'Korean'];

  // Filter recipes based on search and tags
  const filteredRecipes = useMemo(() => {
    return filterRecipes(recipes, searchQuery, selectedTags);
  }, [recipes, searchQuery, selectedTags]);

  // Toggle tag selection
  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Recipes</h1>
        <p className="text-gray-600">
          Browse our collection of {recipes.length} delicious recipes from around the world
        </p>
      </div>

      {isLoading && (
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-gray-200 h-64 rounded-lg"></div>
            ))}
          </div>
        </div>
      )}

      {error && !isLoading && (
        <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search recipes by title, cuisine, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <svg
              className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Filter Tags */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Filter by tags:</h3>
            {(searchQuery || selectedTags.length > 0) && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear all filters
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {filterTags.map((tag) => (
              <TagPill
                key={tag}
                tag={tag}
                onClick={() => toggleTag(tag)}
                isSelected={selectedTags.includes(tag)}
                size="md"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          {filteredRecipes.length === 0 
            ? 'No recipes found' 
            : `Showing ${filteredRecipes.length} of ${recipes.length} recipes`
          }
        </p>
        
        {/* Active filters display */}
        {(searchQuery || selectedTags.length > 0) && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Active filters:</span>
            {searchQuery && (
              <span className="bg-gray-100 px-2 py-1 rounded">
                "{searchQuery}"
              </span>
            )}
            {selectedTags.map(tag => (
              <span key={tag} className="bg-gray-100 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Recipe Grid */}
      <RecipeGrid recipes={filteredRecipes} showSaveButton={true} />
    </div>
  );
};

export default Recipes;
