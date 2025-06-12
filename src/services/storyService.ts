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
  nftMetadataCID?: string;
  ipMetadataCID?: string;
  author: {
    name: string;
    address: Address;
  };
  licenseTypes?: ("non-commercial" | "commercial-use" | "commercial-remix")[];
  licenseType?: "non-commercial" | "commercial-use" | "commercial-remix";
  // Remix-specific fields
  originalStoryId?: string;
  originalTitle?: string;
  originalAuthor?: string;
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
 * Handles both original stories and remixes (derivatives)
 */
export async function registerStoryAsIP(
  data: StoryRegistrationData
): Promise<StoryRegistrationResult> {
  try {
    console.log("Registering story as IP:", data.title);

    // Check if this is a remix (derivative)
    const isRemix = !!data.originalStoryId;

    if (isRemix) {
      console.log("Registering as derivative of:", data.originalStoryId);
      return await registerDerivativeStory(data);
    } else {
      console.log("Registering as original story");
      return await registerOriginalStory(data);
    }
  } catch (error) {
    console.error("Story registration error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Register an original story
 */
async function registerOriginalStory(
  data: StoryRegistrationData
): Promise<StoryRegistrationResult> {
  // Handle both single license type and multiple license types for original stories
  let licenseTypes: ("non-commercial" | "commercial-use" | "commercial-remix")[];
  
  if (data.licenseType) {
    licenseTypes = [data.licenseType];
  } else if (data.licenseTypes && data.licenseTypes.length > 0) {
    licenseTypes = data.licenseTypes;
  } else {
    throw new Error("At least one license type must be provided");
  }

  if (licenseTypes.length > 3) {
    throw new Error("Maximum 3 license types allowed");
  }

  // Validate individual license types
  const validLicenseTypes = [
    "non-commercial",
    "commercial-use",
    "commercial-remix",
  ];
  const invalidLicenses = licenseTypes.filter(
    (type) => !validLicenseTypes.includes(type)
  );
  if (invalidLicenses.length > 0) {
    throw new Error(`Invalid license types: ${invalidLicenses.join(", ")}`);
  }

  // Check for duplicates
  const uniqueLicenses = [...new Set(licenseTypes)];
  if (uniqueLicenses.length !== licenseTypes.length) {
    console.warn("Duplicate license types detected, removing duplicates");
    licenseTypes = uniqueLicenses;
  }

  const response = await fetch("/api/register-story", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      licenseTypes: licenseTypes,
    }),
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

  console.log("Original story registered successfully:", result.ipId);

  return {
    success: true,
    ipId: result.ipId,
    txHash: result.txHash,
    licenseTermsIds: result.licenseTermsIds,
    tokenId: result.tokenId,
    storyData: result.storyData,
    explorerUrl: result.explorerUrl,
  };
}

/**
 * Register a derivative story (remix)
 */
async function registerDerivativeStory(
  data: StoryRegistrationData
): Promise<StoryRegistrationResult> {
  if (!data.originalStoryId) {
    throw new Error("Original story ID is required for derivative registration");
  }

  if (!data.licenseType) {
    throw new Error("License type is required for derivative registration");
  }

  // Get the parent's license terms ID based on the license type
  const parentLicenseTermsId = getLicenseTermsIdFromType(data.licenseType);
  
  if (!parentLicenseTermsId) {
    throw new Error(`Invalid license type: ${data.licenseType}`);
  }

  // For derivatives, both parent and derivative should have the same license terms
  const response = await fetch("/api/register-derivative", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: data.title,
      description: data.description,
      contentCID: data.contentCID,
      imageCID: data.imageCID,
      author: data.author,
      parentIpId: data.originalStoryId,
      parentLicenseTermsId: parentLicenseTermsId,
      derivativeLicenseType: data.licenseType,
    }),
  });

    if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Derivative registration failed");
  }

  console.log("Derivative story registered successfully:", result.ipId);

  return {
    success: true,
    ipId: result.ipId,
    txHash: result.txHash,
    licenseTermsIds: result.licenseTermsIds,
    tokenId: result.tokenId,
    storyData: result.derivativeData,
    explorerUrl: result.explorerUrl,
  };
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
      nftMetadataCID: data.nftMetadataCID,
      ipMetadataCID: data.ipMetadataCID,
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

/**
 * Get license terms ID from license type
 */
function getLicenseTermsIdFromType(licenseType: "non-commercial" | "commercial-use" | "commercial-remix"): string {
  switch (licenseType) {
    case "non-commercial":
      return "1"; // NonCommercialSocialRemixingTermsId
    case "commercial-use":
      return "2"; // CommercialUseOnlyTermsId
    case "commercial-remix":
      return "3"; // CommercialRemixTermsId
    default:
      throw new Error(`Unknown license type: ${licenseType}`);
  }
}
