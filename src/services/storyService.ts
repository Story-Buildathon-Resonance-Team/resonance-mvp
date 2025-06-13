import { Address } from "viem";
import { PublishedStory } from "../stores/types";
import { validateDerivativeLicenseSelection } from "./licenseService";
import { LicenseType } from "../utils/utils";

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
  // Add parent license information for derivatives
  parentLicenseTypes?: ("non-commercial" | "commercial-use" | "commercial-remix")[];
  // Add context data for license validation
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
export async function registerStoryAsIP(data: StoryRegistrationData): Promise<StoryRegistrationResult> {
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
async function getParentLicenseTypes(
  parentIpId: string,
  publishedStories?: PublishedStory[],
  staticUserData?: any[]
): Promise<LicenseType[]> {
  console.log(`Fetching parent license types for IP ID: ${parentIpId}`);

  // First, check if parent license types were explicitly provided
  // This would happen when the UI has already fetched this information
  
  // Check published stories from store
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

function determineDerivativeLicenses(
  parentLicenseTypes: LicenseType[],
  selectedLicenseTypes?: ("non-commercial" | "commercial-use" | "commercial-remix")[],
  selectedLicenseType?: "non-commercial" | "commercial-use" | "commercial-remix"
): {
  derivativeLicenses: LicenseType[];
  isAutoInherited: boolean;
  inheritanceReason: string;
} {
  // Filter out licenses that don't allow derivatives
  const derivativeCompatibleParentLicenses = parentLicenseTypes.filter(
    license => license !== LicenseType.COMMERCIAL_USE
  );

  if (derivativeCompatibleParentLicenses.length === 0) {
    throw new Error("Parent licenses do not allow derivatives. Only 'Commercial Use' licenses found, which prohibit remixing.");
  }

  // If parent has only one derivative-compatible license, derivative automatically inherits it
  if (derivativeCompatibleParentLicenses.length === 1) {
    const inheritedLicense = derivativeCompatibleParentLicenses[0];
    
    return {
      derivativeLicenses: [inheritedLicense],
      isAutoInherited: true,
      inheritanceReason: `Automatically inherited the single derivative-compatible parent license: ${inheritedLicense}`
    };
  }

  // Parent has multiple derivative-compatible licenses - user must select
  let derivativeLicenses: LicenseType[];
  
  if (selectedLicenseTypes && selectedLicenseTypes.length > 0) {
    // User selected multiple licenses
    derivativeLicenses = selectedLicenseTypes.map(type => type as LicenseType);
  } else if (selectedLicenseType) {
    // User selected single license (backward compatibility)
    derivativeLicenses = [selectedLicenseType as LicenseType];
  } else {
    throw new Error(
      `Parent has multiple derivative-compatible licenses: ${derivativeCompatibleParentLicenses.join(", ")}. ` +
      `You must select which license(s) to inherit for your derivative.`
    );
  }

  // Validate all selected licenses are available from parent
  const invalidSelections = derivativeLicenses.filter(license => !derivativeCompatibleParentLicenses.includes(license));
  if (invalidSelections.length > 0) {
    throw new Error(
      `Selected license(s) not available from parent: ${invalidSelections.join(", ")}. ` +
      `Available derivative-compatible licenses: ${derivativeCompatibleParentLicenses.join(", ")}`
    );
  }

  // Validate that selected licenses allow derivatives
  const nonDerivativeLicenses = derivativeLicenses.filter(license => license === LicenseType.COMMERCIAL_USE);
  if (nonDerivativeLicenses.length > 0) {
    throw new Error(`Selected license(s) do not allow derivatives: ${nonDerivativeLicenses.join(", ")}`);
  }

  return {
    derivativeLicenses,
    isAutoInherited: false,
    inheritanceReason: `Selected ${derivativeLicenses.length} license(s) from ${derivativeCompatibleParentLicenses.length} available parent licenses`
  };
}

/**
 * Register a derivative story (remix)
 */
async function registerDerivativeStory(data: StoryRegistrationData): Promise<StoryRegistrationResult> {
  if (!data.originalStoryId) {
    throw new Error("Original story ID is required for derivative registration");
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

  // Determine derivative licenses based on parent licenses and user selection
  const licenseInheritance = determineDerivativeLicenses(
    parentLicenseTypes,
    data.licenseTypes,
    data.licenseType
  );

  console.log(`License inheritance: ${licenseInheritance.inheritanceReason}`);
  console.log(`Derivative will have licenses:`, licenseInheritance.derivativeLicenses);

  // Validate each selected license against parent licenses
  for (const derivativeLicense of licenseInheritance.derivativeLicenses) {
    const validation = validateDerivativeLicenseSelection(
      parentLicenseTypes,
      derivativeLicense
    );
    
    if (!validation.isValid) {
      throw new Error(`License validation failed for ${derivativeLicense}: ${validation.error}`);
    }
  }

  const primaryLicense = licenseInheritance.derivativeLicenses[0];
  const primaryLicenseTermsId = getLicenseTermsIdFromType(primaryLicense);
  
  if (!primaryLicenseTermsId) {
    throw new Error(`Invalid primary license type: ${primaryLicense}`);
  }

  // Determine parent license terms ID to inherit from
  let parentLicenseTermsId: string;
  
  if (parentLicenseTypes.includes(primaryLicense)) {
    parentLicenseTermsId = primaryLicenseTermsId;
  } else {
    // Use the first compatible parent license
    const compatibleParentLicense = parentLicenseTypes.find(license => license !== LicenseType.COMMERCIAL_USE);
    if (!compatibleParentLicense) {
      throw new Error("No compatible parent license found for derivative registration");
    }
    parentLicenseTermsId = getLicenseTermsIdFromType(compatibleParentLicense);
  }

  console.log(`Registering derivative with:`);
  console.log(`- Parent licenses: ${parentLicenseTypes.join(", ")}`);
  console.log(`- Derivative licenses: ${licenseInheritance.derivativeLicenses.join(", ")}`);
  console.log(`- Primary license for registration: ${primaryLicense}`);
  console.log(`- Auto-inherited: ${licenseInheritance.isAutoInherited}`);

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
      derivativeLicenseType: primaryLicense, 
      derivativeLicenseTypes: licenseInheritance.derivativeLicenses, 
      parentLicenseTypes: parentLicenseTypes,
      isAutoInherited: licenseInheritance.isAutoInherited,
      inheritanceReason: licenseInheritance.inheritanceReason,
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
      originalStoryId: data.originalStoryId, 
    };

    return {
      ...result,
      publishedStory,
    };
  }

  return result;
}

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

export async function getDerivativeLicenseOptions(
  parentIpId: string,
  publishedStories?: PublishedStory[],
  staticUserData?: any[],
  parentLicenseTypes?: ("non-commercial" | "commercial-use" | "commercial-remix")[]
): Promise<{
  parentLicenses: LicenseType[];
  availableForDerivative: LicenseType[];
  requiresSelection: boolean;
  autoInheritedLicense?: LicenseType;
  inheritanceReason: string;
}> {
  try {
    let parentLicenses: LicenseType[];
    
    if (parentLicenseTypes && parentLicenseTypes.length > 0) {
      parentLicenses = parentLicenseTypes.map(type => type as LicenseType);
    } else {
      parentLicenses = await getParentLicenseTypes(parentIpId, publishedStories, staticUserData);
    }

    // Filter out licenses that don't allow derivatives
    const availableForDerivative = parentLicenses.filter(
      license => license !== LicenseType.COMMERCIAL_USE
    );

    if (availableForDerivative.length === 0) {
      return {
        parentLicenses,
        availableForDerivative: [],
        requiresSelection: false,
        inheritanceReason: "Parent licenses do not allow derivatives"
      };
    }

    if (availableForDerivative.length === 1) {
      return {
        parentLicenses,
        availableForDerivative,
        requiresSelection: false,
        autoInheritedLicense: availableForDerivative[0],
        inheritanceReason: `Automatically inherits the single derivative-compatible license: ${availableForDerivative[0]}`
      };
    }

    return {
      parentLicenses,
      availableForDerivative,
      requiresSelection: true,
      inheritanceReason: `Multiple licenses available - user must select from: ${availableForDerivative.join(", ")}`
    };

  } catch (error) {
    throw new Error(`Failed to get derivative license options: ${error instanceof Error ? error.message : "Unknown error"}`);
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
  console.log("Getting stories for user:", userAddress);
  return [];
}

function getLicenseTermsIdFromType(licenseType: LicenseType | "non-commercial" | "commercial-use" | "commercial-remix"): string {
  // Convert string to LicenseType if needed
  const normalizedType = typeof licenseType === 'string' ? licenseType as LicenseType : licenseType;
  
  switch (normalizedType) {
    case LicenseType.NON_COMMERCIAL:
    case "non-commercial":
      return "1"; 
    case LicenseType.COMMERCIAL_USE:
    case "commercial-use":
      return "2"; 
    case LicenseType.COMMERCIAL_REMIX:
    case "commercial-remix":
      return "3"; 
    default:
      throw new Error(`Unknown license type: ${licenseType}`);
  }
}
