/**
 * Story Service - Handles story registration with Story Protocol
 * This service acts as a bridge between the UI and the Story Protocol API
 */

import { Address } from "viem";

export interface StoryRegistrationData {
  title: string;
  description: string;
  contentCID: string;
  imageCID: string;
  author: {
    name: string;
    address: Address;
  };
  licenseType: "non-commercial" | "commercial-remix";
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
}

/**
 * Register a story as an IP asset using the Story Protocol API
 */
export async function registerStoryAsIP(
  data: StoryRegistrationData
): Promise<StoryRegistrationResult> {
  try {
    console.log("Registering story as IP:", data.title);

    const response = await fetch("/api/register-story", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
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