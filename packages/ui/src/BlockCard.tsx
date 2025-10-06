import React from 'react'
import { format } from 'date-fns'
import { Clock } from 'lucide-react'

interface BlockCardProps {
  title: string
  startTime: Date
  endTime: Date
  type: string
  color?: string | null
  description?: string
  onClick?: () => void
}

export function BlockCard({
  title,
  startTime,
  endTime,
  type,
  color,
  description,
  onClick,
}: BlockCardProps) {
  const typeColors: Record<string, string> = {
    DEEP_WORK: '#1E3A8A',
    MEETING: '#6B7280',
    BREAK: '#10B981',
    GYM: '#F97316',
    SHALLOW: '#94A3B8',
  }

  const blockColor = color || typeColors[type] || '#6B7280'

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
      style={{ borderLeftWidth: '4px', borderLeftColor: blockColor }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-1" />
            <span>
              {format(startTime, 'h:mm a')} - {format(endTime, 'h:mm a')}
            </span>
          </div>
          {description && (
            <p className="text-sm text-gray-500 mt-2">{description}</p>
          )}
        </div>
        <span
          className="px-2 py-1 text-xs font-medium rounded"
          style={{
            backgroundColor: `${blockColor}20`,
            color: blockColor,
          }}
        >
          {type.replace('_', ' ')}
        </span>
      </div>
    </div>
  )
}