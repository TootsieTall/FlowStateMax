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
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 safe-area-inset-bottom z-40">
      <div className="max-w-lg mx-auto px-2">
        <div className="flex items-center justify-around h-16">
          {BOTTOM_NAV_CONFIG.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-t-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

