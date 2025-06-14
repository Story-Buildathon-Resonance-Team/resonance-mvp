import { NextRequest, NextResponse } from "next/server";
import { initializeServerConfig } from "@/utils/serverConfig";
import {
  NonCommercialSocialRemixingTerms,
  CommercialUseOnlyTerms,
  CommercialRemixTerms,
  SPGNFTContractAddress,
  PILTemplateAddress,
} from "@/utils/utils";
import { uploadJSONToIPFS } from "@/utils/pinata";
import { createHash } from "crypto";
import { IpMetadata } from "@story-protocol/core-sdk";
import { Address, Hash } from "viem";

interface StoryRegistrationRequest {
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

export async function GET() {
  return NextResponse.json({
    message: "Story registration API is running",
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    console.log("=== Starting Story IP Registration API ===");

    // Parse request body first
    const data: StoryRegistrationRequest = await request.json();
    console.log("Request data parsed successfully");

    // Validate license types array
    if (
      !data.licenseTypes ||
      !Array.isArray(data.licenseTypes) ||
      data.licenseTypes.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "At least one license type must be selected",
        },
        { status: 400 }
      );
    }

    // Initialize server-side config
    console.log("Initializing server config...");
    const { client } = initializeServerConfig();
    console.log("Server config initialized successfully");

    console.log("Registration data:", {
      title: data.title,
      author: data.author,
      licenseTypes: data.licenseTypes,
      contentCID: data.contentCID,
      imageCID: data.imageCID,
    });

    // 1. Generate hashes for content and image
    const imageHash = createHash("sha256")
      .update(data.imageCID)
      .digest("hex") as Hash;
    const mediaHash = createHash("sha256")
      .update(data.contentCID)
      .digest("hex") as Hash;

    console.log("Generated hashes:", { imageHash, mediaHash });

    // 2. Generate IP Metadata
    const ipMetadata: IpMetadata = client.ipAsset.generateIpMetadata({
      title: data.title,
      description: data.description,
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
    });

    console.log("Generated IP Metadata:", ipMetadata);

    // 3. Generate NFT Metadata
    const nftMetadata = {
      name: data.title,
      description: `${data.description} This NFT represents ownership of the IP Asset.`,
      image: `https://gateway.pinata.cloud/ipfs/${data.imageCID}`,
      animation_url: `https://gateway.pinata.cloud/ipfs/${data.contentCID}`,
      attributes: [
        {
          trait_type: "Author",
          value: data.author.name,
        },
        {
          trait_type: "Content Type",
          value: "Fiction Story",
        },
        {
          trait_type: "License Count",
          value: data.licenseTypes.length.toString(),
        },
        ...data.licenseTypes.map((type, index) => ({
          trait_type: `License ${index + 1}`,
          value:
            type === "non-commercial"
              ? "Non-Commercial Social Remixing"
              : type === "commercial-use"
              ? "Commercial Use Only"
              : "Commercial Remix",
        })),
        {
          trait_type: "Created",
          value: new Date().toISOString(),
        },
      ],
    };

    console.log("Generated NFT Metadata:", nftMetadata);

    // 4. Upload metadata to IPFS
    console.log("Uploading IP metadata to IPFS...");
    const ipIpfsHash = await uploadJSONToIPFS(ipMetadata);
    const ipHash = createHash("sha256")
      .update(JSON.stringify(ipMetadata))
      .digest("hex");

    console.log("Uploading NFT metadata to IPFS...");
    const nftIpfsHash = await uploadJSONToIPFS(nftMetadata);
    const nftHash = createHash("sha256")
      .update(JSON.stringify(nftMetadata))
      .digest("hex");

    console.log("Metadata uploaded:", {
      ipMetadataCID: ipIpfsHash,
      nftMetadataCID: nftIpfsHash,
    });

    // 5. Determine license terms
    const licenseTermsData = data.licenseTypes.map((licenseType) => {
      switch (licenseType) {
        case "non-commercial":
          return { terms: NonCommercialSocialRemixingTerms };
        case "commercial-use":
          return { terms: CommercialUseOnlyTerms };
        case "commercial-remix":
          return { terms: CommercialRemixTerms };
        default:
          throw new Error(`Invalid license type: ${licenseType}`);
      }
    });

    console.log("License terms:", licenseTermsData);
    console.log("PIL Template Address:", PILTemplateAddress);

    // 6. Register with Story Protocol
    console.log("Registering with Story Protocol...");
    const response = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
      spgNftContract: SPGNFTContractAddress,
      licenseTermsData,
      ipMetadata: {
        ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
        ipMetadataHash: `0x${ipHash}`,
        nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
        nftMetadataHash: `0x${nftHash}`,
      },
      txOptions: { waitForTransaction: true },
    });

    console.log("Story Protocol registration response:", response);

    // 7. Prepare response data (convert BigInt values to strings for JSON serialization)
    const storyData = {
      id: response.ipId!,
      title: data.title,
      description: data.description,
      author: data.author,
      contentCID: data.contentCID,
      imageCID: data.imageCID,
      ipId: response.ipId!,
      txHash: response.txHash!,
      licenseTermsIds: response.licenseTermsIds!.map((id) => id.toString()),
      tokenId: response.tokenId?.toString(),
      licenseTypes: data.licenseTypes,
      createdAt: new Date().toISOString(),
      ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
      nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
      ipMetadataCID: ipIpfsHash,
      nftMetadataCID: nftIpfsHash,
      imageHash,
      mediaHash,
    };

    const explorerUrl = `${process.env.NEXT_PUBLIC_PROTOCOL_EXPLORER}/ipa/${response.ipId}`;

    console.log("=== STORY REGISTRATION SUCCESSFUL ===");
    console.log("Transaction Hash:", response.txHash);
    console.log("IPA ID:", response.ipId);
    console.log("License Terms IDs:", response.licenseTermsIds);
    console.log("Token ID:", response.tokenId);
    console.log("Explorer URL:", explorerUrl);

    return NextResponse.json({
      success: true,
      ipId: response.ipId!,
      txHash: response.txHash!,
      licenseTermsIds: response.licenseTermsIds!.map((id) => id.toString()),
      tokenId: response.tokenId?.toString(),
      storyData,
      explorerUrl,
    });
  } catch (error) {
    console.error("=== STORY REGISTRATION FAILED ===");
    console.error("Error details:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );

    // Return a proper JSON error response
    return NextResponse.json(
      {
        success: false,
        error: `Failed to register story: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        details: error instanceof Error ? error.stack : String(error),
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
