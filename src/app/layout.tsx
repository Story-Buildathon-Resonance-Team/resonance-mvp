"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { PropsWithChildren } from "react";
import Web3Providers from "./Web3Providers";
import Navigation from "./Navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='en'>
      <head>
        <title>Resonance MVP</title>
      </head>
      <body className={`${inter.className} antialiased`}>
        <Web3Providers>
          <main className='flex min-h-screen flex-col items-center justify-between p-4'>
            <Navigation />
            {children}
          </main>
        </Web3Providers>
      </body>
    </html>
  );
}
