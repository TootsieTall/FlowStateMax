'use client'

import { useState, useMemo, lazy, Suspense, memo, useEffect } from 'react'
import { BlockCard, Button, FlowTimer } from '@flowstate/ui'
import { format, isWithinInterval } from 'date-fns'
import { Play, Plus, CheckCircle, Sparkles } from 'lucide-react'
import { SessionData } from './SessionChecklist'
import { SessionComplete } from './SessionComplete'
import { StartFlowButton } from './StartFlowButton'
import { useAppStore } from '@/store'
import ROUTES from '@/lib/routes'

// Lazy load SessionChecklist modal for better initial load performance
const SessionChecklist = lazy(() => import('./SessionChecklist').then(module => ({ default: module.default })))

interface TimeBlock {
  id: string
  title: string
  startTime: Date
  endTime: Date
  type: string
  color: string | null
  completed: boolean
}

interface TodayViewProps {
  user: any
  blocks: TimeBlock[]
  dailyGoals: string[]
}

// Memoized BlockCard for performance
const MemoizedBlockCard = memo(BlockCard)

export function TodayView({ user, blocks, dailyGoals }: TodayViewProps) {
  const [showChecklist, setShowChecklist] = useState(false)
  const [showComplete, setShowComplete] = useState(false)

  // Global session state
  const {
    currentSession,
    isInFlow,
    startFlowSession,
    endFlowSession,
    pauseFlowSession,
    resumeFlowSession,
    checkExtensionConnection,
    toggleQuickCapture,
  } = useAppStore()

  // Check extension connection on mount
  useEffect(() => {
    checkExtensionConnection()
  }, [])

  // Memoize expensive calculations
  const { currentBlock, upcomingBlocks } = useMemo(() => {
    const now = new Date()

    // Find current block
    const current = blocks.find((block) =>
      isWithinInterval(now, { start: new Date(block.startTime), end: new Date(block.endTime) })
    )

    // Get next 3 blocks
    const upcoming = blocks
      .filter((block) => new Date(block.startTime) > now)
      .slice(0, 3)

    return { currentBlock: current, upcomingBlocks: upcoming }
  }, [blocks])

  const handleStartFlow = () => {
    setShowChecklist(true)
  }

  const handleSessionComplete = async (sessionData: SessionData) => {
    if (!currentBlock) return

    setShowChecklist(false)

    // Start Flow session with full integration
    const result = await startFlowSession(currentBlock.id, sessionData.duration)

    if (!result.success) {
      alert(`Failed to start session: ${result.error}`)
    }
  }

  const handleEndSession = async () => {
    if (!currentSession) return

    const result = await endFlowSession()

    if (result.success) {
      // Calculate duration for feedback
      const duration = Math.floor(
        (new Date().getTime() - new Date(currentSession.startTime).getTime()) / (1000 * 60)
      )

      // Show completion modal
      setShowComplete(true)
    } else {
      alert(`Failed to end session: ${result.error}`)
    }
  }

  const handleSessionFeedback = async (
    feedback: 'on_time' | 'needed_more' | 'finished_early'
  ) => {
    // Update session with feedback
    if (currentSession) {
      await fetch('/api/sessions/flow', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: currentSession.id,
          feedback,
        }),
      })
    }

    setShowComplete(false)
  }

  return (
    <div className="min-h-screen layer-base">
      {/* Navigation - Floating layer with depth */}
      <nav className="layer-floating sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gradient-sunset">Daybreak</h1>
            </div>
            <div className="flex items-center space-x-6 md:space-x-8">
              <a href={ROUTES.WEEK} className="text-bark-200 hover:text-sunset-500 transition-all duration-fast hover:-translate-y-0.5">
                Week
              </a>
              <a href={ROUTES.TODAY} className="text-sunset-500 font-semibold">
                Today
              </a>
              <a href={ROUTES.CAPTURE} className="text-bark-200 hover:text-sunset-500 transition-all duration-fast hover:-translate-y-0.5">
                Capture
              </a>
              <a href={ROUTES.EXPLORE} className="text-bark-200 hover:text-sunset-500 transition-all duration-fast hover:-translate-y-0.5">
                Explore
              </a>
              <a href={ROUTES.SETTINGS} className="text-bark-200 hover:text-sunset-500 transition-all duration-fast hover:-translate-y-0.5">
                Settings
              </a>
              <StartFlowButton variant="icon" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Responsive container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Daily Goals - Elevated card */}
        {dailyGoals.length > 0 && (
          <div className="card-shiny p-6">
            <h2 className="text-h3 text-bark-500 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-gold-400" />
              Today's Goals
            </h2>
            <ul className="space-y-3">
              {dailyGoals.map((goal, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-sunset-500 font-bold mr-3 text-lg">{index + 1}.</span>
                  <span className="text-body text-bark-400 leading-relaxed">{goal}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Current Block - Hero elevation with glow */}
        {currentBlock ? (
          <div className="layer-modal p-8 rounded-warm-lg shadow-glow-sunset">
            <div className="text-center">
              <p className="text-overline text-bark-200 mb-2">Current Block</p>
              <h2 className="text-display-md text-bark-500 mb-2">{currentBlock.title}</h2>
              <p className="text-body-lg text-bark-300 mb-6">
                {format(new Date(currentBlock.startTime), 'h:mm a')} -{' '}
                {format(new Date(currentBlock.endTime), 'h:mm a')}
              </p>

              <StartFlowButton variant="primary" />
            </div>
          </div>
        ) : (
          <div className="layer-elevated p-8 rounded-warm-lg text-center">
            <p className="text-body text-bark-300">No active time block right now</p>
            <p className="text-body-sm text-bark-200 mt-2">Your next block is coming up soon</p>
          </div>
        )}

        {/* Upcoming Blocks - Stacked cards with proper spacing */}
        <div className="space-y-4">
          <h3 className="text-h3 text-bark-500">Coming Up</h3>
          {upcomingBlocks.length > 0 ? (
            <div className="space-y-3">
              {upcomingBlocks.map((block) => (
                <MemoizedBlockCard
                  key={block.id}
                  title={block.title}
                  startTime={new Date(block.startTime)}
                  endTime={new Date(block.endTime)}
                  type={block.type}
                  color={block.color}
                />
              ))}
            </div>
          ) : (
            <div className="layer-elevated p-8 rounded-warm-lg text-center">
              <p className="text-body text-bark-300">No upcoming blocks for today</p>
            </div>
          )}
        </div>

        {/* Quick Capture Button - Floating action */}
        <button
          className="fixed bottom-8 right-8 bg-sunset-500 hover:bg-sunset-600 text-white rounded-full p-4 shadow-warm-lg hover:shadow-glow-sunset transition-all hover:scale-110 group z-40"
          onClick={toggleQuickCapture}
          title="Quick Capture (⌘K)"
        >
          <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        </button>
      </main>

      {/* Flow Timer Overlay */}
      {isInFlow && currentSession && (
        <FlowTimer
          startTime={new Date(currentSession.startTime)}
          endTime={new Date(currentSession.endTime)}
          onPause={pauseFlowSession}
          onResume={resumeFlowSession}
          onEnd={handleEndSession}
        />
      )}

      {/* Session Checklist Modal - Lazy loaded with Suspense */}
      {showChecklist && (
        <div className="fixed inset-0 bg-bark-500/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full">
            <Suspense fallback={
              <div className="layer-modal rounded-warm-lg p-8 text-center">
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-dawn-200 rounded-warm w-3/4 mx-auto"></div>
                  <div className="h-4 bg-dawn-200 rounded-warm w-1/2 mx-auto"></div>
                </div>
                <p className="mt-4 text-bark-300">Loading session setup...</p>
              </div>
            }>
              <SessionChecklist
                onComplete={handleSessionComplete}
                onSkip={() => setShowChecklist(false)}
              />
            </Suspense>
          </div>
        </div>
      )}

      {/* Session Completion Modal */}
      {showComplete && currentSession && (
        <SessionComplete
          duration={Math.floor(
            (new Date().getTime() - new Date(currentSession.startTime).getTime()) / (1000 * 60)
          )}
          targetDuration={currentSession.duration}
          onComplete={handleSessionFeedback}
          onClose={() => setShowComplete(false)}
        />
      )}
    </div>
  )
}