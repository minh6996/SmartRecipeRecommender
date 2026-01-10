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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-300/20 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-300/20 rounded-full blur-3xl -z-10" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to access your personalized cookbook
          </p>
        </div>

        <div className="mt-8 glass py-10 px-6 shadow-xl rounded-2xl border border-white/50">
          {error && (
            <div className="mb-6 p-4 bg-red-50/80 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {!import.meta.env.VITE_GOOGLE_CLIENT_ID && (
            <div className="mb-6 p-4 bg-yellow-50/80 border border-yellow-200 rounded-xl text-yellow-900 text-sm flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Missing VITE_GOOGLE_CLIENT_ID in frontend env.
            </div>
          )}

          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <div id="google-signin" className="w-full flex justify-center min-h-[40px]" />
              <p className="mt-4 text-xs text-slate-500 text-center">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>

          {isLoading && (
            <div className="mt-6 flex flex-col items-center justify-center text-sm text-primary-600 font-medium animate-pulse">
              <svg className="animate-spin h-5 w-5 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connecting securely...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
