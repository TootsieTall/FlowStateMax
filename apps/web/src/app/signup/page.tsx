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
      <div className="min-h-screen flex items-center justify-center bg-dawn-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sunset-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-body text-bark-300">Loading...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-dawn-100 to-dawn-200 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">
        {/* Left Side - Branding */}
        <div className="text-bark-500 space-y-6 flex flex-col justify-center">
          <div className="inline-flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-warm-md">
              <Brain className="w-8 h-8 text-gradient-sunset" />
            </div>
            <div>
              <h1 className="text-display-md text-gradient-sunset">Daybreak</h1>
              <p className="text-body text-bark-300">Flow State Productivity</p>
            </div>
          </div>

          <div>
            <h2 className="text-h1 text-bark-500 mb-4">
              Transform Your Productivity
            </h2>
            <p className="text-body text-bark-300 mb-6">
              Based on Cal Newport's Deep Work methodology, Daybreak helps you achieve 
              focus and eliminate distractions.
            </p>

            <div className="space-y-3">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gold-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-gold-600" />
                  </div>
                  <span className="text-body text-bark-400">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="card-elevated p-8 flex flex-col justify-center">
          <h2 className="text-h2 text-bark-500 mb-2">
            Get Started Free
          </h2>
          <p className="text-body text-bark-300 mb-8">
            Join thousands of deep workers worldwide
          </p>

          {/* Google Sign Up */}
          <button
            onClick={handleGoogleSignUp}
            className="btn-primary w-full justify-center"
          >
            <Chrome className="w-5 h-5" />
            Sign up with Google
          </button>

          <div className="mt-6 text-center">
            <p className="text-body-sm text-bark-300">
              Already have an account?{' '}
              <a href={ROUTES.LOGIN} className="text-sunset-700 hover:text-sunset-600 font-medium">
                Sign in
              </a>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-border-DEFAULT">
            <p className="text-caption text-bark-200 text-center">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


