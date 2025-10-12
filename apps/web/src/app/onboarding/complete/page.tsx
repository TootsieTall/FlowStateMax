'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { CheckCircle, Calendar, Target, Sparkles } from 'lucide-react'
import ConnectAccountPrompt from '@/components/ConnectAccountPrompt'
import { shouldPromptOAuthConnection } from '@/lib/guest-auth'

export default function OnboardingComplete() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const [userName, setUserName] = useState('')
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [showOAuthPrompt, setShowOAuthPrompt] = useState(false)

  useEffect(() => {
    // Get user name from session or default
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('flowstate_user_name') || 'there'
      setUserName(storedName)
    }

    // Check if we should show OAuth connection prompt
    const connectAccount = searchParams.get('connectAccount')
    if (connectAccount === 'true' || shouldPromptOAuthConnection(session?.user)) {
      setShowOAuthPrompt(true)
    }
  }, [session, searchParams])

  const handleGetStarted = () => {
    setIsRedirecting(true)
    // Redirect to main dashboard/today view
    setTimeout(() => {
      router.push('/today')
    }, 500)
  }

  return (
    <>
      {/* OAuth Connection Prompt Modal */}
      {showOAuthPrompt && (
        <ConnectAccountPrompt 
          onDismiss={() => setShowOAuthPrompt(false)}
          showDismiss={true}
        />
      )}

      <div className="min-h-screen bg-gradient-to-br from-gold-200 via-dawn-100 to-sunset-200 flex items-center justify-center p-4">
        <div className="card-elevated max-w-3xl w-full p-12 shadow-warm-2xl animate-bounce-in">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-gold-300 to-sunset-300 rounded-full p-4 shadow-glow-gold">
            <CheckCircle className="w-16 h-16 text-white animate-pulse" />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-display-lg text-gradient-sunset mb-3">
            You're All Set{userName ? `, ${userName}` : ''}! 🎉
          </h1>
          <p className="text-h4 text-bark-400">
            Your deep work journey begins now
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-primary-700/40 rounded-lg p-4 text-center border border-gray-600">
            <Target className="w-8 h-8 text-coral-400 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-100 mb-1">Focus Areas Set</h3>
            <p className="text-sm text-gray-300">Your goals are defined</p>
          </div>
          
          <div className="bg-purple-600/20 rounded-lg p-4 text-center border border-purple-500/30">
            <Calendar className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-100 mb-1">Rituals Ready</h3>
            <p className="text-sm text-gray-300">Your routines are configured</p>
          </div>
          
          <div className="bg-green-600/20 rounded-lg p-4 text-center border border-green-500/30">
            <Sparkles className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-100 mb-1">Recovery Planned</h3>
            <p className="text-sm text-gray-300">Balance is key to success</p>
          </div>
        </div>

        {/* What's Next Section */}
        <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-blue-300 mb-3">What happens next?</h2>
          <ul className="space-y-2 text-sm text-gray-200">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-400" />
              <span>Schedule your first deep work blocks in your calendar</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-400" />
              <span>Install the browser extension to block distracting sites</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-400" />
              <span>Complete your pre-work ritual before starting flow sessions</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-400" />
              <span>Track your progress and celebrate your deep work wins</span>
            </li>
          </ul>
        </div>

        {/* Cal Newport Quote */}
        <blockquote className="mb-8">
          <p className="text-sm italic">
            "Clarity about what matters provides clarity about what does not."
          </p>
          <footer className="text-sm mt-2">— Cal Newport, Deep Work</footer>
        </blockquote>

        {/* CTA Button */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleGetStarted}
            disabled={isRedirecting}
            className="btn-primary w-full text-lg py-4 shadow-warm-2xl hover:shadow-glow-sunset"
          >
            {isRedirecting ? 'Launching Dashboard... ✨' : 'Start Your First Flow Session →'}
          </button>
          
          <p className="text-body-sm text-bark-300">
            You can always adjust these settings later in your profile
          </p>
        </div>

        {/* Extension Reminder */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <div className="flex items-start gap-3 text-sm">
            <div className="bg-yellow-600/20 rounded-lg p-2 border border-yellow-500/30">
              <span className="text-2xl">🔌</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-100 mb-1">
                Don't forget the browser extension!
              </h3>
              <p className="text-gray-300 mb-2">
                Install the FlowState extension to automatically block distracting websites during your flow sessions.
              </p>
              <button
                onClick={() => window.open('/extension-install', '_blank')}
                className="text-coral-400 hover:text-coral-300 font-medium underline"
              >
                Install Extension →
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  )
}

