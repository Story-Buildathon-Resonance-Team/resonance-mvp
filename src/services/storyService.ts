import { Address } from "viem";
import { PublishedStory } from "../stores/types";
import { validateDerivativeLicenseSelection, LicenseType } from "./licenseService";

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
  originalStoryId?: string;
  originalTitle?: string;
  originalAuthor?: string;
  parentLicenseTypes?: ("non-commercial" | "commercial-use" | "commercial-remix")[];
  publishedStories?: PublishedStory[];
  staticUserData?: any[];
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
 * 
 * For derivatives, this function will:
 * 1. Fetch parent license information from multiple sources
 * 2. Validate license compatibility 
 * 3. Register the derivative with proper license inheritance
 * 
 * @param data - Story registration data including optional context for license validation
 * @returns Promise<StoryRegistrationResult>
 */
export async function registerStoryAsIP(
  data: StoryRegistrationData
): Promise<StoryRegistrationResult> {
  try {
    console.log("Registering story as IP:", data.title);
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
async function registerOriginalStory(data: StoryRegistrationData): Promise<StoryRegistrationResult> {
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
 * Get parent license information from available sources
 */
async function getParentLicenseTypes( parentIpId: string, publishedStories?: PublishedStory[], staticUserData?: any[]): Promise<LicenseType[]> {
  console.log(`Fetching parent license types for IP ID: ${parentIpId}`);
  if (publishedStories && publishedStories.length > 0) {
    const parentStory = publishedStories.find(story => story.ipId === parentIpId);
    if (parentStory && parentStory.licenseTypes) {
      const licenseTypes = parentStory.licenseTypes.map(type => type as LicenseType);
      console.log(`Found parent licenses in published stories:`, licenseTypes);
      return licenseTypes;
    }
  }

  // Check static user data
  if (staticUserData && staticUserData.length > 0) {
    for (const user of staticUserData) {
      if (user.stories) {
        const parentStory = user.stories.find((story: any) => story.ipId === parentIpId);
        if (parentStory) {
          // Static stories typically default to non-commercial
          const licenseTypes = [LicenseType.NON_COMMERCIAL];
          console.log(`Found parent story in static data, defaulting to non-commercial`);
          return licenseTypes;
        }
      }
    }
  }

  // Try to fetch from API as fallback
  try {
    console.log(`Attempting to fetch parent license info from API for ${parentIpId}`);
    const response = await fetch(`/api/stories/${parentIpId}/licenses`);
    if (response.ok) {
      const licenseData = await response.json();
      if (licenseData.licenseTypes && licenseData.licenseTypes.length > 0) {
        console.log(`Found parent licenses from API:`, licenseData.licenseTypes);
        return licenseData.licenseTypes.map((type: string) => type as LicenseType);
      }
    }
  } catch (error) {
    console.warn(`Failed to fetch parent license info from API:`, error);
  }

  // Ultimate fallback - assume non-commercial (most permissive for derivatives)
  console.warn(`Could not determine parent license types for ${parentIpId}, defaulting to non-commercial`);
  return [LicenseType.NON_COMMERCIAL];
}

/**
 * Register a derivative story (remix)
 */
async function registerDerivativeStory(data: StoryRegistrationData): Promise<StoryRegistrationResult> {
  if (!data.originalStoryId) {
    throw new Error("Original story ID is required for derivative registration");
  }

  if (!data.licenseType) {
    throw new Error("License type is required for derivative registration");
  }
  let parentLicenseTypes: LicenseType[];
  
  if (data.parentLicenseTypes && data.parentLicenseTypes.length > 0) {
    // Use explicitly provided parent license types
    parentLicenseTypes = data.parentLicenseTypes.map(type => type as LicenseType);
    console.log(`Using provided parent license types:`, parentLicenseTypes);
  } else {
    // Fetch parent license types from available sources
    parentLicenseTypes = await getParentLicenseTypes(
      data.originalStoryId,
      data.publishedStories,
      data.staticUserData
    );
  }

  // Validate that the selected license is compatible with the parent's licenses
  const validation = validateDerivativeLicenseSelection(
    parentLicenseTypes,
    data.licenseType as LicenseType
  );
  
  if (!validation.isValid) {
    throw new Error(`License validation failed: ${validation.error}`);
  }

  // Get the derivative license terms ID
  const derivativeLicenseTermsId = getLicenseTermsIdFromType(data.licenseType);
  
  if (!derivativeLicenseTermsId) {
    throw new Error(`Invalid license type: ${data.licenseType}`);
  }

  // For Story Protocol, we need to determine which parent license to inherit from
  // If parent has multiple licenses, we should use the one that matches our derivative license
  // If parent only has one license, we use that one
  let parentLicenseTermsId: string;
  
  if (parentLicenseTypes.includes(data.licenseType as LicenseType)) {
    // Parent has the same license type as derivative - perfect match
    parentLicenseTermsId = derivativeLicenseTermsId;
  } else {
    // Use the first compatible parent license
    parentLicenseTermsId = getLicenseTermsIdFromType(parentLicenseTypes[0]);
  }

  console.log(`Registering derivative with parent license: ${parentLicenseTypes[0]}, derivative license: ${data.licenseType}`);

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
      parentLicenseTypes: parentLicenseTypes, 
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
      originalStoryId: data.originalStoryId, // Include for remixes
    };

    return {
      ...result,
      publishedStory,
    };
  }

  return result;
}

/**
 * Enhanced registration function that automatically includes context data
 * This is the recommended way to register stories in the application
 */
export async function registerStoryWithContext(
  data: Omit<StoryRegistrationData, 'publishedStories' | 'staticUserData'>,
  publishedStories: PublishedStory[],
  staticUserData?: any[]
): Promise<StoryRegistrationResult> {
  const enhancedData: StoryRegistrationData = {
    ...data,
    publishedStories,
    staticUserData,
  };

  return registerStoryAsIPWithStore(enhancedData);
}
export async function validateDerivativeLicense(
  parentIpId: string,
  selectedLicenseType: "non-commercial" | "commercial-use" | "commercial-remix",
  publishedStories?: PublishedStory[],
  staticUserData?: any[],
  parentLicenseTypes?: ("non-commercial" | "commercial-use" | "commercial-remix")[]
): Promise<{
  isValid: boolean;
  error?: string;
  parentLicenses?: LicenseType[];
}> {
  try {
    let parentLicenses: LicenseType[];
    
    if (parentLicenseTypes && parentLicenseTypes.length > 0) {
      parentLicenses = parentLicenseTypes.map(type => type as LicenseType);
    } else {
      parentLicenses = await getParentLicenseTypes(parentIpId, publishedStories, staticUserData);
    }

    const validation = validateDerivativeLicenseSelection(
      parentLicenses,
      selectedLicenseType as LicenseType
    );

    return {
      isValid: validation.isValid,
      error: validation.error,
      parentLicenses,
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : "Unknown validation error",
    };
  }
}

/**
 * Get story details by IP ID (placeholder for future implementation)
 */
export async function getStoryByIpId(ipId: string): Promise<any> {
  console.log("Getting story by IP ID:", ipId);
  return null;
}

export async function getUserStories(userAddress: Address): Promise<any[]> {
  // TODO: Implement user story listing
  console.log("Getting stories for user:", userAddress);
  return [];
}

function getLicenseTermsIdFromType(licenseType: "non-commercial" | "commercial-use" | "commercial-remix"): string {
  switch (licenseType) {
    case "non-commercial":
      return "1"; 
    case "commercial-use":
      return "2"; 
    case "commercial-remix":
      return "3"; 
    default:
      throw new Error(`Unknown license type: ${licenseType}`);
  }
}
