import { DetailedLicenseTerms } from "../types/license";

// PIL Flavor IDs we support
const SUPPORTED_PIL_FLAVORS = ["1", "2", "3"];

/**
 * Get license terms from Story Protocol API, filtered to only PIL Flavors
 * @param ipId Story Protocol IP ID
 * @returns Array of detailed license terms for PIL Flavors only
 * @throws Error if API request fails
 */
export async function getIPLicensesFromStory(
  ipId: string
): Promise<DetailedLicenseTerms[]> {
  if (!process.env.X_API_KEY || !process.env.X_CHAIN) {
    throw new Error("Story Protocol API credentials not configured");
  }

  const response = await fetch(
    `https://api.storyapis.com/api/v3/assets/${ipId}/licenses`,
    {
      headers: {
        "X-Api-Key": process.env.X_API_KEY,
        "X-Chain": process.env.X_CHAIN,
      },
      // Use Next.js cache with revalidation
      next: { revalidate: 900 }, // 15 minutes
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch license terms: ${response.status} ${response.statusText}`
    );
  }

  const apiResponse = await response.json();

  if (!apiResponse || !apiResponse.data || !Array.isArray(apiResponse.data)) {
    throw new Error("Invalid license data format from API");
  }

  // Filter to only PIL Flavors (license terms IDs 1, 2, 3) and exclude disabled licenses
  const pilFlavorLicenses = apiResponse.data.filter(
    (license: DetailedLicenseTerms) =>
      !license.disabled &&
      SUPPORTED_PIL_FLAVORS.includes(license.licenseTemplateId)
  );

  return pilFlavorLicenses;
}
