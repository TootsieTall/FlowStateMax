'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Target, 
  Sparkles,
  ArrowRight,
  Home
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface SessionData {
  id: string
  startTime: string
  endTime: string
  duration: number
  originalDuration?: number
  extendedDuration?: number
  feedback: string
  ritualCompleted: boolean
  locationConfirmed: boolean
}

interface UserStats {
  ritualCompletionCount: number
  locationConfirmationCount: number
  totalSessions: number
  totalMinutes: number
}

export default function FlowCompletePage() {
  const router = useRouter()
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get session data from URL params or localStorage
    const urlParams = new URLSearchParams(window.location.search)
    const sessionId = urlParams.get('sessionId')
    
    if (sessionId) {
      fetchSessionData(sessionId)
    } else {
      // Try to get from localStorage
      const storedSession = localStorage.getItem('lastCompletedSession')
      if (storedSession) {
        setSessionData(JSON.parse(storedSession))
        setLoading(false)
      } else {
        router.push('/today')
      }
    }
  }, [router])

  const fetchSessionData = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/sessions/flow/${sessionId}`)
      if (response.ok) {
        const data = await response.json()
        setSessionData(data.session)
        setUserStats(data.userStats)
        
        // Store in localStorage for future reference
        localStorage.setItem('lastCompletedSession', JSON.stringify(data.session))
      }
    } catch (error) {
      console.error('Error fetching session data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getFeedbackMessage = (feedback: string) => {
    switch (feedback) {
      case 'on_time':
        return { message: 'Perfect timing!', emoji: '🎯', color: 'text-green-500' }
      case 'needed_more':
        return { message: 'Could use more time', emoji: '⏰', color: 'text-orange-500' }
      case 'finished_early':
        return { message: 'Finished ahead of schedule!', emoji: '🚀', color: 'text-blue-500' }
      default:
        return { message: 'Session completed', emoji: '✅', color: 'text-gray-500' }
    }
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`
    }
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-body text-text-tertiary">Loading session summary...</p>
        </div>
      </div>
    )
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="text-center">
          <h1 className="text-h2 text-text-primary mb-4">Session not found</h1>
          <Button onClick={() => router.push('/today')}>
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    )
  }

  const feedback = getFeedbackMessage(sessionData.feedback)
  const totalDuration = (sessionData.originalDuration || sessionData.duration) + (sessionData.extendedDuration || 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-accent-gold to-accent-orange rounded-full mb-6"
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-display-md text-text-primary mb-2">
            Flow Session Complete!
          </h1>
          <p className="text-body text-text-secondary">
            Great work on your deep focus session
          </p>
        </motion.div>

        {/* Session Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          {/* Duration Card */}
          <Card className="bg-gradient-to-br from-accent-gold/10 to-accent-orange/10 border-accent-gold/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-text-primary">
                <Clock className="w-5 h-5 text-accent-gold" />
                Session Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-text-primary mb-2">
                {formatDuration(sessionData.duration)}
              </div>
              {sessionData.extendedDuration && sessionData.extendedDuration > 0 && (
                <div className="text-sm text-text-secondary">
                  <span className="font-medium">{formatDuration(sessionData.originalDuration || sessionData.duration)}</span>
                  {' + '}
                  <span className="text-accent-orange font-medium">{formatDuration(sessionData.extendedDuration)} extended</span>
                  {' = '}
                  <span className="font-bold">{formatDuration(totalDuration)} total</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Feedback Card */}
          <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-text-primary">
                <Target className="w-5 h-5 text-blue-500" />
                How did it go?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold mb-2 ${feedback.color}`}>
                {feedback.emoji} {feedback.message}
              </div>
              <p className="text-sm text-text-secondary">
                Your feedback helps us schedule better sessions
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Ritual & Location Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <div className="font-semibold text-text-primary">Pre-Flow Ritual</div>
                  <div className="text-sm text-text-secondary">
                    {sessionData.ritualCompleted ? 'Completed' : 'Skipped'}
                  </div>
                </div>
                {sessionData.ritualCompleted && (
                  <Badge variant="secondary" className="bg-green-500/20 text-green-700">
                    ✓
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <div className="font-semibold text-text-primary">Location Check</div>
                  <div className="text-sm text-text-secondary">
                    {sessionData.locationConfirmed ? 'Confirmed' : 'Skipped'}
                  </div>
                </div>
                {sessionData.locationConfirmed && (
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-700">
                    ✓
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* User Progress */}
        {userStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-text-primary">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-text-primary">
                      {userStats.ritualCompletionCount}/28
                    </div>
                    <div className="text-sm text-text-secondary">Ritual Completions</div>
                    <Progress 
                      value={(userStats.ritualCompletionCount / 28) * 100} 
                      className="mt-2"
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-text-primary">
                      {userStats.totalSessions}
                    </div>
                    <div className="text-sm text-text-secondary">Total Sessions</div>
                  </div>
                </div>
                
                {userStats.ritualCompletionCount < 28 && (
                  <div className="text-center p-3 bg-accent-gold/10 rounded-lg border border-accent-gold/20">
                    <p className="text-sm text-text-primary">
                      <span className="font-semibold">{28 - userStats.ritualCompletionCount} more</span> ritual completions to master the habit
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={() => router.push('/today')}
            className="btn-primary flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Today
          </Button>
          
          <Button
            onClick={() => router.push('/capture')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Quick Capture
          </Button>
        </motion.div>

        {/* Motivational Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <blockquote className="border-l-4 border-accent-gold bg-bg-elevated px-6 py-4 rounded-r-lg">
            <p className="text-body text-text-primary italic mb-2">
              "The ability to concentrate intensely is a skill that must be trained."
            </p>
            <footer className="text-body-sm text-text-tertiary">— Cal Newport</footer>
          </blockquote>
        </motion.div>
      </div>
    </div>
  )
}