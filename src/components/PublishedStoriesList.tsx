"use client";

import { useStoryStore } from "@/stores";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, BookOpen, Calendar } from "lucide-react";
import Link from "next/link";

export function PublishedStoriesList() {
  const { publishedStories } = useStoryStore();

  if (publishedStories.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="text-lg font-semibold">No published stories yet</h3>
            <p className="text-muted-foreground">
              Start by publishing your first story to see it here.
            </p>
            <Link href="/publish-form">
              <Button>Publish Your First Story</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Published Stories</h2>
        <Badge variant="secondary">{publishedStories.length} published</Badge>
      </div>

      <div className="grid gap-6">
        {publishedStories.map((story) => (
          <Card key={story.ipId} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="line-clamp-2">{story.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {story.description}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="ml-4 shrink-0">
                  {story.licenseType === "non-commercial"
                    ? "Non-Commercial"
                    : story.licenseType === "commercial-use"
                    ? "Commercial Use"
                    : "Commercial Remix"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>IP ID:</strong>{" "}
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {story.ipId.slice(0, 10)}...{story.ipId.slice(-8)}
                    </code>
                  </div>
                  <div>
                    <strong>Token ID:</strong> {story.tokenId}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Published {new Date(story.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <strong>Author:</strong> {story.author.name}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm" variant="outline">
                    <a
                      href={story.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View on Explorer
                    </a>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <a
                      href={`https://gateway.pinata.cloud/ipfs/${story.contentCID}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Content
                    </a>
                  </Button>
                  {story.imageCID && (
                    <Button asChild size="sm" variant="outline">
                      <a
                        href={`https://gateway.pinata.cloud/ipfs/${story.imageCID}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View Cover
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 