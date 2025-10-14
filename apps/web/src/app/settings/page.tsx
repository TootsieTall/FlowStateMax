'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  Settings as SettingsIcon,
  User,
  MapPin,
  Shield,
  Bell,
  Palette,
  Calendar,
  LogOut,
  ChevronRight
} from 'lucide-react';
import ROUTES from '@/lib/routes';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(ROUTES.HOME);
    }
  }, [status, router]);

  useEffect(() => {
    // Check for dark mode preference
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark');
      setDarkMode(isDark);
    }
  }, []);

  const toggleDarkMode = () => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark');
      setDarkMode(!darkMode);
      localStorage.setItem('darkMode', String(!darkMode));
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: ROUTES.HOME });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-body text-text-tertiary">Loading...</p>
        </div>
      </div>
    );
  }

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          icon: User,
          label: 'Profile',
          value: session?.user?.name || 'Not set',
          onClick: () => {},
        },
        {
          icon: Calendar,
          label: 'Integrations',
          value: 'Google Calendar, Gmail',
          onClick: () => router.push(ROUTES.ONBOARDING.INTEGRATIONS),
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: Palette,
          label: 'Dark Mode',
          value: darkMode ? 'On' : 'Off',
          onClick: toggleDarkMode,
          toggle: true,
        },
        {
          icon: Bell,
          label: 'Notifications',
          value: 'Enabled',
          onClick: () => {},
        },
      ],
    },
    {
      title: 'Deep Work',
      items: [
        {
          icon: MapPin,
          label: 'Work Locations',
          value: 'Manage locations',
          onClick: () => router.push(ROUTES.ONBOARDING.LOCATIONS),
        },
        {
          icon: Shield,
          label: 'Blocked Apps',
          value: 'Manage blocked apps',
          onClick: () => router.push(ROUTES.ONBOARDING.APPS),
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary">
      {/* Header */}
      <div className="bg-bg-surface border-b border-border-default shadow-warm-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-gradient-sunset" />
            <div>
              <h1 className="text-display-md text-text-primary">
                Settings
              </h1>
              <p className="text-body text-text-tertiary mt-1">
                Manage your account and preferences ⚙️
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {settingsSections.map((section, idx) => (
            <div key={idx} className="card overflow-hidden">
              <div className="px-6 py-3 border-b border-border-default bg-bg-primary">
                <h2 className="text-overline text-text-secondary">
                  {section.title}
                </h2>
              </div>
              
              <div className="divide-y divide-border-light">
                {section.items.map((item, itemIdx) => (
                  <button
                    key={itemIdx}
                    onClick={item.onClick}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-bg-elevated transition-all duration-fast text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-bg-secondary rounded-lg flex items-center justify-center group-hover:bg-accent-orange/10 transition-colors duration-fast">
                        <item.icon className="w-5 h-5 text-text-tertiary group-hover:text-accent-gold transition-colors" />
                      </div>
                      <div>
                        <div className="font-medium text-text-primary">
                          {item.label}
                        </div>
                        <div className="text-body-sm text-text-tertiary">
                          {item.value}
                        </div>
                      </div>
                    </div>
                    
                    {item.toggle ? (
                      <div className={`w-11 h-6 rounded-full transition-colors duration-fast ${
                        darkMode ? 'bg-accent-gold/50' : 'bg-sand-300'
                      }`}>
                        <div className={`w-5 h-5 bg-bg-surface rounded-full shadow-warm-sm transform transition-transform duration-fast m-0.5 ${
                          darkMode ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </div>
                    ) : (
                      <ChevronRight className="w-5 h-5 text-text-tertiary group-hover:text-accent-gold transition-colors" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="w-full card border-2 border-error-DEFAULT px-6 py-4 flex items-center justify-between hover:bg-error-light transition-all duration-fast group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-error-light rounded-lg flex items-center justify-center group-hover:shadow-warm-sm transition-all">
                <LogOut className="w-5 h-5 text-error-strong group-hover:animate-icon-bounce" />
              </div>
              <span className="font-medium text-error-strong">
                Sign Out
              </span>
            </div>
          </button>

          {/* App Version */}
          <div className="text-center text-body-sm text-text-tertiary py-4">
            Daybreak v1.0.0 🌅
          </div>
        </div>
      </div>
    </div>
  );
}


