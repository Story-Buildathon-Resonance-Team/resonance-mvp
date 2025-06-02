"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { PropsWithChildren } from "react";
import Web3Providers from "./Web3Providers";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='en'>
      <head>
        <title>Resonance MVP</title>
      </head>
      <body className={`${inter} antialiased`}>
        <Web3Providers>{children}</Web3Providers>
      </body>
    </html>
  );
}
