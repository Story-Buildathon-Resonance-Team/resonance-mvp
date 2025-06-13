"use client";

import { useStoryStore } from "@/stores";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookmarkIcon, ClockIcon, ExternalLinkIcon } from "lucide-react";
import { useState, useEffect } from "react";
import type { PublishedStory } from "@/stores/types";
import Link from "next/link";

export default function BookmarkedStoriesList() {
  const { bookmarkedStories, readingProgress, publishedStories } =
    useStoryStore();
  const [bookmarkedStoriesData, setBookmarkedStoriesData] = useState<
    PublishedStory[]
  >([]);

  // In a real app, you'd fetch story details from your API based on the bookmarked story IDs
  // For now, we'll filter from published stories and add some mock data
  useEffect(() => {
    // Filter published stories that are bookmarked
    const bookmarkedPublished = publishedStories.filter((story) =>
      bookmarkedStories.includes(story.ipId)
    );

    // Add mock bookmarked stories for demonstration using real story IDs
    const mockBookmarkedStories: PublishedStory[] = [
      {
        ipId: "0xf85014aa8ECa28A5c8ceEfcC5dCeFB4416F51f08",
        title: "The Weight of Truth",
        description:
          "In a crumbling, post-apocalyptic city hunted by Purifier machines, Daniel searches for a genetic heir who can activate a long-lost device to restore humanity.",
        author: {
          name: "Nat",
          address: "0x1BB1EB6b6676A6b0850547a70019112c41495BA2",
        },
        contentCID:
          "bafkreid34mk4ojned6wlylkcvploxqxfcrolmc6dago4zg3gzpaafxzelq",
        imageCID: "bafybeigmqq35e2wly6qy6enenumudd5bbp67h3koascgyuagixrxq5njly",
        nftMetadataCID: "bafkreic46pmhqoni66axnbmb4ogkx46kfz6us6xfmohdjj5w53penj7aiq",
        ipMetadataCID: "bafkreihfngnzxlhvzjnp7qyqjvefjxmypg3ke5p4o4lrptlvzqq2rjcdzq",
        txHash: "0xabcd...efgh",
        tokenId: "1",
        licenseTypes: ["non-commercial"],
        publishedAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
        explorerUrl:
          "https://aeneid.explorer.story.foundation/ipa/0xf85014aa8ECa28A5c8ceEfcC5dCeFB4416F51f08",
      },
      {
        ipId: "0x2139d4C281A07fd0311c118b02D396A764894E34",
        title: "The Missing Piece",
        description:
          "On the run from her sister&apos;s ruthless regime, Tamara discovers a bloody message in a remote cabin that hints at a deeper truth behind her bloodline and a soul-binding treaty.",
        author: {
          name: "Nat",
          address: "0x1BB1EB6b6676A6b0850547a70019112c41495BA2",
        },
        contentCID:
          "bafkreiaond2f2xj5bhtgjptgnphwn45wqizbhy5ju7z4px7ncfhugp4shu",
        imageCID: "bafybeiammagvjzcc7qln4ni6bjryrxtea5voz326vufkgfspcremp2avbm",
        nftMetadataCID: "bafkreiafjforjo4cy4ye4tgl7xyjlhfaxz5ntp4n3qgcdid573vfwtl5ku",
        ipMetadataCID: "bafkreihxoorp34rjyk3c654ephbjwmgbt3dxaetyoazqzdbu4mmyltigzq",
        txHash: "0xijkl...mnop",
        tokenId: "2",
        licenseTypes: ["non-commercial"],
        publishedAt: Date.now() - 14 * 24 * 60 * 60 * 1000, // 14 days ago
        explorerUrl:
          "https://aeneid.explorer.story.foundation/ipa/0x2139d4C281A07fd0311c118b02D396A764894E34",
      },
    ];

    // Combine real bookmarked stories with mock data
    const allBookmarked = [...bookmarkedPublished];

    // Add mock stories if we don't have enough bookmarked stories
    if (allBookmarked.length === 0) {
      allBookmarked.push(...mockBookmarkedStories);
    }

    setBookmarkedStoriesData(allBookmarked);
  }, [bookmarkedStories, publishedStories]);

  const getReadingProgress = (storyId: string) => {
    return readingProgress.find((p) => p.storyId === storyId);
  };

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return "Less than an hour ago";
  };

  const getLicenseColor = (license: string) => {
    switch (license) {
      case "commercial-use":
        return "bg-green-100 text-green-800";
      case "commercial-remix":
        return "bg-blue-100 text-blue-800";
      case "non-commercial":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (bookmarkedStoriesData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <BookmarkIcon className='h-5 w-5' />
            Bookmarked Stories
          </CardTitle>
          <CardDescription>Stories you&apos;ve saved to read later</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='text-center py-8 text-muted-foreground'>
            <BookmarkIcon className='h-12 w-12 mx-auto mb-4 opacity-50' />
            <p>No bookmarked stories yet</p>
            <p className='text-sm'>
              Discover and bookmark stories to read them later
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <BookmarkIcon className='h-5 w-5' />
          Bookmarked Stories
          <Badge variant='secondary'>{bookmarkedStoriesData.length}</Badge>
        </CardTitle>
        <CardDescription>Stories you&apos;ve saved to read later</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {bookmarkedStoriesData.map((story) => {
            const progress = getReadingProgress(story.ipId);

            return (
              <div key={story.ipId} className='border rounded-lg p-4 space-y-3'>
                <div className='flex justify-between items-start'>
                  <div className='flex-1'>
                    <h3 className='font-semibold text-lg'>{story.title}</h3>
                    <p className='text-muted-foreground text-sm line-clamp-2'>
                      {story.description}
                    </p>
                    <div className='flex items-center gap-2 mt-2 text-sm text-muted-foreground'>
                      <span>by {story.author.name}</span>
                      <span>•</span>
                      <span>{formatTimeAgo(story.publishedAt)}</span>
                    </div>
                  </div>
                  <Badge className={getLicenseColor(story.licenseTypes[0])}>
                    {story.licenseTypes[0].replace("-", " ")}
                  </Badge>
                </div>

                {progress && (
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between text-sm'>
                      <span className='flex items-center gap-1'>
                        <ClockIcon className='h-4 w-4' />
                        Reading Progress
                      </span>
                      <span>{Math.round(progress.progress || 0)}% complete</span>
                    </div>
                    <Progress value={progress.progress || 0} className='h-2' />
                    <p className='text-xs text-muted-foreground'>
                      Last read {formatTimeAgo(progress.lastRead)}
                    </p>
                  </div>
                )}

                <div className='flex gap-2 pt-2'>
                  <Button size='sm' className='flex-1' asChild>
                    <Link href={`/stories/${story.ipId}`}>
                      {(progress?.progress || 0) > 0
                        ? "Continue Reading"
                        : "Start Reading"}
                    </Link>
                  </Button>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => window.open(story.explorerUrl, "_blank")}
                  >
                    <ExternalLinkIcon className='h-4 w-4' />
                  </Button>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() =>
                      window.open(
                        `https://gateway.pinata.cloud/ipfs/${story.contentCID}`,
                        "_blank"
                      )
                    }
                  >
                    View Content
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
