import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Web3Providers from "./Web3Providers";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Resonance - Decentralized Storytelling Platform",
  description:
    "A decentralized platform for publishing, remixing, and monetizing stories on the blockchain.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Providers>
          {children}
          <Toaster />
        </Web3Providers>
      </body>
    </html>
  );
}
