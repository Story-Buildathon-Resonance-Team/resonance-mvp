"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  User,
  FileText,
  Globe,
  AlertCircle,
  GitBranch,
  Sparkles,
} from "lucide-react";
import { users } from "../../data/user";
import { useStoryStore } from "../../stores/storyStore";
import Link from "next/link";

export default function StoriesPage() {
  // Get published stories from both user data and store
  const { publishedStories } = useStoryStore();

  // Get all published stories from user data
  const userStories = users.flatMap((user) =>
    user.stories
      .filter((story) => story.ipId && story.title) // Only show completed stories
      .map((story) => ({
        ...story,
        author: user.userName || user.walletAddress.slice(0, 8) + "...",
        authorAddress: user.walletAddress,
        publishedAt: story.publishedAt || new Date(0).toISOString(), // Use existing date or default
        licenseType: "non-commercial", // Default license type
      }))
  );

  // Convert store stories to match the display format
  const storeStories = publishedStories.map((story) => ({
    ipId: story.ipId,
    ipMetadataCID: story.contentCID, // Using contentCID as fallback
    nftMetadataCID: story.contentCID,
    contentCID: story.contentCID,
    imageCID: story.imageCID,
    title: story.title,
    synopsis: story.description,
    author: story.author.name || story.author.address.slice(0, 8) + "...",
    authorAddress: story.author.address,
    publishedAt: story.publishedAt,
    licenseType: story.licenseTypes?.[0] || "non-commercial",
    originalStoryId: story.originalStoryId, // Track remix relationship
    isRemix: !!story.originalStoryId, // Flag to identify remixes
  }));

  const allStoriesMap = new Map();

  // Add user stories first
  userStories.forEach((story) => {
    if (story.ipId) {
      allStoriesMap.set(story.ipId, story);
    }
  });

  // Add store stories (will override user stories with same ipId)
  storeStories.forEach((story) => {
    if (story.ipId) {
      allStoriesMap.set(story.ipId, story);
    }
  });

  // Convert back to array and sort by publication date (newest first)
  const allStories = Array.from(allStoriesMap.values()).sort(
    (a, b) => (b.publishedAt || 0) - (a.publishedAt || 0)
  );

  const getIPFSUrl = (cid: string) =>
    `https://gateway.pinata.cloud/ipfs/${cid}`;

  return (
    <div className='max-w-6xl mx-auto px-6 py-8 space-y-8'>
      {/* Header */}
      <div className='text-center space-y-4'>
        <div className='flex items-center justify-center gap-2 mb-4'>
          <h1 className='text-3xl font-bold'>Explore</h1>
        </div>
        <p className='text-xl text-foreground/80'>
          Find your favorite stories, discover new authors, and discover a world
          of endless possibilities
        </p>
      </div>

      {/* Stories Grid */}
      {allStories.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {allStories.map((story, index) => (
            <Card key={story.ipId || index} className='flex flex-col h-full'>
              {/* Cover Image */}
              {story.imageCID && (
                <div className='aspect-video object-cover object-[50%_25%] w-full overflow-hidden rounded-t-lg'>
                  <img
                    src={getIPFSUrl(story.imageCID)}
                    alt={story.title || "Story cover"}
                    className='w-full h-full object-cover'
                  />
                </div>
              )}

              <CardHeader className='flex-1'>
                <div className='flex items-start justify-between gap-2'>
                  <CardTitle className='line-clamp-2 flex-1'>
                    {story.title || "Untitled Story"}
                  </CardTitle>
                  {(story as any).isRemix && (
                    <Badge
                      variant='secondary'
                      className='flex items-center gap-1 text-xs'
                    >
                      <GitBranch className='h-3 w-3' />
                      Remix
                    </Badge>
                  )}
                </div>
                <span className='text-foreground mb-1'>
                  Author: {story.author}
                </span>
                {story.synopsis && (
                  <p className='text-sm text-muted-foreground line-clamp-3'>
                    {story.synopsis}
                  </p>
                )}
                {(story as any).isRemix && (
                  <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                    <Sparkles className='h-3 w-3' />
                    <span>Remix of original work</span>
                  </div>
                )}
              </CardHeader>

              <CardContent className='space-y-4'>
                {/* Action Buttons */}
                <div className='flex gap-2 pt-2'>
                  {story.ipId && story.contentCID ? (
                    <Link href={`/stories/${story.ipId}`}>
                      <Button
                        variant='outline'
                        size='sm'
                        className='flex-1 cursor-pointer'
                      >
                        <FileText className='h-4 w-4 mr-1' />
                        Read Story
                      </Button>
                    </Link>
                  ) : story.contentCID && !story.ipId ? (
                    <div className='flex-1 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800'>
                      <AlertCircle className='h-3 w-3 inline mr-1' />
                      This is a test app and some configuration might be
                      missing. Make sure your story has an ipId in the user
                      object (check user.ts file in the data folder)
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className='text-center p-8'>
          <CardContent>
            <BookOpen className='h-16 w-16 mx-auto mb-4 text-muted-foreground' />
            <h3 className='text-lg font-semibold mb-2'>
              No Stories Published Yet
            </h3>
            <p className='text-muted-foreground mb-4'>
              Be the first to publish a story as an IP asset!
            </p>
            <Link href='/publish-form'>
              <Button>
                <FileText className='h-4 w-4 mr-2' />
                Publish Your Story
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
