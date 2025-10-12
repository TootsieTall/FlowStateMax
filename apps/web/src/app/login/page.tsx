'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Brain, Chrome, UserPlus } from 'lucide-react';
import ROUTES from '@/lib/routes';
import { isOAuthEnabled, isGuestOnboardingAllowed, getAuthModeMessage } from '@/lib/guest-auth';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [guestName, setGuestName] = useState('');
  const [loading, setLoading] = useState(false);

  // Feature flags
  const showOAuth = isOAuthEnabled();
  const showGuest = isGuestOnboardingAllowed();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push(ROUTES.TODAY);
    }
  }, [status, router]);

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: ROUTES.TODAY });
  };

  const handleGuestSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    setLoading(true);
    const result = await signIn('credentials', {
      name: guestName.trim(),
      redirect: false,
    });

    if (result?.ok) {
      router.push(ROUTES.ONBOARDING.ROOT);
    } else {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dawn-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sunset-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-body text-bark-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dawn-100 to-dawn-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-warm-lg mb-4">
            <Brain className="w-10 h-10 text-gradient-sunset" />
          </div>
          <h1 className="text-display-lg text-gradient-sunset mb-2">
            Daybreak
          </h1>
          <p className="text-body-lg text-bark-300">
            Flow State Productivity
          </p>
        </div>

        {/* Login Card */}
        <div className="card-elevated p-8">
          <h2 className="text-h2 text-bark-500 mb-2 text-center">
            Welcome Back
          </h2>
          <p className="text-body text-bark-300 mb-8 text-center">
            Sign in to continue your deep work practice
          </p>

          {/* Google Sign In - Only show if OAuth is enabled */}
          {showOAuth && (
            <>
              <button
                onClick={handleGoogleSignIn}
                className="btn-secondary w-full justify-center"
              >
                <Chrome className="w-5 h-5" />
                Sign in with Google
              </button>

              {showGuest && (
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border-DEFAULT"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-bark-200">Or</span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Guest Sign In - Show if guest mode is enabled */}
          {showGuest && (
            <form onSubmit={handleGuestSignIn} className="space-y-4">
              <div>
                <label htmlFor="guestName" className="text-label text-bark-400 mb-2">
                  Continue as Guest
                </label>
                <input
                  id="guestName"
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Enter your name"
                  className="input"
                  required
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !guestName.trim()}
                className="btn-primary w-full justify-center"
              >
                <UserPlus className="w-5 h-5" />
                {loading ? 'Starting...' : 'Start Onboarding'}
              </button>
            </form>
          )}

          {/* Mode indicator */}
          <p className="mt-4 text-caption text-center text-bark-200">
            {getAuthModeMessage()}
          </p>

          <div className="mt-6 text-center">
            <p className="text-body-sm text-bark-300">
              Don't have an account?{' '}
              <a href={ROUTES.SIGNUP} className="text-sunset-700 hover:text-sunset-600 font-medium">
                Sign up
              </a>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 text-center">
          <p className="text-bark-400 text-body-sm mb-4">
            Trusted by deep workers worldwide
          </p>
          <div className="flex items-center justify-center gap-6 text-bark-300 text-caption">
            <span>🔒 Secure</span>
            <span>⚡ Fast</span>
            <span>🎯 Focused</span>
          </div>
        </div>
      </div>
    </div>
  );
}

