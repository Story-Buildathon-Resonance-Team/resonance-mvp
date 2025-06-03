import { Address, Hash } from "viem";

interface StoryRegistrationData {
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

export interface StoryRegistrationResult {
  ipId: string;
  txHash: string;
  licenseTermsIds: readonly string[];
  storyData: {
    id: string;
    title: string;
    description: string;
    author: { name: string; address: Address };
    contentCID: string;
    imageCID: string;
    ipId: string;
    txHash: string;
    licenseTermsIds: readonly string[];
    licenseType: string;
    createdAt: string;
    ipMetadataURI: string;
    nftMetadataURI: string;
    ipMetadataCID: string;
    nftMetadataCID: string;
    imageHash: Hash;
    mediaHash: Hash;
  };
  explorerUrl: string;
}

export async function registerStoryAsIP(
  data: StoryRegistrationData
): Promise<StoryRegistrationResult> {
  try {
    console.log("=== Starting Story IP Registration (Client) ===");
    console.log("Registration data:", {
      title: data.title,
      author: data.author,
      licenseType: data.licenseType,
      contentCID: data.contentCID,
      imageCID: data.imageCID,
    });

    // Call the API route
    const response = await fetch("/api/register-story", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Registration failed");
    }

    console.log("=== STORY REGISTRATION SUCCESSFUL ===");
    console.log("Copy this data to your user object:");
    console.log(
      JSON.stringify(
        {
          ipId: result.ipId,
          metadataCID: result.storyData.ipMetadataCID,
          textCID: data.contentCID,
          imageCID: data.imageCID,
          ipMetadataCID: result.storyData.ipMetadataCID,
          nftMetadataCID: result.storyData.nftMetadataCID,
          title: data.title,
          synopsis: data.description,
        },
        null,
        2
      )
    );

    console.log("Transaction Hash:", result.txHash);
    console.log("IPA ID:", result.ipId);
    console.log("License Terms IDs:", result.licenseTermsIds);
    console.log("Explorer URL:", result.explorerUrl);

    return {
      ipId: result.ipId,
      txHash: result.txHash,
      licenseTermsIds: result.licenseTermsIds,
      storyData: result.storyData,
      explorerUrl: result.explorerUrl,
    };
  } catch (error) {
    console.error("=== STORY REGISTRATION FAILED ===");
    console.error("Error details:", error);
    throw new Error(
      `Failed to register story: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
