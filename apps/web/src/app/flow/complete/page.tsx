'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Clock, Target, TrendingUp } from 'lucide-react';
import ROUTES from '@/lib/routes';

export default function FlowCompletePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [feedback, setFeedback] = useState<'on_time' | 'needed_more' | 'finished_early' | null>(null);
  
  const duration = searchParams.get('duration') || '0';
  const sessionId = searchParams.get('sessionId');

  const handleFeedback = async (selectedFeedback: 'on_time' | 'needed_more' | 'finished_early') => {
    setFeedback(selectedFeedback);

    // Submit feedback to API
    if (sessionId) {
      try {
        await fetch(`/api/sessions/${sessionId}/feedback`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ feedback: selectedFeedback }),
        });
      } catch (error) {
        console.error('Failed to submit feedback:', error);
      }
    }

    // Redirect after a delay
    setTimeout(() => {
      router.push(ROUTES.TODAY);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-4 animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Flow Session Complete!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            You focused for {Math.floor(parseInt(duration) / 60)} minutes
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
            <Clock className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.floor(parseInt(duration) / 60)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Minutes</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
            <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">100%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Focus</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
            <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">+1</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Session</div>
          </div>
        </div>

        {/* Feedback */}
        {!feedback ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
              How did it go?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
              Your feedback helps us optimize future sessions
            </p>
            
            <div className="grid gap-3">
              <button
                onClick={() => handleFeedback('finished_early')}
                className="w-full px-6 py-4 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 border-2 border-green-300 dark:border-green-700 rounded-xl transition-all text-left"
              >
                <div className="font-semibold text-green-900 dark:text-green-100">
                  ✅ Finished Early
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  Completed the work faster than expected
                </div>
              </button>

              <button
                onClick={() => handleFeedback('on_time')}
                className="w-full px-6 py-4 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 border-2 border-blue-300 dark:border-blue-700 rounded-xl transition-all text-left"
              >
                <div className="font-semibold text-blue-900 dark:text-blue-100">
                  🎯 Just Right
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  Perfect amount of time for the task
                </div>
              </button>

              <button
                onClick={() => handleFeedback('needed_more')}
                className="w-full px-6 py-4 bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-900/50 border-2 border-orange-300 dark:border-orange-700 rounded-xl transition-all text-left"
              >
                <div className="font-semibold text-orange-900 dark:text-orange-100">
                  ⏰ Needed More Time
                </div>
                <div className="text-sm text-orange-700 dark:text-orange-300">
                  Could use additional time to complete
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Thanks for your feedback!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Returning to your dashboard...
            </p>
          </div>
        )}

        {/* Skip Button */}
        {!feedback && (
          <div className="text-center mt-6">
            <button
              onClick={() => router.push(ROUTES.TODAY)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm"
            >
              Skip feedback →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

