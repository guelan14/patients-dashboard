import { useState, useCallback } from 'react'
import { fetchPatients } from '../services/api'
import type { Patient } from '../types/patient'

interface UsePatientsState {
  patients: Patient[]
  loading: boolean
  error: string | null
  hasMore: boolean
  page: number
}

export function usePatients() {
  const [state, setState] = useState<UsePatientsState>({
    patients: [],
    loading: false,
    error: null,
    hasMore: true,
    page: 1,
  })

  const loadPatients = useCallback(async (pageToLoad: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const data = await fetchPatients(pageToLoad, 10)

      setState(prev => ({
        ...prev,
        patients: pageToLoad === 1 ? data : [...prev.patients, ...data],
        loading: false,
        hasMore: data.length === 10,
        page: pageToLoad,
      }))
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Error al cargar los pacientes',
      }))
    }
  }, [])

  const loadMore = useCallback(() => {
    if (!state.loading && state.hasMore) {
      loadPatients(state.page + 1)
    }
  }, [state.loading, state.hasMore, state.page, loadPatients])

  const refresh = useCallback(() => {
    loadPatients(1)
  }, [loadPatients])

  return {
    ...state,
    loadMore,
    refresh,
  }
}