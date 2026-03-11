'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Calendar,
  Trash2,
  Flag,
  GripVertical,
  Plus,
  Search,
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

type Column = 'inbox' | 'doing' | 'done';

function columnLabel(col: Column) {
  if (col === 'inbox') return '📥 Inbox';
  if (col === 'doing') return '⚡ Doing';
  return '✅ Done';
}

function itemToColumn(item: CapturedItem): Column {
  if (item.completed) return 'done';
  if (item.impact === 'HIGH') return 'doing';
  return 'inbox';
}

/** Move an item to a column by mutating its fields locally + calling the API */
async function moveItem(
  itemId: string,
  col: Column
): Promise<{ completed: boolean; impact: 'HIGH' | 'LOW' }> {
  const patch =
    col === 'done'
      ? { completed: true }
      : col === 'doing'
      ? { completed: false, impact: 'HIGH' }
      : { completed: false, impact: 'LOW' };

  await fetch(`/api/tasks/${itemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });

  return patch as { completed: boolean; impact: 'HIGH' | 'LOW' };
}

// ─── Kanban column component ────────────────────────────────────────────────

interface KanbanColumnProps {
  col: Column;
  items: CapturedItem[];
  onDrop: (itemId: string, col: Column) => void;
  onDelete: (itemId: string) => void;
  onMoveCard: (itemId: string, col: Column) => void;
}

function KanbanColumn({ col, items, onDrop, onDelete, onMoveCard }: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const dragItem = useRef<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const colBg: Record<Column, string> = {
    inbox: 'bg-bg-elevated border-border-default',
    doing: 'bg-bg-elevated border-border-default',
    done: 'bg-bg-elevated border-border-default',
  };

  const colHeader: Record<Column, string> = {
    inbox: 'text-text-secondary',
    doing: 'text-accent-orange',
    done: 'text-accent-gold',
  };

  return (
    <div
      className={`flex flex-col rounded-2xl border-2 min-h-[400px] transition-all ${colBg[col]} ${
        isDragOver ? 'ring-2 ring-accent-gold/60 scale-[1.01]' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        const id = e.dataTransfer.getData('text/plain');
        if (id) onDrop(id, col);
      }}
    >
      {/* Column header — Stitch 06 */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-text-primary">
            {columnLabel(col)}
          </span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,199,87,0.1)', color: '#ffc757' }}>
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        <button className="text-text-tertiary hover:text-text-primary transition-colors">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </div>

      {/* Cards */}
      <div className="flex-1 px-3 pb-3 space-y-2 overflow-y-auto">
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center h-24 text-text-tertiary text-sm opacity-50 select-none">
            <span>Drop cards here</span>
          </div>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => {
              dragItem.current = item.id;
              e.dataTransfer.setData('text/plain', item.id);
              e.dataTransfer.effectAllowed = 'move';
            }}
            className="group bg-bg-primary border border-border-default rounded-xl p-3 cursor-grab active:cursor-grabbing hover:border-accent-gold/40 hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-2">
              <GripVertical className="w-4 h-4 text-text-tertiary mt-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium leading-snug ${
                    item.completed ? 'line-through text-text-tertiary' : 'text-text-primary'
                  }`}
                >
                  {item.title}
                </p>

                {item.description && (
                  <p className="text-xs text-text-tertiary mt-1 line-clamp-2">
                    {item.description}
                  </p>
                )}

                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {item.impact === 'HIGH' && col !== 'done' && (
                    <span className="flex items-center gap-0.5 text-xs text-accent-orange bg-accent-orange/10 px-1.5 py-0.5 rounded-md">
                      <Flag className="w-2.5 h-2.5" /> High
                    </span>
                  )}
                  {item.deadline && (
                    <span className="flex items-center gap-0.5 text-xs text-text-tertiary">
                      <Calendar className="w-2.5 h-2.5" />
                      {new Date(item.deadline).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  )}
                </div>

                {/* Quick move buttons */}
                <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {col !== 'inbox' && (
                    <button
                      onClick={() => onMoveCard(item.id, 'inbox')}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-bg-surface text-text-tertiary hover:text-text-primary hover:bg-bg-secondary transition-colors"
                    >
                      → Inbox
                    </button>
                  )}
                  {col !== 'doing' && (
                    <button
                      onClick={() => onMoveCard(item.id, 'doing')}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-bg-surface text-text-tertiary hover:text-accent-orange hover:bg-accent-orange/10 transition-colors"
                    >
                      → Doing
                    </button>
                  )}
                  {col !== 'done' && (
                    <button
                      onClick={() => onMoveCard(item.id, 'done')}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-bg-surface text-text-tertiary hover:text-accent-gold hover:bg-accent-gold/10 transition-colors"
                    >
                      → Done
                    </button>
                  )}
                </div>
              </div>

              <button
                onClick={() => onDelete(item.id)}
                className="flex-shrink-0 p-1 rounded text-text-tertiary hover:text-red-400 hover:bg-red-400/10 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function CapturePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toggleQuickCapture } = useAppStore();

  const [items, setItems] = useState<CapturedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const isDevBypass = process.env.NEXT_PUBLIC_DEV_MODE === 'true'

  useEffect(() => {
    if (!isDevBypass && status === 'unauthenticated') router.push(ROUTES.HOME);
  }, [status, router, isDevBypass]);

  useEffect(() => {
    if (status === 'authenticated' || isDevBypass) fetchItems();
  }, [status, isDevBypass]);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/quick-capture');
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch (err) {
      console.error('Failed to fetch items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = async (itemId: string, col: Column) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    if (itemToColumn(item) === col) return; // no-op

    // Optimistic update
    setItems((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? {
              ...i,
              completed: col === 'done',
              impact: col === 'doing' ? 'HIGH' : col === 'inbox' ? 'LOW' : i.impact,
            }
          : i
      )
    );

    try {
      await moveItem(itemId, col);
    } catch {
      fetchItems(); // revert on error
    }
  };

  const handleDelete = async (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    try {
      await fetch(`/api/tasks/${itemId}`, { method: 'DELETE' });
    } catch {
      fetchItems();
    }
  };

  const filtered = items.filter((item) => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (
      item.title.toLowerCase().includes(s) ||
      item.description?.toLowerCase().includes(s)
    );
  });

  const byColumn = (col: Column) => filtered.filter((i) => itemToColumn(i) === col);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-text-tertiary">Loading your board...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary relative overflow-x-hidden">
      {/* Subtle golden top glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-48 z-0"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(255,200,87,0.08) 0%, transparent 70%)',
        }}
      />

      <QuickCapture />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-black text-text-primary tracking-tight">Capture</h1>
            <p className="text-sm text-text-tertiary mt-1">
              Organize your thoughts and tasks into action.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search captures..."
                className="pl-9 pr-4 py-2.5 text-sm rounded-xl text-text-primary placeholder-text-tertiary focus:outline-none transition-colors"
                style={{
                  background: '#1E1E1E',
                  border: '1px solid rgba(255,199,87,0.12)',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(255,199,87,0.4)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,199,87,0.12)' }}
              />
            </div>

            <button
              onClick={toggleQuickCapture}
              className="flex items-center gap-2 px-5 py-2.5 text-bg-primary text-sm font-bold rounded-xl hover:scale-[1.02] transition-all shadow-md"
              style={{ background: 'linear-gradient(to right, #ffc757, #e6ac30)' }}
            >
              <span className="material-symbols-outlined text-lg font-bold">add</span>
              Quick Capture
            </button>
          </div>
        </div>

        {/* Summary chips */}
        <div className="flex gap-3 mb-6 text-xs flex-wrap">
          <span className="px-3 py-1.5 rounded-full text-text-secondary font-semibold" style={{ background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.06)' }}>
            {byColumn('inbox').length} in inbox
          </span>
          <span className="px-3 py-1.5 rounded-full font-bold text-accent-orange" style={{ background: 'rgba(255,140,66,0.08)', border: '1px solid rgba(255,140,66,0.25)' }}>
            {byColumn('doing').length} doing
          </span>
          <span className="px-3 py-1.5 rounded-full font-bold text-accent-gold" style={{ background: 'rgba(255,199,87,0.08)', border: '1px solid rgba(255,199,87,0.25)' }}>
            {byColumn('done').length} done
          </span>
        </div>

        {/* Empty state */}
        {items.length === 0 ? (
          <div className="text-center py-20">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: 'rgba(255,199,87,0.08)', border: '1px solid rgba(255,199,87,0.2)' }}
            >
              <Sparkles className="w-8 h-8 text-accent-gold" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">
              Your inbox is clear
            </h3>
            <p className="text-sm text-text-tertiary mb-8">
              All tasks are processed. Capture your next thought.
            </p>
            <button
              onClick={toggleQuickCapture}
              className="inline-flex items-center gap-2 px-6 py-3 text-bg-primary text-sm font-bold rounded-xl hover:scale-[1.02] transition-all"
              style={{ background: 'linear-gradient(to right, #ffc757, #e6ac30)' }}
            >
              <Sparkles className="w-4 h-4" />
              Capture Something
            </button>
          </div>
        ) : (
          /* Kanban grid */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(['inbox', 'doing', 'done'] as Column[]).map((col) => (
              <KanbanColumn
                key={col}
                col={col}
                items={byColumn(col)}
                onDrop={handleDrop}
                onDelete={handleDelete}
                onMoveCard={handleDrop}
              />
            ))}
          </div>
        )}

        {/* Footer quote — Stitch 06 */}
        <footer className="mt-auto pt-10 pb-6" style={{ borderTop: '1px solid #2D2D2D' }}>
          <blockquote
            className="rounded-xl p-6 text-center"
            style={{
              border: '2px solid rgba(255,199,87,0.3)',
              background: 'rgba(255,199,87,0.05)',
            }}
          >
            <p className="text-accent-gold italic font-medium text-lg leading-relaxed">
              &ldquo;Who you are, what you think, feel, and do, what you love — is the sum of what you focus on.&rdquo;
            </p>
            <cite className="block mt-3 text-text-tertiary font-bold not-italic">
              — Cal Newport, Deep Work
            </cite>
          </blockquote>
        </footer>
      </div>
    </div>
  );
}
