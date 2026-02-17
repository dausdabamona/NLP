import { useState, useEffect, useCallback } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    setStoredValue((prev) => {
      const valueToStore = value instanceof Function ? value(prev) : value
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
      // Dispatch custom event to sync other hooks using the same key in this tab
      window.dispatchEvent(new CustomEvent('local-storage-update', {
        detail: { key, value: valueToStore },
      }))
      return valueToStore
    })
  }, [key])

  useEffect(() => {
    // Sync across different tabs
    const handleStorage = (e) => {
      if (e.key === key) {
        try {
          setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue)
        } catch {
          setStoredValue(initialValue)
        }
      }
    }
    // Sync across components in the same tab
    const handleLocalUpdate = (e) => {
      if (e.detail.key === key) {
        setStoredValue(e.detail.value)
      }
    }
    window.addEventListener('storage', handleStorage)
    window.addEventListener('local-storage-update', handleLocalUpdate)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('local-storage-update', handleLocalUpdate)
    }
  }, [key, initialValue])

  return [storedValue, setValue]
}
