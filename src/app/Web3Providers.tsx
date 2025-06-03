"use client";
import "@tomo-inc/tomo-evm-kit/styles.css";
import { getDefaultConfig, TomoEVMKitProvider } from "@tomo-inc/tomo-evm-kit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { aeneid } from "@story-protocol/core-sdk";
import { useAccount } from "wagmi";

const config = getDefaultConfig({
  appName: "Resonance",
  clientId: process.env.NEXT_PUBLIC_TOMO_CLIENT_ID as string,
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
  chains: [aeneid],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

interface UserContextType {
  address: string | undefined;
  isConnected: boolean;
  userName: string | undefined;
}

const UserContext = createContext<UserContextType>({
  address: undefined,
  isConnected: false,
  userName: undefined,
});

export const useUser = () => useContext(UserContext);

function UserProvider({ children }: PropsWithChildren) {
  const { address, isConnected } = useAccount();
  const [userName, setUserName] = useState<string | undefined>();

  useEffect(() => {
    if (isConnected && address) {
      console.log("Connected address:", address);
      // Here you would typically fetch user info from Tomo social login
      // For now, we'll use the address as fallback
      setUserName(address.slice(0, 4));
    } else {
      console.log("Not connected");
      setUserName(undefined);
    }
  }, [isConnected, address]);

  const value = {
    address,
    isConnected,
    userName,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default function Web3Providers({ children }: PropsWithChildren) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <TomoEVMKitProvider>
          <UserProvider>{children}</UserProvider>
        </TomoEVMKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
