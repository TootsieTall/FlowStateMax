'use client'

import { useState, useMemo, lazy, Suspense, memo, useEffect } from 'react'
import { BlockCard, Button, FlowTimer } from '@flowstate/ui'
import { format, isWithinInterval } from 'date-fns'
import { CheckCircle, Sparkles, Timer } from 'lucide-react'
import { SessionData } from './SessionChecklist'
import { SessionComplete } from './SessionComplete'
import { StartFlowButton } from './StartFlowButton'
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

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

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
      setShowComplete(true)
    } else {
      alert(`Failed to end session: ${result.error}`)
    }
  }

  const handleSessionFeedback = async (
    feedback: 'on_time' | 'needed_more' | 'finished_early'
  ) => {
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

  const today = format(new Date(), 'EEEE, MMMM d')
  const firstName = user?.name?.split(' ')[0] || 'there'
  const totalDeepWork = blocks.reduce((acc, b) => {
    const mins = Math.floor((new Date(b.endTime).getTime() - new Date(b.startTime).getTime()) / 60000)
    return acc + mins
  }, 0)
  const deepWorkHours = Math.floor(totalDeepWork / 60)
  const deepWorkMins = totalDeepWork % 60

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: '#0B0B0B' }}>
      {/* Radial golden glow at BOTTOM CENTER — exact Stitch 02 */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: 'radial-gradient(circle at bottom center, rgba(255, 199, 87, 0.08) 0%, transparent 70%)',
        }}
      />

      {/* Header — Stitch 02: wb_twilight logo, nav links, notification bell, avatar */}
      <header
        className="relative z-50 flex items-center justify-between px-6 lg:px-20 py-4 sticky top-0"
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(11,11,11,0.5)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: '#ffc757', color: '#0B0B0B' }}
          >
            <span className="material-symbols-outlined font-bold" style={{ fontSize: '20px' }}>wb_twilight</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-100">Daybreak</h2>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-[#ffc757] transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
            style={{
              background: '#ffc757',
              color: '#0B0B0B',
              border: '2px solid rgba(255,199,87,0.2)',
            }}
          >
            {user?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || '?'}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-[1400px] mx-auto w-full p-6 lg:p-10 space-y-10">
        {/* Welcome Header — Stitch 02 */}
        <div className="space-y-2">
          <p
            className="font-medium tracking-wide uppercase text-xs"
            style={{ color: '#ffc757' }}
          >
            {today}
          </p>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-100">
            {getGreeting()}, {firstName}.
          </h1>
          <p className="text-slate-400 text-lg">
            Your focus blocks are ready. Let&apos;s make today count.
          </p>
        </div>

        {/* Dashboard Grid — Stitch 02 12-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ── Left: Today's Goals ── */}
          <section className="lg:col-span-3 flex flex-col gap-6">
            <div
              className="rounded-xl p-6 h-full"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255, 199, 87, 0.15)',
                boxShadow: '0 0 20px rgba(255, 199, 87, 0.05)',
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-slate-100">Today&apos;s Goals</h3>
                <span
                  className="text-xs font-bold px-2 py-1 rounded-full"
                  style={{ color: '#ffc757', background: 'rgba(255,199,87,0.1)' }}
                >
                  {dailyGoals.length > 0 ? `0/${dailyGoals.length}` : '0/0'}
                </span>
              </div>
              {dailyGoals.length > 0 ? (
                <ul className="space-y-4">
                  {dailyGoals.map((goal, index) => (
                    <li key={index} className="flex items-start gap-3 group">
                      <div
                        className="mt-1 w-5 h-5 rounded flex-shrink-0 hover:border-[#ffc757] transition-colors"
                        style={{
                          border: '1px solid rgba(255,199,87,0.4)',
                        }}
                      />
                      <span className="text-sm text-slate-100">{goal}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-400 italic">No goals set yet.</p>
              )}
              <button
                className="mt-8 w-full py-2.5 rounded-lg text-xs font-bold text-slate-300 hover:bg-white/5 transition-all"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
              >
                + ADD GOAL
              </button>
            </div>
          </section>

          {/* ── Center: Current Block / Between Blocks ── */}
          <section className="lg:col-span-5 flex flex-col gap-6">
            {currentBlock ? (
              <div
                className="rounded-xl p-8 flex flex-col items-center text-center justify-center min-h-[400px] relative overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255, 199, 87, 0.15)',
                  boxShadow: '0 0 20px rgba(255, 199, 87, 0.05)',
                }}
              >
                <div className="absolute inset-0 blur-[100px] -z-10" style={{ background: 'rgba(255,199,87,0.05)' }} />
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                  style={{ background: 'rgba(255,199,87,0.2)', color: '#ffc757' }}
                >
                  <span className="material-symbols-outlined text-4xl">target</span>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-100 mb-2">{currentBlock.title}</h3>
                <p className="text-slate-400 mb-8 max-w-xs text-sm">
                  {format(new Date(currentBlock.startTime), 'h:mm a')} — {format(new Date(currentBlock.endTime), 'h:mm a')}
                </p>
                <StartFlowButton variant="primary" />
              </div>
            ) : (
              <div
                className="rounded-xl p-8 flex flex-col items-center text-center justify-center min-h-[400px] relative overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255, 199, 87, 0.15)',
                  boxShadow: '0 0 20px rgba(255, 199, 87, 0.05)',
                }}
              >
                <div className="absolute inset-0 blur-[100px] -z-10" style={{ background: 'rgba(255,199,87,0.05)' }} />
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                  style={{ background: 'rgba(255,199,87,0.2)', color: '#ffc757' }}
                >
                  <span className="material-symbols-outlined text-4xl">coffee</span>
                </div>
                <h3 className="text-2xl font-extrabold mb-2 text-slate-100">Between Blocks</h3>
                <p className="text-slate-400 mb-8 max-w-xs text-sm">
                  Take a 15-minute conscious break before your next focus session.
                </p>
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div
                    className="p-4 rounded-xl cursor-pointer group transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.05)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,199,87,0.3)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)' }}
                  >
                    <span className="material-symbols-outlined mb-2" style={{ color: '#ffc757' }}>self_improvement</span>
                    <p className="text-sm font-bold text-slate-100 block">Box Breathing</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">4 Minutes</p>
                  </div>
                  <div
                    className="p-4 rounded-xl cursor-pointer group transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.05)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,199,87,0.3)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)' }}
                  >
                    <span className="material-symbols-outlined mb-2" style={{ color: '#ffc757' }}>directions_walk</span>
                    <p className="text-sm font-bold text-slate-100 block">Digital Walk</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">10 Minutes</p>
                  </div>
                </div>
                <button
                  className="mt-8 px-8 py-3 rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all"
                  style={{ background: '#ffc757', color: '#0B0B0B' }}
                >
                  RESUME DEEP WORK
                </button>
              </div>
            )}
          </section>

          {/* ── Right: Coming Up + Deep Work stat ── */}
          <section className="lg:col-span-4 flex flex-col gap-6">
            {/* Coming Up — Stitch 02 timeline */}
            <div
              className="rounded-xl p-6"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255, 199, 87, 0.15)',
                boxShadow: '0 0 20px rgba(255, 199, 87, 0.05)',
              }}
            >
              <h3 className="font-bold text-lg text-slate-100 mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined" style={{ color: '#ffc757' }}>schedule</span>
                Coming Up
              </h3>
              {upcomingBlocks.length > 0 ? (
                <div className="space-y-6 relative">
                  {/* Vertical timeline line */}
                  <div
                    className="absolute top-2 bottom-2 w-px"
                    style={{ left: '11px', background: 'rgba(255,255,255,0.1)' }}
                  />
                  {upcomingBlocks.map((block, idx) => (
                    <div key={block.id} className="relative pl-8">
                      <div
                        className="absolute left-0 top-1.5 w-[23px] h-[23px] rounded-full z-10"
                        style={{
                          background: '#0B0B0B',
                          border: idx === 0 ? '2px solid #ffc757' : '2px solid #334155',
                        }}
                      />
                      <div className="flex flex-col">
                        {idx === 0 && (
                          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#ffc757' }}>
                            Next Up
                          </span>
                        )}
                        <span className="text-sm font-bold text-slate-100">{block.title}</span>
                        <span className="text-xs text-slate-500">
                          {format(new Date(block.startTime), 'h:mm a')} - {format(new Date(block.endTime), 'h:mm a')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <span className="text-2xl mb-2 block">🌅</span>
                  <p className="text-xs text-slate-500">All clear ahead!</p>
                </div>
              )}
            </div>

            {/* Deep Work stat card — Stitch 02 */}
            <div
              className="rounded-xl p-6 flex items-center justify-between"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255, 199, 87, 0.15)',
                boxShadow: '0 0 20px rgba(255, 199, 87, 0.05)',
              }}
            >
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Deep Work Today</p>
                <p className="text-2xl font-black text-slate-100">
                  {deepWorkHours > 0 ? `${deepWorkHours}h ${deepWorkMins}m` : `${deepWorkMins}m`}
                </p>
              </div>
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(255,199,87,0.1)', color: '#ffc757' }}
              >
                <span className="material-symbols-outlined text-3xl">bolt</span>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Quote — Stitch 02: centered, format_quote icon, gold flanking lines */}
        <footer className="pt-20 pb-10 flex flex-col items-center text-center">
          <div className="max-w-2xl px-6">
            <span
              className="material-symbols-outlined text-5xl mb-4 italic"
              style={{ color: 'rgba(255,199,87,0.3)' }}
            >
              format_quote
            </span>
            <p className="text-xl lg:text-2xl font-medium text-slate-300 italic leading-relaxed">
              &ldquo;If you don&apos;t produce, you won&apos;t thrive — no matter how skilled or talented you are.&rdquo;
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <div className="h-px w-8" style={{ background: 'rgba(255,199,87,0.3)' }} />
              <span className="text-sm font-bold tracking-widest uppercase" style={{ color: '#ffc757' }}>Cal Newport</span>
              <div className="h-px w-8" style={{ background: 'rgba(255,199,87,0.3)' }} />
            </div>
          </div>
          <div className="mt-20 opacity-20 text-[10px] tracking-[0.4em] font-bold uppercase text-slate-400">
            Daybreak &copy; 2024 &bull; Focus on what matters
          </div>
        </footer>
      </main>

      {/* Quick Capture FAB */}
      <button
        className="fixed bottom-24 right-6 rounded-full p-4 shadow-lg hover:scale-110 transition-all group z-40"
        style={{
          background: 'linear-gradient(135deg, #ffc757, #FF8C42)',
          color: '#0B0B0B',
          boxShadow: '0 0 20px rgba(255,200,87,0.35)',
        }}
        onClick={toggleQuickCapture}
        title="Quick Capture"
      >
        <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
      </button>

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

      {/* Session Checklist Modal — Lazy loaded */}
      {showChecklist && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full">
            <Suspense fallback={
              <div style={{ background: '#1E1E1E', border: '1px solid #2C2C2C' }} className="rounded-xl p-8 text-center">
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-white/5 rounded w-3/4 mx-auto" />
                  <div className="h-4 bg-white/5 rounded w-1/2 mx-auto" />
                </div>
                <p className="mt-4 text-slate-500 text-sm">Loading session setup...</p>
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
