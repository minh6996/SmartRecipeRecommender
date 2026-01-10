import { Link, useLocation, useNavigate } from 'react-router-dom';
import TagPill from './TagPill.jsx';
import { useAuth, useSavedRecipes } from '../hooks/useAuth.js';

const RecipeCard = ({ recipe, showSaveButton = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { toggleSave, isSaved } = useSavedRecipes();
  const saved = isSaved(recipe);

  const handleSaveClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      const redirect = `${location.pathname}${location.search}`;
      navigate(`/login?redirect=${encodeURIComponent(redirect)}`);
      return;
    }

    try {
      await toggleSave(recipe);
    } catch (err) {
      console.error(err);
      window.alert(err?.message || 'Failed to save recipe');
    }
  };

  // Generate a consistent color based on recipe ID for placeholder
  const colors = [
    'bg-red-200', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200',
    'bg-purple-200', 'bg-pink-200', 'bg-indigo-200', 'bg-orange-200'
  ];
  const numericId = typeof recipe?.id === 'number' ? recipe.id : 0;
  const placeholderColor = colors[numericId % colors.length];

  return (
    <Link
      to={`/recipes/${recipe.id}`}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col h-full transform hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        {recipe?.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className={`w-full h-full ${placeholderColor} flex items-center justify-center`}>
            <div className="text-center p-4">
              <svg
                className="w-16 h-16 mx-auto mb-2 text-slate-500/50"
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

        {/* Cuisine Badge (Floating) */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 shadow-sm border border-white/20">
          {recipe.cuisine}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title and save button */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-slate-900 leading-tight flex-1 mr-3 group-hover:text-primary-600 transition-colors">
            {recipe.title}
          </h3>
          {showSaveButton && (
            <button
              onClick={handleSaveClick}
              className={`p-2 rounded-full transition-all duration-200 shadow-sm ${saved
                  ? 'bg-red-50 text-red-500 hover:bg-red-100 hover:scale-110'
                  : 'bg-slate-100 text-slate-400 hover:bg-primary-50 hover:text-primary-600'
                }`}
              aria-label={saved ? 'Unsave recipe' : 'Save recipe'}
              title={saved ? 'Unsave' : 'Save'}
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
        <div className="flex items-center text-sm text-slate-500 mb-4 font-medium">
          <svg className="w-4 h-4 mr-1.5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{recipe.cookingTime} min</span>
          <span className="mx-2 text-slate-300">•</span>
          <span>{recipe.tags.length} ingredients</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-slate-50">
          {recipe.tags.slice(0, 3).map((tag, index) => (
            <TagPill key={index} tag={tag} size="sm" />
          ))}
          {recipe.tags.length > 3 && (
            <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full font-medium">+{recipe.tags.length - 3}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
