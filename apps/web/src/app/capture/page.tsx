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
      <div className="min-h-screen flex items-center justify-center bg-dawn-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sunset-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-body text-bark-300">Loading your captures...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dawn-100">
      <QuickCapture />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-display-md text-bark-500 mb-2">
                Quick Capture
              </h1>
              <p className="text-body text-bark-300">
                Capture thoughts, tasks, and ideas instantly ✨
              </p>
            </div>
            <button
              onClick={toggleQuickCapture}
              className="btn-primary group"
            >
              <Sparkles className="w-5 h-5 group-hover:animate-icon-bounce" />
              New Capture
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="card p-4 hover-lift">
              <div className="text-h2 text-bark-500">{stats.total}</div>
              <div className="text-caption text-bark-200">Total Items</div>
            </div>
            <div className="card p-4 hover-lift">
              <div className="text-h2 text-gradient-sunset">{stats.active}</div>
              <div className="text-caption text-bark-200">Active</div>
            </div>
            <div className="card p-4 hover-lift">
              <div className="text-h2 text-gradient-gold">{stats.completed}</div>
              <div className="text-caption text-bark-200">Completed</div>
            </div>
            <div className="card p-4 hover-lift">
              <div className="text-h2 text-sunset-600">{stats.highImpact}</div>
              <div className="text-caption text-bark-200">High Impact</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card-elevated p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-bark-200" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search captures..."
                  className="input pl-10"
                />
              </div>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-bark-300" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="select"
              >
                <option value="all">All Items</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-5 h-5 text-bark-300" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="select"
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
            <div className="text-center py-16 card-elevated animate-bounce-in">
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 bg-gold-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <Sparkles className="w-16 h-16 text-gold-400 relative animate-pulse" />
              </div>
              <h3 className="text-h2 text-transparent bg-clip-text bg-gradient-to-r from-sunset-500 to-gold-500 mb-2">
                Your canvas awaits
              </h3>
              <p className="text-body text-bark-300 mb-6">
                Start capturing your brilliant thoughts and tasks ✨
              </p>
              <button
                onClick={toggleQuickCapture}
                className="btn-primary animate-pulse-glow"
              >
                <Sparkles className="w-4 h-4 inline-block mr-2" />
                Create Your First Capture
              </button>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className={`card-interactive ${
                  item.completed
                    ? 'opacity-60'
                    : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => handleToggleComplete(item.id, item.completed)}
                    className="mt-1 flex-shrink-0 group"
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-gold-500 completion-shine" />
                    ) : (
                      <Circle className="w-6 h-6 text-bark-200 hover:text-sunset-500 transition-colors group-hover:animate-icon-bounce" />
                    )}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className={`text-h4 ${
                        item.completed
                          ? 'text-bark-200 line-through'
                          : 'text-bark-500'
                      }`}>
                        {item.title}
                      </h3>

                      {/* Impact Badge */}
                      {item.impact === 'HIGH' && !item.completed && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-sunset-100 text-sunset-700 text-xs font-medium rounded-lg flex-shrink-0">
                          <Flag className="w-3 h-3" />
                          High Impact
                        </span>
                      )}
                    </div>

                    {item.description && (
                      <p className="text-body-sm text-bark-300 mb-3 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-caption text-bark-200">
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
                    className="p-2 text-bark-200 hover:text-error-strong hover:bg-error-light rounded-lg transition-all duration-fast flex-shrink-0 group"
                  >
                    <Trash2 className="w-5 h-5 group-hover:animate-icon-bounce" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Keyboard Hint */}
        <div className="mt-8 text-center">
          <p className="text-body-sm text-bark-300">
            💡 Tip: Press <kbd className="px-2 py-1 bg-dawn-200 border border-border-DEFAULT rounded text-xs text-bark-400">⌘K</kbd> anywhere to quick capture
          </p>
        </div>
      </div>
    </div>
  );
}

