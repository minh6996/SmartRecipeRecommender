import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const Layout = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Title */}
            <Link to="/" className="flex items-center gap-3 text-2xl font-bold text-gray-900">
              <img src="/logo.svg" alt="Smart Recipe Recommender" className="h-8 w-8" />
              <span>Smart Recipe Recommender</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/"
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Home
              </Link>
              <Link
                to="/recipes"
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/recipes')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Recipes
              </Link>
              <Link
                to="/recommendations"
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/recommendations')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Recommendations
              </Link>
              <Link
                to={isAuthenticated ? "/profile" : "/login"}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/profile') || isActive('/login')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {isAuthenticated ? 'Profile' : 'Login'}
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
