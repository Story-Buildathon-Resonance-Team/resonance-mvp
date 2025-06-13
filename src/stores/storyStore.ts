import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { StoryStore, StoryDraft } from './types'

interface Story {
  ipId: string
  title: string
  description: string
  author: {
    name: string
    address: string
  }
  contentCID: string
  imageCID: string
  txHash: string
  tokenId: string
  licenseType: string
  publishedAt: number
  explorerUrl: string
}

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
        
        publishStory: async (formData) => {
          // TODO: Implement actual story publishing logic
          // For now, just add a mock story
          const mockStory: Story = {
            ipId: "mock-ip-id",
            title: formData.title,
            description: formData.description,
            author: {
              name: "Mock Author",
              address: "0x123...",
            },
            contentCID: "mock-content-cid",
            imageCID: "mock-image-cid",
            txHash: "mock-tx-hash",
            tokenId: "mock-token-id",
            licenseType: formData.licenseType,
            publishedAt: Date.now(),
            explorerUrl: "https://mock-explorer.com",
          };

          set((state) => ({
            publishedStories: [...state.publishedStories, mockStory],
          }));
        },
        
        remixStory: async (formData) => {
          // TODO: Implement actual remix publishing logic
          // For now, just add a mock remix story
          const mockRemixStory: Story = {
            ipId: "mock-remix-ip-id",
            title: formData.remixTitle,
            description: formData.remixDescription,
            author: {
              name: "Mock Remix Author",
              address: "0x456...",
            },
            contentCID: "mock-remix-content-cid",
            imageCID: "mock-remix-image-cid",
            txHash: "mock-remix-tx-hash",
            tokenId: "mock-remix-token-id",
            licenseType: "non-commercial", // Default to non-commercial for remixes
            publishedAt: Date.now(),
            explorerUrl: "https://mock-explorer.com/remix",
          };

          set((state) => ({
            publishedStories: [...state.publishedStories, mockRemixStory],
          }));
        },
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