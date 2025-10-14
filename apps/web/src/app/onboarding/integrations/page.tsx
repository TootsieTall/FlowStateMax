'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Calendar, Mail, CheckCircle, Circle, ArrowRight, Info, X, GraduationCap } from 'lucide-react'

type IntegrationType = 'google' | 'outlook' | 'apple' | null

export default function IntegrationsPage() {
  const router = useRouter()
  const [selectedCalendar, setSelectedCalendar] = useState<IntegrationType>(null)
  const [selectedEmail, setSelectedEmail] = useState<IntegrationType>(null)
  const [canvasToken, setCanvasToken] = useState('')
  const [showCanvasModal, setShowCanvasModal] = useState(false)

  const handleContinue = async () => {
    // Save integration preferences to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('flowstate_calendar_integration', JSON.stringify(selectedCalendar))
      localStorage.setItem('flowstate_email_integration', JSON.stringify(selectedEmail))
    }

    console.log('Saved integrations:', { calendar: selectedCalendar, email: selectedEmail })
    router.push('/onboarding/locations')
  }

  const handleSkip = () => {
    router.push('/onboarding/locations')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary flex items-center justify-center p-4">
      {/* Canvas API Modal */}
      {showCanvasModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowCanvasModal(false)}
        >
          {/* Backdrop with blur */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
          {/* Modal Content */}
          <div 
            className="relative bg-bg-elevated rounded-2xl border border-accent-gold/30 shadow-glow-strong max-w-lg w-full p-6 animate-bounce-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowCanvasModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-accent-gold/10 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-text-tertiary hover:text-text-primary" />
            </button>

            {/* Modal Header */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-6 h-6 text-accent-orange" />
                <h2 className="text-h2 text-text-primary">How to Get Your Canvas API Token</h2>
              </div>
              <p className="text-body-sm text-text-tertiary">
                Follow these steps to connect your Canvas account
              </p>
            </div>

            {/* Instructions */}
            <ol className="space-y-4 mb-6">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-accent-gold/20 text-accent-orange rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </span>
                <div>
                  <p className="text-body text-text-primary font-medium">Log into your Canvas dashboard</p>
                  <p className="text-body-sm text-text-tertiary">Open your university's Canvas site and sign in</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-accent-gold/20 text-accent-orange rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </span>
                <div>
                  <p className="text-body text-text-primary font-medium">Go to Account → Settings</p>
                  <p className="text-body-sm text-text-tertiary">Click on your profile and navigate to Settings</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-accent-gold/20 text-accent-orange rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </span>
                <div>
                  <p className="text-body text-text-primary font-medium">Scroll to "Approved Integrations" or "New Access Token"</p>
                  <p className="text-body-sm text-text-tertiary">Look for the API integration section</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-accent-gold/20 text-accent-orange rounded-full flex items-center justify-center text-sm font-semibold">
                  4
                </span>
                <div>
                  <p className="text-body text-text-primary font-medium">Generate a token — that's your "API key"</p>
                  <p className="text-body-sm text-text-tertiary">Copy the token and paste it in the input field</p>
                </div>
              </li>
            </ol>

            {/* Info Banner */}
            <div className="p-3 bg-accent-gold/10 border border-accent-gold/30 rounded-lg">
              <p className="text-body-sm text-text-secondary">
                <span className="font-semibold text-text-primary">Note:</span> Keep your API token secure. 
                We'll use it to fetch your assignment deadlines and sync them to your calendar.
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowCanvasModal(false)}
              className="mt-6 w-full btn-primary"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      <div className="bg-bg-elevated rounded-2xl border border-accent-gold/30 shadow-glow-strong max-w-2xl w-full p-8 animate-slide-in-right">
        <div className="mb-8">
          <div className="text-overline text-accent-orange mb-2">STEP 3 OF 8</div>
          <h1 className="text-display-md text-text-primary mb-2">Connect Your Tools 🔗</h1>
          <p className="text-body text-text-tertiary">
            Link your calendar and email to automatically schedule deep work sessions
          </p>
        </div>

        {/* Info Banner */}
        <div className="mb-8 p-4 bg-gradient-to-r from-accent-gold/10 to-accent-orange/10 border border-accent-gold/30 rounded-warm-lg flex items-start gap-3">
          <Info className="w-5 h-5 text-accent-orange flex-shrink-0 mt-0.5" />
          <div className="text-body-sm text-text-primary">
            <p className="font-semibold mb-1">Why connect?</p>
            <p>
              Daybreak can automatically find free time in your calendar and block it for deep work. 
              We'll also help you decline low-value meetings that conflict with your focus time.
            </p>
          </div>
        </div>

        {/* Calendar Integration */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-gray-700" />
            <label className="block text-sm font-medium text-gray-700">
              Calendar Integration (Optional)
            </label>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => setSelectedCalendar('google')}
              className={`w-full p-4 rounded-warm-lg border-2 transition-all duration-fast text-left hover-lift ${
                selectedCalendar === 'google'
                  ? 'border-accent-gold bg-gradient-to-br from-sunset-50 to-gold-50 shadow-glow-medium'
                  : 'border-border-default hover:border-accent-gold/30 bg-bg-surface'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-bg-surface rounded-lg flex items-center justify-center shadow-glow-subtle border border-border-default">
                    <span className="text-xl">📅</span>
                  </div>
                  <div>
                    <h3 className={`font-semibold ${selectedCalendar === 'google' ? 'text-accent-orange' : 'text-text-primary'}`}>
                      Google Calendar
                    </h3>
                    <p className="text-body-sm text-text-tertiary">Sync with Gmail and Google Workspace</p>
                  </div>
                </div>
                {selectedCalendar === 'google' ? (
                  <CheckCircle className="w-5 h-5 text-accent-gold animate-bounce-in" />
                ) : (
                  <Circle className="w-5 h-5 text-text-tertiary" />
                )}
              </div>
            </button>

            <button
              onClick={() => setSelectedCalendar('outlook')}
              className={`w-full p-4 rounded-warm border-2 transition-all text-left ${
                selectedCalendar === 'outlook'
                  ? 'border-accent-gold bg-accent-gold/5'
                  : 'border-border-default hover:border-accent-gold/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-bg-surface rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
                    <span className="text-xl">📧</span>
                  </div>
                  <div>
                    <h3 className={`font-semibold ${selectedCalendar === 'outlook' ? 'text-accent-orange' : 'text-text-primary'}`}>
                      Outlook Calendar
                    </h3>
                    <p className="text-sm text-gray-500">Sync with Microsoft 365 and Outlook</p>
                  </div>
                </div>
                {selectedCalendar === 'outlook' ? (
                  <CheckCircle className="w-5 h-5 text-accent-gold" />
                ) : (
                  <Circle className="w-5 h-5 text-text-tertiary" />
                )}
              </div>
            </button>

            <button
              onClick={() => setSelectedCalendar('apple')}
              className={`w-full p-4 rounded-warm border-2 transition-all text-left ${
                selectedCalendar === 'apple'
                  ? 'border-accent-gold bg-accent-gold/5'
                  : 'border-border-default hover:border-accent-gold/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-bg-surface rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
                    <span className="text-xl">🍎</span>
                  </div>
                  <div>
                    <h3 className={`font-semibold ${selectedCalendar === 'apple' ? 'text-accent-orange' : 'text-text-primary'}`}>
                      Apple Calendar
                    </h3>
                    <p className="text-sm text-gray-500">Sync with iCloud Calendar</p>
                  </div>
                </div>
                {selectedCalendar === 'apple' ? (
                  <CheckCircle className="w-5 h-5 text-accent-gold" />
                ) : (
                  <Circle className="w-5 h-5 text-text-tertiary" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Email Integration */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Mail className="w-5 h-5 text-gray-700" />
            <label className="block text-sm font-medium text-gray-700">
              Work/School Email (Optional)
            </label>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => setSelectedEmail('google')}
              className={`w-full p-4 rounded-warm border-2 transition-all text-left ${
                selectedEmail === 'google'
                  ? 'border-accent-gold bg-accent-gold/5'
                  : 'border-border-default hover:border-accent-gold/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-bg-surface rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
                    <span className="text-xl">✉️</span>
                  </div>
                  <div>
                    <h3 className={`font-semibold ${selectedEmail === 'google' ? 'text-accent-orange' : 'text-text-primary'}`}>
                      Gmail / Google Workspace
                    </h3>
                    <p className="text-sm text-gray-500">Connect your Gmail account</p>
                  </div>
                </div>
                {selectedEmail === 'google' ? (
                  <CheckCircle className="w-5 h-5 text-accent-gold" />
                ) : (
                  <Circle className="w-5 h-5 text-text-tertiary" />
                )}
              </div>
            </button>

            <button
              onClick={() => setSelectedEmail('outlook')}
              className={`w-full p-4 rounded-warm border-2 transition-all text-left ${
                selectedEmail === 'outlook'
                  ? 'border-accent-gold bg-accent-gold/5'
                  : 'border-border-default hover:border-accent-gold/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-bg-surface rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
                    <span className="text-xl">📨</span>
                  </div>
                  <div>
                    <h3 className={`font-semibold ${selectedEmail === 'outlook' ? 'text-accent-orange' : 'text-text-primary'}`}>
                      Outlook / Microsoft 365
                    </h3>
                    <p className="text-sm text-gray-500">Connect your Outlook account</p>
                  </div>
                </div>
                {selectedEmail === 'outlook' ? (
                  <CheckCircle className="w-5 h-5 text-accent-gold" />
                ) : (
                  <Circle className="w-5 h-5 text-text-tertiary" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Canvas Integration */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="w-5 h-5 text-gray-700" />
            <label className="block text-sm font-medium text-gray-700">
              University Canvas (Optional)
            </label>
            <button
              onClick={() => setShowCanvasModal(true)}
              className="ml-2 flex items-center gap-1.5 px-2 py-1 hover:bg-accent-gold/10 rounded-lg transition-all group animate-pulse-subtle"
              aria-label="How to get Canvas API token"
            >
              <Info className="w-4 h-4 text-accent-orange group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-accent-orange group-hover:text-accent-warm">
                How to get this?
              </span>
            </button>
          </div>
          
          <div className="p-4 rounded-warm border-2 border-border-default bg-bg-surface">
            <p className="text-sm text-text-secondary mb-3">
              Connect your Canvas account to sync assignment deadlines to your calendar
            </p>
            <input
              type="text"
              value={canvasToken}
              onChange={(e) => setCanvasToken(e.target.value)}
              placeholder="Paste your Canvas API token here"
              className="input w-full"
            />
          </div>
        </div>

        {/* Privacy Note */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            🔒 <span className="font-semibold">Privacy First:</span> We only read calendar availability 
            and meeting titles. Your emails and calendar details remain private and are never stored on our servers.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="btn-ghost"
          >
            Back
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="btn-ghost"
            >
              Skip for now
            </button>
            <button
              onClick={handleContinue}
              className="btn-primary flex items-center gap-2"
            >
              {selectedCalendar || selectedEmail ? 'Connect & Continue' : 'Continue'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Note about actual connection */}
        {(selectedCalendar || selectedEmail) && (
          <div className="mt-4 text-center">
            <p className="text-caption text-text-tertiary">
              Note: Actual integration will be set up after onboarding
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

