import { useState, useEffect } from 'react'

const STORAGE_KEY = 'patient-favorites'

export interface FavoritePatient {
  id: string
  name: string
  avatar: string
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoritePatient[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    window.dispatchEvent(new Event('favorites-updated'))
  }, [favorites])

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          setFavorites((prev) => JSON.stringify(prev) !== stored ? parsed : prev)
        } else {
          setFavorites((prev) => prev.length ? [] : prev)
        }
      } catch {}
    }

    window.addEventListener('favorites-updated', handleStorageChange)
    return () => window.removeEventListener('favorites-updated', handleStorageChange)
  }, [])

  const toggleFavorite = (patient: { id: string; name: string; avatar?: string }) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === patient.id)
      if (exists) {
        return prev.filter((f) => f.id !== patient.id)
      } else {
        return [...prev, { id: patient.id, name: patient.name, avatar: patient.avatar || '' }]
      }
    })
  }

  const isFavorite = (id: string) => favorites.some((f) => f.id === id)

  return { favorites, toggleFavorite, isFavorite }
}