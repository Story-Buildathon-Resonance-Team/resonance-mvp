"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { users, StoryEntry } from "@/data/user";
import { useStoryStore } from "@/stores/storyStore";
import { Loader2, AlertCircle } from "lucide-react";

interface StoryWithAuthor extends StoryEntry {
  author: string;
}

const ReaderPage = () => {
  const params = useParams();
  const router = useRouter();
  const ipId = params.ipId as string;
  const { publishedStories } = useStoryStore();

  const [story, setStory] = useState<StoryWithAuthor | null>(null);
  const [storyContent, setStoryContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const suggestions = [
    { emoji: "🎨", text: "Write fan fiction" },
    { emoji: "📖", text: "Character origin story" },
    { emoji: "🌍", text: "Create a world bible" },
    { emoji: "🌐", text: "Translate to your language" },
    { emoji: "✨", text: "Spin off story" },
  ];

  const getIPFSUrl = (cid: string) =>
    `https://gateway.pinata.cloud/ipfs/${cid}`;

  // Navigation handlers for remix functionality
  const handleRemixStory = () => {
    if (story) {
      router.push(`/remix-form?originalStoryId=${story.ipId}`);
    }
  };

  const handleRemixSuggestion = (suggestion: { emoji: string; text: string }) => {
    if (story) {
      router.push(`/remix-form?originalStoryId=${story.ipId}&suggestion=${encodeURIComponent(suggestion.text)}`);
    }
  };

  useEffect(() => {
    // Find the story by ipId - check both user data and store
    const findStory = () => {
      // First check the store for published stories
      const storeStory = publishedStories.find((s) => s.ipId === ipId);
      if (storeStory) {
        return {
          ipId: storeStory.ipId,
          ipMetadataCID: storeStory.contentCID,
          nftMetadataCID: storeStory.contentCID,
          contentCID: storeStory.contentCID,
          imageCID: storeStory.imageCID,
          title: storeStory.title,
          synopsis: storeStory.description,
          author: storeStory.author.name || storeStory.author.address.slice(0, 8) + "...",
        };
      }

      // Fallback to user data
      for (const user of users) {
        const foundStory = user.stories.find((s) => s.ipId === ipId);
        if (foundStory) {
          return {
            ...foundStory,
            author: user.userName || user.walletAddress.slice(0, 8) + "...",
          };
        }
      }
      return null;
    };

    const foundStory = findStory();

    if (!foundStory) {
      setError(
        "Sorry, this is a test app and some configuration is missing. If you want to see your story here, please make sure to add necessary information to the user object in the user.ts file, data folder."
      );
      setLoading(false);
      return;
    }

    // Check for required fields
    if (!foundStory.title || !foundStory.contentCID) {
      const missingFields = [];
      if (!foundStory.title) missingFields.push("title");
      if (!foundStory.contentCID) missingFields.push("contentCID");

      setError(
        `Sorry, this is a test app and some configuration is missing. The following required fields are missing: ${missingFields.join(
          ", "
        )}. Please make sure to add necessary information to the user object in the user.ts file, data folder.`
      );
      setLoading(false);
      return;
    }

    setStory(foundStory);

    // Fetch story content from IPFS
    const fetchStoryContent = async () => {
      try {
        const response = await fetch(getIPFSUrl(foundStory.contentCID));
        if (!response.ok) {
          throw new Error("Failed to fetch story content");
        }
        const content = await response.text();
        setStoryContent(content);
      } catch (err) {
        setError(
          "Failed to load story content from IPFS. Please try again later."
        );
        console.error("Error fetching story content:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStoryContent();
  }, [ipId, publishedStories]);

  // Parse story content into paragraphs
  const parseStoryContent = (content: string) => {
    return content
      .split("\n\n")
      .filter((paragraph) => paragraph.trim().length > 0)
      .map((paragraph) => paragraph.trim());
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='flex items-center gap-3 text-foreground'>
          <Loader2 className='h-8 w-8 animate-spin' />
          <span className='text-lg'>Loading story...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center p-4'>
        <Card className='max-w-2xl w-full bg-card backdrop-blur-xl border-destructive/20'>
          <CardContent className='p-8 text-center'>
            <AlertCircle className='h-16 w-16 mx-auto mb-4 text-destructive' />
            <h2 className='text-xl font-semibold mb-4 text-foreground'>
              Story Not Found
            </h2>
            <p className='text-muted-foreground leading-relaxed'>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!story) return null;

  const paragraphs = parseStoryContent(storyContent);

  return (
    <div className='min-h-screen p-4 md:p-8'>
      <div className='max-w-6xl mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12'>
          {/* Main Content */}
          <div className='lg:col-span-2'>
            <Card className='bg-card backdrop-blur-xl border-primary/20 shadow-2xl'>
              <CardContent className='p-6 md:p-12'>
                {/* Story Header */}
                <div className='text-center mb-12 pb-8 border-b-2 border-primary/30'>
                  <h1 className='text-3xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent leading-tight'>
                    {story.title}
                  </h1>
                  {story.synopsis && (
                    <p className='text-lg md:text-xl text-muted-foreground italic'>
                      {story.synopsis}
                    </p>
                  )}
                </div>

                {/* Story Content */}
                <div className='prose prose-lg max-w-none text-foreground leading-relaxed'>
                  <div className='columns-1 gap-12 text-justify space-y-6'>
                    {paragraphs.map((paragraph, index) => (
                      <p
                        key={index}
                        className='text-base md:text-lg leading-relaxed mb-6'
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className='lg:col-span-1 flex flex-col gap-6'>
            {/* Author Section */}
            <Card className='bg-card backdrop-blur-lg border-primary/20'>
              <CardContent className='p-6 text-center'>
                <div className='w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center text-2xl'>
                  ✍️
                </div>
                <h3 className='text-xl font-semibold mb-4'>{story.author}</h3>

                <div className='mb-4'>
                  <div className='bg-emerald-500/20 border border-emerald-500/40 rounded-xl px-4 py-3 text-emerald-400 text-sm font-medium'>
                    This is an original
                  </div>
                </div>

                <div className='bg-primary/10 border border-primary/30 rounded-xl px-4 py-3 text-primary text-sm'>
                  Connected works: 12
                </div>
              </CardContent>
            </Card>

            {/* Remix Ideas */}
            <Card className='bg-card border-primary/30 backdrop-blur-lg'>
              <CardContent className='p-6'>
                <h4 className='text-xl font-semibold mb-6 text-primary'>
                  Remix Ideas
                </h4>
                <div className='space-y-3'>
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className='flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-transparent hover:border-primary/40 hover:bg-primary/20 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 group'
                      onClick={() => handleRemixSuggestion(suggestion)}
                    >
                      <span className='text-lg'>{suggestion.emoji}</span>
                      <span className='text-muted-foreground group-hover:text-primary transition-colors'>
                        {suggestion.text}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card className='bg-card backdrop-blur-lg border-primary/20'>
              <CardContent className='p-6'>
                <div className='flex flex-col gap-4'>
                  <Button
                    className='w-full font-semibold'
                    onClick={handleRemixStory}
                  >
                    Remix This Story
                  </Button>
                  <Button
                    variant='outline'
                    className='w-full font-semibold'
                    onClick={() => console.log("Tip functionality coming soon")}
                  >
                    Tip This Story
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReaderPage;
