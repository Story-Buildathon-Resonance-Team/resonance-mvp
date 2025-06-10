"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Shield,
  Globe,
  Sparkles,
  Users,
  Droplets,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "./Web3Providers";
import { useStoryStore } from "../stores/storyStore";

export default function HomePage() {
  const { isConnected } = useUser();
  const { publishedStories } = useStoryStore();

  // Get the latest published stories for display
  const latestStories = publishedStories
    .sort((a, b) => b.publishedAt - a.publishedAt)
    .slice(0, 2);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen space-y-8'>
      {/* Hero Section */}
      <div className='text-center space-y-4 max-w-6xl mt-20 mb-20'>
        <div className='flex items-center justify-center gap-2 mb-4'>
          <h1 className='text-5xl font-bold'>Stories That Spark Stories</h1>
        </div>
        <p className='text-xl text-muted-foreground'>
          Enter a vibrant world where creativity flows freely. Protect your
          original works, collaborate with fellow writers, and watch as your
          stories inspire endless new possibilities.
        </p>
        <p className='text-gray-600'>
          Decentralized storytelling platform powered by Story Protocol, Pinata,
          and Tomo
        </p>
      </div>

      {/* Feature Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full mt-12 mb-16'>
        <Card className='text-center'>
          <CardHeader>
              🔐
              <br />
            <CardTitle className='text-lg'>Secure & Share</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground'>
              Blockchain-powered protection through Story Protocol ensures your
              creative work is safe while encouraging collaborative remixing and
              building on your ideas.
            </p>
          </CardContent>
        </Card>

        <Card className='text-center'>
          <CardHeader>
            🎨
            <br />
            <CardTitle className='text-lg'>Creative Playground</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground'>
              Transform existing narratives, spawn new characters, or create
              entirely fresh worlds. Every story becomes a launching pad for
              imagination.
            </p>
          </CardContent>
        </Card>

        <Card className='text-center'>
          <CardHeader>
            🌟
            <br />
            <CardTitle className='text-lg'>Community Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground'>
              Stories rise in popularity based on their collaborative power. The
              more remixes and derivative works, the greater the resonance.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stories in Motion Section */}
      <div className='w-full max-w-6xl space-y-6 mt-20 mb-20'>
        <div className='text-center space-y-2'>
          <h2 className='text-3xl font-bold'>Stories in Motion</h2>
          <p className='text-lg text-muted-foreground'>
            Discover the most collaborative stories and remixes shaping our
            creative community
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {latestStories.length > 0 ? (
            // Show latest published stories
            latestStories.map((story, index) => (
              <Card key={story.ipId} className='overflow-hidden group hover:shadow-lg transition-all duration-300'>
                <div className='h-48 relative overflow-hidden'>
                  {story.imageCID ? (
                    <img
                      src={`https://gateway.pinata.cloud/ipfs/${story.imageCID}`}
                      alt={story.title}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <div className={`h-full bg-gradient-to-br ${index === 0 ? 'from-primary via-primary to-accent' : 'from-accent via-accent to-primary'}`}>
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <div className='flex space-x-2'>
                          <div className='w-2 h-2 bg-white/40 rounded-full'></div>
                          <div className='w-2 h-2 bg-white/60 rounded-full'></div>
                          <div className='w-2 h-2 bg-white/40 rounded-full'></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className='absolute top-4 right-4'>
                    <Badge className='bg-white/20 text-white border-white/30 hover:bg-white/30'>
                      {story.originalStoryId ? 'Latest Remix' : 'Latest Story'}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className='text-xl line-clamp-2'>{story.title}</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <p className='text-muted-foreground line-clamp-3'>
                    {story.description}
                  </p>
                  <div className='flex items-center justify-between text-sm'>
                    <div className='flex items-center gap-4'>
                      <div className='flex items-center gap-1 text-primary'>
                        <BookOpen className='h-4 w-4' />
                        <span>{story.licenseType === 'non-commercial' ? 'Non-Commercial' : story.licenseType === 'commercial-use' ? 'Commercial Use' : 'Commercial Remix'}</span>
                      </div>
                    </div>
                    <span className='text-primary font-medium'>
                      by {story.author.name}
                    </span>
                  </div>
                  <div className='pt-2'>
                    <Link href={`/stories/${story.ipId}`}>
                      <Button variant="outline" size="sm" className='w-full'>
                        Read Story
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            // Fallback to hardcoded examples when no stories are published
            <>
              {/* Top Story Card */}
              <Card className='overflow-hidden group hover:shadow-lg transition-all duration-300'>
                <div className='h-48 bg-gradient-to-br from-primary via-primary to-accent relative'>
                  <div className='absolute top-4 right-4'>
                    <Badge className='bg-white/20 text-white border-white/30 hover:bg-white/30'>
                      Top Story
                    </Badge>
                  </div>
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='flex space-x-2'>
                      <div className='w-2 h-2 bg-white/40 rounded-full'></div>
                      <div className='w-2 h-2 bg-white/60 rounded-full'></div>
                      <div className='w-2 h-2 bg-white/40 rounded-full'></div>
                    </div>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className='text-xl'>The Quantum Gardens</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <p className='text-muted-foreground'>
                    In a world where reality bends through botanical manipulation,
                    Maya discovers her grandmother's secret garden holds the key to
                    rewriting the laws of physics. A story that has blossomed into
                    12 unique interpretations.
                  </p>
                  <div className='flex items-center justify-between text-sm'>
                    <div className='flex items-center gap-4'>
                      <div className='flex items-center gap-1 text-primary'>
                        <Users className='h-4 w-4' />
                        <span>12 Collaborators</span>
                      </div>
                      <div className='flex items-center gap-1 text-primary'>
                        <Droplets className='h-4 w-4' />
                        <span>2.3k Tips</span>
                      </div>
                    </div>
                    <span className='text-primary font-medium'>
                      by Elena Rodriguez
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Top Remix Card */}
              <Card className='overflow-hidden group hover:shadow-lg transition-all duration-300'>
                <div className='h-48 bg-gradient-to-br from-accent via-accent to-primary relative'>
                  <div className='absolute top-4 right-4'>
                    <Badge className='bg-white/20 text-white border-white/30 hover:bg-white/30'>
                      Top Remix
                    </Badge>
                  </div>
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='flex space-x-2'>
                      <div className='w-2 h-2 bg-white/40 rounded-full'></div>
                      <div className='w-2 h-2 bg-white/60 rounded-full'></div>
                      <div className='w-2 h-2 bg-white/40 rounded-full'></div>
                    </div>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className='text-xl'>
                    Quantum Gardens: The Underground
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <p className='text-muted-foreground'>
                    A thrilling remix exploring the dark underbelly of Maya's world,
                    where rogue botanists use quantum flora for corporate espionage.
                    This interpretation has sparked 8 new derivative works of its
                    own.
                  </p>
                  <div className='flex items-center justify-between text-sm'>
                    <div className='flex items-center gap-4'>
                      <div className='flex items-center gap-1 text-primary'>
                        <Users className='h-4 w-4' />
                        <span>8 Collaborators</span>
                      </div>
                      <div className='flex items-center gap-1 text-primary'>
                        <Droplets className='h-4 w-4' />
                        <span>1.8k Tips</span>
                      </div>
                    </div>
                    <span className='text-primary font-medium'>
                      by Marcus Chen
                    </span>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Footer Call-to-Action Section */}
      <div className='w-full max-w-6xl text-center space-y-6 mt-20 mb-16'>
        <div className='space-y-4'>
          <h2 className='text-4xl font-bold'>Ready to Begin Your Story?</h2>
          <p className='text-lg text-muted-foreground max-w-4xl mx-auto'>
            Join a community where creativity multiplies and every story has the
            potential to become a universe.
          </p>
        </div>

        <div className='pt-4'>
          {isConnected ? (
            <Link href='/publish-form'>
              <Button size='lg'>
                Start Creating
              </Button>
            </Link>
          ) : (
            <Button size='lg'>
              Start Creating
            </Button>
          )}
        </div>

        {/* Technology Stack */}
        <div className='pt-12 space-y-2'>
          <p className='text-sm text-muted-foreground'>Powered by</p>
          <div className='flex items-center justify-center gap-4 text-sm'>
            <Badge variant='secondary'>Story Protocol</Badge>
            <Badge variant='secondary'>Pinata IPFS</Badge>
            <Badge variant='secondary'>Tomo EVM Kit</Badge>
            <Badge variant='secondary'>Next.js</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
