'use client';

import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import BottomNav from './BottomNav';
import QuickCaptureWrapper from './QuickCaptureWrapper';
import { FloatingCaptureCTA } from './FloatingCaptureCTA';

/**
 * App Shell Component
 * 
 * Wraps the application with:
 * - Bottom navigation
 * - Quick capture modal
 * - Proper spacing for bottom nav
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { status } = useSession();

  // Pages that don't need the app shell
  const noShellPages = [
    '/',
    '/login',
    '/signup',
  ].includes(pathname || '');

  // Pages that have bottom nav (need padding)
  const hasBottomNav = !noShellPages && 
    !pathname?.startsWith('/onboarding') && 
    pathname !== '/flow' && 
    pathname !== '/shutdown';

  // Pages where floating CTA should appear (main app pages only)
  const shouldShowFloatingCTA = status === 'authenticated' && 
    !noShellPages && 
    !pathname?.startsWith('/onboarding') && 
    pathname !== '/flow' && 
    pathname !== '/shutdown' &&
    pathname !== '/settings';

  return (
    <>
      {/* Main Content */}
      <div className={hasBottomNav ? 'pb-16' : ''}>
        {children}
      </div>

      {/* Bottom Navigation */}
      {status === 'authenticated' && <BottomNav />}

      {/* Quick Capture Modal (always available when authenticated) */}
      {status === 'authenticated' && <QuickCaptureWrapper />}

      {/* Floating Capture CTA (main app pages only) */}
      {shouldShowFloatingCTA && <FloatingCaptureCTA />}
    </>
  );
}


