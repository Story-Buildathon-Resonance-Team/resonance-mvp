/**
 * Pinata Utilities - Handles IPFS uploads for story content and metadata
 */

import { uploadFileToIPFS, uploadJSONToIPFS } from "./functions/uploadIPFS";

export interface StoryUploadData {
  title: string;
  content: string;
  coverImage: File;
  author: string;
  description: string;
}

export interface StoryUploadResult {
  contentCID: string;
  imageCID: string;
  contentUrl: string;
  imageUrl: string;
}

/**
 * Upload story content and cover image to IPFS via Pinata
 */
export async function uploadStoryToPinata(
  data: StoryUploadData,
  apiKey?: string
): Promise<StoryUploadResult> {
  try {
    console.log("Uploading story to Pinata:", data.title);

    // Upload cover image first
    console.log("Uploading cover image...");
    const imageCID = await uploadFileToIPFS(data.coverImage, apiKey);
    const imageUrl = `https://gateway.pinata.cloud/ipfs/${imageCID}`;

    // Create story content object
    const storyContent = {
      title: data.title,
      description: data.description,
      content: data.content,
      author: data.author,
      createdAt: new Date().toISOString(),
      type: "fiction-story",
      version: "1.0",
    };

    // Upload story content as JSON
    console.log("Uploading story content...");
    const contentCID = await uploadJSONToIPFS(storyContent, apiKey);
    const contentUrl = `https://gateway.pinata.cloud/ipfs/${contentCID}`;

    console.log("Story uploaded successfully:", {
      contentCID,
      imageCID,
    });

    return {
      contentCID,
      imageCID,
      contentUrl,
      imageUrl,
    };
  } catch (error) {
    console.error("Error uploading story to Pinata:", error);
    throw new Error(
      `Failed to upload story to IPFS: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Upload JSON metadata to IPFS (re-export for convenience)
 */
export { uploadJSONToIPFS } from "./functions/uploadIPFS";

/**
 * Upload file to IPFS (re-export for convenience)
 */
export { uploadFileToIPFS } from "./functions/uploadIPFS";

/**
 * Generate IPFS gateway URL
 */
export function getIPFSUrl(cid: string, gateway = "https://gateway.pinata.cloud/ipfs"): string {
  return `${gateway}/${cid}`;
}

/**
 * Validate IPFS CID format
 */
export function isValidCID(cid: string): boolean {
  // Basic CID validation - checks for common CID patterns
  const cidRegex = /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|b[A-Za-z2-7]{58}|z[1-9A-HJ-NP-Za-km-z]{48})$/;
  return cidRegex.test(cid);
}