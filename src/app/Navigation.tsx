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
import { BookOpen, Home, Menu, X, LayoutDashboard, User, Settings, LogOut, ChevronDown } from "lucide-react";

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

  // User dropdown component
  const UserDropdown = ({ size = "default" }: { size?: "default" | "sm" }) => {
    if (!isConnected) {
      return (
        <Button
          variant='default'
          size={size}
          className='cursor-pointer'
          onClick={() => {
            console.log("openConnectModal:", openConnectModal);
            openConnectModal?.();
          }}
        >
          Login
        </Button>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='default'
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
    <nav className='w-full max-w-4xl'>
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
              <Link href='/publish-form' onClick={() => navigate('/publish-form')}>
                <Button variant='outline' size='sm'>
                  Publish Story
                </Button>
              </Link>
            </div>
          )}

          {/* User Dropdown */}
          <UserDropdown />
        </div>

        {/* Mobile Menu Button and User Button */}
        <div className='md:hidden flex items-center gap-2'>
          {/* User Dropdown - Always visible */}
          <UserDropdown size="sm" />

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
            <Link href='/dashboard' onClick={() => handleNavigation('/dashboard')}>
              <Button
                variant='ghost'
                size='sm'
                className='w-full justify-start gap-2'
              >
                <LayoutDashboard className='h-4 w-4' />
                Dashboard
              </Button>
            </Link>
            <Link href='/library' onClick={() => handleNavigation('/library')}>
              <Button
                variant='ghost'
                size='sm'
                className='w-full justify-start gap-2'
              >
                <BookOpen className='h-4 w-4' />
                Library
              </Button>
            </Link>
            <Link href='/publish-form' onClick={() => handleNavigation('/publish-form')}>
              <Button
                variant='outline'
                size='sm'
                className='w-full justify-start'
              >
                Publish Story
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
