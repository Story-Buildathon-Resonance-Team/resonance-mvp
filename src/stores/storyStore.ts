import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { StoryStore, StoryDraft } from './types'

export const useStoryStore = create<StoryStore>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        drafts: [],
        currentDraft: null,
        readingProgress: [],
        bookmarkedStories: [],
        publishedStories: [],
        remixedStories: [],
        
        // Actions - Drafts
        createDraft: () => {
          const id = uuidv4()
          const newDraft: StoryDraft = {
            id,
            title: '',
            description: '',
            content: '',
            contentType: 'text',
            licenseType: 'non-commercial',
            lastSaved: Date.now(),
            isAutosaved: false,
          }
          
          set((state) => ({
            drafts: [...state.drafts, newDraft],
            currentDraft: newDraft
          }))
          
          return id
        },
        
        saveDraft: (id, data) => set((state) => ({
          drafts: state.drafts.map(draft => 
            draft.id === id 
              ? { ...draft, ...data, lastSaved: Date.now(), isAutosaved: true }
              : draft
          ),
          currentDraft: state.currentDraft?.id === id 
            ? { ...state.currentDraft, ...data, lastSaved: Date.now(), isAutosaved: true }
            : state.currentDraft
        })),
        
        deleteDraft: (id) => set((state) => ({
          drafts: state.drafts.filter(draft => draft.id !== id),
          currentDraft: state.currentDraft?.id === id ? null : state.currentDraft
        })),
        
        loadDraft: (id) => {
          const { drafts } = get()
          const draft = drafts.find(d => d.id === id)
          if (draft) {
            set({ currentDraft: draft })
          }
        },
        
        setCurrentDraft: (draft) => set({ currentDraft: draft }),
        
        // Actions - Reading
        updateReadingProgress: (storyId, progress) => set((state) => {
          const existing = state.readingProgress.find(p => p.storyId === storyId)
          
          if (existing) {
            return {
              readingProgress: state.readingProgress.map(p =>
                p.storyId === storyId
                  ? { ...p, progress, lastRead: Date.now() }
                  : p
              )
            }
          } else {
            return {
              readingProgress: [
                ...state.readingProgress,
                {
                  storyId,
                  progress,
                  lastRead: Date.now(),
                  bookmarked: false
                }
              ]
            }
          }
        }),
        
        toggleBookmark: (storyId) => set((state) => {
          const isBookmarked = state.bookmarkedStories.includes(storyId)
          
          return {
            bookmarkedStories: isBookmarked
              ? state.bookmarkedStories.filter(id => id !== storyId)
              : [...state.bookmarkedStories, storyId],
            readingProgress: state.readingProgress.map(p =>
              p.storyId === storyId
                ? { ...p, bookmarked: !isBookmarked }
                : p
            )
          }
        }),
        
        // Actions - Published Stories
        addPublishedStory: (story) => set((state) => ({
          publishedStories: [story, ...state.publishedStories]
        })),
        
        // Actions - Remixed Stories
        addRemixedStory: (story) => set((state) => ({
          remixedStories: [story, ...state.remixedStories]
        })),
        
        updateRemixedStory: (id, updates) => set((state) => ({
          remixedStories: state.remixedStories.map(story =>
            story.id === id ? { ...story, ...updates } : story
          )
        })),
        
        deleteRemixedStory: (id) => set((state) => ({
          remixedStories: state.remixedStories.filter(story => story.id !== id)
        })),
        
        // Persistence
        loadFromStorage: () => {
          // Handled by persist middleware
        },
        
        saveToStorage: () => {
          // Handled by persist middleware
        },
        
        // Auto-save (placeholder - implement if needed)
        enableAutoSave: () => {},
        disableAutoSave: () => {},
      }),
      {
        name: 'story-storage',
        partialize: (state) => ({
          drafts: state.drafts,
          readingProgress: state.readingProgress,
          bookmarkedStories: state.bookmarkedStories,
          publishedStories: state.publishedStories,
          remixedStories: state.remixedStories,
        }),
      }
    ),
    {
      name: 'story-store',
    }
  )
) 