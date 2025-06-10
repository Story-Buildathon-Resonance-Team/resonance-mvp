"use client";

import { useStoryStore } from "@/stores";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, BookOpen, Calendar, Eye } from "lucide-react";
import Link from "next/link";

export function PublishedStoriesList() {
  const { publishedStories } = useStoryStore();

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const weeks = Math.floor(days / 7)
    const months = Math.floor(days / 30)
    
    if (months > 0) return `${months}mo ago`
    if (weeks > 0) return `${weeks}w ago`
    if (days > 0) return `${days}d ago`
    return 'Today'
  }

  const getLicenseColor = (license: string) => {
    switch (license) {
      case 'commercial-use': return 'text-green-600 bg-green-50 border-green-200'
      case 'commercial-remix': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'non-commercial': return 'text-gray-600 bg-gray-50 border-gray-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  if (publishedStories.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No published stories yet</h3>
        <p className="text-muted-foreground mb-6">
          Publish your first story to share it with the world on the blockchain.
        </p>
        <Link href="/publish-form">
          <Button>Publish Your First Story</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {publishedStories.map((story) => (
        <div 
          key={story.ipId} 
          className="group p-4 hover:bg-muted/30 rounded-lg transition-colors border-l-2 border-transparent hover:border-green-500/20"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-3 mb-2">
                <div className="flex-1">
                  <h3 className="font-medium text-lg leading-tight mb-1 line-clamp-2">
                    {story.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                    {story.description}
                  </p>
                </div>
                
                <Badge 
                  variant="outline" 
                  className={`text-xs shrink-0 ${getLicenseColor(story.licenseType)}`}
                >
                  {story.licenseType === "non-commercial"
                    ? "Non-Commercial"
                    : story.licenseType === "commercial-use"
                    ? "Commercial"
                    : "Remix"}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatTimeAgo(story.publishedAt)}
                </span>
                
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  Token #{story.tokenId}
                </span>
                
                <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                  {story.ipId.slice(0, 8)}...{story.ipId.slice(-6)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button asChild size="sm" variant="outline">
                <a
                  href={story.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  Explorer
                </a>
              </Button>
              
              <Button asChild size="sm" variant="outline">
                <Link
                  href={`/stories/${story.ipId}`}
                  className="flex items-center gap-1"
                >
                  <Eye className="h-3 w-3" />
                  Read
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 