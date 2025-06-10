"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { PropsWithChildren } from "react";
import Web3Providers from "./Web3Providers";
import Navigation from "./Navigation";
import { StoreProvider } from "@/stores/StoreProvider";

const inter = Inter({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap"
});

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='en' className="h-full">
      <head>
        <title>Resonance - Decentralized Storytelling Platform</title>
        <meta name="description" content="Create, protect, and remix stories on the blockchain. Join the future of collaborative storytelling." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} antialiased h-full overflow-x-hidden`}>
        <StoreProvider>
          <Web3Providers>
            {/* Fixed Navigation */}
            <header className="fixed top-0 left-0 right-0 z-50">
              <div className="container mx-auto px-6 py-6">
                <Navigation />
              </div>
            </header>
            
            {/* Main Content - Full Screen */}
            <main className='w-full min-h-screen pt-24'>
              {children}
            </main>
          </Web3Providers>
        </StoreProvider>
      </body>
    </html>
  );
}
