'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, X, Sparkles } from 'lucide-react'

interface RecoveryActivity {
  id: string
  title: string
  description: string
  selected: boolean
}

export default function RecoveryPage() {
  const router = useRouter()
  const [activities, setActivities] = useState<RecoveryActivity[]>([
    {
      id: 'gym',
      title: '🏋️ Gym / Workout',
      description: 'Weight training, fitness classes',
      selected: false
    },
    {
      id: 'running',
      title: '🏃 Running / Cardio',
      description: 'Running, cycling, swimming',
      selected: false
    },
    {
      id: 'sports',
      title: '⚽ Sports / Recreation',
      description: 'Basketball, tennis, hiking',
      selected: false
    },
    {
      id: 'social',
      title: '👥 Social Time',
      description: 'Friends, family, community',
      selected: false
    },
    {
      id: 'reading',
      title: '📖 Reading',
      description: 'Books, articles (non-work)',
      selected: false
    },
    {
      id: 'hobbies',
      title: '🎨 Hobbies',
      description: 'Music, art, crafts, games',
      selected: false
    }
  ])
  const [customActivity, setCustomActivity] = useState('')
  const [trackRecovery, setTrackRecovery] = useState<boolean | null>(null)
  const [hobbiesToTry, setHobbiesToTry] = useState<string[]>([])
  const [newHobby, setNewHobby] = useState('')

  const toggleActivity = (id: string) => {
    setActivities(prev =>
      prev.map(activity =>
        activity.id === id ? { ...activity, selected: !activity.selected } : activity
      )
    )
  }

  const addCustomActivity = () => {
    if (!customActivity.trim()) return

    const newActivity: RecoveryActivity = {
      id: `custom-${Date.now()}`,
      title: customActivity.trim(),
      description: 'Custom activity',
      selected: true
    }

    setActivities([...activities, newActivity])
    setCustomActivity('')
  }

  const addHobbyToTry = () => {
    if (!newHobby.trim()) return
    if (hobbiesToTry.includes(newHobby.trim())) return
    
    setHobbiesToTry([...hobbiesToTry, newHobby.trim()])
    setNewHobby('')
  }

  const removeHobbyToTry = (hobby: string) => {
    setHobbiesToTry(hobbiesToTry.filter(h => h !== hobby))
  }

  const handleContinue = async () => {
    const selectedActivities = activities.filter(a => a.selected)
    
    // Save recovery preferences to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('flowstate_recovery_activities', JSON.stringify(selectedActivities))
      localStorage.setItem('flowstate_track_recovery', JSON.stringify(trackRecovery))
      localStorage.setItem('flowstate_hobbies_to_try', JSON.stringify(hobbiesToTry))
    }

    console.log('Saved recovery preferences:', { 
      activities: selectedActivities, 
      trackRecovery,
      hobbiesToTry 
    })
    router.push('/onboarding/complete')
  }

  const handleSkip = () => {
    router.push('/onboarding/complete')
  }

  const selectedCount = activities.filter(a => a.selected).length

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-8">
        <div className="mb-8">
          <div className="text-sm text-primary-700 font-semibold mb-2">STEP 8 OF 8</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Plan Your Active Recovery
          </h1>
          <p className="text-gray-600">
            What activities help you recharge between deep work sessions?
          </p>
        </div>

        {/* Info Banner */}
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-1">
            🏃 Why Recovery Matters
          </h3>
          <p className="text-sm text-blue-700">
            Deep work is mentally demanding. Strategic recovery through physical activity and leisure 
            helps restore your cognitive resources and prevents burnout. Cal Newport emphasizes the 
            importance of having a life outside of work.
          </p>
        </div>

        {/* Activities Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select your recovery activities
          </label>
          <div className="grid grid-cols-2 gap-3">
            {activities.map((activity) => (
              <button
                key={activity.id}
                onClick={() => toggleActivity(activity.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  activity.selected
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <h3 className={`font-semibold ${activity.selected ? 'text-green-700' : 'text-gray-900'}`}>
                      {activity.title}
                    </h3>
                    <p className={`text-sm ${activity.selected ? 'text-green-600' : 'text-gray-500'}`}>
                      {activity.description}
                    </p>
                  </div>
                  {activity.selected && (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Add Custom Activity */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add another activity
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customActivity}
              onChange={(e) => setCustomActivity(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomActivity()}
              placeholder="e.g., Yoga, Meditation, Cooking"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none text-gray-900"
            />
            <button
              onClick={addCustomActivity}
              className="px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Tracking Preference */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Do you want to track these activities?
          </label>
          <div className="space-y-3">
            <button
              onClick={() => setTrackRecovery(true)}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                trackRecovery === true
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-semibold ${trackRecovery === true ? 'text-primary-700' : 'text-gray-900'}`}>
                    ✅ Yes, help me track
                  </h3>
                  <p className={`text-sm ${trackRecovery === true ? 'text-primary-600' : 'text-gray-500'}`}>
                    Log activities and see patterns in your energy levels
                  </p>
                </div>
                {trackRecovery === true && (
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                )}
              </div>
            </button>

            <button
              onClick={() => setTrackRecovery(false)}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                trackRecovery === false
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-semibold ${trackRecovery === false ? 'text-primary-700' : 'text-gray-900'}`}>
                    🎯 No, keep it simple
                  </h3>
                  <p className={`text-sm ${trackRecovery === false ? 'text-primary-600' : 'text-gray-500'}`}>
                    Just use this list as a reminder of healthy activities
                  </p>
                </div>
                {trackRecovery === false && (
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Hobbies to Try */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <label className="block text-sm font-medium text-gray-700">
              Hobbies you've wanted to try
            </label>
          </div>
          <p className="text-sm text-gray-500 mb-3">
            We'll periodically remind you to explore these new interests during your recovery time
          </p>
          
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newHobby}
              onChange={(e) => setNewHobby(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addHobbyToTry()}
              placeholder="e.g., Learn guitar, Rock climbing, Photography"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none text-gray-900"
            />
            <button
              onClick={addHobbyToTry}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Add
            </button>
          </div>

          {hobbiesToTry.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {hobbiesToTry.map((hobby, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-800 rounded-full text-sm"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{hobby}</span>
                  <button
                    onClick={() => removeHobbyToTry(hobby)}
                    className="hover:bg-purple-200 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cal Newport Quote */}
        <blockquote className="mb-8">
          <p className="text-sm italic">
            "At the end of the workday, shut down your consideration of work issues until the next 
            morning—no after-dinner email checks, no mental replays of conversations, and no scheming 
            about how you'll handle an upcoming challenge."
          </p>
          <footer className="text-sm mt-2">— Cal Newport, Deep Work</footer>
        </blockquote>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Back
          </button>
          <div className="flex items-center gap-4">
            {selectedCount > 0 && (
              <span className="text-sm text-gray-600">
                {selectedCount} activit{selectedCount !== 1 ? 'ies' : 'y'} selected
              </span>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleSkip}
                className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handleContinue}
                className="px-8 py-3 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-800 transition-colors"
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

