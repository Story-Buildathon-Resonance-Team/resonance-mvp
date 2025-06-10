import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { UserPreferencesStore, UserPreferences } from './types'

const defaultPreferences: UserPreferences = {
  theme: 'system',
  readingSpeed: 'normal',
  autoSave: true,
  notifications: {
    publishSuccess: true,
    newStories: true,
    derivatives: false,
  },
}

export const useUserPreferencesStore = create<UserPreferencesStore>()(
  devtools(
    persist(
      (set, get) => ({
        preferences: defaultPreferences,
        
        // Actions
        setTheme: (theme) => set((state) => ({
          preferences: { ...state.preferences, theme }
        })),
        
        setReadingSpeed: (speed) => set((state) => ({
          preferences: { ...state.preferences, readingSpeed: speed }
        })),
        
        setAutoSave: (enabled) => set((state) => ({
          preferences: { ...state.preferences, autoSave: enabled }
        })),
        
        updateNotificationSettings: (settings) => set((state) => ({
          preferences: {
            ...state.preferences,
            notifications: { ...state.preferences.notifications, ...settings }
          }
        })),
        
        // Persistence
        loadPreferences: () => {
          // Handled by persist middleware
        },
        
        savePreferences: () => {
          // Handled by persist middleware
        },
      }),
      {
        name: 'user-preferences',
      }
    ),
    {
      name: 'user-preferences-store',
    }
  )
) 