import { getLicenseTermsById, validateLicenseCompatibility, LicenseType, LICENSE_TYPE_TO_ID } from "../utils/utils";

export interface LicenseInfo {
    id: string;
    type: LicenseType;
    name: string;
    description: string;
    allowsDerivatives: boolean;
    isCommercial: boolean;
    requiresAttribution: boolean;
    commercialRevShare: number;
}

export interface ParentAssetLicenseInfo {
    ipId: string;
    title: string;
    author: string;
    licenses: LicenseInfo[];
    hasMultipleLicenses: boolean;
}

export interface LicenseInheritanceResult {
    requiresSelection: boolean;
    availableLicenses: LicenseInfo[];
    inheritedLicense?: LicenseInfo;
    error?: string;
}

/**
 * Get human-readable license information
 */
export function getLicenseDisplayInfo(licenseType: LicenseType): LicenseInfo {
    const licenseId = LICENSE_TYPE_TO_ID[licenseType];
    const terms = getLicenseTermsById(licenseId);

    if (!terms) {
        throw new Error(`Invalid license type: ${licenseType}`);
    }

    const licenseInfoMap: Record<LicenseType, Omit<LicenseInfo, 'id'>> = {
        [LicenseType.NON_COMMERCIAL]: {
            type: LicenseType.NON_COMMERCIAL,
            name: "Non-Commercial Social Remixing",
            description: "Allows remixing and sharing for non-commercial purposes only. Derivatives must use the same license.",
            allowsDerivatives: true,
            isCommercial: false,
            requiresAttribution: true,
            commercialRevShare: 0,
        },
        [LicenseType.COMMERCIAL_USE]: {
            type: LicenseType.COMMERCIAL_USE,
            name: "Commercial Use Only",
            description: "Allows commercial use but prohibits creating derivatives. No remixing allowed.",
            allowsDerivatives: false,
            isCommercial: true,
            requiresAttribution: true,
            commercialRevShare: 10,
        },
        [LicenseType.COMMERCIAL_REMIX]: {
            type: LicenseType.COMMERCIAL_REMIX,
            name: "Commercial Remix",
            description: "Allows commercial use and remixing. Derivatives must use the same license and share revenue.",
            allowsDerivatives: true,
            isCommercial: true,
            requiresAttribution: true,
            commercialRevShare: 25,
        },
    };

    return {
        id: licenseId,
        ...licenseInfoMap[licenseType],
    };
}

/**
 * Get all available license types that allow derivatives
 */
export function getDerivativeCompatibleLicenses(): LicenseInfo[] {
    return [
        getLicenseDisplayInfo(LicenseType.NON_COMMERCIAL),
        getLicenseDisplayInfo(LicenseType.COMMERCIAL_REMIX),
    ];
}

/**
 * Determine license inheritance requirements for a derivative work
 */
export function determineLicenseInheritance(
    parentLicenses: LicenseType[]
): LicenseInheritanceResult {
    if (!parentLicenses || parentLicenses.length === 0) {
        return {
            requiresSelection: false,
            availableLicenses: [],
            error: "No parent licenses found",
        };
    }

    // Filter out licenses that don't allow derivatives
    const derivativeCompatibleLicenses = parentLicenses
        .map(type => getLicenseDisplayInfo(type))
        .filter(license => license.allowsDerivatives);

    if (derivativeCompatibleLicenses.length === 0) {
        return {
            requiresSelection: false,
            availableLicenses: [],
            error: "Parent asset licenses do not allow derivatives",
        };
    }

    // Single license case - automatic inheritance
    if (derivativeCompatibleLicenses.length === 1) {
        return {
            requiresSelection: false,
            availableLicenses: derivativeCompatibleLicenses,
            inheritedLicense: derivativeCompatibleLicenses[0],
        };
    }

    // Multiple licenses case - requires user selection
    return {
        requiresSelection: true,
        availableLicenses: derivativeCompatibleLicenses,
    };
}

/**
 * Validate that a selected license is compatible with parent licenses
 */
export function validateDerivativeLicenseSelection(
    parentLicenses: LicenseType[],
    selectedLicenseType: LicenseType
): {
    isValid: boolean;
    error?: string;
} {
    const selectedLicenseInfo = getLicenseDisplayInfo(selectedLicenseType);

    // Check if the selected license is among the parent's available licenses
    const parentLicenseIds = parentLicenses.map(type => LICENSE_TYPE_TO_ID[type]);
    const isAvailableInParent = parentLicenseIds.includes(selectedLicenseInfo.id);

    if (!isAvailableInParent) {
        return {
            isValid: false,
            error: "Selected license is not available from the parent asset",
        };
    }

    // Additional validation using the existing compatibility function
    const compatibility = validateLicenseCompatibility(
        selectedLicenseInfo.id,
        selectedLicenseInfo.id
    );

    if (!compatibility.isCompatible) {
        return {
            isValid: false,
            error: compatibility.reason,
        };
    }

    return {
        isValid: true,
    };
}

/**
 * Get parent asset license information from various sources
 */
export async function getParentAssetLicenseInfo(
    ipId: string,
    publishedStories?: any[],
    staticUserData?: any[]
): Promise<ParentAssetLicenseInfo | null> {
    try {
        // First check published stories (from store)
        if (publishedStories) {
            const storeStory = publishedStories.find(s => s.ipId === ipId);
            if (storeStory) {
                const licenses = storeStory.licenseTypes?.map((type: string) =>
                    getLicenseDisplayInfo(type as LicenseType)
                ) || [getLicenseDisplayInfo(LicenseType.NON_COMMERCIAL)];

                return {
                    ipId: storeStory.ipId,
                    title: storeStory.title,
                    author: storeStory.author.name || storeStory.author.address.slice(0, 8) + "...",
                    licenses,
                    hasMultipleLicenses: licenses.length > 1,
                };
            }
        }

        // Fallback to static user data
        if (staticUserData) {
            for (const user of staticUserData) {
                const foundStory = user.stories?.find((s: any) => s.ipId === ipId);
                if (foundStory) {
                    // Static stories default to non-commercial license
                    const licenses = [getLicenseDisplayInfo(LicenseType.NON_COMMERCIAL)];

                    return {
                        ipId: foundStory.ipId,
                        title: foundStory.title,
                        author: user.userName || user.walletAddress.slice(0, 8) + "...",
                        licenses,
                        hasMultipleLicenses: false,
                    };
                }
            }
        }

        // TODO: In a real implementation, this would query the Story Protocol
        // to get the actual license terms attached to the IP asset
        console.warn(`Could not find license information for IP ID: ${ipId}`);
        return null;
    } catch (error) {
        console.error("Error getting parent asset license info:", error);
        return null;
    }
}

/**
 * Format license information for display in UI
 */
export function formatLicenseForDisplay(license: LicenseInfo): {
    title: string;
    subtitle: string;
    badge: string;
    description: string;
    features: string[];
} {
    const features: string[] = [];

    if (license.allowsDerivatives) {
        features.push("Allows remixing");
    }

    if (license.isCommercial) {
        features.push("Commercial use allowed");
        if (license.commercialRevShare > 0) {
            features.push(`${license.commercialRevShare}% revenue share`);
        }
    } else {
        features.push("Non-commercial only");
    }

    if (license.requiresAttribution) {
        features.push("Attribution required");
    }

    return {
        title: license.name,
        subtitle: license.type.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        badge: license.isCommercial ? "Commercial" : "Non-Commercial",
        description: license.description,
        features,
    };
}

/**
 * Get license inheritance summary for display
 */
export function getLicenseInheritanceSummary(
    parentLicenses: LicenseType[],
    selectedLicense?: LicenseType
): {
    status: "automatic" | "selection_required" | "no_derivatives" | "error";
    message: string;
    selectedLicenseInfo?: LicenseInfo;
} {
    const inheritance = determineLicenseInheritance(parentLicenses);

    if (inheritance.error) {
        return {
            status: "error",
            message: inheritance.error,
        };
    }

    if (inheritance.availableLicenses.length === 0) {
        return {
            status: "no_derivatives",
            message: "The parent asset does not allow derivative works.",
        };
    }

    if (!inheritance.requiresSelection && inheritance.inheritedLicense) {
        return {
            status: "automatic",
            message: `Your remix will automatically inherit the "${inheritance.inheritedLicense.name}" license from the parent asset.`,
            selectedLicenseInfo: inheritance.inheritedLicense,
        };
    }

    if (inheritance.requiresSelection) {
        if (selectedLicense) {
            const selectedLicenseInfo = getLicenseDisplayInfo(selectedLicense);
            return {
                status: "selection_required",
                message: `You have selected the "${selectedLicenseInfo.name}" license for your remix.`,
                selectedLicenseInfo,
            };
        } else {
            return {
                status: "selection_required",
                message: `The parent asset has multiple licenses. Please select one for your remix.`,
            };
        }
    }

    return {
        status: "error",
        message: "Unable to determine license inheritance requirements.",
    };
}