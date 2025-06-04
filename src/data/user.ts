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
  contentCID: string;
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
        contentCID: "",
        imageCID: "",
        title: "",
        synopsis: "",
      },
      {
        ipId: "",
        ipMetadataCID: "",
        nftMetadataCID: "",
        contentCID: "",
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
        ipId: "0x2139d4C281A07fd0311c118b02D396A764894E34",
        ipMetadataCID:
          "bafkreihxoorp34rjyk3c654ephbjwmgbt3dxaetyoazqzdbu4mmyltigzq",
        nftMetadataCID:
          "bafkreiafjforjo4cy4ye4tgl7xyjlhfaxz5ntp4n3qgcdid573vfwtl5ku",
        contentCID:
          "bafkreiaond2f2xj5bhtgjptgnphwn45wqizbhy5ju7z4px7ncfhugp4shu",
        imageCID: "bafybeiammagvjzcc7qln4ni6bjryrxtea5voz326vufkgfspcremp2avbm",
        title: "The Missing Piece",
        synopsis:
          "On the run from her sister’s ruthless regime, Tamara discovers a bloody message in a remote cabin that hints at a deeper truth behind her bloodline and a soul-binding treaty.",
      },
      {
        ipId: "0xf85014aa8ECa28A5c8ceEfcC5dCeFB4416F51f08",
        ipMetadataCID:
          "bafkreihfngnzxlhvzjnp7qyqjvefjxmypg3ke5p4o4lrptlvzqq2rjcdzq",
        nftMetadataCID:
          "bafkreic46pmhqoni66axnbmb4ogkx46kfz6us6xfmohdjj5w53penj7aiq",
        contentCID:
          "bafkreid34mk4ojned6wlylkcvploxqxfcrolmc6dago4zg3gzpaafxzelq",
        imageCID: "bafybeigmqq35e2wly6qy6enenumudd5bbp67h3koascgyuagixrxq5njly",
        title: "The Weight of Truth",
        synopsis:
          "In a crumbling, post-apocalyptic city hunted by Purifier machines, Daniel searches for a genetic heir who can activate a long-lost device to restore humanity",
      },
      {
        ipId: "", // The IP ID returned by Story Protocol
        ipMetadataCID: "",
        nftMetadataCID: "",
        contentCID: "",
        imageCID: "",
        title: "",
        synopsis: "",
      },
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
        contentCID: "",
        imageCID: "",
        title: "",
        synopsis: "",
      },
      {
        ipId: "",
        ipMetadataCID: "",
        nftMetadataCID: "",
        contentCID: "",
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
        contentCID: "",
        imageCID: "",
        title: "",
        synopsis: "",
      },
      {
        ipId: "",
        ipMetadataCID: "",
        nftMetadataCID: "",
        contentCID: "",
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
        contentCID: "",
        imageCID: "",
        title: "",
        synopsis: "",
      },
      {
        ipId: "",
        ipMetadataCID: "",
        nftMetadataCID: "",
        contentCID: "",
        imageCID: "",
        title: "",
        synopsis: "",
      },
      // …up to 10 entries
    ],
  },
  // Up to 5 user objects here.
];
