'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { User, MapPin, Shield, Bell, Link as LinkIcon, Trash2 } from 'lucide-react'
import ROUTES from '@/lib/routes'
import { ExpandableSection } from '@/components/settings/ExpandableSection'

interface ProfileData {
  name?: string
  email?: string
  image?: string
}

interface Location {
  id: string
  name: string
  latitude: number
  longitude: number
  radius: number
  enabled: boolean
}

interface BlockedApp {
  id: string
  name: string
  identifier: string
  domain?: string
  category?: string
  enabled: boolean
}

interface RitualItem {
  id: string
  text: string
  order: number
  completed: boolean
}

interface NotificationPrefs {
  locationAlerts: boolean
  sessionAlerts: boolean
  integrationSync: boolean
  dailyPrompts: boolean
  streakTracking: boolean
}

interface Integration {
  id: string
  provider: string
  isActive: boolean
  metadata?: any
}

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // State
  const [profile, setProfile] = useState<ProfileData>({})
  const [locations, setLocations] = useState<Location[]>([])
  const [blockedApps, setBlockedApps] = useState<BlockedApp[]>([])
  const [ritualItems, setRitualItems] = useState<RitualItem[]>([])
  const [notifications, setNotifications] = useState<NotificationPrefs>({
    locationAlerts: true,
    sessionAlerts: true,
    integrationSync: true,
    dailyPrompts: true,
    streakTracking: true
  })
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch all settings data
  useEffect(() => {
    if (status === 'authenticated') {
      fetchAllSettings()
    }
  }, [status])

  const fetchAllSettings = async () => {
    try {
      setLoading(true)
      const [profileRes, locationsRes, appsRes, ritualRes, notifRes, integrationsRes] = 
        await Promise.all([
          fetch('/api/user/profile'),
          fetch('/api/settings/locations'),
          fetch('/api/settings/blocked-apps'),
          fetch('/api/settings/ritual'),
          fetch('/api/settings/notifications'),
          fetch('/api/settings/integrations')
        ])

      if (profileRes.ok) {
        const data = await profileRes.json()
        setProfile(data.data || data)
      }

      if (locationsRes.ok) {
        const data = await locationsRes.json()
        setLocations(data.data || [])
      }

      if (appsRes.ok) {
        const data = await appsRes.json()
        setBlockedApps(data.data || [])
      }

      if (ritualRes.ok) {
        const data = await ritualRes.json()
        setRitualItems(data.data || [])
      }

      if (notifRes.ok) {
        const data = await notifRes.json()
        setNotifications(data.data || notifications)
      }

      if (integrationsRes.ok) {
        const data = await integrationsRes.json()
        setIntegrations(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: ROUTES.HOME })
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }

    try {
      const res = await fetch('/api/user/delete', { method: 'DELETE' })
      if (res.ok) {
        await signOut({ callbackUrl: ROUTES.HOME })
      } else {
        alert('Failed to delete account. Please try again.')
      }
    } catch (error) {
      console.error('Delete account error:', error)
      alert('An error occurred. Please try again.')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-body text-text-tertiary">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary pb-20">
      {/* Header */}
      <div className="bg-bg-surface border-b border-border-default">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          <h1 className="text-display-md text-text-primary font-bold">Settings</h1>
          <p className="text-body text-text-secondary mt-1">
            Manage your account and preferences
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-4">
        
        {/* Profile Section */}
        <ExpandableSection
          id="profile"
          title="Profile"
          icon={<User size={20} />}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Name
              </label>
              <input
                type="text"
                value={profile.name || ''}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="input w-full"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Email
              </label>
              <input
                type="email"
                value={profile.email || ''}
                className="input w-full bg-bg-secondary cursor-not-allowed"
                disabled
              />
              <p className="text-xs text-text-tertiary mt-1">Email cannot be changed</p>
            </div>
            <button className="btn-primary">
              Save Profile
            </button>
          </div>
        </ExpandableSection>

        {/* Locations Section */}
        <ExpandableSection
          id="locations"
          title="Flow Locations"
          icon={<MapPin size={20} />}
        >
          <div className="space-y-4">
            {locations.length === 0 ? (
              <p className="text-text-secondary">No flow locations configured yet.</p>
            ) : (
              <div className="space-y-2">
                {locations.map((loc) => (
                  <div key={loc.id} className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg">
                    <div>
                      <p className="font-medium text-text-primary">{loc.name}</p>
                      <p className="text-sm text-text-tertiary">Radius: {loc.radius}m</p>
                    </div>
                    <button className="text-error-strong hover:text-error-dark">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button 
              onClick={() => router.push(ROUTES.ONBOARDING.LOCATIONS)}
              className="btn-secondary w-full"
            >
              Manage Locations
            </button>
          </div>
        </ExpandableSection>

        {/* Blocked Apps Section */}
        <ExpandableSection
          id="blocked-apps"
          title="Blocked Apps"
          icon={<Shield size={20} />}
        >
          <div className="space-y-4">
            {blockedApps.length === 0 ? (
              <p className="text-text-secondary">No blocked apps configured yet.</p>
            ) : (
              <div className="space-y-2">
                {blockedApps.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg">
                    <div>
                      <p className="font-medium text-text-primary">{app.name}</p>
                      {app.domain && (
                        <p className="text-sm text-text-tertiary">{app.domain}</p>
                      )}
                    </div>
                    <button className="text-error-strong hover:text-error-dark">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button 
              onClick={() => router.push(ROUTES.ONBOARDING.APPS)}
              className="btn-secondary w-full"
            >
              Manage Blocked Apps
            </button>
          </div>
        </ExpandableSection>

        {/* Ritual Section */}
        <ExpandableSection
          id="ritual"
          title="Pre-Work Ritual"
          icon={<User size={20} />}
        >
          <div className="space-y-4">
            {ritualItems.length === 0 ? (
              <p className="text-text-secondary">No ritual items configured yet.</p>
            ) : (
              <div className="space-y-2">
                {ritualItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg">
                    <p className="text-text-primary">{item.text}</p>
                    <button className="text-error-strong hover:text-error-dark">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button 
              onClick={() => router.push(ROUTES.ONBOARDING.RITUAL)}
              className="btn-secondary w-full"
            >
              Manage Ritual
            </button>
          </div>
        </ExpandableSection>

        {/* Notifications Section */}
        <ExpandableSection
          id="notifications"
          title="Notifications"
          icon={<Bell size={20} />}
        >
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-text-primary capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => setNotifications({ ...notifications, [key]: !value })}
                  className="w-5 h-5"
                />
              </div>
            ))}
            <button className="btn-primary">
              Save Preferences
            </button>
          </div>
        </ExpandableSection>

        {/* Integrations Section */}
        <ExpandableSection
          id="integrations"
          title="Integrations"
          icon={<LinkIcon size={20} />}
        >
          <div className="space-y-4">
            {integrations.length === 0 ? (
              <p className="text-text-secondary">No integrations connected yet.</p>
            ) : (
              <div className="space-y-2">
                {integrations.map((int) => (
                  <div key={int.id} className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg">
                    <div>
                      <p className="font-medium text-text-primary capitalize">
                        {int.provider.replace('_', ' ')}
                      </p>
                      <p className="text-sm text-text-tertiary">
                        {int.isActive ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                    <button className="btn-ghost text-sm">
                      Disconnect
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button 
              onClick={() => router.push(ROUTES.ONBOARDING.INTEGRATIONS)}
              className="btn-secondary w-full"
            >
              Manage Integrations
            </button>
          </div>
        </ExpandableSection>

        {/* Account Actions */}
        <ExpandableSection
          id="account"
          title="Account"
          icon={<User size={20} />}
        >
          <div className="space-y-4">
            <button
              onClick={handleSignOut}
              className="btn-secondary w-full"
            >
              Sign Out
            </button>
            <button
              onClick={handleDeleteAccount}
              className="w-full px-4 py-3 bg-error-light text-error-strong font-medium rounded-lg hover:bg-error-DEFAULT transition-colors"
            >
              Delete Account
            </button>
            <p className="text-xs text-text-tertiary text-center">
              Deleting your account is permanent and cannot be undone.
            </p>
          </div>
        </ExpandableSection>

        {/* App Version */}
        <div className="text-center text-sm text-text-tertiary py-4">
          Daybreak v1.0.0
        </div>
      </div>
    </div>
  )
}
