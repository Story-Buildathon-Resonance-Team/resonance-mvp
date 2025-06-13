"use client";

import { useUser } from "../Web3Providers";
import { useStoryStore } from "@/stores";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DraftsList } from "@/components/DraftsList";
import { PublishedStoriesList } from "@/components/PublishedStoriesList";
import DashboardDataSeeder from "@/components/DashboardDataSeeder";
import { PlusIcon, FileTextIcon, BookOpenIcon } from "lucide-react";
import { useMemo, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const user = useUser();
  const {
    drafts,
    publishedStories,
    bookmarkedStories,
    remixedStories,
    readingProgress,
  } = useStoryStore();

  const [activeView, setActiveView] = useState<"drafts" | "published">(
    "drafts"
  );

  // Calculate dashboard stats
  const stats = useMemo(() => {
    const totalDrafts = drafts.length;
    const totalPublished = publishedStories.length;
    const totalBookmarked = bookmarkedStories.length;
    const totalRemixes = remixedStories.length;

    // Calculate recent activity (last 7 days)
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentActivity =
      drafts.filter((d) => d.lastSaved > weekAgo).length +
      publishedStories.filter((s) => s.publishedAt > weekAgo).length;

    return {
      totalDrafts,
      totalPublished,
      totalBookmarked,
      totalRemixes,
      recentActivity,
    };
  }, [drafts, publishedStories, bookmarkedStories, remixedStories]);

  if (!user?.isConnected) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <Card className='max-w-md mx-auto'>
          <CardHeader className='text-center'>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Please connect your wallet to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className='text-center'>
            <Button asChild>
              <Link href='/'>Go to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='max-w-6xl mx-auto px-6 py-8'>
      <DashboardDataSeeder />

      {/* Header Section */}
      <div className='mb-8'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6'>
          <div>
            <h1 className='text-3xl font-bold mb-2'>Your Stories</h1>
            <p className='text-muted-foreground'>
              Write, publish, and manage your stories.
            </p>
          </div>

          {/* Primary CTA */}
          <Button asChild size='lg' className='w-fit cursor-pointer'>
            <Link href='/publish-form' className='flex items-center gap-2'>
              <PlusIcon className='h-5 w-5' />
              Write a Story
            </Link>
          </Button>
        </div>

        {/* Quick Stats Row */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
          <div className='text-center p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg'>
            <div className='text-2xl font-bold text-primary'>
              {stats.totalDrafts}
            </div>
            <div className='text-sm text-muted-foreground'>Drafts</div>
          </div>
          <div className='text-center p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg'>
            <div className='text-2xl font-bold text-primary'>
              {stats.totalPublished}
            </div>
            <div className='text-sm text-muted-foreground'>Published</div>
          </div>
          <div className='text-center p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg'>
            <div className='text-2xl font-bold text-primary'>
              {stats.totalBookmarked}
            </div>
            <div className='text-sm text-muted-foreground'>Bookmarked</div>
          </div>
          <div className='text-center p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg'>
            <div className='text-2xl font-bold text-primary'>
              {stats.recentActivity}
            </div>
            <div className='text-sm text-muted-foreground'>This Week</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='space-y-6'>
        {/* Stories Toggle */}
        <div className='flex items-center gap-4'>
          <div className='flex items-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-1'>
            <Button
              variant={activeView === "drafts" ? "default" : "ghost"}
              size='sm'
              onClick={() => setActiveView("drafts")}
              className='relative cursor-pointer'
            >
              <FileTextIcon className='h-4 w-4 mr-2' />
              Drafts
              {stats.totalDrafts > 0 && (
                <Badge variant='secondary' className='ml-2'>
                  {stats.totalDrafts}
                </Badge>
              )}
            </Button>
            <Button
              variant={activeView === "published" ? "default" : "ghost"}
              size='sm'
              onClick={() => setActiveView("published")}
              className='relative cursor-pointer'
            >
              <BookOpenIcon className='h-4 w-4 mr-2' />
              Published
              {stats.totalPublished > 0 && (
                <Badge variant='secondary' className='ml-2'>
                  {stats.totalPublished}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Stories Content */}
        <div className='min-h-[400px]'>
          {activeView === "drafts" ? <DraftsList /> : <PublishedStoriesList />}
        </div>
      </div>
    </div>
  );
}
