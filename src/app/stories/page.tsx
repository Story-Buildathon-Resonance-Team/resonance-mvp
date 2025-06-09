"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  ExternalLink, 
  User, 
  Calendar,
  FileText,
  Globe
} from "lucide-react";
import { users } from "../../data/user";
import Link from "next/link";

export default function StoriesPage() {
  // Get all published stories from user data
  const allStories = users.flatMap(user => 
    user.stories
      .filter(story => story.ipId && story.title) // Only show completed stories
      .map(story => ({
        ...story,
        author: user.userName || user.walletAddress.slice(0, 8) + "...",
        authorAddress: user.walletAddress
      }))
  );

  const getIPFSUrl = (cid: string) => `https://gateway.pinata.cloud/ipfs/${cid}`;
  const getExplorerUrl = (ipId: string) => `https://aeneid.explorer.story.foundation/ipa/${ipId}`;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <br /><br />
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <h1 className="text-3xl font-bold">Published Stories</h1>
        </div>
        <p className="text-xl text-muted-foreground">
          Discover stories registered as IP assets on Story Protocol.
        </p>
      </div>

      {/* Stories Grid */}
      {allStories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allStories.map((story, index) => (
            <Card key={story.ipId || index} className="flex flex-col h-full">
              {/* Cover Image */}
              {story.imageCID && (
                <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                  <img
                    src={getIPFSUrl(story.imageCID)}
                    alt={story.title || "Story cover"}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <CardHeader className="flex-1">
                <CardTitle className="line-clamp-2">
                  {story.title || "Untitled Story"}
                </CardTitle>
                {story.synopsis && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {story.synopsis}
                  </p>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Author Info */}
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" />
                  <span>{story.author}</span>
                </div>

                {/* License Badge */}
                <Badge variant="secondary" className="w-fit">
                  Non-Commercial Social Remixing
                </Badge>

                {/* IP Asset Info */}
                {story.ipId && (
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">
                      <strong>IP Asset ID:</strong>
                      <br />
                      <code className="text-xs">{story.ipId}</code>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  {story.contentCID && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => window.open(getIPFSUrl(story.contentCID), '_blank')}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Read Story
                    </Button>
                  )}
                  
                  {story.ipId && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(getExplorerUrl(story.ipId), '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* IPFS Links */}
                <div className="text-xs text-muted-foreground space-y-1">
                  {story.ipMetadataCID && (
                    <div className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      <a 
                        href={getIPFSUrl(story.ipMetadataCID)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        IP Metadata
                      </a>
                    </div>
                  )}
                  {story.nftMetadataCID && (
                    <div className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      <a 
                        href={getIPFSUrl(story.nftMetadataCID)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        NFT Metadata
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center p-8">
          <CardContent>
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Stories Published Yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to publish a story as an IP asset!
            </p>
            <Link href="/publish-form">
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Publish Your Story
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Call to Action */}
      <Card className="text-center p-6 bg-primary/5 border-primary/20">
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">Ready to Share Your Story?</h3>
          <p className="text-muted-foreground mb-4">
            Register your fiction as intellectual property and join the decentralized storytelling revolution.
          </p>
          <Link href="/publish-form">
            <Button>
              <BookOpen className="h-4 w-4 mr-2" />
              Publish Your Story
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}