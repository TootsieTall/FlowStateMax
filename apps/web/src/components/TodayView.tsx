'use client'

import { useState, useMemo, lazy, Suspense, memo, useEffect } from 'react'
import { BlockCard, Button, FlowTimer } from '@flowstate/ui'
import { format, isWithinInterval } from 'date-fns'
import { Play, Plus, CheckCircle } from 'lucide-react'
import { SessionData } from './SessionChecklist'
import { SessionComplete } from './SessionComplete'
import { useAppStore } from '@/store'

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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">FlowState</h1>
            </div>
            <div className="flex items-center space-x-8">
              <a href="/week" className="text-gray-600 hover:text-gray-900">
                Week
              </a>
              <a href="/today" className="text-primary font-semibold border-b-2 border-primary pb-1">
                Today
              </a>
              <a href="/explore" className="text-gray-600 hover:text-gray-900">
                Explore
              </a>
              <a href="/settings" className="text-gray-600 hover:text-gray-900">
                Settings
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Daily Goals */}
        {dailyGoals.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-primary" />
              Today's Goals
            </h2>
            <ul className="space-y-2">
              {dailyGoals.map((goal, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary font-bold mr-2">{index + 1}.</span>
                  <span className="text-gray-700">{goal}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Current Block */}
        {currentBlock ? (
          <div className="bg-white rounded-lg shadow-md border-2 border-primary p-8 mb-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">Current Block</p>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{currentBlock.title}</h2>
              <p className="text-lg text-gray-600 mb-6">
                {format(new Date(currentBlock.startTime), 'h:mm a')} -{' '}
                {format(new Date(currentBlock.endTime), 'h:mm a')}
              </p>

              {!isInFlow ? (
                <Button
                  onClick={handleStartFlow}
                  size="lg"
                  className="bg-primary hover:bg-primary-dark text-white px-8 py-4 text-lg"
                >
                  <Play className="w-6 h-6 mr-2" />
                  Start Flow Session
                </Button>
              ) : (
                <div className="text-sm text-primary-700 font-medium">
                  Flow session in progress...
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6 text-center">
            <p className="text-gray-500">No active time block right now</p>
            <p className="text-sm text-gray-400 mt-2">Your next block is coming up soon</p>
          </div>
        )}

        {/* Upcoming Blocks */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Coming Up</h3>
          {upcomingBlocks.length > 0 ? (
            upcomingBlocks.map((block) => (
              <MemoizedBlockCard
                key={block.id}
                title={block.title}
                startTime={new Date(block.startTime)}
                endTime={new Date(block.endTime)}
                type={block.type}
                color={block.color}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No upcoming blocks for today</p>
          )}
        </div>

        {/* Quick Capture Button */}
        <button
          className="fixed bottom-8 right-8 bg-primary hover:bg-primary-dark text-white rounded-full p-4 shadow-lg transition-transform hover:scale-110"
          onClick={() => (window.location.href = '/capture')}
        >
          <Plus className="w-6 h-6" />
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full">
            <Suspense fallback={
              <div className="bg-white rounded-xl p-8 text-center">
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
                <p className="mt-4 text-gray-500">Loading session setup...</p>
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