import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchNotifications } from '../api/notifications.js'
import Log from '../middleware/logger.js'

/**
 * Custom hook to manage notification fetching with pagination and filtering.
 */
export function useNotifications({ page = 1, limit = 10, notification_type = 'All' } = {}) {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [total, setTotal] = useState(0)
  const abortRef = useRef(null)

  const load = useCallback(async () => {
    // Cancel previous in-flight request
    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()

    setLoading(true)
    setError(null)
    Log('frontend', 'info', 'hook', `useNotifications: fetching page=${page} type=${notification_type}`)

    try {
      const data = await fetchNotifications({ page, limit, notification_type })
      const list = data?.notifications || []
      setNotifications(list)
      setTotal(data?.total || list.length)
      Log('frontend', 'info', 'hook', `useNotifications: received ${list.length} notifications`)
    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') return
      const msg = err.response?.status === 401
        ? 'Unauthorized — please check your API token.'
        : err.message || 'Failed to load notifications.'
      setError(msg)
      Log('frontend', 'error', 'hook', `useNotifications: error — ${msg}`)
    } finally {
      setLoading(false)
    }
  }, [page, limit, notification_type])

  useEffect(() => {
    load()
    return () => abortRef.current?.abort()
  }, [load])

  return { notifications, loading, error, total, refetch: load }
}

export default useNotifications
