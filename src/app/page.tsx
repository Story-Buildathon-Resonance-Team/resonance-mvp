"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Shield,
  Globe,
  Sparkles,
  Users,
  ArrowRight,
  Star,
  Zap,
  Heart,
  TrendingUp,
  Award,
  Infinity,
  DollarSign,
  Network,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "./Web3Providers";
import { useStoryStore } from "../stores/storyStore";

export default function HomePage() {
  const { isConnected } = useUser();
  const { publishedStories } = useStoryStore();
  const router = useRouter();

  // Automatically redirect logged-in users to dashboard
  useEffect(() => {
    if (isConnected) {
      router.push("/dashboard");
    }
  }, [isConnected, router]);

  // Don't render the landing page if user is connected (they'll be redirected)
  if (isConnected) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-foreground'>Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  // Get the latest published stories for display
  const latestStories = publishedStories
    .sort((a, b) => b.publishedAt - a.publishedAt)
    .slice(0, 2);

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

      {/* Hero Section - Full Viewport */}
      <section className='relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-20'>
        <div className='container mx-auto max-w-7xl'>
          <div className='text-center space-y-12'>
            {/* Badge */}
            <div className='inline-flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-foreground animate-fade-in backdrop-blur-sm'>
              <Sparkles className='h-4 w-4' />
              <span>The Future of Creative Storytelling</span>
              <Sparkles className='h-4 w-4' />
            </div>

            {/* Main Headline */}
            <div className='space-y-8'>
              <h1 className='text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-foregound leading-[0.9] animate-fade-in-up tracking-tight'>
                Stories That Spark Stories
              </h1>

              <p className='text-xl md:text-2xl lg:text-3xl text-foreground max-w-5xl mx-auto leading-relaxed animate-fade-in-up delay-200 font-light'>
                Enter a vibrant world where creativity flows freely. Protect
                your original works, collaborate with fellow writers, and watch
                as your stories inspire endless new possibilities.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className='flex flex-col sm:flex-row items-center justify-center gap-6 pt-8'>
              <Link href='/publish-form'>
                <Button
                  size='lg'
                  className='group px-10 py-6 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 cursor-pointer'
                >
                  <BookOpen className='h-6 w-6 mr-3 group-hover:rotate-12 transition-transform duration-300' />
                  Start Creating
                  <ArrowRight className='h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform duration-300' />
                </Button>
              </Link>
              <Link href='#stories'>
                <Button
                  variant='outline'
                  size='lg'
                  className='px-10 py-6 text-lg font-semibold border-2 hover:bg-primary/10 transition-all duration-300 backdrop-blur-sm cursor-pointer'
                >
                  <Star className='h-5 w-5 mr-2' />
                  Explore Stories
                </Button>
              </Link>
            </div>

            {/* Stats Section */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-12 pt-20 animate-fade-in-up delay-600'>
              <div className='text-center space-y-3'>
                <div className='text-4xl md:text-5xl font-bold text-primary'>
                  ∞
                </div>
                <div className='text-base font-medium text-foreground'>
                  Infinite Possibilities
                </div>
              </div>
              <div className='text-center space-y-3'>
                <div className='text-4xl md:text-5xl font-bold text-primary'>
                  {publishedStories.length || "0"}
                </div>
                <div className='text-base font-medium text-foreground'>
                  Stories Published
                </div>
              </div>
              <div className='text-center space-y-3'>
                <div className='text-4xl md:text-5xl font-bold text-primary'>
                  100%
                </div>
                <div className='text-base font-medium text-foreground'>
                  Ownership Protected
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='relative z-10 py-32 px-6'>
        <div className='container mx-auto max-w-7xl'>
          <div className='text-center mb-20'>
            <div className='inline-flex items-center gap-2 px-6 py-3 bg-accent/10 border border-accent/20 rounded-full text-sm font-medium text-foreground mb-8'>
              <Shield className='h-4 w-4' />
              <span>Why Resonance?</span>
            </div>
            <h2 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-accent bg-clip-text text-foreground/90 mb-6'>
              There's a Better Way to Create
            </h2>
            <p className='text-xl text-foreground max-w-3xl mx-auto'>
              Amazing fictional worlds die with their original stories.
              Characters with endless potential sit unused. Worlds rich enough
              for dozens of stories never get explored. Meanwhile, readers crave
              more from the universes they love.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up delay-600'>
            <Card className='group text-center border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-500 hover:scale-105 hover:shadow-2xl'>
              <CardHeader className='pb-4'>
                <div className='w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-2xl group-hover:rotate-6 transition-transform duration-300'>
                  <Shield className='h-8 w-8 text-white' />
                </div>
                <CardTitle className='text-xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-foreground/90'>
                  Open for collaboration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-foreground leading-relaxed'>
                  Set the terms for how other creators can expand your
                  characters and worlds while maintaining control.
                </p>
              </CardContent>
            </Card>

            <Card className='group text-center border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-500 hover:scale-105 hover:shadow-2xl'>
              <CardHeader className='pb-4'>
                <div className='w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center text-2xl group-hover:rotate-6 transition-transform duration-300'>
                  <Sparkles className='h-8 w-8 text-white' />
                </div>
                <CardTitle className='text-xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-foreground/90'>
                  Creative Discovery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-foreground leading-relaxed'>
                  Readers find new stories in universes they already love, while
                  creators find inspiring foundations to build upon
                </p>
              </CardContent>
            </Card>

            <Card className='group text-center border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-500 hover:scale-105 hover:shadow-2xl'>
              <CardHeader className='pb-4'>
                <div className='w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary via-accent to-primary rounded-2xl flex items-center justify-center text-2xl group-hover:rotate-6 transition-transform duration-300'>
                  <TrendingUp className='h-8 w-8 text-white' />
                </div>
                <CardTitle className='text-xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-foreground/90'>
                  Share Success
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-foreground leading-relaxed'>
                  Story Protocol ensures fair compensation flows to everyone who
                  contributed creative value to your expanding universe.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stories in Motion Section */}
      <section
        id='stories'
        className='relative z-10 py-32 px-6 bg-gradient-to-b from-background to-primary/5'
      >
        <div className='container mx-auto max-w-7xl'>
          <div className='text-center mb-20'>
            <div className='inline-flex items-center gap-2 px-6 py-3 bg-accent/10 border border-accent/20 rounded-full text-sm font-medium text-foreground mb-8'>
              <TrendingUp className='h-4 w-4' />
              <span>Live Community</span>
            </div>
            <h2 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-accent bg-clip-text text-foreground mb-6'>
              Stories in Motion
            </h2>
            <p className='text-xl text-foreground max-w-3xl mx-auto'>
              Discover the most collaborative stories and remixes shaping our
              creative community.
            </p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {latestStories.length > 0 ? (
              // Show latest published stories
              latestStories.map((story, index) => (
                <Card
                  key={story.ipId}
                  className='overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border-0 bg-card/80 backdrop-blur-sm'
                >
                  <div className='h-56 relative overflow-hidden'>
                    {story.imageCID ? (
                      <img
                        src={`https://gateway.pinata.cloud/ipfs/${story.imageCID}`}
                        alt={story.title}
                        className='w-full h-full object-cover object-[50%_25%] group-hover:scale-110 transition-transform duration-500'
                      />
                    ) : (
                      <div
                        className={`h-full bg-gradient-to-br ${
                          index === 0
                            ? "from-primary via-primary to-accent"
                            : "from-accent via-accent to-primary"
                        } relative`}
                      >
                        <div className='absolute inset-0 bg-black/20'></div>
                        <div className='absolute inset-0 flex items-center justify-center'>
                          <div className='flex space-x-3'>
                            <div className='w-3 h-3 bg-white/60 rounded-full animate-pulse'></div>
                            <div className='w-3 h-3 bg-white/80 rounded-full animate-pulse delay-100'></div>
                            <div className='w-3 h-3 bg-white/60 rounded-full animate-pulse delay-200'></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className='absolute top-4 right-4'>
                      <Badge className='bg-white/90 text-primary border-0 font-semibold shadow-lg'>
                        {story.originalStoryId ? (
                          <>
                            <Sparkles className='h-3 w-3 mr-1' />
                            Latest Remix
                          </>
                        ) : (
                          <>
                            <Star className='h-3 w-3 mr-1' />
                            Latest Story
                          </>
                        )}
                      </Badge>
                    </div>
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                  </div>
                  <CardHeader className='pb-3'>
                    <CardTitle className='text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors'>
                      {story.title}
                    </CardTitle>
                    <span className='text-primary font-semibold'>
                      by {story.author.name}
                    </span>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <p className='text-foreground line-clamp-3 leading-relaxed'>
                      {story.description}
                    </p>
                    <div className='flex items-center justify-between text-sm'>
                      <div className='flex items-center gap-2'>
                        <Badge variant='outline' className='text-xs'>
                          <BookOpen className='h-3 w-3 mr-1' />
                          {story.licenseType === "non-commercial"
                            ? "Non-Commercial"
                            : story.licenseType === "commercial-use"
                            ? "Commercial Use"
                            : "Commercial Remix"}
                        </Badge>
                      </div>
                    </div>
                    <div className='pt-2'>
                      <Link href={`/stories/${story.ipId}`}>
                        <Button
                          variant='default'
                          size='sm'
                          className='w-full group/btn cursor-pointer'
                        >
                          <BookOpen className='h-4 w-4 mr-2 group-hover/btn:rotate-12 transition-transform' />
                          Read Story
                          <ArrowRight className='h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform' />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Fallback to hardcoded examples when no stories are published
              <>
                {/* Top Story Card - First Humans */}
                <Card className='overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border-0 bg-card/80 backdrop-blur-sm'>
                  <div className='h-56 relative overflow-hidden'>
                    <img
                      src='https://gateway.pinata.cloud/ipfs/bafybeigrawa3glvh6rephb2xfzt5lwed2eghjmfbpafgyyvzdpqf3x7gku'
                      alt='First Humans: Temple of Origins'
                      className='w-full h-full object-cover object-[50%_25%] group-hover:scale-110 transition-transform duration-500'
                    />
                    <div className='absolute top-4 right-4'>
                      <Badge className='bg-white/90 text-primary border-0 font-semibold shadow-lg'>
                        <Award className='h-3 w-3 mr-1' />
                        Top Story
                      </Badge>
                    </div>
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                  </div>
                  <CardHeader className='pb-3'>
                    <CardTitle className='text-xl font-bold group-hover:text-primary transition-colors'>
                      First Humans: Temple of Origins
                    </CardTitle>
                    <span className='text-primary font-semibold'>by Nat</span>
                  </CardHeader>
                  <CardContent className='flex flex-col justify-between space-y-4'>
                    <p className='text-foreground leading-relaxed'>
                      Ji-Won and Lee-Hyun, members of an advanced ancient
                      civilization, must separate as she joins a secret
                      colonization mission while he stays behind to guide
                      humanity's development through hidden genetic codes.
                    </p>
                    <div className='flex items-center justify-between text-sm'>
                      <div className='flex items-center gap-3'>
                        <Badge variant='outline' className='text-xs'>
                          <Users className='h-3 w-3 mr-1' />
                          12 Collaborators
                        </Badge>
                        <Badge variant='outline' className='text-xs'>
                          <Heart className='h-3 w-3 mr-1' />
                          2.3k Tips
                        </Badge>
                      </div>
                    </div>
                    <div className='pt-2'>
                      <Link href='/stories/0xb07834B2d74cf0F64302a08976c4B3f2F623A4fC'>
                        <Button
                          variant='default'
                          size='sm'
                          className='w-full group/btn cursor-pointer'
                        >
                          <BookOpen className='h-4 w-4 mr-2 group-hover/btn:rotate-12 transition-transform' />
                          Read Story
                          <ArrowRight className='h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform' />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                {/* Top Remix Card - The Architect's Burden */}
                <Card className='overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border-0 bg-card/80 backdrop-blur-sm'>
                  <div className='h-56 relative overflow-hidden'>
                    <img
                      src='https://gateway.pinata.cloud/ipfs/bafybeid57w42yhoagkkuesyc36nk5h4pln2pq7v363ipsn7zkce5jvlvpe'
                      alt="The Architect's Burden"
                      className='w-full h-full object-cover object-[50%_30%] group-hover:scale-110 transition-transform duration-500'
                    />
                    <div className='absolute top-4 right-4'>
                      <Badge className='bg-white/90 text-primary border-0 font-semibold shadow-lg'>
                        <Sparkles className='h-3 w-3 mr-1' />
                        Top Remix
                      </Badge>
                    </div>
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                  </div>
                  <CardHeader className='pb-3'>
                    <CardTitle className='text-xl font-bold group-hover:text-primary transition-colors'>
                      The Architect's Burden
                    </CardTitle>
                    <span className='text-primary font-semibold'>by Nat</span>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <p className='text-foreground leading-relaxed'>
                      In a last-ditch effort to restore Earth's dying
                      ecosystems, Dr. Elena Vasquez builds a machine that
                      demands a human sacrifice to seed new life. But as the
                      device awakens with a mind of its own, she realizes...
                    </p>
                    <div className='flex items-center justify-between text-sm'>
                      <div className='flex items-center gap-3'>
                        <Badge variant='outline' className='text-xs'>
                          <Users className='h-3 w-3 mr-1' />8 Collaborators
                        </Badge>
                        <Badge variant='outline' className='text-xs'>
                          <Heart className='h-3 w-3 mr-1' />
                          1.8k Tips
                        </Badge>
                      </div>
                    </div>
                    <div className='pt-2'>
                      <Link href='/stories/0xca5f2e51677519C47C465D5500Bd392efE576bF2'>
                        <Button
                          variant='default'
                          size='sm'
                          className='w-full group/btn cursor-pointer'
                        >
                          <BookOpen className='h-4 w-4 mr-2 group-hover/btn:rotate-12 transition-transform' />
                          Read Story
                          <ArrowRight className='h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform' />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className='relative z-10 py-32 px-6'>
        <div className='container mx-auto max-w-7xl'>
          <div className='text-center mb-20'>
            <h2 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-accent bg-clip-text text-foreground mb-6'>
              Community Impact
            </h2>
            <p className='text-xl text-foreground max-w-3xl mx-auto mb-6'>
              Be part of a platform where creative collaboration leads to better
              discovery. The more remixes and derivative works, the greater the
              resonance.
            </p>
            <p className='text-xl text-foreground max-w-3xl mx-auto'>
              Your best fictional creations—the characters you spent months
              developing, the worlds you built from nothing—deserve to inspire
              other creators.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up delay-600'>
            <Card className='group text-center border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-500 hover:scale-105 hover:shadow-2xl'>
              <CardHeader className='pb-4'>
                <div className='w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-2xl group-hover:rotate-6 transition-transform duration-300'>
                  <Eye className='h-8 w-8 text-white' />
                </div>
                <CardTitle className='text-xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-foreground/90'>
                  Explore
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-foreground leading-relaxed'>
                  Discover origin stories, spin-offs, and adventures you never
                  imagined for the characters you created.
                </p>
              </CardContent>
            </Card>

            <Card className='group text-center border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-500 hover:scale-105 hover:shadow-2xl'>
              <CardHeader className='pb-4'>
                <div className='w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center text-2xl group-hover:rotate-6 transition-transform duration-300'>
                  <Network className='h-8 w-8 text-white' />
                </div>
                <CardTitle className='text-xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-foreground/90'>
                  Connect
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-foreground leading-relaxed'>
                  Collaborate with writers who understand and expand your
                  vision, building lasting creative relationships.
                </p>
              </CardContent>
            </Card>

            <Card className='group text-center border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-500 hover:scale-105 hover:shadow-2xl'>
              <CardHeader className='pb-4'>
                <div className='w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary via-accent to-primary rounded-2xl flex items-center justify-center text-2xl group-hover:rotate-6 transition-transform duration-300'>
                  <DollarSign className='h-8 w-8 text-white' />
                </div>
                <CardTitle className='text-xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-foreground/90'>
                  Earn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-foreground leading-relaxed'>
                  Build revenue streams that grow as your universe expands,
                  earning from every story your world inspires.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer Call-to-Action Section */}
      <section className='relative z-10 py-32 px-6'>
        <div className='container mx-auto max-w-7xl'>
          <Card className='border-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 backdrop-blur-sm p-16'>
            <CardContent className='text-center space-y-12'>
              <div className='space-y-8'>
                <div className='inline-flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-foreground backdrop-blur-sm'>
                  <Infinity className='h-4 w-4' />
                  <span>Create Your First Story</span>
                  <Infinity className='h-4 w-4' />
                </div>

                <h2 className='text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-foreground leading-tight'>
                  Ready to Leave Your Mark?
                </h2>

                <p className='text-xl md:text-2xl text-foreground max-w-4xl mx-auto leading-relaxed font-light'>
                  Join a community where creativity multiplies and every story
                  has the potential to become a universe. Your imagination is
                  the only limit.
                </p>
              </div>

              <div className='flex flex-col sm:flex-row items-center justify-center gap-6 pt-8'>
                <Link href='/publish-form'>
                  <Button
                    size='lg'
                    className='group px-10 py-6 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 cursor-pointer'
                  >
                    <BookOpen className='h-6 w-6 mr-3 group-hover:rotate-12 transition-transform duration-300' />
                    Start Creating
                    <ArrowRight className='h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform duration-300' />
                  </Button>
                </Link>
                <Link href='#stories'>
                  <Button
                    variant='outline'
                    size='lg'
                    className='px-10 py-6 text-lg font-semibold border-2 hover:bg-primary/10 transition-all duration-300 backdrop-blur-sm cursor-pointer'
                  >
                    <Star className='h-5 w-5 mr-2' />
                    Explore Stories
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
