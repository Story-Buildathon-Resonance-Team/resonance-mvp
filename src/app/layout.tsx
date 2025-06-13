"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { PropsWithChildren } from "react";
import Web3Providers from "./Web3Providers";
import { StoreProvider } from "@/stores/StoreProvider";
import LayoutWrapper from "./LayoutWrapper";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='en' className='h-full'>
      <head>
        <title>Resonance - The Future of Collaborative Storytelling</title>
        <meta
          name='description'
          content='Create, protect, and remix stories on the blockchain. Join the future of collaborative storytelling.'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </head>
      <body
        className={`${inter.className} antialiased h-full overflow-x-hidden`}
      >
        <StoreProvider>
          <Web3Providers>
            <LayoutWrapper>{children}</LayoutWrapper>
          </Web3Providers>
        </StoreProvider>
      </body>
    </html>
  );
}
