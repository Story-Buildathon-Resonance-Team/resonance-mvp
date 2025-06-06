"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Upload, 
  Shield, 
  Globe, 
  ArrowRight,
  Sparkles,
  FileText,
  Users,
  Droplets,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { useUser } from "./Web3Providers";

export default function HomePage() {
  const { isConnected, userName } = useUser();

  return (
    <div className='flex flex-col items-center justify-center min-h-screen space-y-8'>
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-2xl">
        <div className="flex items-center justify-center gap-2 mb-4">
          <h1 className="text-5xl font-bold">Stories That
          Spark Stories</h1>
        </div>
        <p className="text-xl text-muted-foreground">
          Enter a vibrant world where creativity flows freely. Protect your original works, collaborate with fellow writers, and watch as your stories inspire endless new possibilities.
        </p>
        <p className="text-gray-600">
        Decentralized storytelling platform powered by Story Protocol, Pinata, and Tomo
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        <Card className="text-center">
          <CardHeader>
            <Shield className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <CardTitle className="text-lg">Secure & Share</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
            Blockchain-powered protection through Story Protocol ensures your creative work is safe while encouraging collaborative remixing and building on your ideas.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <Globe className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <CardTitle className="text-lg">Creative Playground</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Transform existing narratives, spawn new characters, or create entirely fresh worlds. Every story becomes a launching pad for imagination.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <CardTitle className="text-lg">Community Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Stories rise in popularity based on their collaborative power. The more remixes and derivative works, the greater the resonance.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stories in Motion Section */}
      <div className="w-full max-w-6xl space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Stories in Motion</h2>
          <p className="text-lg text-muted-foreground">
            Discover the most collaborative stories and remixes shaping our creative community
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Story Card */}
          <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="h-48 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 relative">
              <div className="absolute top-4 right-4">
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  Top Story
                </Badge>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                </div>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-xl">The Quantum Gardens</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                In a world where reality bends through botanical manipulation, Maya discovers her grandmother's secret garden holds the key to rewriting the laws of physics. A story that has blossomed into 12 unique interpretations.
              </p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-green-600">
                    <Users className="h-4 w-4" />
                    <span>12 Collaborators</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-600">
                    <Droplets className="h-4 w-4" />
                    <span>2.3k Tips</span>
                  </div>
                </div>
                <span className="text-blue-600 font-medium">by Elena Rodriguez</span>
              </div>
            </CardContent>
          </Card>

          {/* Top Remix Card */}
          <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="h-48 bg-gradient-to-br from-teal-400 via-teal-500 to-emerald-600 relative">
              <div className="absolute top-4 right-4">
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  Top Remix
                </Badge>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                </div>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-xl">Quantum Gardens: The Underground</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                A thrilling remix exploring the dark underbelly of Maya's world, where rogue botanists use quantum flora for corporate espionage. This interpretation has sparked 8 new derivative works of its own.
              </p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-green-600">
                    <Users className="h-4 w-4" />
                    <span>8 Collaborators</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-600">
                    <Droplets className="h-4 w-4" />
                    <span>1.8k Tips</span>
                  </div>
                </div>
                <span className="text-blue-600 font-medium">by Marcus Chen</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Action Card */}
      <Card className='max-w-2xl w-full'>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Get Started
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isConnected ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Connected as {userName}
                </Badge>
              </div>
              <p className='text-gray-700'>
                You're connected and ready to publish your stories as intellectual property assets!
              </p>
              <div className="flex gap-3">
                <Link href="/publish-form">
                  <Button className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Publish Story
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/stories">
                  <Button variant="outline" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    View Stories
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className='text-gray-700'>
                Connect your wallet to start publishing stories and registering them as IP assets on the blockchain.
              </p>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">What you can do:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Publish fiction stories with cover images</li>
                  <li>• Register stories as IP assets on Story Protocol</li>
                  <li>• Choose licensing terms (non-commercial or commercial)</li>
                  <li>• Store content permanently on IPFS</li>
                  <li>• Enable others to create derivatives of your work</li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground">
                Click the "Login" button in the top right to connect your wallet and get started.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Technology Stack */}
      <div className="text-center space-y-2 max-w-2xl">
        <p className="text-sm text-muted-foreground">Powered by</p>
        <div className="flex items-center justify-center gap-4 text-sm">
          <Badge variant="secondary">Story Protocol</Badge>
          <Badge variant="secondary">Pinata IPFS</Badge>
          <Badge variant="secondary">Tomo EVM Kit</Badge>
          <Badge variant="secondary">Next.js</Badge>
        </div>
      </div>
    </div>
  );
}
