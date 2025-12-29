import { Link, useLocation, useNavigate } from 'react-router-dom';
import TagPill from './TagPill.jsx';
import { useAuth, useSavedRecipes } from '../hooks/useAuth.js';

const RecipeCard = ({ recipe, showSaveButton = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { toggleSave, isSaved } = useSavedRecipes();
  const saved = isSaved(recipe.id);

  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      const redirect = `${location.pathname}${location.search}`;
      navigate(`/login?redirect=${encodeURIComponent(redirect)}`);
      return;
    }

    toggleSave(recipe.id);
  };

  // Generate a consistent color based on recipe ID for placeholder
  const colors = [
    'bg-red-200', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200',
    'bg-purple-200', 'bg-pink-200', 'bg-indigo-200', 'bg-orange-200'
  ];
  const placeholderColor = colors[recipe.id % colors.length];

  return (
    <Link
      to={`/recipes/${recipe.id}`}
      className="recipe-card bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
    >
      {/* Image placeholder */}
      <div className={`h-48 ${placeholderColor} flex items-center justify-center`}>
        <div className="text-center p-4">
          <svg 
            className="w-16 h-16 mx-auto mb-2 text-gray-600" 
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
          <p className="text-gray-700 font-medium text-sm">{recipe.cuisine}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and save button */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 flex-1 mr-2">
            {recipe.title}
          </h3>
          {showSaveButton && (
            <button
              onClick={handleSaveClick}
              className={`p-2 rounded-full transition-colors ${
                saved 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
              aria-label={saved ? 'Unsave recipe' : 'Save recipe'}
            >
              <svg 
                className="w-5 h-5" 
                fill={saved ? 'currentColor' : 'none'} 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                />
              </svg>
            </button>
          )}
        </div>

        {/* Meta info */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{recipe.cookingTime} min</span>
          <span className="mx-2">•</span>
          <span>{recipe.cuisine}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {recipe.tags.slice(0, 3).map((tag, index) => (
            <TagPill key={index} tag={tag} size="sm" />
          ))}
          {recipe.tags.length > 3 && (
            <span className="text-xs text-gray-500 ml-1">+{recipe.tags.length - 3}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
