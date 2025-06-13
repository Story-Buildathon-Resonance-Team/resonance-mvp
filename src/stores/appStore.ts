import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { AppStore } from './types'

export const useAppStore = create<AppStore>()(
  devtools(
    (set) => ({
      // State
      isLoading: false,
      currentPage: '/',
      mobileMenuOpen: false,
      
      // Actions
      setIsLoading: (loading) => set({ isLoading: loading }),
      setCurrentPage: (page) => set({ currentPage: page }),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
      
      // Navigation
      navigate: (page) => {
        set({ currentPage: page, mobileMenuOpen: false })
      },
    }),
    {
      name: 'app-store',
    }
  )
) 