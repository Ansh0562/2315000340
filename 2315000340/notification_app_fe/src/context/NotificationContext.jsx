import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import Log from '../middleware/logger.js'

const NotificationContext = createContext(null)

const READ_KEY = 'campus_notifications_read'

function loadReadIds() {
  try {
    const raw = localStorage.getItem(READ_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function saveReadIds(readIds) {
  try {
    localStorage.setItem(READ_KEY, JSON.stringify([...readIds]))
  } catch {
    // storage unavailable
  }
}

export function NotificationProvider({ children }) {
  const [readIds, setReadIds] = useState(() => loadReadIds())
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })

  useEffect(() => {
    saveReadIds(readIds)
    Log('frontend', 'debug', 'state', `Read IDs persisted: ${readIds.size} notifications`)
  }, [readIds])

  const markAsRead = useCallback((id) => {
    setReadIds((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      Log('frontend', 'info', 'state', `Notification marked as read: ${id}`)
      return next
    })
  }, [])

  const markAllAsRead = useCallback((ids) => {
    setReadIds((prev) => {
      const next = new Set(prev)
      ids.forEach((id) => next.add(id))
      Log('frontend', 'info', 'state', `All visible notifications marked as read (${ids.length})`)
      return next
    })
  }, [])

  const isRead = useCallback((id) => readIds.has(id), [readIds])

  const showSnackbar = useCallback((message, severity = 'info') => {
    setSnackbar({ open: true, message, severity })
  }, [])

  const closeSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }))
  }, [])

  return (
    <NotificationContext.Provider
      value={{ readIds, markAsRead, markAllAsRead, isRead, snackbar, showSnackbar, closeSnackbar }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotificationContext() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotificationContext must be used within NotificationProvider')
  return ctx
}

export default NotificationContext
