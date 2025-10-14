'use client';

import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/store';
import { X, Sparkles, Calendar, ListTodo, StickyNote, Loader2 } from 'lucide-react';

interface ParsedIntent {
  type: 'task' | 'note' | 'schedule';
  title: string;
  description?: string;
  deadline?: string;
  scheduledAt?: string;
  impact?: 'HIGH' | 'LOW';
  suggestedBlocks?: {
    title: string;
    duration: string;
    day: string;
  }[];
}

export default function QuickCapture() {
  const { quickCaptureOpen, toggleQuickCapture } = useAppStore();
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedIntent, setParsedIntent] = useState<ParsedIntent | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (quickCaptureOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [quickCaptureOpen]);

  // Keyboard shortcut: Cmd+K or Ctrl+K to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleQuickCapture();
      }
      // Escape to close
      if (e.key === 'Escape' && quickCaptureOpen) {
        toggleQuickCapture();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quickCaptureOpen, toggleQuickCapture]);

  // Parse intent as user types (debounced)
  useEffect(() => {
    if (input.length < 5) {
      setParsedIntent(null);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await fetch('/api/ai/parse-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: input }),
        });

        if (response.ok) {
          const data = await response.json();
          setParsedIntent(data);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Failed to parse intent:', error);
      }
    }, 800); // Debounce 800ms

    return () => clearTimeout(timer);
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);

    try {
      // Create the captured item
      const response = await fetch('/api/quick-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: input,
          type: parsedIntent?.type || 'task',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to capture');
      }

      const result = await response.json();

      // If it's a task with a deadline, optionally break it down
      if (result.task?.deadline && parsedIntent?.suggestedBlocks) {
        const shouldBreakdown = confirm(
          'This task has a deadline. Would you like me to break it down into time blocks?'
        );

        if (shouldBreakdown) {
          await fetch('/api/ai/deadline-breakdown', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              taskId: result.task.id,
              deadline: result.task.deadline,
            }),
          });
        }
      }

      // Success! Clear and close
      setInput('');
      setParsedIntent(null);
      setShowSuggestions(false);
      toggleQuickCapture();

      // Show success toast (you could add a toast library)
      console.log('✅ Captured successfully');
    } catch (error) {
      console.error('Error capturing:', error);
      alert('Failed to capture. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickAction = (type: 'task' | 'note' | 'schedule') => {
    if (parsedIntent) {
      setParsedIntent({ ...parsedIntent, type });
    }
  };

  if (!quickCaptureOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={toggleQuickCapture}
      />

      {/* Modal */}
      <div className="fixed top-[20vh] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 animate-in slide-in-from-top-4 duration-300">
        <div className="bg-bg-surface dark:bg-gray-900 rounded-2xl shadow-2xl border border-border-default dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border-default dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-semibold text-text-primary dark:text-white">
                Quick Capture
              </h2>
            </div>
            <button
              onClick={toggleQuickCapture}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-text-tertiary" />
            </button>
          </div>

          {/* Main Input */}
          <form onSubmit={handleSubmit} className="p-6">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type anything... (e.g., 'Finish project proposal by Friday', 'Call Mom tomorrow at 2pm', 'Research competitors')"
              className="w-full min-h-[120px] p-4 text-lg bg-gray-50 dark:bg-gray-800 border border-border-default dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none outline-none transition-all"
              disabled={isProcessing}
            />

            {/* AI Suggestions */}
            {showSuggestions && parsedIntent && (
              <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800 animate-in fade-in duration-200">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
                      AI Understanding:
                    </p>
                    <div className="space-y-1 text-sm text-indigo-800 dark:text-indigo-200">
                      <p>
                        <strong>Type:</strong> {parsedIntent.type.charAt(0).toUpperCase() + parsedIntent.type.slice(1)}
                      </p>
                      <p>
                        <strong>Title:</strong> {parsedIntent.title}
                      </p>
                      {parsedIntent.deadline && (
                        <p>
                          <strong>Deadline:</strong> {new Date(parsedIntent.deadline).toLocaleDateString()}
                        </p>
                      )}
                      {parsedIntent.scheduledAt && (
                        <p>
                          <strong>Scheduled:</strong> {new Date(parsedIntent.scheduledAt).toLocaleString()}
                        </p>
                      )}
                      {parsedIntent.impact && (
                        <p>
                          <strong>Impact:</strong> {parsedIntent.impact}
                        </p>
                      )}
                    </div>

                    {/* Suggested Blocks */}
                    {parsedIntent.suggestedBlocks && parsedIntent.suggestedBlocks.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-indigo-200 dark:border-indigo-700">
                        <p className="text-sm font-medium text-indigo-900 dark:text-indigo-100 mb-2">
                          Suggested breakdown:
                        </p>
                        <div className="space-y-1">
                          {parsedIntent.suggestedBlocks.map((block, idx) => (
                            <div key={idx} className="text-xs text-indigo-700 dark:text-indigo-300">
                              {block.day}: {block.title} ({block.duration})
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Action Buttons */}
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleQuickAction('task')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${
                  parsedIntent?.type === 'task'
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500'
                    : 'bg-gray-100 dark:bg-gray-800 text-text-secondary dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <ListTodo className="w-4 h-4" />
                <span className="text-sm font-medium">Task</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickAction('note')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${
                  parsedIntent?.type === 'note'
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500'
                    : 'bg-gray-100 dark:bg-gray-800 text-text-secondary dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <StickyNote className="w-4 h-4" />
                <span className="text-sm font-medium">Note</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickAction('schedule')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${
                  parsedIntent?.type === 'schedule'
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500'
                    : 'bg-gray-100 dark:bg-gray-800 text-text-secondary dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Schedule</span>
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!input.trim() || isProcessing}
              className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-medium rounded-xl transition-all disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Capturing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Capture</span>
                </>
              )}
            </button>
          </form>

          {/* Footer hint */}
          <div className="px-6 pb-4 pt-2 border-t border-border-default dark:border-gray-700">
            <p className="text-xs text-text-tertiary dark:text-gray-400 text-center">
              Press <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">⌘K</kbd> to quickly capture anything
            </p>
          </div>
        </div>
      </div>
    </>
  );
}


