import { LicenseTerms, LicensingConfig, WIP_TOKEN_ADDRESS } from '@story-protocol/core-sdk'
import { Address, parseEther, zeroAddress } from 'viem'
import { networkInfo } from './clientConfig'

// Export contract addresses with appropriate defaults based on network
export const NFTContractAddress: Address =
    (process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as Address) || networkInfo.defaultNFTContractAddress || zeroAddress

export const SPGNFTContractAddress: Address =
    (process.env.NEXT_PUBLIC_SPG_NFT_CONTRACT_ADDRESS as Address) || networkInfo.defaultSPGNFTContractAddress || zeroAddress

// This is a pre-configured PIL Flavor:
// https://docs.story.foundation/concepts/programmable-ip-license/pil-flavors#flavor-%231%3A-non-commercial-social-remixing
export const NonCommercialSocialRemixingTermsId = '1'
export const NonCommercialSocialRemixingTerms: LicenseTerms = {
    transferable: true,
    royaltyPolicy: '0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E',
    defaultMintingFee: 0n,
    expiration: 0n,
    commercialUse: false,
    commercialAttribution: false,
    commercializerChecker: zeroAddress,
    commercializerCheckerData: '0x',
    commercialRevShare: 0,
    commercialRevCeiling: 0n,
    derivativesAllowed: true,
    derivativesAttribution: true,
    derivativesApproval: false,
    derivativesReciprocal: false,
    derivativeRevCeiling: 0n,
    currency: '0x1514000000000000000000000000000000000000',
    uri: '',
}
//commercial use only terms no derivatives
export const CommercialUseOnlyTermsId = '2'
export const CommercialUseOnlyTerms: LicenseTerms = {
    transferable: true,
    royaltyPolicy: '0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E',
    defaultMintingFee: 0n,
    expiration: 0n,
    commercialUse: true,
    commercialAttribution: true,
    commercializerChecker: zeroAddress,
    commercializerCheckerData: '0x',
    commercialRevShare: 10,
    commercialRevCeiling: 0n,
    derivativesAllowed: false,
    derivativesAttribution: false,
    derivativesApproval: false,
    derivativesReciprocal: false,
    derivativeRevCeiling: 0n,
    currency: '0x1514000000000000000000000000000000000000',
    uri: '',
}
//commercial remix terms with derivatives
export const CommercialRemixTermsId = '3'
export const CommercialRemixTerms: LicenseTerms = {
    transferable: true,
    royaltyPolicy: '0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E',
    defaultMintingFee: 0n,
    expiration: 0n,
    commercialUse: true,
    commercialAttribution: true,
    commercializerChecker: zeroAddress,
    commercializerCheckerData: '0x',
    commercialRevShare: 25,
    commercialRevCeiling: 0n,
    derivativesAllowed: true,
    derivativesAttribution: true,
    derivativesApproval: false,
    derivativesReciprocal: false,
    derivativeRevCeiling: 0n,
    currency: '0x1514000000000000000000000000000000000000',
    uri: '',
}
// Note: Attribution-only terms (ID "4") don't exist in the current PIL implementation
// Only IDs "1", "2", and "3" are valid predefined license terms

// Docs: https://docs.story.foundation/developers/deployed-smart-contracts
export const RoyaltyPolicyLAP: Address = '0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E'
export const RoyaltyPolicyLRP: Address = '0x9156e603C949481883B1d3355c6f1132D191fC41'
export const PILTemplateAddress: Address = '0x2E896b0b2Fdb7457499B56AAaA4AE55BCB4Cd316' // Correct PIL Template address

// This is a pre-configured PIL Flavor:
// https://docs.story.foundation/concepts/programmable-ip-license/pil-flavors#flavor-%233%3A-commercial-remix
export function createCommercialRemixTerms(terms: { commercialRevShare: number; defaultMintingFee: number }): LicenseTerms {
    return {
        transferable: true,
        royaltyPolicy: RoyaltyPolicyLAP,
        defaultMintingFee: parseEther(terms.defaultMintingFee.toString()),
        expiration: BigInt(0),
        commercialUse: true,
        commercialAttribution: true,
        commercializerChecker: zeroAddress,
        commercializerCheckerData: '0x',
        commercialRevShare: terms.commercialRevShare,
        commercialRevCeiling: BigInt(0),
        derivativesAllowed: true,
        derivativesAttribution: true,
        derivativesApproval: false,
        derivativesReciprocal: true,
        derivativeRevCeiling: BigInt(0),
        currency: WIP_TOKEN_ADDRESS,
        uri: 'https://github.com/piplabs/pil-document/blob/ad67bb632a310d2557f8abcccd428e4c9c798db1/off-chain-terms/CommercialRemix.json',
    }
}

export const defaultLicensingConfig: LicensingConfig = {
    mintingFee: 0n,
    isSet: false,
    disabled: false,
    commercialRevShare: 0,
    expectGroupRewardPool: zeroAddress,
    expectMinimumGroupRewardShare: 0,
    licensingHook: zeroAddress,
    hookData: '0x',
}

export function convertRoyaltyPercentToTokens(royaltyPercent: number): number {
    // there are 100,000,000 tokens total (100, but 6 decimals)
    return royaltyPercent * 1_000_000
}

// License Type Enum for better type safety (only valid license types)
export enum LicenseType {
    NON_COMMERCIAL = 'non-commercial',
    COMMERCIAL_USE = 'commercial-use',
    COMMERCIAL_REMIX = 'commercial-remix',
}

// Mapping from license type to license terms ID (only valid IDs)
export const LICENSE_TYPE_TO_ID: Record<LicenseType, string> = {
    [LicenseType.NON_COMMERCIAL]: NonCommercialSocialRemixingTermsId,
    [LicenseType.COMMERCIAL_USE]: CommercialUseOnlyTermsId,
    [LicenseType.COMMERCIAL_REMIX]: CommercialRemixTermsId,
}

// Utility functions for working with license terms (only valid terms)
export function getAllLicenseTerms(): Record<string, LicenseTerms> {
    return {
        [NonCommercialSocialRemixingTermsId]: NonCommercialSocialRemixingTerms,
        [CommercialUseOnlyTermsId]: CommercialUseOnlyTerms,
        [CommercialRemixTermsId]: CommercialRemixTerms,
    }
}

export function getLicenseTermsById(id: string): LicenseTerms | undefined {
    const allTerms = getAllLicenseTerms()
    return allTerms[id]
}

export function isCommercialLicense(licenseTermsId: string): boolean {
    const terms = getLicenseTermsById(licenseTermsId)
    return terms?.commercialUse ?? false
}

export function allowsDerivatives(licenseTermsId: string): boolean {
    const terms = getLicenseTermsById(licenseTermsId)
    return terms?.derivativesAllowed ?? false
}

export function requiresAttribution(licenseTermsId: string): boolean {
    const terms = getLicenseTermsById(licenseTermsId)
    return terms?.derivativesAttribution ?? false
}

export function isTransferable(licenseTermsId: string): boolean {
    const terms = getLicenseTermsById(licenseTermsId)
    return terms?.transferable ?? false
}

export function hasExpiration(licenseTermsId: string): boolean {
    const terms = getLicenseTermsById(licenseTermsId)
    return terms?.expiration !== undefined && terms.expiration > 0n
}

export function getCommercialRevShare(licenseTermsId: string): number {
    const terms = getLicenseTermsById(licenseTermsId)
    return terms?.commercialRevShare ?? 0
}

export function getMintingFee(licenseTermsId: string): bigint {
    const terms = getLicenseTermsById(licenseTermsId)
    return terms?.defaultMintingFee ?? 0n
}

export function getLicenseTypeFromId(id: string): LicenseType | undefined {
    for (const [type, licenseId] of Object.entries(LICENSE_TYPE_TO_ID)) {
        if (licenseId === id) {
            return type as LicenseType
        }
    }
    return undefined
}

export function getLicenseIdFromType(type: LicenseType): string {
    return LICENSE_TYPE_TO_ID[type]
}

export function getLicenseTermsByType(type: LicenseType): LicenseTerms | undefined {
    const id = getLicenseIdFromType(type)
    return getLicenseTermsById(id)
}

// Helper function to get human-readable license information
export function getLicenseInfo(licenseTermsId: string): {
    id: string
    type?: LicenseType
    isCommercial: boolean
    allowsDerivatives: boolean
    requiresAttribution: boolean
    isTransferable: boolean
    hasExpiration: boolean
    commercialRevShare: number
    mintingFee: bigint
} {
    return {
        id: licenseTermsId,
        type: getLicenseTypeFromId(licenseTermsId),
        isCommercial: isCommercialLicense(licenseTermsId),
        allowsDerivatives: allowsDerivatives(licenseTermsId),
        requiresAttribution: requiresAttribution(licenseTermsId),
        isTransferable: isTransferable(licenseTermsId),
        hasExpiration: hasExpiration(licenseTermsId),
        commercialRevShare: getCommercialRevShare(licenseTermsId),
        mintingFee: getMintingFee(licenseTermsId),
    }
}

// Validation functions
export function isValidLicenseTermsId(id: string): boolean {
    return getLicenseTermsById(id) !== undefined
}

export function validateLicenseCompatibility(parentLicenseId: string, derivativeLicenseId: string): {
    isCompatible: boolean
    reason?: string
} {
    const parentTerms = getLicenseTermsById(parentLicenseId)
    const derivativeTerms = getLicenseTermsById(derivativeLicenseId)

    if (!parentTerms || !derivativeTerms) {
        return {
            isCompatible: false,
            reason: 'Invalid license terms ID'
        }
    }

    if (!parentTerms.derivativesAllowed) {
        return {
            isCompatible: false,
            reason: 'Parent license does not allow derivatives'
        }
    }

    if (parentTerms.derivativesReciprocal && derivativeTerms !== parentTerms) {
        return {
            isCompatible: false,
            reason: 'Parent license requires reciprocal licensing (same terms)'
        }
    }

    if (parentTerms.commercialUse && !derivativeTerms.commercialUse) {
        return {
            isCompatible: false,
            reason: 'Cannot create non-commercial derivative from commercial license'
        }
    }

    return {
        isCompatible: true
    }
}