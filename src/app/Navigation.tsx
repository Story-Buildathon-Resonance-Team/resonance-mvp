"use client";

import { useEffect } from "react";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConnectModal } from "@tomo-inc/tomo-evm-kit";
import { useDisconnect } from "wagmi";
import { useUser } from "./Web3Providers";
import { useAppStore } from "@/stores";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Menu, X, LayoutDashboard, User, Settings, LogOut, ChevronDown } from "lucide-react";

export default function Navigation() {
  const { openConnectModal } = useConnectModal();
  const { disconnect } = useDisconnect();
  const { address, isConnected, userName } = useUser();
  const { mobileMenuOpen, setMobileMenuOpen, navigate } = useAppStore();
  const router = useRouter();

  // Navigate to dashboard when user connects
  useEffect(() => {
    if (isConnected && address) {
      console.log("User connected, navigating to dashboard");
      router.push('/dashboard');
    }
  }, [isConnected, address, router]);

  useEffect(() => {
    if (isConnected && address) {
      console.log("Connected address:", address);
    } else {
      console.log("Not connected");
    }
  }, [isConnected, address]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleNavigation = (href: string) => {
    navigate(href);
    closeMobileMenu();
  };

  const handleLogout = () => {
    disconnect?.();
    console.log("User logged out");
  };

  const handlePreferences = () => {
    // TODO: Navigate to preferences page or open preferences modal
    console.log("Opening preferences");
    navigate('/preferences');
  };

  const handleLogin = () => {
    console.log("Login button clicked!");
    console.log("openConnectModal:", openConnectModal);
    console.log("typeof openConnectModal:", typeof openConnectModal);
    
    if (openConnectModal) {
      try {
        openConnectModal();
        console.log("openConnectModal called successfully");
      } catch (error) {
        console.error("Error calling openConnectModal:", error);
      }
    } else {
      console.error("openConnectModal is not available");
    }
  };

  // User dropdown component
  const UserDropdown = ({ size = "default" }: { size?: "default" | "sm" }) => {
    if (!isConnected) {
      return (
        <Button
          variant='default'
          size={size}
          className='cursor-pointer'
          onClick={handleLogin}
        >
          Login
        </Button>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            size={size}
            className='cursor-pointer flex items-center gap-2'
          >
            <User className="h-4 w-4" />
            <span>{userName}</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{userName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handlePreferences} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Preferences</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <nav className='w-full max-w-6xl'>
      {/* Desktop Navigation */}
      <div className='flex justify-between items-center'>
        {/* Logo/Home Link */}
        <Link
          href='/'
          className='flex items-center gap-2 text-lg font-semibold'
          onClick={() => navigate('/')}
        >
          <BookOpen className='h-6 w-6' />
          <span>Resonance</span>
        </Link>

        {/* Desktop Navigation Links - Hidden on Mobile */}
        <div className='hidden md:flex items-center gap-4'>
          {isConnected && (
            <div className='flex items-center gap-3'>
              <Link href='/publish-form' onClick={() => navigate('/publish-form')}>
                <Button variant='default' size='sm'>
                  Publish a Story
                </Button>
              </Link>
              <Link href='/library' onClick={() => navigate('/library')}>
                <Button
                  variant='ghost'
                  size='sm'
                  className='flex items-center gap-2'
                >
                  <BookOpen className='h-4 w-4' />
                  Library
                </Button>
              </Link>
              <Link href='/dashboard' onClick={() => navigate('/dashboard')}>
                <Button
                  variant='ghost'
                  size='sm'
                  className='flex items-center gap-2'
                >
                  <LayoutDashboard className='h-4 w-4' />
                  Dashboard
                </Button>
              </Link>
            </div>
          )}

          {/* Action Buttons */}
          <div className='flex items-center gap-2'>
            {/* Login/User Dropdown */}
            <UserDropdown />
          </div>
        </div>

        {/* Mobile Menu Button and Action Buttons */}
        <div className='md:hidden flex items-center gap-2'>
          {/* Mobile Action Buttons */}
          <div className='flex items-center gap-2'>
            {/* Login/User Dropdown */}
            <UserDropdown size="sm" />
          </div>

          {/* Hamburger Menu Button - Only show when connected */}
          {isConnected && (
            <Button
              variant='ghost'
              size='sm'
              onClick={toggleMobileMenu}
              className='p-2'
            >
              {mobileMenuOpen ? (
                <X className='h-5 w-5' />
              ) : (
                <Menu className='h-5 w-5' />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Menu - Dropdown */}
      {isConnected && mobileMenuOpen && (
        <div className='md:hidden mt-4 bg-card border border-border rounded-lg shadow-lg'>
          <div className='flex flex-col p-2'>
          <Link href='/publish-form' onClick={() => navigate('/publish-form')}>
                <Button variant='ghost' size='sm'>
                  Publish a Story
                </Button>
              </Link>
              <Link href='/library' onClick={() => navigate('/library')}>
                <Button
                  variant='ghost'
                  size='sm'
                  className='flex items-center gap-2'
                >
                  <BookOpen className='h-4 w-4' />
                  Library
                </Button>
              </Link>
              <Link href='/dashboard' onClick={() => navigate('/dashboard')}>
                <Button
                  variant='ghost'
                  size='sm'
                  className='flex items-center gap-2'
                >
                  <LayoutDashboard className='h-4 w-4' />
                  Dashboard
                </Button>
              </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
