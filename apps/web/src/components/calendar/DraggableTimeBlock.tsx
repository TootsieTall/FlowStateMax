'use client'

import { useState, useRef } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import { Clock, GripVertical, Check } from 'lucide-react'
import { TimeBlock, BLOCK_COLORS, BLOCK_HOVER_COLORS } from './types'
import { formatTime, formatDuration, getBlockTopPosition, getBlockHeight } from './utils'
import { cn } from '@/lib/utils'

interface DraggableTimeBlockProps {
  block: TimeBlock
  hourHeight: number
  width?: number
  left?: number
  onResize?: (blockId: string, newStartTime: Date, newEndTime: Date) => void
  onClick?: (block: TimeBlock) => void
}

export function DraggableTimeBlock({
  block,
  hourHeight,
  width = 100,
  left = 0,
  onResize,
  onClick,
}: DraggableTimeBlockProps) {
  const [isResizing, setIsResizing] = useState(false)
  const resizeStartRef = useRef<{ startY: number; originalTop: number; originalHeight: number } | null>(null)

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: block.id,
    data: {
      block,
      type: 'time-block',
    },
    disabled: isResizing,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    position: 'absolute' as const,
    top: getBlockTopPosition(block.startTime, hourHeight),
    height: getBlockHeight(block.startTime, block.endTime, hourHeight),
    width: `${width}%`,
    left: `${left}%`,
    zIndex: isDragging ? 50 : isResizing ? 40 : 10,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleResizeStart = (e: React.MouseEvent | React.TouchEvent, edge: 'top' | 'bottom') => {
    e.stopPropagation()
    setIsResizing(true)

    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    resizeStartRef.current = {
      startY: clientY,
      originalTop: style.top as number,
      originalHeight: style.height as number,
    }

    const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
      if (!resizeStartRef.current) return

      const currentY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY
      const deltaY = currentY - resizeStartRef.current.startY

      if (edge === 'bottom') {
        const newHeight = Math.max(hourHeight / 4, resizeStartRef.current.originalHeight + deltaY)
        const durationMinutes = (newHeight / hourHeight) * 60
        const newEndTime = new Date(block.startTime.getTime() + durationMinutes * 60000)
        onResize?.(block.id, block.startTime, newEndTime)
      } else {
        const newTop = resizeStartRef.current.originalTop + deltaY
        const newHeight = resizeStartRef.current.originalHeight - deltaY
        if (newHeight >= hourHeight / 4) {
          const startMinutes = (newTop / hourHeight) * 60
          const newStartTime = new Date(block.startTime)
          newStartTime.setHours(0, startMinutes, 0, 0)
          onResize?.(block.id, newStartTime, block.endTime)
        }
      }
    }

    const handleEnd = () => {
      setIsResizing(false)
      resizeStartRef.current = null
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchmove', handleMove)
      document.removeEventListener('touchend', handleEnd)
    }

    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleEnd)
    document.addEventListener('touchmove', handleMove)
    document.addEventListener('touchend', handleEnd)
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={cn(
        'rounded-lg border-2 shadow-md cursor-move overflow-hidden',
        'transition-shadow hover:shadow-lg',
        BLOCK_COLORS[block.type],
        BLOCK_HOVER_COLORS[block.type],
        isDragging && 'shadow-2xl ring-2 ring-blue-400',
        isResizing && 'ring-2 ring-purple-400'
      )}
      {...listeners}
      {...attributes}
      onClick={() => onClick?.(block)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Resize handle - Top */}
      <div
        className="absolute top-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-white/20 transition-colors"
        onMouseDown={(e) => handleResizeStart(e, 'top')}
        onTouchStart={(e) => handleResizeStart(e, 'top')}
        onClick={(e) => e.stopPropagation()}
      />

      {/* Content */}
      <div className="h-full p-2 flex flex-col justify-between">
        <div className="flex items-start gap-1">
          <GripVertical className="w-3 h-3 opacity-60 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm truncate">{block.title}</h4>
            {block.description && (
              <p className="text-xs opacity-90 truncate">{block.description}</p>
            )}
          </div>
          {block.completed && (
            <Check className="w-4 h-4 flex-shrink-0" />
          )}
        </div>

        <div className="flex items-center gap-1 text-xs opacity-90">
          <Clock className="w-3 h-3" />
          <span>{formatTime(block.startTime)}</span>
          <span>•</span>
          <span>{formatDuration(block.startTime, block.endTime)}</span>
        </div>
      </div>

      {/* Resize handle - Bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-white/20 transition-colors"
        onMouseDown={(e) => handleResizeStart(e, 'bottom')}
        onTouchStart={(e) => handleResizeStart(e, 'bottom')}
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>
  )
}
