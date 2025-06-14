"use client"

import { useEffect, PropsWithChildren } from 'react'
import { enableAutoSave, disableAutoSave } from './publishStore'
import { useUserPreferencesStore } from './userPreferencesStore'
import { useStoryStore } from './storyStore'

export function StoreProvider({ children }: PropsWithChildren) {
  const autoSaveEnabled = useUserPreferencesStore(state => state.preferences.autoSave)
  
  useEffect(() => {
    // Initialize stores
    useUserPreferencesStore.getState().loadPreferences()
    useStoryStore.getState().loadFromStorage()
    
    // Set up auto-save based on user preferences
    if (autoSaveEnabled) {
      enableAutoSave()
    } else {
      disableAutoSave()
    }
    
    return () => {
      disableAutoSave()
    }
  }, [autoSaveEnabled])
  
  return <>{children}</>
} 