'use client'

import { useState } from 'react'
import { BlockCard, Button, Timer } from '@flowstate/ui'
import { format, isWithinInterval } from 'date-fns'
import { Play, Plus, CheckCircle } from 'lucide-react'
import SessionChecklist, { SessionData } from './SessionChecklist'

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

export function TodayView({ user, blocks, dailyGoals }: TodayViewProps) {
  const [activeSession, setActiveSession] = useState<string | null>(null)
  const [showChecklist, setShowChecklist] = useState(false)
  const now = new Date()

  // Find current block
  const currentBlock = blocks.find((block) =>
    isWithinInterval(now, { start: new Date(block.startTime), end: new Date(block.endTime) })
  )

  // Get next 3 blocks
  const upcomingBlocks = blocks
    .filter((block) => new Date(block.startTime) > now)
    .slice(0, 3)

  const handleStartFlow = () => {
    setShowChecklist(true)
  }

  const handleSessionComplete = async (sessionData: SessionData) => {
    if (!currentBlock) return

    // Start flow session with location and checklist data
    const response = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        blockId: currentBlock.id,
        startTime: new Date(),
        location: sessionData.location,
        locationVerified: sessionData.locationVerified,
        duration: sessionData.duration,
        goal: sessionData.goal,
        checklist: sessionData.checklist,
      }),
    })

    if (response.ok) {
      const session = await response.json()
      setActiveSession(session.id)
      setShowChecklist(false)
    }
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

              {activeSession ? (
                <div className="space-y-4">
                  <Timer
                    startTime={new Date(currentBlock.startTime)}
                    endTime={new Date(currentBlock.endTime)}
                  />
                  <p className="text-sm text-gray-500">Flow session active</p>
                </div>
              ) : (
                <Button
                  onClick={handleStartFlow}
                  size="lg"
                  className="bg-primary hover:bg-primary-dark text-white px-8 py-4 text-lg"
                >
                  <Play className="w-6 h-6 mr-2" />
                  Start Flow Session
                </Button>
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
              <BlockCard
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

      {/* Session Checklist Modal */}
      {showChecklist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full">
            <SessionChecklist
              onComplete={handleSessionComplete}
              onSkip={() => setShowChecklist(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}