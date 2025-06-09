'use client'

import { useStoryStore } from '@/stores'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { RemixedStory, ReadingProgress } from '@/stores/types'

export default function DashboardDataSeeder() {
  const { 
    remixedStories, 
    addRemixedStory, 
    readingProgress, 
    updateReadingProgress,
    bookmarkedStories,
    toggleBookmark
  } = useStoryStore()
  const [hasSeeded, setHasSeeded] = useState(false)

  useEffect(() => {
    // Only seed data if we haven't already and there's no existing data
    if (hasSeeded || remixedStories.length > 0) return

    // Sample remixed stories
    const sampleRemixes: RemixedStory[] = [
      {
        id: uuidv4(),
        originalStoryId: 'original-1',
        originalTitle: 'The Last Algorithm',
        originalAuthor: {
          name: 'Dr. Sarah Chen',
          address: '0x1234...abcd'
        },
        remixTitle: 'The Last Algorithm: A New Hope',
        remixDescription: 'A continuation of the original story exploring what happens when humanity discovers the algorithm wasn\'t the last one after all. This remix takes a more optimistic approach to AI consciousness.',
        remixedAt: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
        status: 'published',
        ipId: 'remix-ip-1',
        contentCID: 'QmRemixContent1',
        imageCID: 'QmRemixImage1'
      },
      {
        id: uuidv4(),
        originalStoryId: 'original-2',
        originalTitle: 'Digital Ghosts',
        originalAuthor: {
          name: 'Marcus Rivera',
          address: '0x5678...efgh'
        },
        remixTitle: 'Digital Ghosts: The Awakening',
        remixDescription: 'A darker take on the original concept, exploring what happens when the digital ghosts begin to remember their past lives and seek revenge on those who erased them.',
        remixedAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
        status: 'draft'
      },
      {
        id: uuidv4(),
        originalStoryId: 'original-3',
        originalTitle: 'Quantum Hearts',
        originalAuthor: {
          name: 'Elena Vasquez',
          address: '0x9abc...ijkl'
        },
        remixTitle: 'Quantum Hearts: Parallel Love',
        remixDescription: 'An exploration of love across multiple quantum realities, where the same two souls find each other in different universes with different challenges and outcomes.',
        remixedAt: Date.now() - 14 * 24 * 60 * 60 * 1000, // 14 days ago
        status: 'published',
        ipId: 'remix-ip-2',
        contentCID: 'QmRemixContent2',
        imageCID: 'QmRemixImage2'
      }
    ]

    // Add sample reading progress for the bookmarked stories
    const sampleProgress: { storyId: string; progress: number }[] = [
      { storyId: 'mock-1', progress: 35 },
      { storyId: 'mock-2', progress: 78 },
      { storyId: 'original-1', progress: 100 },
      { storyId: 'original-3', progress: 45 }
    ]

    // Seed the data
    sampleRemixes.forEach(remix => addRemixedStory(remix))
    
    // Add reading progress
    sampleProgress.forEach(({ storyId, progress }) => {
      updateReadingProgress(storyId, progress)
    })

    // Bookmark some stories
    if (!bookmarkedStories.includes('mock-1')) {
      toggleBookmark('mock-1')
    }
    if (!bookmarkedStories.includes('mock-2')) {
      toggleBookmark('mock-2')
    }

    setHasSeeded(true)
  }, [
    hasSeeded, 
    remixedStories.length, 
    addRemixedStory, 
    updateReadingProgress, 
    bookmarkedStories, 
    toggleBookmark
  ])

  // This component doesn't render anything visible
  return null
} 