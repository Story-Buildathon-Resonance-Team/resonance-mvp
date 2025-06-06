"use client";

import { useEffect } from "react";
import { Button } from "../components/ui/button";
import { useConnectModal } from "@tomo-inc/tomo-evm-kit";
import { useUser } from "./Web3Providers";
import Link from "next/link";
import { BookOpen, Home } from "lucide-react";

export default function Navigation() {
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
    <nav className='w-full max-w-4xl mb-8 flex justify-between items-center'>
      {/* Logo/Home Link */}
      <Link href="/" className="flex items-center gap-2 text-lg font-semibold hover:text-primary transition-colors">
        <BookOpen className="h-6 w-6" />
        <span>Resonance</span>
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-4">
        {isConnected && (
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link href="/publish-form">
              <Button variant="outline" size="sm">
                Publish Story
              </Button>
            </Link>
          </div>
        )}
        
        {/* Connect/User Button */}
        <Button
          variant='default'
          className='cursor-pointer'
          onClick={() => {
            console.log("openConnectModal:", openConnectModal);
            openConnectModal?.();
          }}
        >
          {isConnected ? `${userName}` : "Login"}
        </Button>
      </div>
    </nav>
  );
}