import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { PublishStore, StoryDraft } from './types'

const initialFormData: Partial<StoryDraft> = {
  title: '',
  description: '',
  content: '',
  contentType: 'text',
  licenseType: 'non-commercial',
}

export const usePublishStore = create<PublishStore>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        currentStep: 1,
        formData: initialFormData,
        isSubmitting: false,
        submitStatus: { type: null, message: '' },
        
        // Actions
        setCurrentStep: (step) => set({ currentStep: step }),
        
        updateFormData: (data) => set((state) => ({
          formData: { 
            ...state.formData, 
            ...data,
            lastSaved: Date.now(),
            isAutosaved: true
          }
        })),
        
        setIsSubmitting: (submitting) => set({ isSubmitting: submitting }),
        
        setSubmitStatus: (status) => set({ submitStatus: status }),
        
        // Form Management
        saveFormData: () => {
          const { formData } = get()
          if (formData.title || formData.content) {
            set({
              formData: {
                ...formData,
                lastSaved: Date.now(),
                isAutosaved: true
              }
            })
          }
        },
        
        loadFormData: () => {
          // This will be automatically handled by persist middleware
        },
        
        resetForm: () => set({
          currentStep: 1,
          formData: initialFormData,
          submitStatus: { type: null, message: '' }
        }),
        
        validateCurrentStep: async () => {
          const { currentStep, formData } = get()
          
          // Basic validation logic - you can enhance this
          switch (currentStep) {
            case 1:
              return !!(formData.title && formData.description && 
                       (formData.content || formData.storyFile) && 
                       formData.coverImage)
            case 2:
              return !!formData.licenseType
            case 3:
              return true // Review step
            default:
              return false
          }
        },
        
        // Navigation
        nextStep: async () => {
          const { currentStep, validateCurrentStep } = get()
          const isValid = await validateCurrentStep()
          
          if (isValid && currentStep < 3) {
            set({ currentStep: currentStep + 1 })
            return true
          }
          return false
        },
        
        previousStep: () => {
          const { currentStep } = get()
          if (currentStep > 1) {
            set({ currentStep: currentStep - 1 })
          }
        },
        
        setFormData: (data: Partial<StoryDraft>) => set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      }),
      {
        name: 'publish-form-storage',
        partialize: (state) => ({ 
          formData: state.formData,
          currentStep: state.currentStep 
        }),
      }
    ),
    {
      name: 'publish-store',
    }
  )
)

// Auto-save functionality
let autoSaveTimer: NodeJS.Timeout | null = null

export const enableAutoSave = () => {
  if (autoSaveTimer) clearInterval(autoSaveTimer)
  
  autoSaveTimer = setInterval(() => {
    const store = usePublishStore.getState()
    if (store.formData.title || store.formData.content) {
      store.saveFormData()
    }
  }, 10000) // Auto-save every 10 seconds
}

export const disableAutoSave = () => {
  if (autoSaveTimer) {
    clearInterval(autoSaveTimer)
    autoSaveTimer = null
  }
} 