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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  // Get the latest published stories for display
  const latestStories = publishedStories
    .sort((a, b) => b.publishedAt - a.publishedAt)
    .slice(0, 2);

  return (
    <div className="w-full">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-[32rem] h-[32rem] bg-accent/6 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary/12 rounded-full blur-2xl animate-bounce delay-500"></div>
        <div className="absolute top-10 right-10 w-48 h-48 bg-accent/8 rounded-full blur-2xl animate-pulse delay-700"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-primary/6 rounded-full blur-3xl animate-pulse delay-300"></div>
      </div>

      {/* Hero Section - Full Viewport */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center space-y-12">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary animate-fade-in backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              <span>The Future of Creative Storytelling</span>
              <Sparkles className="h-4 w-4" />
            </div>

            {/* Main Headline */}
            <div className="space-y-8">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent leading-[0.9] animate-fade-in-up tracking-tight">
                Stories That Spark
                <br />
                <span className="relative inline-block">
                  Stories
                  <div className="absolute -bottom-3 left-0 right-0 h-2 bg-gradient-to-r from-primary to-accent rounded-full animate-scale-x"></div>
                </span>
              </h1>

              <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-5xl mx-auto leading-relaxed animate-fade-in-up delay-200 font-light">
                Enter a vibrant world where creativity flows freely. Protect
                your original works, collaborate with fellow writers, and watch
                as your stories inspire endless new possibilities.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 animate-fade-in-up delay-400">
              {isConnected ? (
                <>
                  <Link href="/publish-form">
                    <Button
                      size="lg"
                      className="group px-10 py-6 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                    >
                      <BookOpen className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                      Start Creating
                      <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </Link>
                  <Link href="/stories">
                    <Button
                      variant="outline"
                      size="lg"
                      className="px-10 py-6 text-lg font-semibold border-2 hover:bg-primary/10 transition-all duration-300 backdrop-blur-sm"
                    >
                      <Star className="h-5 w-5 mr-2" />
                      Explore Stories
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button
                    size="lg"
                    className="group px-10 py-6 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  >
                    <BookOpen className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                    Start Creating
                    <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                  <Link href="/stories">
                    <Button
                      variant="outline"
                      size="lg"
                      className="px-10 py-6 text-lg font-semibold border-2 hover:bg-primary/10 transition-all duration-300 backdrop-blur-sm"
                    >
                      <Star className="h-5 w-5 mr-2" />
                      Explore Stories
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Technology Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-12 animate-fade-in-up delay-500">
              <Badge
                variant="secondary"
                className="flex items-center gap-2 px-4 py-2 text-sm backdrop-blur-sm"
              >
                <Shield className="h-4 w-4" />
                Story Protocol
              </Badge>
              <Badge
                variant="secondary"
                className="flex items-center gap-2 px-4 py-2 text-sm backdrop-blur-sm"
              >
                <Globe className="h-4 w-4" />
                Pinata IPFS
              </Badge>
              <Badge
                variant="secondary"
                className="flex items-center gap-2 px-4 py-2 text-sm backdrop-blur-sm"
              >
                <Zap className="h-4 w-4" />
                Tomo EVM
              </Badge>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-20 animate-fade-in-up delay-600">
              <div className="text-center space-y-3">
                <div className="text-4xl md:text-5xl font-bold text-primary">
                  ∞
                </div>
                <div className="text-base font-medium text-muted-foreground">
                  Infinite Possibilities
                </div>
              </div>
              <div className="text-center space-y-3">
                <div className="text-4xl md:text-5xl font-bold text-primary">
                  {publishedStories.length || "0"}
                </div>
                <div className="text-base font-medium text-muted-foreground">
                  Stories Published
                </div>
              </div>
              <div className="text-center space-y-3">
                <div className="text-4xl md:text-5xl font-bold text-primary">
                  100%
                </div>
                <div className="text-base font-medium text-muted-foreground">
                  Ownership Protected
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-accent/10 border border-accent/20 rounded-full text-sm font-medium text-accent mb-8">
              <Shield className="h-4 w-4" />
              <span>Platform Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent mb-6">
              Why Choose Resonance?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the future of storytelling with blockchain-powered
              protection and collaborative creativity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up delay-600">
            <Card className="group text-center border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-2xl group-hover:rotate-6 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  Secure & Share
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Blockchain-powered protection through Story Protocol ensures
                  your creative work is safe while encouraging collaborative
                  remixing and building on your ideas.
                </p>
              </CardContent>
            </Card>

            <Card className="group text-center border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center text-2xl group-hover:rotate-6 transition-transform duration-300">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  Creative Playground
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Transform existing narratives, spawn new characters, or create
                  entirely fresh worlds. Every story becomes a launching pad for
                  imagination.
                </p>
              </CardContent>
            </Card>

            <Card className="group text-center border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary via-accent to-primary rounded-2xl flex items-center justify-center text-2xl group-hover:rotate-6 transition-transform duration-300">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  Community Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Stories rise in popularity based on their collaborative power.
                  The more remixes and derivative works, the greater the
                  resonance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stories in Motion Section */}
      <section className="relative z-10 py-32 px-6 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-accent/10 border border-accent/20 rounded-full text-sm font-medium text-accent mb-8">
              <TrendingUp className="h-4 w-4" />
              <span>Live Community</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent mb-6">
              Stories in Motion
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover the most collaborative stories and remixes shaping our
              creative community
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {latestStories.length > 0 ? (
              // Show latest published stories
              latestStories.map((story, index) => (
                <Card
                  key={story.ipId}
                  className="overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border-0 bg-card/80 backdrop-blur-sm"
                >
                  <div className="h-56 relative overflow-hidden">
                    {story.imageCID ? (
                      <img
                        src={`https://gateway.pinata.cloud/ipfs/${story.imageCID}`}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div
                        className={`h-full bg-gradient-to-br ${
                          index === 0
                            ? "from-primary via-primary to-accent"
                            : "from-accent via-accent to-primary"
                        } relative`}
                      >
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex space-x-3">
                            <div className="w-3 h-3 bg-white/60 rounded-full animate-pulse"></div>
                            <div className="w-3 h-3 bg-white/80 rounded-full animate-pulse delay-100"></div>
                            <div className="w-3 h-3 bg-white/60 rounded-full animate-pulse delay-200"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 text-primary border-0 font-semibold shadow-lg">
                        {story.originalStoryId ? (
                          <>
                            <Sparkles className="h-3 w-3 mr-1" />
                            Latest Remix
                          </>
                        ) : (
                          <>
                            <Star className="h-3 w-3 mr-1" />
                            Latest Story
                          </>
                        )}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                      {story.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                      {story.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          <BookOpen className="h-3 w-3 mr-1" />
                          {story.licenseType === "non-commercial"
                            ? "Non-Commercial"
                            : story.licenseType === "commercial-use"
                            ? "Commercial Use"
                            : "Commercial Remix"}
                        </Badge>
                      </div>
                      <span className="text-primary font-semibold">
                        by {story.author.name}
                      </span>
                    </div>
                    <div className="pt-2">
                      <Link href={`/stories/${story.ipId}`}>
                        <Button
                          variant="default"
                          size="sm"
                          className="w-full group/btn"
                        >
                          <BookOpen className="h-4 w-4 mr-2 group-hover/btn:rotate-12 transition-transform" />
                          Read Story
                          <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
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
                <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border-0 bg-card/80 backdrop-blur-sm">
                  <div className="h-56 bg-gradient-to-br from-primary via-primary to-accent relative">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 text-primary border-0 font-semibold shadow-lg">
                        <Award className="h-3 w-3 mr-1" />
                        Top Story
                      </Badge>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex space-x-3">
                        <div className="w-3 h-3 bg-white/60 rounded-full animate-pulse"></div>
                        <div className="w-3 h-3 bg-white/80 rounded-full animate-pulse delay-100"></div>
                        <div className="w-3 h-3 bg-white/60 rounded-full animate-pulse delay-200"></div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                      The Quantum Gardens
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      In a world where reality bends through botanical
                      manipulation, Maya discovers her grandmother's secret
                      garden holds the key to rewriting the laws of physics. A
                      story that has blossomed into 12 unique interpretations.
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          12 Collaborators
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Heart className="h-3 w-3 mr-1" />
                          2.3k Tips
                        </Badge>
                      </div>
                      <span className="text-primary font-semibold">
                        by Elena Rodriguez
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Top Remix Card */}
                <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border-0 bg-card/80 backdrop-blur-sm">
                  <div className="h-56 bg-gradient-to-br from-accent via-accent to-primary relative">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 text-primary border-0 font-semibold shadow-lg">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Top Remix
                      </Badge>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex space-x-3">
                        <div className="w-3 h-3 bg-white/60 rounded-full animate-pulse"></div>
                        <div className="w-3 h-3 bg-white/80 rounded-full animate-pulse delay-100"></div>
                        <div className="w-3 h-3 bg-white/60 rounded-full animate-pulse delay-200"></div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                      Quantum Gardens: The Underground
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      A thrilling remix exploring the dark underbelly of Maya's
                      world, where rogue botanists use quantum flora for
                      corporate espionage. This interpretation has sparked 8 new
                      derivative works of its own.
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">
                          <Users className="h-3 w-3 mr-1" />8 Collaborators
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Heart className="h-3 w-3 mr-1" />
                          1.8k Tips
                        </Badge>
                      </div>
                      <span className="text-primary font-semibold">
                        by Marcus Chen
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer Call-to-Action Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="container mx-auto max-w-7xl">
          <Card className="border-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 backdrop-blur-sm p-16">
            <CardContent className="text-center space-y-12">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary backdrop-blur-sm">
                  <Infinity className="h-4 w-4" />
                  <span>Your Story Awaits</span>
                  <Infinity className="h-4 w-4" />
                </div>

                <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent leading-tight">
                  Ready to Begin Your Story?
                </h2>

                <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light">
                  Join a community where creativity multiplies and every story
                  has the potential to become a universe. Your imagination is
                  the only limit.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                {isConnected ? (
                  <>
                    <Link href="/publish-form">
                      <Button
                        size="lg"
                        className="group px-10 py-6 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                      >
                        <BookOpen className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                        Start Creating
                        <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </Link>
                    <Link href="/stories">
                      <Button
                        variant="outline"
                        size="lg"
                        className="px-10 py-6 text-lg font-semibold border-2 hover:bg-primary/10 transition-all duration-300 backdrop-blur-sm"
                      >
                        <Star className="h-5 w-5 mr-2" />
                        Explore Stories
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Button
                      size="lg"
                      className="group px-10 py-6 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                    >
                      <BookOpen className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                      Start Creating
                      <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                    <Link href="/stories">
                      <Button
                        variant="outline"
                        size="lg"
                        className="px-10 py-6 text-lg font-semibold border-2 hover:bg-primary/10 transition-all duration-300 backdrop-blur-sm"
                      >
                        <Star className="h-5 w-5 mr-2" />
                        Explore Stories
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              {/* Technology Stack */}
              <div className="pt-12 space-y-6">
                <p className="text-base font-medium text-muted-foreground">
                  Powered by cutting-edge technology
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-2 px-4 py-2 text-sm backdrop-blur-sm"
                  >
                    <Shield className="h-4 w-4" />
                    Story Protocol
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-2 px-4 py-2 text-sm backdrop-blur-sm"
                  >
                    <Globe className="h-4 w-4" />
                    Pinata IPFS
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-2 px-4 py-2 text-sm backdrop-blur-sm"
                  >
                    <Zap className="h-4 w-4" />
                    Tomo EVM Kit
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-2 px-4 py-2 text-sm backdrop-blur-sm"
                  >
                    <BookOpen className="h-4 w-4" />
                    Next.js
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
