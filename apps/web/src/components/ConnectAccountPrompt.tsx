'use client';

import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { Chrome, X, CheckCircle, AlertCircle } from 'lucide-react';
import { isOAuthEnabled, isGuestUser, shouldPromptOAuthConnection } from '@/lib/guest-auth';

interface ConnectAccountPromptProps {
  onDismiss?: () => void;
  showDismiss?: boolean;
}

/**
 * Post-Onboarding OAuth Connection Component
 * 
 * Shown to guest users after completing onboarding to optionally
 * connect their Google account for sync and backup features.
 */
export default function ConnectAccountPrompt({ 
  onDismiss,
  showDismiss = true 
}: ConnectAccountPromptProps) {
  const { data: session } = useSession();
  const [connecting, setConnecting] = useState(false);

  // Only show if OAuth is enabled and user is a guest
  if (!isOAuthEnabled() || !shouldPromptOAuthConnection(session?.user)) {
    return null;
  }

  const handleConnectGoogle = async () => {
    setConnecting(true);
    try {
      // This will link the Google account to the existing session
      await signIn('google', {
        callbackUrl: window.location.pathname,
      });
    } catch (error) {
      console.error('Failed to connect Google account:', error);
      setConnecting(false);
    }
  };

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss();
    }
    // Store dismissal in localStorage to not show again for a while
    localStorage.setItem('oauth_prompt_dismissed', Date.now().toString());
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        {/* Dismiss button */}
        {showDismiss && (
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
            <Chrome className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
          Connect Your Account
        </h2>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          You're currently using FlowState as a guest. Connect your Google account to:
        </p>

        {/* Benefits */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Sync Across Devices</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Access your data from anywhere
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Backup Your Progress</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Never lose your flow sessions and goals
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Enhanced Features</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Unlock calendar integration and more
              </p>
            </div>
          </div>
        </div>

        {/* Warning for guest mode */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-6">
          <div className="flex gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 dark:text-amber-300">
              Guest data is stored locally and may be lost if you clear your browser data.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleConnectGoogle}
            disabled={connecting}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white rounded-xl transition-all font-semibold shadow-sm hover:shadow-md"
          >
            <Chrome className="w-5 h-5" />
            {connecting ? 'Connecting...' : 'Connect with Google'}
          </button>

          {showDismiss && (
            <button
              onClick={handleDismiss}
              className="w-full px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium transition-colors"
            >
              Maybe Later
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Inline banner version for showing in the app
 */
export function ConnectAccountBanner({ onDismiss }: { onDismiss?: () => void }) {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);

  if (!shouldPromptOAuthConnection(session?.user)) {
    return null;
  }

  // Check if user dismissed recently (within 7 days)
  const dismissed = localStorage.getItem('oauth_prompt_dismissed');
  if (dismissed) {
    const dismissedTime = parseInt(dismissed);
    const weekInMs = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - dismissedTime < weekInMs) {
      return null;
    }
  }

  return (
    <>
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-lg shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Chrome className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium">Connect Your Google Account</p>
              <p className="text-sm text-indigo-100">
                Sync your data and unlock more features
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
            >
              Connect
            </button>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <ConnectAccountPrompt 
          onDismiss={() => {
            setShowModal(false);
            onDismiss?.();
          }}
        />
      )}
    </>
  );
}

