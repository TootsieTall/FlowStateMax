'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Calendar, Target, Sparkles } from 'lucide-react'

export default function OnboardingComplete() {
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    // Get user name from session or default
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('flowstate_user_name') || 'there'
      setUserName(storedName)
    }
  }, [])

  const handleGetStarted = () => {
    setIsRedirecting(true)
    // Redirect to main dashboard/today view
    setTimeout(() => {
      router.push('/today')
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-12">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            You're All Set{userName ? `, ${userName}` : ''}! 🎉
          </h1>
          <p className="text-xl text-gray-600">
            Your deep work journey begins now
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-primary-50 rounded-lg p-4 text-center">
            <Target className="w-8 h-8 text-primary-700 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Focus Areas Set</h3>
            <p className="text-sm text-gray-600">Your goals are defined</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <Calendar className="w-8 h-8 text-purple-700 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Rituals Ready</h3>
            <p className="text-sm text-gray-600">Your routines are configured</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <Sparkles className="w-8 h-8 text-green-700 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Recovery Planned</h3>
            <p className="text-sm text-gray-600">Balance is key to success</p>
          </div>
        </div>

        {/* What's Next Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-blue-900 mb-3">What happens next?</h2>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>Schedule your first deep work blocks in your calendar</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>Install the browser extension to block distracting sites</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>Complete your pre-work ritual before starting flow sessions</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>Track your progress and celebrate your deep work wins</span>
            </li>
          </ul>
        </div>

        {/* Cal Newport Quote */}
        <div className="mb-8 p-4 border-l-4 border-primary-600 bg-primary-50">
          <p className="text-sm italic text-gray-700">
            "Clarity about what matters provides clarity about what does not."
          </p>
          <p className="text-sm text-gray-600 mt-2">— Cal Newport, Deep Work</p>
        </div>

        {/* CTA Button */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleGetStarted}
            disabled={isRedirecting}
            className="w-full bg-primary-700 hover:bg-primary-800 disabled:bg-primary-500 text-white font-bold px-10 py-4 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            {isRedirecting ? 'Launching Dashboard...' : 'Start Your First Flow Session →'}
          </button>
          
          <p className="text-sm text-gray-500">
            You can always adjust these settings later in your profile
          </p>
        </div>

        {/* Extension Reminder */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-start gap-3 text-sm">
            <div className="bg-yellow-100 rounded-lg p-2">
              <span className="text-2xl">🔌</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Don't forget the browser extension!
              </h3>
              <p className="text-gray-600 mb-2">
                Install the FlowState extension to automatically block distracting websites during your flow sessions.
              </p>
              <button
                onClick={() => window.open('/extension-install', '_blank')}
                className="text-primary-700 hover:text-primary-800 font-medium underline"
              >
                Install Extension →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

