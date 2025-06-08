"use client";

import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { useConnectModal } from "@tomo-inc/tomo-evm-kit";
import { useUser } from "./Web3Providers";
import Link from "next/link";
import { BookOpen, Home, Menu, X } from "lucide-react";

export default function Navigation() {
  const { openConnectModal } = useConnectModal();
  const { address, isConnected, userName } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      console.log("Connected address:", address);
    } else {
      console.log("Not connected");
    }
  }, [isConnected, address]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className='w-full max-w-4xl'>
      {/* Desktop Navigation */}
      <div className="flex justify-between items-center">
        {/* Logo/Home Link */}
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <BookOpen className="h-6 w-6" />
          <span>Resonance</span>
        </Link>

        {/* Desktop Navigation Links - Hidden on Mobile */}
        <div className="hidden md:flex items-center gap-4">
          {isConnected && (
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              </Link>
              <Link href="/stories">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Stories
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

        {/* Mobile Menu Button and User Button */}
        <div className="md:hidden flex items-center gap-2">
          {/* User Button - Always visible */}
          <Button
            variant='default'
            size="sm"
            className='cursor-pointer'
            onClick={() => {
              console.log("openConnectModal:", openConnectModal);
              openConnectModal?.();
            }}
          >
            {isConnected ? `${userName}` : "Login"}
          </Button>
          
          {/* Hamburger Menu Button - Only show when connected */}
          {isConnected && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Menu - Dropdown */}
      {isConnected && isMobileMenuOpen && (
        <div className="md:hidden mt-4 bg-card border border-border rounded-lg shadow-lg">
          <div className="flex flex-col p-2">
            <Link href="/" onClick={closeMobileMenu}>
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link href="/stories" onClick={closeMobileMenu}>
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                <BookOpen className="h-4 w-4" />
                Stories
              </Button>
            </Link>
            <Link href="/publish-form" onClick={closeMobileMenu}>
              <Button variant="outline" size="sm" className="w-full justify-start">
                Publish Story
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}