/**
 * CIDs for quick UI population:
 * - `metadataCID` points to the off‐chain JSON that contains title & synopsis.
 * - `textCID` points to the raw story text (e.g. up to 1,000 words).
 * - `imageCID` points to the cover image.
 * Optional: If you want to show title/synopsis client‐side without refetching metadata, you can include them here.
 */

export interface StoryEntry {
  ipId: string;
  ipMetadataCID: string;
  nftMetadataCID: string;
  textCID: string;
  imageCID: string;
  title?: string;
  synopsis?: string;
}

export interface UserEntry {
  userName: string;
  walletAddress: string;
  stories: StoryEntry[];
}

//Hard‐coded user data for dashboard display.

export const users: UserEntry[] = [
  {
    userName: "Craig",
    walletAddress: "",
    stories: [
      {
        ipId: "", // The IP ID returned by Story Protocol
        ipMetadataCID: "",
        nftMetadataCID: "",
        textCID: "",
        imageCID: "",
        title: "",
        synopsis: "",
      },
      {
        ipId: "",
        ipMetadataCID: "",
        nftMetadataCID: "",
        textCID: "",
        imageCID: "",
        title: "",
        synopsis: "",
      },
      // …up to 10 entries
    ],
  },
  {
    userName: "Nat",
    walletAddress: "0x1BB1EB6b6676A6b0850547a70019112c41495BA2",
    stories: [
      {
        ipId: "",
        ipMetadataCID: "",
        nftMetadataCID: "",
        textCID: "",
        imageCID: "",
        title: "",
        synopsis: "",
      },
      // …more
    ],
  },
  {
    userName: "Simon",
    walletAddress: "",
    stories: [
      {
        ipId: "", // The IP ID returned by Story Protocol
        ipMetadataCID: "",
        nftMetadataCID: "",
        textCID: "",
        imageCID: "",
        title: "",
        synopsis: "",
      },
      {
        ipId: "",
        ipMetadataCID: "",
        nftMetadataCID: "",
        textCID: "",
        imageCID: "",
        title: "",
        synopsis: "",
      },
      // …up to 10 entries
    ],
  },
  {
    userName: "Xavier",
    walletAddress: "",
    stories: [
      {
        ipId: "", // The IP ID returned by Story Protocol
        ipMetadataCID: "",
        nftMetadataCID: "",
        textCID: "",
        imageCID: "",
        title: "",
        synopsis: "",
      },
      {
        ipId: "",
        ipMetadataCID: "",
        nftMetadataCID: "",
        textCID: "",
        imageCID: "",
        title: "",
        synopsis: "",
      },
      // …up to 10 entries
    ],
  },
  {
    userName: "", // Placeholder for user cloning this repo
    walletAddress: "",
    stories: [
      {
        ipId: "", // The IP ID returned by Story Protocol
        ipMetadataCID: "",
        nftMetadataCID: "",
        textCID: "",
        imageCID: "",
        title: "",
        synopsis: "",
      },
      {
        ipId: "",
        ipMetadataCID: "",
        nftMetadataCID: "",
        textCID: "",
        imageCID: "",
        title: "",
        synopsis: "",
      },
      // …up to 10 entries
    ],
  },
  // Up to 5 user objects here.
];
