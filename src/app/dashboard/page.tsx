"use client";

import { useEffect, useState } from "react";
import { useUser } from "../Web3Providers";
import { useRouter } from "next/navigation";
import { useStoryStore } from "@/stores/storyStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Sparkles,
  Heart,
} from "lucide-react";
import { DraftsList } from "@/components/DraftsList";
import { PublishedStoriesList } from "@/components/PublishedStoriesList";
import RemixedStoriesList from "@/components/RemixedStoriesList";
import BookmarkedStoriesList from "@/components/BookmarkedStoriesList";
import DashboardDataSeeder from "@/components/DashboardDataSeeder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardPage() {
  const { isConnected } = useUser();
  const router = useRouter();
  const { publishedStories, remixedStories, bookmarkedStories } = useStoryStore();
  const [activeTab, setActiveTab] = useState("drafts");

  // Automatically redirect non-logged-in users to home
  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  // Don't render the dashboard if user is not connected (they'll be redirected)
  if (!isConnected) {
    return null;
  }

  return (
    <div className='w-full'>
      {/* Animated Background Elements */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none z-0'>
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute top-3/4 right-1/4 w-[32rem] h-[32rem] bg-accent/6 rounded-full blur-3xl animate-pulse delay-1000'></div>
        <div className='absolute top-1/2 left-1/2 w-64 h-64 bg-primary/12 rounded-full blur-2xl animate-bounce delay-500'></div>
        <div className='absolute top-10 right-10 w-48 h-48 bg-accent/8 rounded-full blur-2xl animate-pulse delay-700'></div>
        <div className='absolute bottom-20 left-10 w-80 h-80 bg-primary/6 rounded-full blur-3xl animate-pulse delay-300'></div>
      </div>

      {/* Dashboard Content */}
      <div className='relative z-10 min-h-screen px-6 py-10'>
        <div className='container mx-auto max-w-7xl'>
          {/* Header Section */}
          <div className='text-center space-y-12 mb-16'>
            <div className='space-y-8'>
              <h1 className='text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-foreground leading-[0.9] animate-fade-in-up tracking-tight'>
                Your Creative Universe
              </h1>

              <p className='text-xl md:text-2xl text-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200 font-light'>
                Manage your stories, track remixes, and discover new
                collaborations. Your creative journey starts here.
              </p>
            </div>

            {/* Stats Section */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up delay-600'>
              <Card className='group text-center border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-500 hover:scale-105 hover:shadow-2xl'>
                <CardHeader className='pb-4'>
                  <div className='w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-2xl group-hover:rotate-6 transition-transform duration-300'>
                    <BookOpen className='h-8 w-8 text-white' />
                  </div>
                  <CardTitle className='text-xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-foreground/90'>
                    Your Stories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-4xl font-bold text-primary mb-2'>
                    {publishedStories.length}
                  </p>
                  <p className='text-foreground leading-relaxed'>
                    Original stories published
                  </p>
                </CardContent>
              </Card>

              <Card className='group text-center border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-500 hover:scale-105 hover:shadow-2xl'>
                <CardHeader className='pb-4'>
                  <div className='w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center text-2xl group-hover:rotate-6 transition-transform duration-300'>
                    <Sparkles className='h-8 w-8 text-white' />
                  </div>
                  <CardTitle className='text-xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-foreground/90'>
                    Remixes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-4xl font-bold text-primary mb-2'>
                    {remixedStories.length}
                  </p>
                  <p className='text-foreground leading-relaxed'>
                    Stories remixed from yours
                  </p>
                </CardContent>
              </Card>

              <Card className='group text-center border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-500 hover:scale-105 hover:shadow-2xl'>
                <CardHeader className='pb-4'>
                  <div className='w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary via-accent to-primary rounded-2xl flex items-center justify-center text-2xl group-hover:rotate-6 transition-transform duration-300'>
                    <Heart className='h-8 w-8 text-white' />
                  </div>
                  <CardTitle className='text-xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-foreground/90'>
                    Bookmarks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-4xl font-bold text-primary mb-2'>
                    {bookmarkedStories.length}
                  </p>
                  <p className='text-foreground leading-relaxed'>
                    Stories you&apos;ve saved
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tabs Section */}
          <Tabs
            defaultValue='drafts'
            value={activeTab}
            onValueChange={setActiveTab}
            className='space-y-8'
          >
            <TabsList className='grid w-full grid-cols-4'>
              <TabsTrigger value='drafts'>Drafts</TabsTrigger>
              <TabsTrigger value='published'>Published</TabsTrigger>
              <TabsTrigger value='remixed'>Remixed</TabsTrigger>
              <TabsTrigger value='bookmarked'>Bookmarked</TabsTrigger>
            </TabsList>

            <TabsContent value='drafts' className='space-y-8'>
              <DraftsList />
            </TabsContent>

            <TabsContent value='published' className='space-y-8'>
              <PublishedStoriesList />
            </TabsContent>

            <TabsContent value='remixed' className='space-y-8'>
              <RemixedStoriesList />
            </TabsContent>

            <TabsContent value='bookmarked' className='space-y-8'>
              <BookmarkedStoriesList />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Development Only: Data Seeder */}
      <DashboardDataSeeder />
    </div>
  );
}
