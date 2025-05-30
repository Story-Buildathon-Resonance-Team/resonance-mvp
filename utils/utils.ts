import {
  LicenseTerms,
  LicensingConfig,
  WIP_TOKEN_ADDRESS,
} from "@story-protocol/core-sdk";
import { Address, parseEther, zeroAddress } from "viem";
import dotenv from "dotenv";
import { networkInfo } from "./config";

dotenv.config();

export const NFTContractAddress: Address =
  (process.env.NFT_CONTRACT_ADDRESS as Address) ||
  networkInfo.defaultNFTContractAddress ||
  zeroAddress;

export const SPGNFTContractAddress: Address =
  (process.env.SPG_NFT_CONTRACT_ADDRESS as Address) ||
  networkInfo.defaultSPGNFTContractAddress ||
  zeroAddress;

// Pre-configured PIL Flavor for "help this story go viral"
// https://docs.story.foundation/concepts/programmable-ip-license/pil-flavors#flavor-%231%3A-non-commercial-social-remixing

export const NonCommercialSocialRemixingTermsId = "1";
const nonCommercialSocialRemix: LicenseTerms = {
  transferable: true,
  royaltyPolicy: zeroAddress,
  defaultMintingFee: 0n,
  expiration: 0n,
  commercialUse: false,
  commercialAttribution: false,
  commercializerChecker: zeroAddress,
  commercializerCheckerData: "0x",
  commercialRevShare: 0,
  commercialRevCeiling: 0n,
  derivativesAllowed: true,
  derivativesAttribution: true,
  derivativesApproval: false,
  derivativesReciprocal: true,
  derivativeRevCeiling: 0n,
  currency: zeroAddress,
  uri: "https://github.com/piplabs/pil-document/blob/998c13e6ee1d04eb817aefd1fe16dfe8be3cd7a2/off-chain-terms/NCSR.json",
};

// Docs: https://docs.story.foundation/developers/deployed-smart-contracts
export const RoyaltyPolicyLAP: Address =
  "0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E";
export const RoyaltyPolicyLRP: Address =
  "0x9156e603C949481883B1d3355c6f1132D191fC41";

// Pre-configured PIL Flavor for "support this story and earn money together"
// https://docs.story.foundation/concepts/programmable-ip-license/pil-flavors#commercial-remix

export function createCommercialRemixTerms(terms: {
  commercialRevShare: number;
  defaultMintingFee: number;
}): LicenseTerms {
  return {
    transferable: true,
    royaltyPolicy: RoyaltyPolicyLAP,
    defaultMintingFee: parseEther(terms.defaultMintingFee.toString()),
    expiration: BigInt(0),
    commercialUse: true,
    commercialAttribution: true,
    commercializerChecker: zeroAddress,
    commercializerCheckerData: "0x",
    commercialRevShare: terms.commercialRevShare,
    commercialRevCeiling: BigInt(0),
    derivativesAllowed: true,
    derivativesAttribution: true,
    derivativesApproval: false,
    derivativesReciprocal: true,
    derivativeRevCeiling: BigInt(0),
    currency: WIP_TOKEN_ADDRESS,
    uri: "https://github.com/piplabs/pil-document/blob/ad67bb632a310d2557f8abcccd428e4c9c798db1/off-chain-terms/CommercialRemix.json",
  };
}
