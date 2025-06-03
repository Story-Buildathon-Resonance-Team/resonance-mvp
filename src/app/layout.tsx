"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { PropsWithChildren } from "react";
import Web3Providers from "./Web3Providers";
import { useEffect } from "react";
import { Button } from "../components/ui/button";
import { useConnectModal } from "@tomo-inc/tomo-evm-kit";
import { useAccount } from "wagmi";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: PropsWithChildren) {
  const { openConnectModal } = useConnectModal();

  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      console.log("Connected address:", address);
    } else {
      console.log("Not connected");
    }
  }, [isConnected, address]);
  return (
    <html lang='en'>
      <head>
        <title>Resonance MVP</title>
      </head>
      <body className={`${inter} antialiased`}>
        <Web3Providers>
          <main className='flex min-h-screen flex-col items-center justify-between p-4'>
            <nav className='w-full max-w-4xl mb-8 flex justify-end'>
              <Button
                variant='default'
                className='my-1 cursor-pointer'
                onClick={() => openConnectModal?.()}
              >
                {isConnected ? "Connected" : "Login with Tomo"}
              </Button>
            </nav>
            {children}
          </main>
        </Web3Providers>
      </body>
    </html>
  );
}
