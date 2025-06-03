// services/storyService.ts
import { client } from "@/utils/config";
import {
  createCommercialRemixTerms,
  NonCommercialSocialRemixingTermsId,
} from "@/utils/utils";
import { uploadJSONToIPFS } from "@/utils/functions/uploadToIpfs";
import { createHash } from "crypto";
import { IpMetadata } from "@story-protocol/core-sdk";

interface StoryRegistrationData {
  title: string;
  description: string;
  contentCID: string;
  imageCID: string;
  author: {
    name: string;
    address: string;
  };
  licenseType: "non-commercial" | "commercial-remix";
}

export async function registerStoryAsIP(data: StoryRegistrationData) {
  try {
    // 1. Generate IP Metadata
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
      imageHash: createHash("sha256").update(data.imageCID).digest("hex"),
      mediaUrl: `https://gateway.pinata.cloud/ipfs/${data.contentCID}`,
      mediaHash: createHash("sha256").update(data.contentCID).digest("hex"),
      mediaType: "text/plain",
    });

    // 2. Generate NFT Metadata
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

    // 3. Upload metadata to IPFS
    const ipIpfsHash = await uploadJSONToIPFS(ipMetadata);
    const ipHash = createHash("sha256")
      .update(JSON.stringify(ipMetadata))
      .digest("hex");
    const nftIpfsHash = await uploadJSONToIPFS(nftMetadata);
    const nftHash = createHash("sha256")
      .update(JSON.stringify(nftMetadata))
      .digest("hex");

    // 4. Determine license terms
    const licenseTermsData =
      data.licenseType === "non-commercial"
        ? [{ terms: NonCommercialSocialRemixingTermsId }]
        : [
            {
              terms: createCommercialRemixTerms({
                defaultMintingFee: 1,
                commercialRevShare: 5,
              }),
            },
          ];

    // 5. Register with Story Protocol
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

    // 6. Save to local data for demo
    const storyData = {
      id: response.ipId,
      title: data.title,
      description: data.description,
      author: data.author,
      contentCID: data.contentCID,
      imageCID: data.imageCID,
      ipId: response.ipId,
      txHash: response.txHash,
      licenseTermsIds: response.licenseTermsIds,
      licenseType: data.licenseType,
      createdAt: new Date().toISOString(),
      ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
      nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
    };

    console.log("Story registered successfully:", {
      "Transaction Hash": response.txHash,
      "IPA ID": response.ipId,
      "License Terms IDs": response.licenseTermsIds,
    });

    return {
      ...response,
      storyData,
      explorerUrl: `${process.env.NEXT_PUBLIC_PROTOCOL_EXPLORER}/ipa/${response.ipId}`,
    };
  } catch (error) {
    console.error("Error registering story:", error);
    throw new Error(
      `Failed to register story: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
