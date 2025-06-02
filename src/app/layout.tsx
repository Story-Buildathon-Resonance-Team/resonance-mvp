import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PropsWithChildren } from "react";
import Web3Providers from "./Web3Providers";
import { useConnectModal } from "@tomo-inc/tomo-evm-kit";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Example",
  description: "This is an Example DApp",
};

export default function RootLayout({ children }: PropsWithChildren) {
  const { openConnectModal } = useConnectModal();

  return (
    <html lang='en'>
      <body>
        <Web3Providers>
          <button onClick={openConnectModal}>Connect Wallet</button>
          {children}
        </Web3Providers>
      </body>
    </html>
  );
}
