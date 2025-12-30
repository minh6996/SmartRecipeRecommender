import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const Login = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { googleLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get redirect URL from query params
  const redirectTo = searchParams.get('redirect') || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, navigate, redirectTo]);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;

      const google = window.google;
      const el = document.getElementById('google-signin');
      if (!google?.accounts?.id || !el) {
        if (attempts > 25) window.clearInterval(timer);
        return;
      }

      window.clearInterval(timer);

      google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          try {
            setError('');
            setIsLoading(true);
            await googleLogin(response.credential);
            navigate(redirectTo);
          } catch (err) {
            setError(err?.message || 'Google login failed.');
          } finally {
            setIsLoading(false);
          }
        },
      });

      google.accounts.id.renderButton(el, {
        theme: 'outline',
        size: 'large',
        width: '360',
      });
    }, 200);

    return () => window.clearInterval(timer);
  }, [googleLogin, navigate, redirectTo]);

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">Use Google to sign in.</p>
        </div>

        <div className="mt-8 bg-white py-8 px-6 shadow rounded-lg">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}

          {!import.meta.env.VITE_GOOGLE_CLIENT_ID && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-900 text-sm">
              Missing VITE_GOOGLE_CLIENT_ID in frontend env.
            </div>
          )}

          <div className="mb-4">
            <div id="google-signin" className="flex justify-center" />
          </div>

          {isLoading && (
            <div className="text-center text-sm text-gray-500">Signing you in...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
