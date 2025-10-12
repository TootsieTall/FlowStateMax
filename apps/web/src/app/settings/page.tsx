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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-indigo-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your account and preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {settingsSections.map((section, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                  {section.title}
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {section.items.map((item, itemIdx) => (
                  <button
                    key={itemIdx}
                    onClick={item.onClick}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {item.label}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {item.value}
                        </div>
                      </div>
                    </div>
                    
                    {item.toggle ? (
                      <div className={`w-11 h-6 rounded-full transition-colors ${
                        darkMode ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform m-0.5 ${
                          darkMode ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </div>
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="w-full bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-800 px-6 py-4 flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <span className="font-medium text-red-600 dark:text-red-400">
                Sign Out
              </span>
            </div>
          </button>

          {/* App Version */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
            FlowState v1.0.0
          </div>
        </div>
      </div>
    </div>
  );
}


