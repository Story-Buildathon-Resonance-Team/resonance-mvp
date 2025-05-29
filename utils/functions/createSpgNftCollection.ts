import { zeroAddress } from "viem";
import { client } from "../config";

const main = async function () {
  const newCollection = await client.nftClient.createNFTCollection({
    name: "Test Resonance",
    symbol: "TESTR",
    isPublicMinting: true,
    mintOpen: true,
    mintFeeRecipient: zeroAddress,
    contractURI: "",
    txOptions: { waitForTransaction: true },
  });

  console.log("New Collection Created:", {
    "SPG NFT Address": newCollection.spgNftContract,
    "Transaction Hash": newCollection.txHash,
  });
};

main();
