'use client'

import { useStoryStore } from '@/stores'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { BookmarkIcon, ClockIcon, ExternalLinkIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import type { PublishedStory } from '@/stores/types'

export default function BookmarkedStoriesList() {
  const { bookmarkedStories, readingProgress, publishedStories } = useStoryStore()
  const [bookmarkedStoriesData, setBookmarkedStoriesData] = useState<PublishedStory[]>([])

  // In a real app, you'd fetch story details from your API based on the bookmarked story IDs
  // For now, we'll filter from published stories and add some mock data
  useEffect(() => {
    // Filter published stories that are bookmarked
    const bookmarkedPublished = publishedStories.filter(story => 
      bookmarkedStories.includes(story.ipId)
    )
    
    // Add mock bookmarked stories for demonstration
    const mockBookmarkedStories: PublishedStory[] = [
      {
        ipId: 'mock-1',
        title: 'The Digital Renaissance',
        description: 'A fascinating exploration of how AI is reshaping art and creativity in the 21st century.',
        author: {
          name: 'Alice Chen',
          address: '0x1234...5678'
        },
        contentCID: 'QmExample1',
        imageCID: 'QmImage1',
        txHash: '0xabcd...efgh',
        tokenId: '1',
        licenseType: 'commercial-use',
        publishedAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
        explorerUrl: 'https://explorer.story.foundation/ipa/mock-1'
      },
      {
        ipId: 'mock-2',
        title: 'Quantum Storytelling',
        description: 'How quantum computing will revolutionize narrative structures and interactive fiction.',
        author: {
          name: 'Bob Martinez',
          address: '0x9876...5432'
        },
        contentCID: 'QmExample2',
        imageCID: 'QmImage2',
        txHash: '0xijkl...mnop',
        tokenId: '2',
        licenseType: 'non-commercial',
        publishedAt: Date.now() - 14 * 24 * 60 * 60 * 1000, // 14 days ago
        explorerUrl: 'https://explorer.story.foundation/ipa/mock-2'
      }
    ]

    // Combine real bookmarked stories with mock data
    const allBookmarked = [...bookmarkedPublished]
    
    // Add mock stories if we don't have enough bookmarked stories
    if (allBookmarked.length === 0) {
      allBookmarked.push(...mockBookmarkedStories)
    }
    
    setBookmarkedStoriesData(allBookmarked)
  }, [bookmarkedStories, publishedStories])

  const getReadingProgress = (storyId: string) => {
    return readingProgress.find(p => p.storyId === storyId)
  }

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    return 'Less than an hour ago'
  }

  const getLicenseColor = (license: string) => {
    switch (license) {
      case 'commercial-use': return 'bg-green-100 text-green-800'
      case 'commercial-remix': return 'bg-blue-100 text-blue-800'
      case 'non-commercial': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (bookmarkedStoriesData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookmarkIcon className="h-5 w-5" />
            Bookmarked Stories
          </CardTitle>
          <CardDescription>
            Stories you've saved to read later
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <BookmarkIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No bookmarked stories yet</p>
            <p className="text-sm">Discover and bookmark stories to read them later</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookmarkIcon className="h-5 w-5" />
          Bookmarked Stories
          <Badge variant="secondary">{bookmarkedStoriesData.length}</Badge>
        </CardTitle>
        <CardDescription>
          Stories you've saved to read later
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookmarkedStoriesData.map((story) => {
            const progress = getReadingProgress(story.ipId)
            
            return (
              <div key={story.ipId} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{story.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {story.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <span>by {story.author.name}</span>
                      <span>•</span>
                      <span>{formatTimeAgo(story.publishedAt)}</span>
                    </div>
                  </div>
                  <Badge className={getLicenseColor(story.licenseType)}>
                    {story.licenseType.replace('-', ' ')}
                  </Badge>
                </div>
                
                {progress && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" />
                        Reading Progress
                      </span>
                      <span>{Math.round(progress.progress)}% complete</span>
                    </div>
                    <Progress value={progress.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Last read {formatTimeAgo(progress.lastRead)}
                    </p>
                  </div>
                )}
                
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    {progress?.progress > 0 ? 'Continue Reading' : 'Start Reading'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open(story.explorerUrl, '_blank')}
                  >
                    <ExternalLinkIcon className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open(`https://gateway.pinata.cloud/ipfs/${story.contentCID}`, '_blank')}
                  >
                    View Content
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
} 