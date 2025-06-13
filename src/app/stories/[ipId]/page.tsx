"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { users, StoryEntry } from "@/data/user";
import { useStoryStore } from "@/stores/storyStore";
import { Loader2, AlertCircle } from "lucide-react";

interface StoryWithAuthor extends StoryEntry {
  author: string;
}

interface AssetData {
  childrenCount: number;
  parentCount: number;
  ipId: string;
  title: string;
  description: string;
}

interface NFTMetadataAttribute {
  trait_type: string;
  value: string;
}

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  animation_url: string;
  attributes: NFTMetadataAttribute[];
}

interface ProcessedLicenseData {
  hasLicenses: boolean;
  allowsRemix: boolean;
  isCommercialUseOnly: boolean;
  licenseCount: number;
  licenses: string[];
}

interface StoryContentData {
  title?: string;
  description?: string;
  content?: string;
  author?: string;
  createdAt?: string;
  type?: string;
  contentType?: string;
  version?: string;
}

const ReaderPage = () => {
  const params = useParams();
  const router = useRouter();
  const ipId = params.ipId as string;
  const { publishedStories } = useStoryStore();

  const [story, setStory] = useState<StoryWithAuthor | null>(null);
  const [storyContent, setStoryContent] = useState<string>("");
  const [assetData, setAssetData] = useState<AssetData | null>(null);
  const [licenseData, setLicenseData] = useState<ProcessedLicenseData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(true);
  const [assetLoading, setAssetLoading] = useState(true);
  const [licenseLoading, setLicenseLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [contentError, setContentError] = useState<string>("");
  const [assetError, setAssetError] = useState<string>("");
  const [licenseError, setLicenseError] = useState<string>("");

  const suggestions = [
    { emoji: "🎨", text: "Write fan fiction" },
    { emoji: "📖", text: "Character origin story" },
    { emoji: "🌍", text: "Create a world bible" },
    { emoji: "🌐", text: "Translate to your language" },
    { emoji: "✨", text: "Spin off story" },
  ];

  const getIPFSUrl = (cid: string) =>
    `https://gateway.pinata.cloud/ipfs/${cid}`;

  // Process license data from NFT metadata attributes
  const processLicenseDataFromMetadata = (
    attributes: NFTMetadataAttribute[]
  ): ProcessedLicenseData => {
    // Add guard clause to handle undefined or invalid attributes
    if (!attributes || !Array.isArray(attributes) || attributes.length === 0) {
      return {
        hasLicenses: false,
        allowsRemix: true, // Default to allowing remix if no attributes found
        isCommercialUseOnly: false,
        licenseCount: 0,
        licenses: [],
      };
    }

    const licenses: string[] = [];

    // Check for OLD format (single License Type)
    const oldLicenseType = attributes.find(
      (attr) => attr.trait_type === "License Type"
    );

    if (oldLicenseType) {
      licenses.push(oldLicenseType.value);
    } else {
      // Check for NEW format (multiple licenses)
      const licenseCountAttr = attributes.find(
        (attr) => attr.trait_type === "License Count"
      );

      if (licenseCountAttr) {
        const licenseCount = parseInt(licenseCountAttr.value, 10);
        for (let i = 1; i <= licenseCount; i++) {
          const licenseAttr = attributes.find(
            (attr) => attr.trait_type === `License ${i}`
          );
          if (licenseAttr) {
            licenses.push(licenseAttr.value);
          }
        }
      }
    }

    const hasLicenses = licenses.length > 0;

    if (!hasLicenses) {
      return {
        hasLicenses: false,
        allowsRemix: true, // Default to allowing remix if no licenses found
        isCommercialUseOnly: false,
        licenseCount: 0,
        licenses: [],
      };
    }

    // Check if ALL licenses are Commercial Use (blocks remixes)
    const isCommercialUseOnly = licenses.every(
      (license) => license === "Commercial Use"
    );

    // Allow remixes if ANY license allows it (i.e., not all are Commercial Use)
    const allowsRemix = !isCommercialUseOnly;

    return {
      hasLicenses,
      allowsRemix,
      isCommercialUseOnly,
      licenseCount: licenses.length,
      licenses,
    };
  };
  // Navigation handlers for remix functionality
  const handleRemixStory = () => {
    if (story) {
      router.push(`/remix-form?originalStoryId=${story.ipId}`);
    }
  };

  // Fetch asset data from API
  const fetchAssetData = async (ipId: string) => {
    try {
      setAssetLoading(true);
      setAssetError("");
      const response = await fetch(`/api/stories/${ipId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch asset data: ${response.statusText}`);
      }
      const data = await response.json();
      setAssetData(data);
    } catch (error) {
      console.error("Error fetching asset data:", error);
      setAssetError("Failed to load asset data");
    } finally {
      setAssetLoading(false);
    }
  };

  // Fetch and process license data from NFT metadata
  const fetchLicenseDataFromMetadata = async (nftMetadataCID: string) => {
    try {
      setLicenseLoading(true);
      setLicenseError("");

      const response = await fetch(getIPFSUrl(nftMetadataCID));
      if (!response.ok) {
        throw new Error(`Failed to fetch NFT metadata: ${response.statusText}`);
      }

      const nftMetadata: NFTMetadata = await response.json();
      const processedData = processLicenseDataFromMetadata(
        nftMetadata.attributes
      );
      setLicenseData(processedData);
    } catch (error) {
      console.error("Error fetching NFT metadata:", error);
      // Default to allowing remixes on error
      setLicenseData({
        hasLicenses: false,
        allowsRemix: true,
        isCommercialUseOnly: false,
        licenseCount: 0,
        licenses: [],
      });
      setLicenseError("Failed to load license data");
    } finally {
      setLicenseLoading(false);
    }
  };

  // Enhanced content fetching to handle both plain text and JSON formats
  const fetchStoryContent = async (contentCID: string) => {
    try {
      setContentLoading(true);
      setContentError("");
      const response = await fetch(getIPFSUrl(contentCID));
      if (!response.ok) {
        throw new Error("Failed to fetch story content");
      }

      const contentType = response.headers.get("content-type");
      const rawContent = await response.text();

      // Try to parse as JSON first
      try {
        const jsonContent: StoryContentData = JSON.parse(rawContent);
        // If it's a JSON object with content field, extract it
        if (
          jsonContent &&
          typeof jsonContent === "object" &&
          "content" in jsonContent
        ) {
          setStoryContent(jsonContent.content || "");
        } else {
          // If it's JSON but not in expected format, use the raw content
          setStoryContent(rawContent);
        }
      } catch {
        // If JSON parsing fails, treat as plain text
        setStoryContent(rawContent);
      }
    } catch (err) {
      setContentError(
        "Failed to load story content from IPFS. Please try again later."
      );
      console.error("Error fetching story content:", err);
    } finally {
      setContentLoading(false);
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
          author:
            storeStory.author.name ||
            storeStory.author.address.slice(0, 8) + "...",
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
    if (
      !foundStory.title ||
      !foundStory.contentCID ||
      !foundStory.nftMetadataCID
    ) {
      const missingFields = [];
      if (!foundStory.title) missingFields.push("title");
      if (!foundStory.contentCID) missingFields.push("contentCID");
      if (!foundStory.nftMetadataCID) missingFields.push("nftMetadataCID");

      setError(
        `Sorry, this is a test app and some configuration is missing. The following required fields are missing: ${missingFields.join(
          ", "
        )}. Please make sure to add necessary information to the user object in the user.ts file, data folder.`
      );
      setLoading(false);
      return;
    }

    setStory(foundStory);
    setLoading(false);

    // Fetch all data in parallel
    Promise.all([
      fetchStoryContent(foundStory.contentCID),
      fetchAssetData(ipId),
      fetchLicenseDataFromMetadata(foundStory.nftMetadataCID),
    ]);
  }, [ipId, publishedStories]);

  // Parse story content into paragraphs
  const parseStoryContent = (content: string) => {
    return content
      .split("\n\n")
      .filter((paragraph) => paragraph.trim().length > 0)
      .map((paragraph) => paragraph.trim());
  };

  // Determine if remix functionality should be shown
  const shouldShowRemixFeatures = () => {
    if (licenseError || !licenseData) return true; // Default to showing if we can't determine
    return licenseData.allowsRemix;
  };

  // Get remix status message
  const getRemixStatusMessage = () => {
    if (licenseLoading) {
      return "Checking license terms...";
    }
    if (licenseError) {
      return "Unable to verify license terms";
    }
    if (!licenseData) {
      return "License terms not available";
    }
    if (licenseData.isCommercialUseOnly) {
      return "This story was registered with Commercial Use license(s) only. No remixes allowed.";
    }
    if (!licenseData.allowsRemix) {
      return "This story's license does not allow remixes.";
    }
    return null;
  };

  // Get origin status text
  const getOriginStatus = () => {
    if (assetError || !assetData) return "Loading...";
    return assetData.parentCount === 0
      ? "This is an original"
      : "This is a remix";
  };

  // Get connected works count
  const getConnectedWorksCount = () => {
    if (assetError || !assetData) return "Loading...";
    return assetData.childrenCount;
  };

  // Get lineage information
  const getLineageInfo = () => {
    if (assetError || !assetData) return null;
    return {
      isOriginal: assetData.parentCount === 0,
      isRemix: assetData.parentCount > 0,
      parentCount: assetData.parentCount,
      childrenCount: assetData.childrenCount,
      totalConnected: assetData.parentCount + assetData.childrenCount,
    };
  };

  // Find connected works from store and user data
  const getConnectedWorks = () => {
    const connected = {
      parents: [] as any[],
      children: [] as any[],
    };

    // Find children (remixes of this story)
    const allStories = [
      ...publishedStories,
      ...users.flatMap((user) =>
        user.stories
          .filter((story) => story.ipId && story.title)
          .map((story) => ({
            ...story,
            author: {
              name: user.userName || user.walletAddress.slice(0, 8) + "...",
              address: user.walletAddress,
            },
          }))
      ),
    ];

    // Find stories that have this story as their original
    connected.children = allStories.filter(
      (story) => (story as any).originalStoryId === ipId
    );

    // Find parent story if this is a remix
    const currentStoryInStore = publishedStories.find((s) => s.ipId === ipId);
    if (currentStoryInStore?.originalStoryId) {
      const parentStory = allStories.find(
        (s) => s.ipId === currentStoryInStore.originalStoryId
      );
      if (parentStory) {
        connected.parents.push(parentStory);
      }
    }

    return connected;
  };

  const lineageInfo = getLineageInfo();
  const connectedWorks = getConnectedWorks();

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
  const remixStatusMessage = getRemixStatusMessage();

  return (
    <div className='min-h-screen'>
      <div className='max-w-6xl mx-auto px-6 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12'>
          {/* Main Content */}
          <div className='lg:col-span-2'>
            <Card className='bg-card backdrop-blur-xl border-primary/20 shadow-2xl'>
              <CardContent className='p-6 md:p-12'>
                {/* Story Header */}
                <div className='text-center mb-12 pb-8 border-b-2 border-primary/30'>
                  <h1 className='text-3xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-foreground/70 leading-tight'>
                    {story.title}
                  </h1>
                  {story.synopsis && (
                    <p className='text-lg md:text-xl text-foreground/80 italic'>
                      {story.synopsis}
                    </p>
                  )}
                </div>

                {/* Story Content */}
                <div className='prose prose-lg max-w-none text-foreground leading-relaxed'>
                  {contentLoading ? (
                    <div className='flex items-center justify-center py-12'>
                      <Loader2 className='h-8 w-8 animate-spin mr-3' />
                      <span>Loading story content...</span>
                    </div>
                  ) : contentError ? (
                    <div className='text-center py-12'>
                      <AlertCircle className='h-12 w-12 mx-auto mb-4 text-destructive' />
                      <p className='text-destructive'>{contentError}</p>
                    </div>
                  ) : (
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
                  )}
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

                <div className='space-y-4'>
                  {/* Lineage Status */}
                  <div className='mb-4'>
                    {assetLoading ? (
                      <div className='bg-muted/20 border border-muted/40 rounded-xl px-4 py-3 text-muted-foreground text-sm font-medium'>
                        <Loader2 className='h-4 w-4 inline mr-2 animate-spin' />
                        Loading lineage...
                      </div>
                    ) : assetError ? (
                      <div className='bg-destructive/20 border border-destructive/40 rounded-xl px-4 py-3 text-destructive text-sm font-medium'>
                        Failed to load lineage
                      </div>
                    ) : lineageInfo ? (
                      <div className='space-y-3'>
                        <div
                          className={`border rounded-xl px-4 py-3 text-sm font-medium ${
                            lineageInfo.isOriginal
                              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                              : "bg-blue-500/20 border-blue-500/40 text-blue-400"
                          }`}
                        >
                          {lineageInfo.isOriginal ? "Original Work" : "Remix"}
                        </div>

                        {lineageInfo.isRemix && (
                          <div className='bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 text-amber-600 text-sm'>
                            Derived from {lineageInfo.parentCount} parent work
                            {lineageInfo.parentCount !== 1 ? "s" : ""}
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>

                  {/* Connected Works Summary */}
                  <div className='bg-primary/10 border border-primary/30 rounded-xl px-4 py-3 text-primary text-sm'>
                    <div className='font-medium mb-1'>Connected Works</div>
                    <div className='text-xs opacity-80'>
                      {lineageInfo
                        ? `${lineageInfo.totalConnected} total connections`
                        : "Loading..."}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Connected Works Lineage */}
            <Card className='bg-card border-primary/30 backdrop-blur-lg'>
              <CardContent className='p-6'>
                <h4 className='text-xl font-semibold mb-6 text-primary flex items-center gap-2'>
                  <svg
                    className='w-5 h-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M13 10V3L4 14h7v7l9-11h-7z'
                    />
                  </svg>
                  Connected Works
                </h4>

                {lineageInfo && lineageInfo.totalConnected > 0 ? (
                  <div className='space-y-4'>
                    {/* Parent Works */}
                    {connectedWorks.parents.length > 0 && (
                      <div className='space-y-3'>
                        <h5 className='text-sm font-medium text-muted-foreground uppercase tracking-wide'>
                          Parent Works ({connectedWorks.parents.length})
                        </h5>
                        {connectedWorks.parents.map((parent, index) => (
                          <div
                            key={index}
                            className='flex items-center gap-3 p-3 bg-blue-500/10 border-blue-500/30 border rounded-lg'
                          >
                            <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                            <div className='flex-1'>
                              <div className='font-medium text-sm text-foreground'>
                                {parent.title}
                              </div>
                              <div className='text-xs text-muted-foreground'>
                                by {parent.author?.name || parent.author}
                              </div>
                            </div>
                            <Badge
                              variant='outline'
                              className='text-xs border-blue-500/30 text-blue-500'
                            >
                              Original
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Current Work */}
                    <div className='space-y-3'>
                      <h5 className='text-sm font-medium text-muted-foreground uppercase tracking-wide'>
                        Current Work
                      </h5>
                      <div className='flex items-center gap-3 p-3 bg-primary/10 border-2 border-primary/30 rounded-lg'>
                        <div className='w-2 h-2 bg-primary rounded-full'></div>
                        <div className='flex-1'>
                          <div className='font-medium text-sm'>
                            {story.title}
                          </div>
                          <div className='text-xs text-muted-foreground'>
                            by {story.author}
                          </div>
                        </div>
                        <Badge className='text-xs'>
                          {lineageInfo.isOriginal ? "Original" : "Remix"}
                        </Badge>
                      </div>
                    </div>

                    {/* Child Works */}
                    {connectedWorks.children.length > 0 && (
                      <div className='space-y-3'>
                        <h5 className='text-sm font-medium text-muted-foreground uppercase tracking-wide'>
                          Derivative Works ({connectedWorks.children.length})
                        </h5>
                        {connectedWorks.children.map((child, index) => (
                          <div
                            key={index}
                            className='flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg backdrop-blur-sm'
                          >
                            <div className='w-2 h-2 bg-amber-600 rounded-full'></div>
                            <div className='flex-1'>
                              <div className='font-medium text-sm text-foreground'>
                                {child.title}
                              </div>
                              <div className='text-xs text-muted-foreground'>
                                by {child.author?.name || child.author}
                              </div>
                            </div>
                            <Badge
                              variant='secondary'
                              className='text-xs bg-accent/20 text-amber-600 border-amber-600/30'
                            >
                              Remix
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className='text-center py-8 text-muted-foreground'>
                    <div className='w-16 h-16 mx-auto mb-4 bg-muted/20 rounded-full flex items-center justify-center'>
                      <svg
                        className='w-8 h-8'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M13 10V3L4 14h7v7l9-11h-7z'
                        />
                      </svg>
                    </div>
                    <p className='text-sm'>No connected works found</p>
                    <p className='text-xs mt-1'>
                      This story has no parent or derivative works yet
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Remix Ideas or License Restriction Message */}
            {shouldShowRemixFeatures() ? (
              <Card className='bg-card border-primary/30 backdrop-blur-lg'>
                <CardContent className='p-6'>
                  <h4 className='text-xl font-semibold mb-6 text-primary'>
                    Remix Ideas
                  </h4>
                  <div className='space-y-3'>
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className='flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-transparent hover:border-primary/40 hover:bg-primary/20'
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
            ) : (
              <Card className='bg-card border-amber-500/30 backdrop-blur-lg'>
                <CardContent className='p-6'>
                  <h4 className='text-xl font-semibold mb-4 text-amber-500'>
                    License Restriction
                  </h4>
                  <div className='bg-amber-500/10 border border-amber-500/30 rounded-lg p-4'>
                    <p className='text-amber-400 text-sm'>
                      {remixStatusMessage ||
                        "Remix not available for this story."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <Card className='bg-card backdrop-blur-lg border-primary/20'>
              <CardContent className='p-6'>
                <div className='flex flex-col gap-4'>
                  <Button
                    className='w-full font-semibold cursor-pointer'
                    onClick={handleRemixStory}
                    disabled={licenseLoading || !shouldShowRemixFeatures()}
                  >
                    {licenseLoading ? (
                      <>
                        <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                        Checking license...
                      </>
                    ) : (
                      "Remix This Story"
                    )}
                  </Button>

                  {licenseError && (
                    <div className='bg-destructive/10 border border-destructive/30 rounded-lg p-3'>
                      <p className='text-destructive text-sm'>{licenseError}</p>
                    </div>
                  )}
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
