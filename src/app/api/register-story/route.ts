import { NextRequest, NextResponse } from "next/server";
import { initializeServerConfig } from "@/utils/config";
import {
  createCommercialRemixTerms,
  NonCommercialSocialRemixingTerms,
  SPGNFTContractAddress,
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
  licenseType: "non-commercial" | "commercial-remix";
}

export async function POST(request: NextRequest) {
  try {
    console.log("=== Starting Story IP Registration API ===");

    // Initialize server-side config
    const { client } = initializeServerConfig();

    // Parse request body
    const data: StoryRegistrationRequest = await request.json();

    console.log("Registration data:", {
      title: data.title,
      author: data.author,
      licenseType: data.licenseType,
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
          trait_type: "License Type",
          value:
            data.licenseType === "non-commercial"
              ? "Non-Commercial Social Remixing"
              : "Commercial Remix",
        },
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
    const licenseTermsData =
      data.licenseType === "non-commercial"
        ? [{ terms: NonCommercialSocialRemixingTerms }]
        : [
            {
              terms: createCommercialRemixTerms({
                defaultMintingFee: 1,
                commercialRevShare: 5,
              }),
            },
          ];

    console.log("License terms:", licenseTermsData);

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

    // 7. Prepare response data
    const storyData = {
      id: response.ipId!,
      title: data.title,
      description: data.description,
      author: data.author,
      contentCID: data.contentCID,
      imageCID: data.imageCID,
      ipId: response.ipId!,
      txHash: response.txHash!,
      licenseTermsIds: response.licenseTermsIds!,
      licenseType: data.licenseType,
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
    console.log("Explorer URL:", explorerUrl);

    return NextResponse.json({
      success: true,
      ipId: response.ipId!,
      txHash: response.txHash!,
      licenseTermsIds: response.licenseTermsIds!,
      storyData,
      explorerUrl,
    });
  } catch (error) {
    console.error("=== STORY REGISTRATION FAILED ===");
    console.error("Error details:", error);

    return NextResponse.json(
      {
        success: false,
        error: `Failed to register story: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
