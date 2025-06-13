'use client'

import { useStoryStore } from '@/stores'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { 
  GitFork, 
  ExternalLinkIcon, 
  TrashIcon, 
  EditIcon, 
  Send,
  LinkIcon 
} from 'lucide-react'
import { useState } from 'react'

export default function RemixedStoriesList() {
  const { remixedStories, deleteRemixedStory } = useStoryStore()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    return 'Less than an hour ago'
  }

  const getStatusColor = (status: 'draft' | 'published') => {
    return status === 'published' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800'
  }

  const handleDelete = (id: string) => {
    deleteRemixedStory(id)
    setDeletingId(null)
  }

  const handlePublish = (id: string) => {
    // In a real app, this would redirect to the publish page with the remix data
    console.log('Publishing remix:', id)
    // For now, just navigate to publish page
    window.location.href = '/publish-form'
  }

  const handleEdit = (id: string) => {
    // In a real app, this would load the remix into the editor
    console.log('Editing remix:', id)
    // For now, just navigate to publish page
    window.location.href = '/publish-form'
  }

  if (remixedStories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitFork className="h-5 w-5" />
            Remixed Stories
          </CardTitle>
          <CardDescription>
            Stories you&apos;ve remixed from others
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <GitFork className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No remixes yet</p>
            <p className="text-sm">
              Find stories you love and create your own unique remixes
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitFork className="h-5 w-5" />
          Remixed Stories
          <Badge variant="secondary">{remixedStories.length}</Badge>
        </CardTitle>
        <CardDescription>
          Stories you&apos;ve remixed from others
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {remixedStories.map((remix) => (
            <div key={remix.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{remix.remixTitle}</h3>
                    <Badge className={getStatusColor(remix.status)}>
                      {remix.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                    {remix.remixDescription}
                  </p>
                  
                  {/* Original Story Reference */}
                  <div className="bg-gray-50 border rounded-lg p-3 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Remixed from:</span>
                    </div>
                    <p className="font-medium">{remix.originalTitle}</p>
                    <p className="text-sm text-muted-foreground">
                      by {remix.originalAuthor.name}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Created {formatTimeAgo(remix.remixedAt)}</span>
                    {remix.status === 'published' && remix.ipId && (
                      <>
                        <span>•</span>
                        <span>Published as IP Asset</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                {remix.status === 'draft' ? (
                  <>
                    <Button 
                      size="sm" 
                      onClick={() => handleEdit(remix.id)}
                      className="flex items-center gap-1"
                    >
                      <EditIcon className="h-4 w-4" />
                      Edit Draft
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handlePublish(remix.id)}
                      className="flex items-center gap-1"
                    >
                      <Send className="h-4 w-4" />
                      Publish
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(`https://explorer.story.foundation/ipa/${remix.ipId}`, '_blank')}
                      className="flex items-center gap-1"
                    >
                      <ExternalLinkIcon className="h-4 w-4" />
                      View on Explorer
                    </Button>
                    {remix.contentCID && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(`https://gateway.pinata.cloud/ipfs/${remix.contentCID}`, '_blank')}
                      >
                        View Content
                      </Button>
                    )}
                  </>
                )}
                
                <AlertDialog open={deletingId === remix.id} onOpenChange={(open) => !open && setDeletingId(null)}>
                  <AlertDialogTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => setDeletingId(remix.id)}
                      className="ml-auto"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Remix</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete &ldquo;{remix.remixTitle}&rdquo;?
                        {remix.status === 'published' && ' This will only remove it from your dashboard - the published version will remain on the blockchain.'}
                        {remix.status === 'draft' && ' This action cannot be undone.'}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(remix.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 