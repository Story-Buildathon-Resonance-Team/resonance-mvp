"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { PropsWithChildren } from "react";
import Web3Providers from "./Web3Providers";
import { useConnectModal } from "@tomo-inc/tomo-evm-kit";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: PropsWithChildren) {
  const { openConnectModal } = useConnectModal();

  return (
    <html lang='en'>
      <head>
        <title>Resonance MVP</title>
      </head>
      <body className={`${inter} antialiased`}>
        <Web3Providers>
          <button onClick={openConnectModal}>Login</button>
          {children}
        </Web3Providers>
      </body>
    </html>
  );
}
