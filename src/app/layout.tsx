"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { PropsWithChildren, useEffect } from "react";
import Web3Providers, { useUser } from "./Web3Providers";
import { Button } from "../components/ui/button";
import { useConnectModal } from "@tomo-inc/tomo-evm-kit";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: PropsWithChildren) {
  const { openConnectModal } = useConnectModal();
  const { address, isConnected, userName } = useUser();

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
      <body className={`${inter.className} antialiased`}>
        <Web3Providers>
          <main className='flex min-h-screen flex-col items-center justify-between p-4'>
            <nav className='w-full max-w-4xl mb-8 flex justify-end'>
              <Button
                variant='default'
                className='my-1 cursor-pointer'
                onClick={() => {
                  console.log("openConnectModal:", openConnectModal);
                  openConnectModal?.();
                }}
              >
                {isConnected ? `${userName}` : "Login"}
              </Button>
            </nav>
            {children}
          </main>
        </Web3Providers>
      </body>
    </html>
  );
}
