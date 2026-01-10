import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const Layout = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Title */}
            <Link to="/" className="flex items-center gap-3 text-xl font-bold text-slate-800 tracking-tight hover:text-primary-600 transition-colors">
              <img src="/logo.svg" alt="Smart Recipe Recommender" className="h-8 w-8" />
              <span>Smart Recipe<span className="text-primary-600">Recommender</span></span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                to="/"
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all ${isActive('/')
                  ? 'text-primary-700 bg-primary-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
              >
                Home
              </Link>
              <Link
                to="/recipes"
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all ${isActive('/recipes')
                  ? 'text-primary-700 bg-primary-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
              >
                Recipes
              </Link>
              <Link
                to="/recommendations"
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all ${isActive('/recommendations')
                  ? 'text-primary-700 bg-primary-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
              >
                Recommendations
              </Link>

              <div className="h-6 w-px bg-slate-200 mx-2"></div>

              {user?.role === 'admin' && (
                <Link
                  to="/add-recipe"
                  className={`px-4 py-2 text-sm font-semibold rounded-full transition-all mr-2 ${isActive('/add-recipe')
                    ? 'text-white bg-primary-600 shadow-md'
                    : 'text-primary-600 bg-white border border-primary-200 hover:bg-primary-50'
                    }`}
                >
                  + Add Recipe
                </Link>
              )}

              <Link
                to={isAuthenticated ? "/profile" : "/login"}
                className={`ml-2 px-5 py-2 text-sm font-semibold rounded-full transition-all shadow-sm ${isActive('/profile') || isActive('/login')
                  ? 'bg-slate-800 text-white hover:bg-slate-700 hover:shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
              >
                {isAuthenticated ? 'Profile' : 'Sign In'}
              </Link>
            </nav>

            {/* Mobile menu button - simplified for now */}
            <div className="md:hidden">
              <button className="text-gray-700 hover:text-gray-900">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2024 Smart Recipe Recommender. Academic project demonstration.</p>
            <p className="mt-2">Built with React, Vite, and TailwindCSS</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
