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
      <div className="text-center pt-8 pb-4">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">What are we cooking?</h1>

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
      <div className="glass p-6 rounded-2xl shadow-sm border border-slate-100">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search recipes by title, cuisine, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm group-hover:border-primary-300"
            />
            <svg
              className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-hover:text-primary-500 transition-colors"
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
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Filter by tags</h3>
            {(searchQuery || selectedTags.length > 0) && (
              <button
                onClick={clearFilters}
                className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear filters
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
