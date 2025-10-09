'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Brain, Chrome } from 'lucide-react';
import ROUTES from '@/lib/routes';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push(ROUTES.TODAY);
    }
  }, [status, router]);

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: ROUTES.TODAY });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <Brain className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            FlowState
          </h1>
          <p className="text-indigo-100 text-lg">
            Deep Work Companion
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
            Welcome Back
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
            Sign in to continue your deep work practice
          </p>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border-2 border-gray-300 dark:border-gray-600 rounded-xl transition-all font-semibold text-gray-700 dark:text-gray-200 shadow-sm hover:shadow-md"
          >
            <Chrome className="w-5 h-5" />
            Sign in with Google
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <a href={ROUTES.SIGNUP} className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                Sign up
              </a>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 text-center">
          <p className="text-white/80 text-sm mb-4">
            Trusted by deep workers worldwide
          </p>
          <div className="flex items-center justify-center gap-6 text-white/60 text-xs">
            <span>🔒 Secure</span>
            <span>⚡ Fast</span>
            <span>🎯 Focused</span>
          </div>
        </div>
      </div>
    </div>
  );
}

