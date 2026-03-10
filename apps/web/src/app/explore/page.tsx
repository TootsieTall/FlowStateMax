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

  const isDevBypass = process.env.NEXT_PUBLIC_DEV_MODE === 'true'

  // Redirect if not authenticated (skipped in dev bypass mode)
  useEffect(() => {
    if (!isDevBypass && status === 'unauthenticated') {
      router.push(ROUTES.HOME);
    }
  }, [status, router, isDevBypass]);

  if (!isDevBypass && status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-body text-text-tertiary">Loading...</p>
        </div>
      </div>
    );
  }

  const features = [
    {
      title: 'Podcast Library',
      description: 'Curated deep work and productivity podcasts 🎧',
      icon: Headphones,
      color: 'bg-gradient-to-br from-sunset-400 to-gold-400',
      comingSoon: true,
    },
    {
      title: 'Reading List',
      description: 'Essential books on deep work and focus 📚',
      icon: Book,
      color: 'bg-gradient-to-br from-gold-400 to-accent-orange',
      comingSoon: true,
    },
    {
      title: 'Boredom Training',
      description: 'Meditation and mindfulness exercises 🧘',
      icon: Brain,
      color: 'bg-gradient-to-br from-sand-400 to-sand-500',
      comingSoon: true,
    },
    {
      title: 'AI Brainstorm',
      description: 'Interactive thinking partner for problem-solving ✨',
      icon: Sparkles,
      color: 'bg-gradient-to-br from-accent-gold to-sunset-600',
      href: ROUTES.CAPTURE,
      action: 'Try Quick Capture with AI',
    },
    {
      title: 'Recovery Activities',
      description: 'Track and plan intentional downtime ❤️',
      icon: Heart,
      color: 'bg-gradient-to-br from-accent-gold to-accent-orange',
      comingSoon: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary">
      {/* Header */}
      <div className="layer-floating sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Compass className="w-8 h-8 text-accent-gold icon-hover" />
            <div>
              <h1 className="text-display-md text-gradient-sunset">
                Explore ✨
              </h1>
              <p className="text-body text-text-tertiary mt-1">
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
              className="card hover-lift group"
            >
              <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-warm-md group-hover:shadow-warm-lg transition-all duration-fast`}>
                <feature.icon className="w-6 h-6 text-white group-hover:animate-icon-bounce" />
              </div>
              
              <h3 className="text-h3 text-text-primary mb-2">
                {feature.title}
              </h3>
              
              <p className="text-body text-text-tertiary mb-4">
                {feature.description}
              </p>

              {feature.comingSoon ? (
                <div className="inline-block px-3 py-1 bg-bg-surface text-text-tertiary text-sm rounded-full border border-border-default">
                  Coming Soon
                </div>
              ) : feature.href ? (
                <a
                  href={feature.href}
                  className="btn-primary inline-flex"
                >
                  {feature.action}
                </a>
              ) : null}
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-bg-elevated rounded-2xl border border-accent-gold/30 shadow-glow-strong p-8 border-2 border-accent-gold/20">
          <h2 className="text-h2 text-text-primary mb-4">
            Progressive Disclosure ✨
          </h2>
          <p className="text-body text-text-secondary mb-4">
            Daybreak follows Cal Newport's principle of <strong className="text-text-primary">progressive disclosure</strong> — 
            advanced features are hidden until you need them. This keeps the app simple and 
            prevents overwhelming new users with too many options.
          </p>
          <p className="text-body text-text-tertiary">
            As we build out more features, they'll appear here. For now, focus on the core: 
            planning your week, executing today, and achieving deep work.
          </p>
        </div>
      </div>
    </div>
  );
}


