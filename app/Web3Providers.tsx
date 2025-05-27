"use client";
import "@tomo-inc/tomo-evm-kit/styles.css";
import { getDefaultConfig, TomoEVMKitProvider } from "@tomo-inc/tomo-evm-kit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { aeneid } from "@story-protocol/core-sdk";

const config = getDefaultConfig({
  appName: "Resonance",
  clientId: process.env.NEXT_PUBLIC_TOMO_CLIENT_ID as string,
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
  chains: [aeneid],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

export default function Web3Providers({ children }: PropsWithChildren) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <TomoEVMKitProvider>{children}</TomoEVMKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
