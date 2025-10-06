import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { storage } from '../shared/storage'
import { api } from '../shared/api'

function OptionsPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [blockedApps, setBlockedApps] = useState<any[]>([])

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      const auth = await storage.get('auth')
      setAuthenticated(!!auth?.token)

      if (auth?.token) {
        const apps = await api.getBlockedApps()
        setBlockedApps(apps)
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleAuthenticate() {
    // Open web app for authentication
    const webAppUrl = process.env.WEB_APP_URL || 'http://localhost:3000'
    window.open(`${webAppUrl}/extension/auth`, '_blank')
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading...</div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>FlowState Extension Settings</h1>
        <p style={styles.subtitle}>Manage your deep work settings</p>
      </div>

      {!authenticated ? (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Connect to FlowState</h2>
          <p style={styles.text}>
            Sign in to your FlowState account to sync your blocked apps and flow sessions.
          </p>
          <button style={styles.button} onClick={handleAuthenticate}>
            Sign In
          </button>
        </div>
      ) : (
        <>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Blocked Apps</h2>
            <p style={styles.text}>
              These apps will trigger a breathing exercise during flow sessions.
            </p>
            {blockedApps.length === 0 ? (
              <p style={styles.emptyState}>No blocked apps configured yet.</p>
            ) : (
              <ul style={styles.list}>
                {blockedApps.map((app) => (
                  <li key={app.id} style={styles.listItem}>
                    <span>{app.name}</span>
                    <span style={styles.badge}>{app.enabled ? 'Active' : 'Inactive'}</span>
                  </li>
                ))}
              </ul>
            )}
            <button style={styles.secondaryButton} onClick={() => {
              const webAppUrl = process.env.WEB_APP_URL || 'http://localhost:3000'
              window.open(`${webAppUrl}/settings/apps`, '_blank')
            }}>
              Manage in Web App
            </button>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>How It Works</h2>
            <ul style={styles.instructions}>
              <li>When you start a flow session, the extension will:
                <ul>
                  <li>Convert your browser to grayscale mode</li>
                  <li>Show a breathing exercise when you try to open blocked apps</li>
                  <li>Track your focus sessions</li>
                </ul>
              </li>
              <li>Manage your flow sessions and blocks in the web app</li>
              <li>The extension syncs automatically with your account</li>
            </ul>
          </div>
        </>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    marginBottom: '40px',
    textAlign: 'center',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
  },
  card: {
    background: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#333',
  },
  text: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '16px',
  },
  button: {
    background: '#1976D2',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  secondaryButton: {
    background: '#f0f0f0',
    color: '#333',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '16px',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: '16px 0',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    borderBottom: '1px solid #f0f0f0',
  },
  badge: {
    background: '#e8f5e9',
    color: '#2e7d32',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  emptyState: {
    textAlign: 'center',
    color: '#999',
    padding: '24px',
    fontStyle: 'italic',
  },
  instructions: {
    color: '#666',
    lineHeight: '1.8',
  },
}

// Mount the app
const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(<OptionsPage />)
}