'use client';

import QuickCapture from './QuickCapture';

/**
 * Wrapper component for QuickCapture to be used in Server Components
 * This ensures the QuickCapture modal is available globally across the app
 */
export default function QuickCaptureWrapper() {
  return <QuickCapture />;
}

