import React, { useState, useEffect, useCallback } from 'react';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import VISUAL_CMS_Dashboard from './VISUAL_CMS_Dashboard.jsx';
import insforge from '../utils/insforgeClient.js';

const CMSAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for an existing InsForge session on mount (the SDK rehydrates via
  // the httpOnly refresh cookie), and subscribe to auth state changes so
  // sign-in/sign-out elsewhere is reflected here.
  useEffect(() => {
    if (!insforge) {
      setError('CMS backend is not configured.');
      return;
    }

    const checkUser = () =>
      insforge.auth.getCurrentUser().then(({ data }) => {
        setIsAuthenticated(!!data?.user);
      });

    checkUser();

    // onAuthStateChange emits event names only — re-check the user on each one.
    const unsubscribe = insforge.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
      } else {
        checkUser();
      }
    });

    return unsubscribe;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!insforge) {
      setError('CMS backend is not configured.');
      setLoading(false);
      return;
    }

    try {
      const { error: signInError } = await insforge.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message || 'Invalid credentials');
      }
      // On success, onAuthStateChange fires and sets isAuthenticated.
    } catch (error) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordToggle = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowPassword(prev => !prev);
  }, []);

  const handleLogout = async () => {
    if (insforge) {
      await insforge.auth.signOut();
    }
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
  };

  // Show dashboard if authenticated (the dashboard renders its own header
  // including the Logout button — no wrapper needed here)
  if (isAuthenticated) {
    return <VISUAL_CMS_Dashboard />;
  }

  // Show login form if not authenticated
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <Lock className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            CMS Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            New Media Tek Content Management System
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="admin@example.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-12 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="••••••••"
                  style={{ paddingRight: '3rem' }}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <button
                    type="button"
                    className="p-1 hover:bg-gray-100 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 pointer-events-auto"
                    onClick={handlePasswordToggle}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    title={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex="-1"
                    style={{ zIndex: 10 }}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        
        {import.meta.env.DEV && (
          <div className="text-center text-xs text-gray-400 mt-4 p-2 bg-gray-50 rounded">
            Sign in with the CMS admin account created in InsForge.
          </div>
        )}
      </div>
    </div>
  );
};

export default CMSAuth;
