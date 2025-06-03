import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
});

export interface StoryUploadData {
  title: string;
  content: string;
  coverImage?: File;
  author: string;
  description: string;
}

export interface PinataUploadResult {
  contentCID: string;
  imageCID: string;
}

export async function uploadStoryToPinata(
  data: StoryUploadData
): Promise<PinataUploadResult> {
  try {
    console.log("Starting Pinata upload process...");

    // 1. Upload story content as plain text
    console.log("Uploading story content to IPFS...");
    const contentBlob = new Blob([data.content], { type: "text/plain" });
    const contentFile = new File(
      [contentBlob],
      `${data.title.replace(/\s+/g, "_")}_content.txt`,
      {
        type: "text/plain",
      }
    );

    const contentUpload = await pinata.upload.file(contentFile);
    console.log("Content uploaded to IPFS:", contentUpload.IpfsHash);

    // 2. Upload cover image (required)
    if (!data.coverImage) {
      throw new Error("Cover image is required");
    }

    console.log("Uploading cover image to IPFS...");
    const imageUpload = await pinata.upload.file(data.coverImage);
    console.log("Image uploaded to IPFS:", imageUpload.IpfsHash);

    const result = {
      contentCID: contentUpload.IpfsHash,
      imageCID: imageUpload.IpfsHash,
    };

    console.log("Pinata upload completed:", result);
    return result;
  } catch (error) {
    console.error("Pinata upload failed:", error);
    throw new Error(
      `Failed to upload to IPFS: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function uploadJSONToIPFS(jsonMetadata: any): Promise<string> {
  try {
    console.log("Uploading JSON metadata to IPFS...");
    const { IpfsHash } = await pinata.upload.json(jsonMetadata);
    console.log("JSON metadata uploaded:", IpfsHash);
    return IpfsHash;
  } catch (error) {
    console.error("JSON upload failed:", error);
    throw new Error(
      `Failed to upload JSON to IPFS: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
