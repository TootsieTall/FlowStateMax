'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Compass, Book, Headphones, Brain, Heart, Sparkles } from 'lucide-react';
import ROUTES from '@/lib/routes';

/**
 * Explore Page
 * 
 * Optional features and resources for deep work enhancement:
 * - Podcast recommendations
 * - Book suggestions
 * - Meditation/boredom training
 * - AI brainstorm partner
 * - Recovery activities
 */
export default function ExplorePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(ROUTES.HOME);
    }
  }, [status, router]);

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
    {
      title: 'Podcast Library',
      description: 'Curated deep work and productivity podcasts',
      icon: Headphones,
      color: 'bg-purple-500',
      comingSoon: true,
    },
    {
      title: 'Reading List',
      description: 'Essential books on deep work and focus',
      icon: Book,
      color: 'bg-blue-500',
      comingSoon: true,
    },
    {
      title: 'Boredom Training',
      description: 'Meditation and mindfulness exercises',
      icon: Brain,
      color: 'bg-green-500',
      comingSoon: true,
    },
    {
      title: 'AI Brainstorm',
      description: 'Interactive thinking partner for problem-solving',
      icon: Sparkles,
      color: 'bg-indigo-500',
      href: ROUTES.CAPTURE,
      action: 'Try Quick Capture with AI',
    },
    {
      title: 'Recovery Activities',
      description: 'Track and plan intentional downtime',
      icon: Heart,
      color: 'bg-pink-500',
      comingSoon: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Compass className="w-8 h-8 text-indigo-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Explore
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Enhance your deep work practice with curated resources
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {feature.description}
              </p>

              {feature.comingSoon ? (
                <div className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded-full">
                  Coming Soon
                </div>
              ) : feature.href ? (
                <a
                  href={feature.href}
                  className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {feature.action}
                </a>
              ) : null}
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-8 border border-indigo-200 dark:border-indigo-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Progressive Disclosure
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            FlowState follows Cal Newport's principle of <strong>progressive disclosure</strong> — 
            advanced features are hidden until you need them. This keeps the app simple and 
            prevents overwhelming new users with too many options.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            As we build out more features, they'll appear here. For now, focus on the core: 
            planning your week, executing today, and achieving deep work.
          </p>
        </div>
      </div>
    </div>
  );
}


