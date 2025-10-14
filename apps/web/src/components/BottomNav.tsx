'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Calendar, CheckCircle, Compass, Settings } from 'lucide-react';
import { ROUTES, BOTTOM_NAV_CONFIG } from '@/lib/routes';

/**
 * Bottom Navigation Component - Floating Icons Style
 * 
 * Main navigation for the app with 4 tabs:
 * - Week: Planning view
 * - Today: Main dashboard (default)
 * - Explore: Optional features
 * - Settings: Configuration
 */
export default function BottomNav() {
  const pathname = usePathname();

  // Icon mapping
  const iconMap = {
    Calendar,
    CheckCircle,
    Compass,
    Settings,
  };

  // Don't show bottom nav on certain pages
  const hideBottomNav = [
    '/login',
    '/signup',
    '/',
    '/flow',
    '/shutdown',
  ].some(path => pathname === path || pathname?.startsWith('/onboarding'));

  if (hideBottomNav) {
    return null;
  }

  return (
    <nav className="fixed bottom-6 left-0 right-0 z-50 pointer-events-none">
      <div className="max-w-lg mx-auto px-6">
        <div className="bg-bg-elevated/90 backdrop-blur-xl border border-accent-gold/20 rounded-2xl shadow-glow-strong p-3 pointer-events-auto">
          <div className="flex items-center justify-around gap-2">
            {BOTTOM_NAV_CONFIG.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap];
              const isActive = pathname === item.path;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`
                    flex flex-col items-center justify-center gap-1 
                    px-4 py-2.5 rounded-xl transition-all duration-200
                    ${
                      isActive
                        ? 'bg-gradient-to-br from-accent-gold to-accent-orange shadow-glow-medium scale-105'
                        : 'hover:bg-bg-surface hover:scale-105'
                    }
                  `}
                >
                  <Icon 
                    className={`w-5 h-5 transition-all ${
                      isActive 
                        ? 'text-bg-primary' 
                        : 'text-text-secondary'
                    }`} 
                  />
                  <span 
                    className={`text-xs font-medium whitespace-nowrap ${
                      isActive 
                        ? 'text-bg-primary font-semibold' 
                        : 'text-text-tertiary'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}


