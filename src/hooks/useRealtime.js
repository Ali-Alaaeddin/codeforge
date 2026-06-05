import { useEffect } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Hook to subscribe to real-time changes on a specific Supabase table
 * @param {string} table - The database table to watch (e.g., 'comments')
 * @param {string} filter - Optional filter (e.g., `pr_id=eq.${prId}`)
 * @param {function} onInsert - Callback when a row is inserted
 * @param {function} onUpdate - Callback when a row is updated
 * @param {function} onDelete - Callback when a row is deleted
 */
export function useRealtime(table, filter, { onInsert, onUpdate, onDelete }) {
  useEffect(() => {
    // Create a channel name based on the table and filter
    const channelName = filter ? `public:${table}:${filter}` : `public:${table}`
    
    const channel = supabase.channel(channelName)

    if (onInsert) {
      channel.on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table, filter },
        (payload) => onInsert(payload.new)
      )
    }

    if (onUpdate) {
      channel.on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table, filter },
        (payload) => onUpdate(payload.new, payload.old)
      )
    }

    if (onDelete) {
      channel.on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table, filter },
        (payload) => onDelete(payload.old)
      )
    }

    // Subscribe to the channel
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`Subscribed to real-time events for ${channelName}`)
      }
    })

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [table, filter, onInsert, onUpdate, onDelete])
}
