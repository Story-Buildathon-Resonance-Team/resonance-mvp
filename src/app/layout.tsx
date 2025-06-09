"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { PropsWithChildren } from "react";
import Web3Providers from "./Web3Providers";
import Navigation from "./Navigation";
import { StoreProvider } from "@/stores/StoreProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='en'>
      <head>
        <title>Resonance MVP</title>
      </head>
      <body className={`${inter.className} antialiased`}>
        <StoreProvider>
          <Web3Providers>
            {/* Sticky Navigation */}
            <header className="sticky top-0 z-50 bg-background border-b border-border">
              <div className="flex justify-center p-4">
                <Navigation />
              </div>
            </header>
            
            {/* Main Content */}
            <main className='flex min-h-screen flex-col items-center p-4 pt-0'>
              {children}
            </main>
          </Web3Providers>
        </StoreProvider>
      </body>
    </html>
  );
}
