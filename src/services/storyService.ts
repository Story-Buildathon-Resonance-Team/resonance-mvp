/**
 * Story Service - Handles story registration with Story Protocol
 * This service acts as a bridge between the UI and the Story Protocol API
 */

import { Address } from "viem";
import { useStoryStore } from "../stores/storyStore";
import { PublishedStory } from "../stores/types";

export interface StoryRegistrationData {
  title: string;
  description: string;
  contentCID: string;
  imageCID: string;
  author: {
    name: string;
    address: Address;
  };
  licenseTypes: ("non-commercial" | "commercial-use" | "commercial-remix")[];
}

export interface StoryRegistrationResult {
  success: boolean;
  ipId?: string;
  txHash?: string;
  licenseTermsIds?: string[];
  tokenId?: string;
  storyData?: any;
  explorerUrl?: string;
  error?: string;
  publishedStory?: PublishedStory;
}

/**
 * Register a story as an IP asset using the Story Protocol API
 */
export async function registerStoryAsIP(
  data: StoryRegistrationData
): Promise<StoryRegistrationResult> {
  try {
    console.log("Registering story as IP:", data.title);

    // Validate license types array
    if (
      !data.licenseTypes ||
      !Array.isArray(data.licenseTypes) ||
      data.licenseTypes.length === 0
    ) {
      throw new Error("At least one license type must be provided");
    }

    if (data.licenseTypes.length > 3) {
      throw new Error("Maximum 3 license types allowed");
    }

    // Validate individual license types
    const validLicenseTypes = [
      "non-commercial",
      "commercial-use",
      "commercial-remix",
    ];
    const invalidLicenses = data.licenseTypes.filter(
      (type) => !validLicenseTypes.includes(type)
    );
    if (invalidLicenses.length > 0) {
      throw new Error(`Invalid license types: ${invalidLicenses.join(", ")}`);
    }

    // Check for duplicates
    const uniqueLicenses = [...new Set(data.licenseTypes)];
    if (uniqueLicenses.length !== data.licenseTypes.length) {
      console.warn("Duplicate license types detected, removing duplicates");
      data.licenseTypes = uniqueLicenses;
    }

    const response = await fetch("/api/register-story", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Story registration failed");
    }

    console.log("Story registered successfully:", result.ipId);

    return {
      success: true,
      ipId: result.ipId,
      txHash: result.txHash,
      licenseTermsIds: result.licenseTermsIds,
      tokenId: result.tokenId,
      storyData: result.storyData,
      explorerUrl: result.explorerUrl,
    };
  } catch (error) {
    console.error("Story registration error:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Register a story as an IP asset and prepare it for store addition
 */
export async function registerStoryAsIPWithStore(
  data: StoryRegistrationData
): Promise<StoryRegistrationResult> {
  const result = await registerStoryAsIP(data);

  if (result.success && result.storyData) {
    // Create a PublishedStory object for the store
    const publishedStory: PublishedStory = {
      ipId: result.ipId!,
      title: data.title,
      description: data.description,
      author: data.author,
      contentCID: data.contentCID,
      imageCID: data.imageCID,
      txHash: result.txHash!,
      tokenId: result.tokenId!,
      licenseTypes: data.licenseTypes,
      publishedAt: Date.now(),
      explorerUrl: result.explorerUrl!,
    };

    return {
      ...result,
      publishedStory,
    };
  }

  return result;
}

/**
 * Get story details by IP ID (placeholder for future implementation)
 */
export async function getStoryByIpId(ipId: string): Promise<any> {
  // TODO: Implement story retrieval from Story Protocol
  console.log("Getting story by IP ID:", ipId);
  return null;
}

/**
 * List user's published stories (placeholder for future implementation)
 */
export async function getUserStories(userAddress: Address): Promise<any[]> {
  // TODO: Implement user story listing
  console.log("Getting stories for user:", userAddress);
  return [];
}
