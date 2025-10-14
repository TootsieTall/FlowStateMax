'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Calendar, CheckCircle, Compass, Settings } from 'lucide-react';
import { ROUTES, BOTTOM_NAV_CONFIG } from '@/lib/routes';

/**
 * Bottom Navigation Component
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
    <nav className="fixed bottom-0 left-0 right-0 bg-bg-surface border-t border-border-light safe-area-inset-bottom z-40 shadow-warm-lg">
      <div className="max-w-lg mx-auto px-2">
        <div className="flex items-center justify-around h-16">
          {BOTTOM_NAV_CONFIG.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-fast relative ${
                  isActive
                    ? 'text-sunset-500'
                    : 'text-bark-200 hover:text-bark-400'
                }`}
              >
                <Icon className={`w-6 h-6 mb-1 transition-transform duration-fast ${isActive ? 'scale-110' : 'hover:scale-105'}`} />
                <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-sunset-500 to-gold-400 rounded-t-lg shadow-glow-amber" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}


