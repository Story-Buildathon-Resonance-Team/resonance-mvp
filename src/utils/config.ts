import { aeneid, StoryClient, StoryConfig } from "@story-protocol/core-sdk";
import {
  Chain,
  createPublicClient,
  createWalletClient,
  http,
  WalletClient,
} from "viem";
import { privateKeyToAccount, Address, Account } from "viem/accounts";

type NetworkType = "aeneid";

interface NetworkConfig {
  rpcProviderUrl: string;
  blockExplorer: string;
  protocolExplorer: string;
  defaultNFTContractAddress: Address | null;
  defaultSPGNFTContractAddress: Address | null;
  chain: Chain;
}

const networkConfigs: Record<NetworkType, NetworkConfig> = {
  aeneid: {
    rpcProviderUrl: "https://aeneid.storyrpc.io",
    blockExplorer: "https://aeneid.storyscan.io",
    protocolExplorer: "https://aeneid.explorer.story.foundation",
    defaultNFTContractAddress:
      "0x937bef10ba6fb941ed84b8d249abc76031429a9a" as Address,
    defaultSPGNFTContractAddress:
      "0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc" as Address,
    chain: aeneid,
  },
} as const;

const getNetwork = (): NetworkType => {
  const network = process.env.STORY_NETWORK as NetworkType;
  if (network && !(network in networkConfigs)) {
    throw new Error(
      `Invalid network: ${network}. Must be one of: ${Object.keys(
        networkConfigs
      ).join(", ")}`
    );
  }
  return network || "aeneid";
};

export const network = getNetwork();

export const networkInfo = {
  ...networkConfigs[network],
  rpcProviderUrl:
    process.env.NEXT_PUBLIC_RPC_PROVIDER_URL ||
    networkConfigs[network].rpcProviderUrl,
};

// Client-safe configuration (no private keys)
const baseConfig = {
  chain: networkInfo.chain,
  transport: http(networkInfo.rpcProviderUrl),
} as const;

export const publicClient = createPublicClient(baseConfig);

// Server-side only configuration
let serverAccount: Account | null = null;
let serverClient: ReturnType<typeof StoryClient.newClient> | null = null;
let serverWalletClient: WalletClient | null = null;

// Helper function to check if we're on the server
const isServer = typeof window === "undefined";

// Server-side initialization function
export function initializeServerConfig() {
  if (!isServer) {
    throw new Error(
      "initializeServerConfig can only be called on the server side"
    );
  }

  if (!process.env.WALLET_PRIVATE_KEY) {
    throw new Error("WALLET_PRIVATE_KEY is required in .env file");
  }

  if (!serverAccount) {
    serverAccount = privateKeyToAccount(
      `0x${process.env.WALLET_PRIVATE_KEY}` as Address
    );
  }

  if (!serverClient) {
    const config: StoryConfig = {
      account: serverAccount,
      transport: http(networkInfo.rpcProviderUrl),
      chainId: network,
    };
    serverClient = StoryClient.newClient(config);
  }

  if (!serverWalletClient) {
    serverWalletClient = createWalletClient({
      ...baseConfig,
      account: serverAccount,
    }) as WalletClient;
  }

  return {
    account: serverAccount,
    client: serverClient,
    walletClient: serverWalletClient,
  };
}

// Getters for server-side usage
export function getServerAccount(): Account {
  if (!isServer) {
    throw new Error("getServerAccount can only be called on the server side");
  }
  if (!serverAccount) {
    initializeServerConfig();
  }
  return serverAccount!;
}

export function getServerClient(): ReturnType<typeof StoryClient.newClient> {
  if (!isServer) {
    throw new Error("getServerClient can only be called on the server side");
  }
  if (!serverClient) {
    initializeServerConfig();
  }
  return serverClient!;
}

export function getServerWalletClient(): WalletClient {
  if (!isServer) {
    throw new Error(
      "getServerWalletClient can only be called on the server side"
    );
  }
  if (!serverWalletClient) {
    initializeServerConfig();
  }
  return serverWalletClient!;
}

// Legacy exports for backward compatibility (server-side only)
// These will throw errors if used on client-side
export const account = new Proxy({} as Account, {
  get() {
    if (!isServer) {
      throw new Error(
        "account can only be accessed on the server side. Use getServerAccount() instead."
      );
    }
    return getServerAccount();
  },
});

export const client = new Proxy(
  {} as ReturnType<typeof StoryClient.newClient>,
  {
    get() {
      if (!isServer) {
        throw new Error(
          "client can only be accessed on the server side. Use getServerClient() instead."
        );
      }
      return getServerClient();
    },
  }
);

export const walletClient = new Proxy({} as WalletClient, {
  get() {
    if (!isServer) {
      throw new Error(
        "walletClient can only be accessed on the server side. Use getServerWalletClient() instead."
      );
    }
    return getServerWalletClient();
  },
});

export const PROTOCOL_EXPLORER = networkInfo.protocolExplorer;
