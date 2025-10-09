'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { BlockType } from '@prisma/client'

export interface TimeBlockData {
  id: string
  userId: string
  title: string
  description?: string | null
  startTime: Date
  endTime: Date
  type: BlockType
  color?: string | null
  completed: boolean
  taskId?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateTimeBlockInput {
  title: string
  description?: string
  startTime: Date
  endTime: Date
  type: BlockType
  taskId?: string
}

export interface UpdateTimeBlockInput {
  title?: string
  description?: string
  startTime?: Date
  endTime?: Date
  type?: BlockType
  completed?: boolean
  taskId?: string
}

/**
 * Fetch time blocks for a date range
 */
export function useTimeBlocks(startDate: Date, endDate: Date) {
  return useQuery({
    queryKey: ['time-blocks', startDate.toISOString(), endDate.toISOString()],
    queryFn: async () => {
      const response = await fetch(
        `/api/blocks?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch time blocks')
      }

      const data = await response.json()

      // Parse dates
      return data.map((block: any) => ({
        ...block,
        startTime: new Date(block.startTime),
        endTime: new Date(block.endTime),
        createdAt: new Date(block.createdAt),
        updatedAt: new Date(block.updatedAt),
      })) as TimeBlockData[]
    },
    staleTime: 1000 * 60, // 1 minute
  })
}

/**
 * Create a new time block
 */
export function useCreateTimeBlock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateTimeBlockInput) => {
      const response = await fetch('/api/blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        throw new Error('Failed to create time block')
      }

      const data = await response.json()
      return {
        ...data,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      } as TimeBlockData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-blocks'] })
    },
  })
}

/**
 * Update an existing time block
 */
export function useUpdateTimeBlock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTimeBlockInput }) => {
      const response = await fetch(`/api/blocks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update time block')
      }

      const result = await response.json()
      return {
        ...result,
        startTime: new Date(result.startTime),
        endTime: new Date(result.endTime),
        createdAt: new Date(result.createdAt),
        updatedAt: new Date(result.updatedAt),
      } as TimeBlockData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-blocks'] })
    },
  })
}

/**
 * Delete a time block
 */
export function useDeleteTimeBlock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/blocks/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete time block')
      }

      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-blocks'] })
    },
  })
}

/**
 * Move a time block to a new time
 */
export function useMoveTimeBlock() {
  const updateMutation = useUpdateTimeBlock()

  return {
    ...updateMutation,
    mutate: (blockId: string, newStartTime: Date, newEndTime: Date) => {
      updateMutation.mutate({
        id: blockId,
        data: {
          startTime: newStartTime,
          endTime: newEndTime,
        },
      })
    },
  }
}

/**
 * Resize a time block
 */
export function useResizeTimeBlock() {
  const updateMutation = useUpdateTimeBlock()

  return {
    ...updateMutation,
    mutate: (blockId: string, newStartTime: Date, newEndTime: Date) => {
      updateMutation.mutate({
        id: blockId,
        data: {
          startTime: newStartTime,
          endTime: newEndTime,
        },
      })
    },
  }
}
