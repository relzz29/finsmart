import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const NotifContext = createContext(null)

// ─── Local notification store ───────────────────────────────────────────────
const STORAGE_KEY = 'fs_notifications'

function loadNotifs() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch { return [] }
}

function saveNotifs(notifs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifs.slice(0, 50)))
  } catch {}
}

export function NotifProvider({ children }) {
  const [notifs, setNotifs] = useState(loadNotifs)

  const addNotif = useCallback((notif) => {
    const item = {
      id: Date.now() + Math.random(),
      read: false,
      time: new Date().toISOString(),
      ...notif,
    }
    setNotifs(prev => {
      const next = [item, ...prev].slice(0, 50)
      saveNotifs(next)
      return next
    })
    return item
  }, [])

  const markRead = useCallback((id) => {
    setNotifs(prev => {
      const next = prev.map(n => n.id === id ? { ...n, read: true } : n)
      saveNotifs(next)
      return next
    })
  }, [])

  const markAllRead = useCallback(() => {
    setNotifs(prev => {
      const next = prev.map(n => ({ ...n, read: true }))
      saveNotifs(next)
      return next
    })
  }, [])

  const clearAll = useCallback(() => {
    setNotifs([])
    saveNotifs([])
  }, [])

  const unreadCount = notifs.filter(n => !n.read).length

  return (
    <NotifContext.Provider value={{ notifs, addNotif, markRead, markAllRead, clearAll, unreadCount }}>
      {children}
    </NotifContext.Provider>
  )
}

export function useNotifications() {
  return useContext(NotifContext)
}
