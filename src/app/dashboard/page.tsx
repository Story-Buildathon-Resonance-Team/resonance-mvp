'use client'

import { useUser } from '../Web3Providers'
import { useStoryStore } from '@/stores'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { DraftsList } from '@/components/DraftsList'
import { PublishedStoriesList } from '@/components/PublishedStoriesList'
import DashboardDataSeeder from '@/components/DashboardDataSeeder'
import { 
  PlusIcon,
  FileTextIcon,
  BookOpenIcon,
  EyeIcon,
  TrendingUpIcon,
  ClockIcon,
  BookmarkIcon,
  GitFork
} from 'lucide-react'
import { useMemo, useState } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  const user = useUser()
  const { 
    drafts, 
    publishedStories, 
    bookmarkedStories, 
    remixedStories, 
    readingProgress 
  } = useStoryStore()
  
  const [activeView, setActiveView] = useState<'drafts' | 'published'>('drafts')

  // Calculate dashboard stats
  const stats = useMemo(() => {
    const totalDrafts = drafts.length
    const totalPublished = publishedStories.length
    const totalBookmarked = bookmarkedStories.length
    const totalRemixes = remixedStories.length
    
    // Calculate recent activity (last 7 days)
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    const recentActivity = drafts.filter(d => d.lastSaved > weekAgo).length + 
                          publishedStories.filter(s => s.publishedAt > weekAgo).length
    
    return {
      totalDrafts,
      totalPublished,
      totalBookmarked,
      totalRemixes,
      recentActivity
    }
  }, [drafts, publishedStories, bookmarkedStories, remixedStories])

  if (!user?.isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Please connect your wallet to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link href="/">Go to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <DashboardDataSeeder />
      
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Stories</h1>
            <p className="text-muted-foreground">
              Write, publish, and manage your stories on the blockchain
            </p>
          </div>
          
          {/* Primary CTA */}
          <Button asChild size="lg" className="w-fit">
            <Link href="/publish-form" className="flex items-center gap-2">
              <PlusIcon className="h-5 w-5" />
              Write a Story
            </Link>
          </Button>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-primary">{stats.totalDrafts}</div>
            <div className="text-sm text-muted-foreground">Drafts</div>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-primary">{stats.totalPublished}</div>
            <div className="text-sm text-muted-foreground">Published</div>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-primary">{stats.totalBookmarked}</div>
            <div className="text-sm text-muted-foreground">Bookmarked</div>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-primary">{stats.recentActivity}</div>
            <div className="text-sm text-muted-foreground">This Week</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Stories Toggle */}
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={activeView === 'drafts' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('drafts')}
              className="relative"
            >
              <FileTextIcon className="h-4 w-4 mr-2" />
              Drafts
              {stats.totalDrafts > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {stats.totalDrafts}
                </Badge>
              )}
            </Button>
            <Button
              variant={activeView === 'published' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('published')}
              className="relative"
            >
              <BookOpenIcon className="h-4 w-4 mr-2" />
              Published
              {stats.totalPublished > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {stats.totalPublished}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Stories Content */}
        <div className="min-h-[400px]">
          {activeView === 'drafts' ? <DraftsList /> : <PublishedStoriesList />}
        </div>

        {/* Secondary Actions
        {(stats.totalBookmarked > 0 || stats.totalRemixes > 0) && (
          <>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Reading & Inspiration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats.totalBookmarked > 0 && (
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <BookmarkIcon className="h-5 w-5 text-blue-600" />
                          <div>
                            <div className="font-medium">Bookmarked Stories</div>
                            <div className="text-sm text-muted-foreground">
                              {stats.totalBookmarked} stories saved
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">View All</Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {stats.totalRemixes > 0 && (
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <GitFork className="h-5 w-5 text-purple-600" />
                          <div>
                            <div className="font-medium">Your Remixes</div>
                            <div className="text-sm text-muted-foreground">
                              {stats.totalRemixes} remixes created
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">View All</Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </>
        )} */}

        {/* Quick Actions */}
        <Separator />
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Explore</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" asChild className="h-auto p-4 justify-start">
              <Link href="/library" className="flex items-center gap-3">
                <BookOpenIcon className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Browse Stories</div>
                  <div className="text-sm text-muted-foreground">Discover new stories</div>
                </div>
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="h-auto p-4 justify-start">
              <Link href="/library" className="flex items-center gap-3">
                <GitFork className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Find Stories to Remix</div>
                  <div className="text-sm text-muted-foreground">Build on others' work</div>
                </div>
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="h-auto p-4 justify-start">
              <Link href="/" className="flex items-center gap-3">
                <TrendingUpIcon className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Trending Stories</div>
                  <div className="text-sm text-muted-foreground">See what's popular</div>
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 