'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Brain, Chrome, Check } from 'lucide-react';
import ROUTES from '@/lib/routes';

export default function SignupPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push(ROUTES.ONBOARDING.ROOT);
    }
  }, [status, router]);

  const handleGoogleSignUp = () => {
    signIn('google', { callbackUrl: ROUTES.ONBOARDING.ROOT });
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

  const features = [
    'Location-based flow triggers',
    'Smart app blocking with breath exercises',
    'Visual weekly planning',
    'AI-powered task capture',
    'Daily goals & shutdown ritual',
    'Monochrome mode for focus',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">
        {/* Left Side - Branding */}
        <div className="text-white space-y-6 flex flex-col justify-center">
          <div className="inline-flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <Brain className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">FlowState</h1>
              <p className="text-indigo-100">Deep Work Companion</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">
              Transform Your Productivity
            </h2>
            <p className="text-indigo-100 mb-6">
              Based on Cal Newport's Deep Work methodology, FlowState helps you achieve 
              focus and eliminate distractions.
            </p>

            <div className="space-y-3">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-indigo-50">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Get Started Free
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Join thousands of deep workers worldwide
          </p>

          {/* Google Sign Up */}
          <button
            onClick={handleGoogleSignUp}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border-2 border-gray-300 dark:border-gray-600 rounded-xl transition-all font-semibold text-gray-700 dark:text-gray-200 shadow-sm hover:shadow-md"
          >
            <Chrome className="w-5 h-5" />
            Sign up with Google
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <a href={ROUTES.LOGIN} className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                Sign in
              </a>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


