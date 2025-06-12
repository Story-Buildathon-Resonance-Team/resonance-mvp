// src/app/api/register-derivative/route.ts
import { NextRequest, NextResponse } from "next/server";
import { initializeServerConfig } from "@/utils/serverConfig";
import { uploadJSONToIPFS } from "@/utils/pinata";
import { createHash } from "crypto";
import { IpMetadata } from "@story-protocol/core-sdk";
import { Address, Hash } from "viem";
import {
  PILTemplateAddress,
  validateLicenseCompatibility,
  getLicenseTermsById,
  SPGNFTContractAddress,
} from "@/utils/utils";

interface DerivativeRegistrationRequest {
  title: string;
  description: string;
  contentCID: string;
  imageCID: string;
  author: {
    name: string;
    address: Address;
  };
  parentIpId: Address;
  parentLicenseTermsId: string;
  derivativeLicenseType:
    | "non-commercial"
    | "commercial-use"
    | "commercial-remix";
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

export async function POST(request: NextRequest) {
  try {
    console.log("=== Starting Derivative IP Registration API ===");
    console.log("SPGNFTContractAddress:", SPGNFTContractAddress);
    console.log("PILTemplateAddress:", PILTemplateAddress);

    const data: DerivativeRegistrationRequest = await request.json();
    console.log("Derivative request data:", {
      title: data.title,
      parentIpId: data.parentIpId,
      authorAddress: data.author.address,
      derivativeLicenseType: data.derivativeLicenseType
    });

    // Initialize server-side config
    const { client } = initializeServerConfig();

    // 1. Validate parent IP exists and license compatibility
    console.log("Validating parent IP and license compatibility...");

    try {
      // Check if parent IP exists (this would need actual implementation)
      // const parentIP = await client.ipAsset.getIpMetadata(data.parentIpId);

      // Convert derivative license type to license terms ID
      const derivativeLicenseTermsId = getLicenseTermsIdFromType(data.derivativeLicenseType);
      
      console.log("License validation:", {
        parentLicenseTermsId: data.parentLicenseTermsId,
        derivativeLicenseType: data.derivativeLicenseType,
        derivativeLicenseTermsId: derivativeLicenseTermsId
      });
      
      // Validate license compatibility
      const compatibility = validateLicenseCompatibility(
        data.parentLicenseTermsId,
        derivativeLicenseTermsId
      );

      if (!compatibility.isCompatible) {
        return NextResponse.json(
          {
            success: false,
            error: `License incompatibility: ${compatibility.reason}`,
          },
          { status: 400 }
        );
      }
    } catch (validationError) {
      console.error("Parent IP validation failed:", validationError);
      return NextResponse.json(
        {
          success: false,
          error:
            "Could not validate parent IP. Please ensure the parent IP ID is correct.",
        },
        { status: 400 }
      );
    }

    // 2. Generate hashes for content and image
    const imageHash = createHash("sha256")
      .update(data.imageCID)
      .digest("hex") as Hash;
    const mediaHash = createHash("sha256")
      .update(data.contentCID)
      .digest("hex") as Hash;

    // 3. Generate IP Metadata for derivative
    const ipMetadata: IpMetadata = client.ipAsset.generateIpMetadata({
      title: data.title,
      description: `${data.description} [Derivative of IP: ${data.parentIpId}]`,
      createdAt: Date.now().toString(),
      creators: [
        {
          name: data.author.name,
          address: data.author.address,
          contributionPercent: 100,
        },
      ],
      image: `https://gateway.pinata.cloud/ipfs/${data.imageCID}`,
      imageHash: `0x${imageHash}`,
      mediaUrl: `https://gateway.pinata.cloud/ipfs/${data.contentCID}`,
      mediaHash: `0x${mediaHash}`,
      mediaType: "text/plain",
      // Add derivative-specific metadata
      derivativeOf: data.parentIpId,
      licenseTerms: data.parentLicenseTermsId,
    });

    // 4. Generate NFT Metadata for derivative
    const nftMetadata = {
      name: data.title,
      description: `${data.description} This derivative NFT represents a new creative work based on IP Asset ${data.parentIpId}.`,
      image: `https://gateway.pinata.cloud/ipfs/${data.imageCID}`,
      animation_url: `https://gateway.pinata.cloud/ipfs/${data.contentCID}`,
      attributes: [
        {
          trait_type: "Author",
          value: data.author.name,
        },
        {
          trait_type: "Content Type",
          value: "Derivative Fiction Story",
        },
        {
          trait_type: "Parent IP ID",
          value: data.parentIpId,
        },
        {
          trait_type: "Parent License Terms",
          value: data.parentLicenseTermsId,
        },
        {
          trait_type: "Created",
          value: new Date().toISOString(),
        },
      ],
    };

    // 5. Upload metadata to IPFS
    console.log("Uploading metadata to IPFS...");
    const ipIpfsHash = await uploadJSONToIPFS(ipMetadata);
    const ipHash = createHash("sha256")
      .update(JSON.stringify(ipMetadata))
      .digest("hex");

    const nftIpfsHash = await uploadJSONToIPFS(nftMetadata);
    const nftHash = createHash("sha256")
      .update(JSON.stringify(nftMetadata))
      .digest("hex");

    // 6. Register derivative with Story Protocol
    console.log("Registering derivative with Story Protocol...");

    try {
      // First, ensure parent has the required license terms attached
      await client.license.attachLicenseTerms({
        ipId: data.parentIpId,
        licenseTermsId: data.parentLicenseTermsId,
        licenseTemplate: PILTemplateAddress,
        txOptions: { waitForTransaction: true },
      });
    } catch (attachError) {
      console.log("License terms may already be attached:", attachError);
    }

    console.log("Registering derivative with:", {
      spgNftContract: SPGNFTContractAddress,
      recipient: data.author.address,
      parentIpId: data.parentIpId,
      parentLicenseTermsId: data.parentLicenseTermsId,
      PILTemplateAddress: PILTemplateAddress
    });

    // Register the derivative
    const response = await client.ipAsset.mintAndRegisterIpAndMakeDerivative({
      spgNftContract: SPGNFTContractAddress,
      recipient: data.author.address,
      derivData: {
        parentIpIds: [data.parentIpId],
        licenseTermsIds: [BigInt(data.parentLicenseTermsId)],
        licenseTemplate: PILTemplateAddress,
      },
      ipMetadata: {
        ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
        ipMetadataHash: `0x${ipHash}`,
        nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
        nftMetadataHash: `0x${nftHash}`,
      },
      txOptions: { waitForTransaction: true },
    });

    console.log("Derivative registered successfully:", response);

    // 7. Prepare response data
    const derivativeData = {
      id: response.ipId!,
      title: data.title,
      description: data.description,
      author: data.author,
      contentCID: data.contentCID,
      imageCID: data.imageCID,
      parentIpId: data.parentIpId,
      parentLicenseTermsId: data.parentLicenseTermsId,
      ipId: response.ipId!,
      txHash: response.txHash!,
      tokenId: response.tokenId?.toString(),
      createdAt: new Date().toISOString(),
      ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
      nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
    };

    const explorerUrl = `${process.env.NEXT_PUBLIC_PROTOCOL_EXPLORER}/ipa/${response.ipId}`;

    console.log("=== DERIVATIVE REGISTRATION SUCCESSFUL ===");
    console.log("Transaction Hash:", response.txHash);
    console.log("Derivative IPA ID:", response.ipId);
    console.log("Parent IPA ID:", data.parentIpId);
    console.log("Explorer URL:", explorerUrl);

    return NextResponse.json({
      success: true,
      ipId: response.ipId!,
      txHash: response.txHash!,
      tokenId: response.tokenId?.toString(),
      derivativeData,
      explorerUrl,
      parentIpId: data.parentIpId,
    });
  } catch (error) {
    console.error("=== DERIVATIVE REGISTRATION FAILED ===");
    console.error("Error details:", error);

    return NextResponse.json(
      {
        success: false,
        error: `Failed to register derivative: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        details: error instanceof Error ? error.stack : String(error),
      },
      { status: 500 }
    );
  }
}
