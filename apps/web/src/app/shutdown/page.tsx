'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Moon, CheckCircle, FileText, AlarmClock, Calendar } from 'lucide-react';
import ROUTES from '@/lib/routes';

export default function ShutdownPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [brainDump, setBrainDump] = useState('');
  const [tomorrowTasks, setTomorrowTasks] = useState(['', '', '']);
  const [alarmsSet, setAlarmsSet] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const isDevBypass = process.env.NEXT_PUBLIC_DEV_MODE === 'true';

  useEffect(() => {
    if (!isDevBypass && status === 'unauthenticated') {
      router.push(ROUTES.HOME);
    }
  }, [status, router, isDevBypass]);

  const handleTaskChange = (index: number, value: string) => {
    const newTasks = [...tomorrowTasks];
    newTasks[index] = value;
    setTomorrowTasks(newTasks);
  };

  const handleComplete = async () => {
    setSubmitting(true);

    try {
      const response = await fetch('/api/shutdown/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brainDump,
          tomorrowTop: tomorrowTasks.filter(t => t.trim() !== ''),
          alarmsSet,
        }),
      });

      if (response.ok) {
        router.push(ROUTES.TODAY);
      }
    } catch (error) {
      console.error('Failed to complete shutdown:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isDevBypass && status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const steps = [
    {
      number: 1,
      title: 'Brain Dump',
      description: 'Write down any lingering thoughts or tasks',
      icon: FileText,
    },
    {
      number: 2,
      title: 'Tomorrow\'s Top 3',
      description: 'What are your 3 most important tasks for tomorrow?',
      icon: Calendar,
    },
    {
      number: 3,
      title: 'Set Alarms',
      description: 'Ensure you\'re ready for tomorrow',
      icon: AlarmClock,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Moon className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">
            Shutdown Ritual
          </h1>
          <p className="text-indigo-200 text-lg">
            Properly close out your work day
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between mb-12">
          {steps.map((s, idx) => (
            <div key={s.number} className="flex items-center flex-1">
              <div className={`flex flex-col items-center ${idx > 0 ? 'w-full' : ''}`}>
                {idx > 0 && (
                  <div className={`h-1 w-full ${step > s.number - 1 ? 'bg-indigo-400' : 'bg-indigo-800'}`} />
                )}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                  step >= s.number
                    ? 'bg-indigo-500 text-white'
                    : 'bg-indigo-800 text-indigo-400'
                } ${idx > 0 ? 'mt-2' : ''}`}>
                  {step > s.number ? <CheckCircle className="w-6 h-6" /> : s.number}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="bg-bg-surface dark:bg-gray-800 rounded-2xl p-8 shadow-2xl">
          {step === 1 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Brain Dump
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Clear your mind of lingering thoughts
                  </p>
                </div>
              </div>

              <textarea
                value={brainDump}
                onChange={(e) => setBrainDump(e.target.value)}
                placeholder="Write anything that's on your mind... incomplete tasks, ideas, concerns, etc."
                className="w-full h-48 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none bg-bg-surface dark:bg-gray-900 text-gray-900 dark:text-white"
              />

              <button
                onClick={() => setStep(2)}
                className="mt-6 w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
              >
                Continue →
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Tomorrow's Top 3
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    What are your priorities for tomorrow?
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {tomorrowTasks.map((task, idx) => (
                  <div key={idx}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-text-tertiary mb-2">
                      Priority {idx + 1}
                    </label>
                    <input
                      type="text"
                      value={task}
                      onChange={(e) => handleTaskChange(idx, e.target.value)}
                      placeholder={`Task ${idx + 1}`}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-bg-surface dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-text-tertiary font-semibold rounded-xl transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                  <AlarmClock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Set Alarms
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Confirm alarms are set for tomorrow
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 mb-6">
                <p className="text-gray-700 dark:text-text-tertiary mb-4">
                  <strong>Recommended:</strong>
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li>• Morning alarm (wake up time)</li>
                  <li>• First deep work block reminder</li>
                  <li>• Lunch break reminder</li>
                  <li>• Evening shutdown ritual reminder</li>
                </ul>
              </div>

              <label className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700 rounded-xl mb-6">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setAlarmsSet(['morning', 'deep_work', 'lunch', 'shutdown']);
                    } else {
                      setAlarmsSet([]);
                    }
                  }}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-gray-700 dark:text-text-tertiary font-medium">
                  I confirm my alarms are set for tomorrow
                </span>
              </label>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 px-6 py-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-text-tertiary font-semibold rounded-xl transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={handleComplete}
                  disabled={submitting || alarmsSet.length === 0}
                  className="flex-1 px-6 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-semibold rounded-xl transition-colors disabled:cursor-not-allowed"
                >
                  {submitting ? 'Completing...' : 'Complete Shutdown ✓'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quote */}
        <div className="mt-8 text-center">
          <blockquote className="text-indigo-200 italic">
            "The shutdown ritual is perhaps the most important habit for maintaining work-life balance 
            in a deep work practice."
          </blockquote>
          <cite className="text-indigo-300 text-sm mt-2 block">— Cal Newport</cite>
        </div>
      </div>
    </div>
  );
}


