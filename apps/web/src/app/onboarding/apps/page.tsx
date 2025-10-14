'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { SUGGESTED_BLOCKED_APPS } from '@flowstate/core'
import { CheckCircle, Circle, Smartphone, AlertCircle } from 'lucide-react'

interface BlockedApp {
  name: string
  identifier: string
  iosBundleId: string
  selected: boolean
}

export default function AppsPage() {
  const router = useRouter()
  const [blockedApps, setBlockedApps] = useState<BlockedApp[]>(
    SUGGESTED_BLOCKED_APPS.map(app => ({ ...app, selected: false }))
  )
  const [customApp, setCustomApp] = useState('')
  const [blockedUrls, setBlockedUrls] = useState('')

  const toggleApp = (identifier: string) => {
    setBlockedApps(prev =>
      prev.map(app =>
        app.identifier === identifier ? { ...app, selected: !app.selected } : app
      )
    )
  }

  const addCustomApp = () => {
    if (!customApp.trim()) return

    const newApp: BlockedApp = {
      name: customApp.trim(),
      identifier: customApp.toLowerCase().replace(/\s+/g, '.'),
      iosBundleId: customApp.toLowerCase().replace(/\s+/g, '.'),
      selected: true
    }

    setBlockedApps([...blockedApps, newApp])
    setCustomApp('')
  }

  const handleContinue = async () => {
    const selectedApps = blockedApps.filter(app => app.selected)

    try {
      // Save blocked apps to database via API
      const response = await fetch('/api/onboarding/apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blockedApps: selectedApps.map(app => ({
            name: app.name,
            identifier: app.identifier,
          })),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('Failed to save blocked apps:', error)
        alert('Failed to save blocked apps. Please try again.')
        return
      }

      const data = await response.json()
      console.log(`✅ Saved ${data.count} blocked apps`)
      router.push('/onboarding/ritual')
    } catch (error) {
      console.error('Error saving blocked apps:', error)
      alert('Failed to save blocked apps. Please try again.')
    }
  }

  const handleSkip = () => {
    router.push('/onboarding/ritual')
  }

  const selectedCount = blockedApps.filter(app => app.selected).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary flex items-center justify-center p-4">
      <div className="bg-bg-elevated rounded-2xl border border-accent-gold/30 shadow-glow-strong animate-slide-in-right max-w-2xl w-full p-8">
        <div className="mb-8">
          <div className="text-overline text-accent-orange mb-2">STEP 5 OF 8</div>
          <h1 className="text-display-md text-text-primary mb-2">
            Which apps distract you?
          </h1>
          <p className="text-body text-text-tertiary">
            Select apps to block during deep work sessions. You'll see a breathing exercise before opening them.
          </p>
        </div>

        {/* Info Banner */}
        <div className="mb-6 p-4 bg-gradient-to-r from-accent-gold/10 to-accent-orange/10 border border-accent-gold/30 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-accent-orange flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-text-primary mb-1">
              How App Blocking Works
            </h3>
            <p className="text-sm text-text-secondary">
              When you try to open a blocked app during a deep work session, you'll be prompted with a 
              10-second breathing exercise. This pause helps you decide if it's truly necessary or just a distraction.
            </p>
          </div>
        </div>

        {/* Suggested Apps */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-primary mb-3">
            <Smartphone className="w-4 h-4 inline mr-1" />
            Common distractions
          </label>
          <div className="grid grid-cols-2 gap-3">
            {blockedApps.slice(0, -1).map((app) => {
              const isCustom = !SUGGESTED_BLOCKED_APPS.some(
                suggested => suggested.identifier === app.identifier
              )
              
              return (
                <button
                  key={app.identifier}
                  onClick={() => toggleApp(app.identifier)}
                  className={`p-4 rounded-lg border-2 transition-all text-left flex items-center justify-between ${
                    app.selected
                      ? 'border-accent-orange bg-accent-orange/10'
                      : 'border-border-default hover:border-accent-gold/30 bg-bg-surface'
                  }`}
                >
                  <span className={`font-medium ${app.selected ? 'text-accent-orange' : 'text-text-primary'}`}>
                    {app.name}
                  </span>
                  {app.selected ? (
                    <CheckCircle className="w-5 h-5 text-accent-orange" />
                  ) : (
                    <Circle className="w-5 h-5 text-text-tertiary" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Custom App Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-primary mb-2">
            Add another app
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customApp}
              onChange={(e) => setCustomApp(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomApp()}
              placeholder="e.g., Discord, Slack, WhatsApp"
              className="input"
            />
            <button
              onClick={addCustomApp}
              className="btn-primary"
            >
              Add
            </button>
          </div>
        </div>

        {/* URL Blocking Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-primary mb-2">
            Block Websites (Optional)
          </label>
          <input
            type="text"
            value={blockedUrls}
            onChange={(e) => setBlockedUrls(e.target.value)}
            placeholder="e.g., twitter.com, reddit.com, youtube.com"
            className="input w-full"
          />
          <p className="text-xs text-text-tertiary mt-2">
            Enter website URLs separated by commas to block during flow sessions
          </p>
        </div>

        {/* Selected Apps List */}
        {blockedApps.filter(app => app.selected && !SUGGESTED_BLOCKED_APPS.some(s => s.identifier === app.identifier)).length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Custom blocked apps
            </label>
            <div className="space-y-2">
              {blockedApps
                .filter(app => app.selected && !SUGGESTED_BLOCKED_APPS.some(s => s.identifier === app.identifier))
                .map((app) => (
                  <div
                    key={app.identifier}
                    className="p-3 bg-accent-orange/10 border border-accent-orange/30 rounded-lg flex items-center justify-between"
                  >
                    <span className="text-sm font-medium text-accent-orange">{app.name}</span>
                    <button
                      onClick={() => {
                        setBlockedApps(prev => prev.filter(a => a.identifier !== app.identifier))
                      }}
                      className="text-accent-orange hover:text-accent-orange text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Browser Extension Notice */}
        <div className="mb-8 p-4 bg-accent-warm/10 border border-accent-warm/30 rounded-lg">
          <h3 className="text-sm font-semibold text-text-primary mb-1">
            📱 Mobile & Desktop Support
          </h3>
          <p className="text-sm text-text-secondary">
            App blocking works through our browser extension and mobile app. Install the extension after onboarding 
            to enable these features on your computer. Mobile support coming soon!
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 btn-ghost"
          >
            Back
          </button>
          <div className="flex items-center gap-4">
            {selectedCount > 0 && (
              <span className="text-sm text-body text-text-tertiary">
                {selectedCount} app{selectedCount !== 1 ? 's' : ''} selected
              </span>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleSkip}
                className="px-6 py-2 btn-ghost"
              >
                Skip
              </button>
              <button
                onClick={handleContinue}
                className="px-8 py-3 btn-primary transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

