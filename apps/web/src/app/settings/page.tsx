'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
// Material Symbols used inline to match Stitch 09 design exactly
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

  const isDevBypass = process.env.NEXT_PUBLIC_DEV_MODE === 'true'

  // Fetch all settings data
  useEffect(() => {
    if (status === 'authenticated' || isDevBypass) {
      fetchAllSettings()
    }
  }, [status, isDevBypass])

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

  if ((!isDevBypass && status === 'loading') || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-text-tertiary">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary relative overflow-x-hidden pb-20">
      {/* Subtle golden top glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-48 z-0"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% -10%, rgba(255,200,87,0.07) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-[800px] mx-auto px-4 sm:px-6 py-10 space-y-6">
        {/* Page header */}
        <div className="mb-2">
          <h1 className="text-4xl font-black text-text-primary tracking-tight">Settings</h1>
          <p className="text-text-tertiary mt-1 text-sm">Configure your high-performance environment</p>
        </div>

        {/* Profile card — Stitch 09 gold glow card */}
        <div
          className="rounded-xl p-6 flex flex-wrap justify-between items-center gap-4"
          style={{
            background: '#1E1E1E',
            boxShadow: '0 0 15px -5px rgba(255,199,87,0.3)',
            border: '1px solid rgba(255,199,87,0.2)',
          }}
        >
          <div className="flex items-center gap-6">
            <div className="relative flex-shrink-0">
              <div
                className="w-24 h-24 rounded-full overflow-hidden"
                style={{ border: '2px solid rgba(255,199,87,0.3)' }}
              >
                {profile.image ? (
                  <img src={profile.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-3xl font-black"
                    style={{ background: 'linear-gradient(135deg, rgba(255,199,87,0.3) 0%, rgba(255,140,66,0.2) 100%)' }}
                  >
                    <span className="text-accent-gold">
                      {profile.name?.charAt(0)?.toUpperCase() || session?.user?.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                )}
              </div>
              <button
                className="absolute -bottom-1 -right-1 p-1.5 rounded-full shadow-lg"
                style={{ background: '#ffc757', color: '#0B0B0B', border: '2px solid #0B0B0B' }}
              >
                <span className="material-symbols-outlined text-sm block">edit</span>
              </button>
            </div>
            <div className="flex flex-col">
              <h3 className="text-2xl font-bold text-white leading-tight">
                {profile.name || session?.user?.name || 'User'}
              </h3>
              <p className="text-text-tertiary font-medium text-sm">{profile.email || session?.user?.email}</p>
              <span
                className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded w-fit"
                style={{ background: 'rgba(255,199,87,0.1)', color: '#ffc757' }}
              >
                Premium Member
              </span>
            </div>
          </div>
          <button
            className="px-6 py-2.5 font-bold rounded-lg hover:opacity-90 transition-all text-sm"
            style={{ background: '#ffc757', color: '#0B0B0B' }}
          >
            Update Profile
          </button>
        </div>
        
        {/* Profile Section */}
        <ExpandableSection
          id="profile"
          title="Profile"
          icon={<span className="material-symbols-outlined">person</span>}
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
          icon={<span className="material-symbols-outlined">location_on</span>}
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
                      <span className="material-symbols-outlined text-lg">close</span>
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
          icon={<span className="material-symbols-outlined">shield</span>}
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
                      <span className="material-symbols-outlined text-lg">close</span>
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
          icon={<span className="material-symbols-outlined">notifications</span>}
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
                      <span className="material-symbols-outlined text-lg">close</span>
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
          icon={<span className="material-symbols-outlined">link</span>}
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
          icon={<span className="material-symbols-outlined">extension</span>}
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

        {/* Danger Zone — Stitch 09 */}
        <ExpandableSection
          id="danger"
          title="Danger Zone"
          icon={<span className="material-symbols-outlined text-red-500">delete_forever</span>}
        >
          <div className="space-y-4" style={{ borderTop: '1px solid rgba(239,68,68,0.2)', paddingTop: '1rem' }}>
            <p className="text-sm text-text-tertiary">
              Permanently delete your account and all associated focus data. This action cannot be undone.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="w-full py-3 font-bold text-sm rounded-lg transition-all hover:bg-red-500 hover:text-white"
              style={{
                background: 'rgba(239,68,68,0.1)',
                color: '#ef4444',
                border: '1px solid rgba(239,68,68,0.3)',
              }}
            >
              Delete My Account
            </button>
            <button
              onClick={handleSignOut}
              className="btn-secondary w-full"
            >
              Sign Out
            </button>
          </div>
        </ExpandableSection>

        {/* Footer Quote — Stitch 09 */}
        <div
          className="mt-12 p-8 rounded-r-xl italic"
          style={{
            borderLeft: '4px solid #ffc757',
            background: 'rgba(255,199,87,0.05)',
          }}
        >
          <p className="text-xl font-medium leading-relaxed" style={{ color: '#cbd5e1' }}>
            &ldquo;Deep work is the ability to focus without distraction on a cognitively demanding task. It&rsquo;s a skill that allows you to quickly master complicated information and produce better results in less time.&rdquo;
          </p>
          <p className="mt-4 font-black uppercase text-sm" style={{ color: '#ffc757', letterSpacing: '0.2em' }}>
            — Cal Newport
          </p>
        </div>

        {/* Footer */}
        <div className="text-center text-xs font-semibold tracking-widest uppercase py-10" style={{ color: '#4b5563' }}>
          &copy; 2024 Daybreak Productivity Systems. Designed for Deep Work.
        </div>
      </div>
    </div>
  )
}
