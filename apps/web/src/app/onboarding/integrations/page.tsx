'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Mail, CheckCircle, Circle, ArrowRight, Info } from 'lucide-react'

type IntegrationType = 'google' | 'outlook' | 'apple' | null

export default function IntegrationsPage() {
  const router = useRouter()
  const [selectedCalendar, setSelectedCalendar] = useState<IntegrationType>(null)
  const [selectedEmail, setSelectedEmail] = useState<IntegrationType>(null)

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
    <div className="min-h-screen bg-gradient-to-br from-gold-200 via-dawn-100 to-sunset-200 flex items-center justify-center p-4">
      <div className="card-elevated max-w-2xl w-full p-8 animate-slide-in-right">
        <div className="mb-8">
          <div className="text-overline text-sunset-600 mb-2">STEP 3 OF 8</div>
          <h1 className="text-display-md text-bark-500 mb-2">Connect Your Tools 🔗</h1>
          <p className="text-body text-bark-300">
            Link your calendar and email to automatically schedule deep work sessions
          </p>
        </div>

        {/* Info Banner */}
        <div className="mb-8 p-4 bg-gradient-to-r from-gold-100 to-sunset-100 border border-gold-300 rounded-warm-lg flex items-start gap-3">
          <Info className="w-5 h-5 text-sunset-600 flex-shrink-0 mt-0.5" />
          <div className="text-body-sm text-bark-500">
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
                  ? 'border-sunset-400 bg-gradient-to-br from-sunset-50 to-gold-50 shadow-warm-md'
                  : 'border-border-DEFAULT hover:border-sunset-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-warm-sm border border-border-light">
                    <span className="text-xl">📅</span>
                  </div>
                  <div>
                    <h3 className={`font-semibold ${selectedCalendar === 'google' ? 'text-sunset-600' : 'text-bark-500'}`}>
                      Google Calendar
                    </h3>
                    <p className="text-body-sm text-bark-300">Sync with Gmail and Google Workspace</p>
                  </div>
                </div>
                {selectedCalendar === 'google' ? (
                  <CheckCircle className="w-5 h-5 text-gold-500 animate-bounce-in" />
                ) : (
                  <Circle className="w-5 h-5 text-bark-200" />
                )}
              </div>
            </button>

            <button
              onClick={() => setSelectedCalendar('outlook')}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                selectedCalendar === 'outlook'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
                    <span className="text-xl">📧</span>
                  </div>
                  <div>
                    <h3 className={`font-semibold ${selectedCalendar === 'outlook' ? 'text-primary-700' : 'text-gray-900'}`}>
                      Outlook Calendar
                    </h3>
                    <p className="text-sm text-gray-500">Sync with Microsoft 365 and Outlook</p>
                  </div>
                </div>
                {selectedCalendar === 'outlook' ? (
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300" />
                )}
              </div>
            </button>

            <button
              onClick={() => setSelectedCalendar('apple')}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                selectedCalendar === 'apple'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
                    <span className="text-xl">🍎</span>
                  </div>
                  <div>
                    <h3 className={`font-semibold ${selectedCalendar === 'apple' ? 'text-primary-700' : 'text-gray-900'}`}>
                      Apple Calendar
                    </h3>
                    <p className="text-sm text-gray-500">Sync with iCloud Calendar</p>
                  </div>
                </div>
                {selectedCalendar === 'apple' ? (
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300" />
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
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                selectedEmail === 'google'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
                    <span className="text-xl">✉️</span>
                  </div>
                  <div>
                    <h3 className={`font-semibold ${selectedEmail === 'google' ? 'text-primary-700' : 'text-gray-900'}`}>
                      Gmail / Google Workspace
                    </h3>
                    <p className="text-sm text-gray-500">Connect your Gmail account</p>
                  </div>
                </div>
                {selectedEmail === 'google' ? (
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300" />
                )}
              </div>
            </button>

            <button
              onClick={() => setSelectedEmail('outlook')}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                selectedEmail === 'outlook'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
                    <span className="text-xl">📨</span>
                  </div>
                  <div>
                    <h3 className={`font-semibold ${selectedEmail === 'outlook' ? 'text-primary-700' : 'text-gray-900'}`}>
                      Outlook / Microsoft 365
                    </h3>
                    <p className="text-sm text-gray-500">Connect your Outlook account</p>
                  </div>
                </div>
                {selectedEmail === 'outlook' ? (
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300" />
                )}
              </div>
            </button>
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
            <p className="text-caption text-bark-300">
              Note: Actual integration will be set up after onboarding
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

