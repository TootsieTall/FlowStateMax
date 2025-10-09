'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Calendar, 
  Trash2, 
  CheckCircle2, 
  Circle,
  Filter,
  Search,
  ArrowUpDown,
  Clock,
  Flag
} from 'lucide-react';
import { useAppStore } from '@/store';
import QuickCapture from '@/components/QuickCapture';
import ROUTES from '@/lib/routes';

interface CapturedItem {
  id: string;
  title: string;
  description: string | null;
  impact: 'HIGH' | 'LOW';
  deadline: string | null;
  scheduledAt: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CapturePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toggleQuickCapture } = useAppStore();

  const [items, setItems] = useState<CapturedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'deadline' | 'impact'>('recent');

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(ROUTES.HOME);
    }
  }, [status, router]);

  // Fetch captured items
  useEffect(() => {
    if (status === 'authenticated') {
      fetchItems();
    }
  }, [status]);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/quick-capture');
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (itemId: string, currentStatus: boolean) => {
    try {
      // Optimistic update
      setItems(items.map(item => 
        item.id === itemId ? { ...item, completed: !currentStatus } : item
      ));

      // TODO: Create API endpoint to update task completion
      const response = await fetch(`/api/tasks/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentStatus }),
      });

      if (!response.ok) {
        // Revert on error
        setItems(items.map(item => 
          item.id === itemId ? { ...item, completed: currentStatus } : item
        ));
      }
    } catch (error) {
      console.error('Failed to toggle completion:', error);
      // Revert on error
      setItems(items.map(item => 
        item.id === itemId ? { ...item, completed: currentStatus } : item
      ));
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      // Optimistic update
      setItems(items.filter(item => item.id !== itemId));

      // TODO: Create API endpoint to delete task
      const response = await fetch(`/api/tasks/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        // Refresh on error
        fetchItems();
      }
    } catch (error) {
      console.error('Failed to delete item:', error);
      fetchItems();
    }
  };

  // Filter and sort items
  const filteredItems = items
    .filter(item => {
      // Filter by status
      if (filter === 'active' && item.completed) return false;
      if (filter === 'completed' && !item.completed) return false;

      // Filter by search
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          item.title.toLowerCase().includes(search) ||
          item.description?.toLowerCase().includes(search)
        );
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'deadline') {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      } else if (sortBy === 'impact') {
        if (a.impact === 'HIGH' && b.impact === 'LOW') return -1;
        if (a.impact === 'LOW' && b.impact === 'HIGH') return 1;
        return 0;
      }
      return 0;
    });

  const stats = {
    total: items.length,
    active: items.filter(item => !item.completed).length,
    completed: items.filter(item => item.completed).length,
    highImpact: items.filter(item => item.impact === 'HIGH' && !item.completed).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your captures...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <QuickCapture />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Quick Capture
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Capture thoughts, tasks, and ideas instantly
              </p>
            </div>
            <button
              onClick={toggleQuickCapture}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/30"
            >
              <Sparkles className="w-5 h-5" />
              New Capture
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Items</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-indigo-600">{stats.active}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-orange-600">{stats.highImpact}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">High Impact</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search captures..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="all">All Items</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-5 h-5 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="recent">Recent First</option>
                <option value="deadline">By Deadline</option>
                <option value="impact">By Impact</option>
              </select>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No items found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start capturing your thoughts and tasks
              </p>
              <button
                onClick={toggleQuickCapture}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all"
              >
                Create Your First Capture
              </button>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className={`bg-white dark:bg-gray-800 rounded-xl p-4 border transition-all hover:shadow-md ${
                  item.completed
                    ? 'border-gray-200 dark:border-gray-700 opacity-60'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => handleToggleComplete(item.id, item.completed)}
                    className="mt-1 flex-shrink-0"
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400 hover:text-indigo-600 transition-colors" />
                    )}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className={`text-lg font-medium ${
                        item.completed
                          ? 'text-gray-500 dark:text-gray-500 line-through'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {item.title}
                      </h3>

                      {/* Impact Badge */}
                      {item.impact === 'HIGH' && !item.completed && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-medium rounded-lg flex-shrink-0">
                          <Flag className="w-3 h-3" />
                          High Impact
                        </span>
                      )}
                    </div>

                    {item.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>

                      {item.deadline && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Due: {new Date(item.deadline).toLocaleDateString()}</span>
                        </div>
                      )}

                      {item.scheduledAt && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Scheduled: {new Date(item.scheduledAt).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Keyboard Hint */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            💡 Tip: Press <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">⌘K</kbd> anywhere to quick capture
          </p>
        </div>
      </div>
    </div>
  );
}

