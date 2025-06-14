"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConnect } from "@/hooks/useConnect";
import { useDisconnect } from "wagmi";
import { useUser } from "./Web3Providers";
import { useAppStore } from "@/stores";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  BookOpen,
  Menu,
  X,
  LayoutDashboard,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
} from "lucide-react";

export default function Navigation() {
  const { handleConnect } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected, userName } = useUser();
  const { mobileMenuOpen, setMobileMenuOpen, navigate } = useAppStore();
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirected = useRef(false);

  // Floating navbar state
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Navigate to dashboard when user connects for the first time
  useEffect(() => {
    if (isConnected && address && !hasRedirected.current) {
      // Only redirect to dashboard if not already on a specific page
      if (pathname === "/" || pathname === "") {
        router.push("/dashboard");
      }
      hasRedirected.current = true;
    } else if (!isConnected) {
      // Reset the flag when user disconnects
      hasRedirected.current = false;
    }
  }, [isConnected, address, router, pathname]);

  // Handle scroll behavior for floating navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Set scrolled state for styling
      setIsScrolled(currentScrollY > 50);

      // Handle navbar visibility
      if (currentScrollY < lastScrollY.current || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    disconnect?.();
  };

  // User dropdown component
  const UserDropdown = ({ size = "default" }: { size?: "default" | "sm" }) => {
    if (!isConnected) {
      return (
        <Button
          variant='default'
          size={size}
          className='cursor-pointer gradient-purple-cyan text-white font-semibold hover:shadow-glow transition-all duration-300'
          onClick={handleConnect}
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
            className='cursor-pointer flex items-center gap-2 border-white/20 text-white hover:bg-white/10 hover:border-cyan-300/50 hover:text-cyan-300 transition-all duration-300'
          >
            <User className='h-4 w-4' />
            <span>{userName}</span>
            <ChevronDown className='h-3 w-3' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-56'>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col space-y-1'>
              <p className='text-sm font-medium leading-none'>{userName}</p>
              <p className='text-xs leading-none text-muted-foreground'>
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className='cursor-pointer text-red-600'
          >
            <LogOut className='mr-2 h-4 w-4' />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <nav
      className={`
      w-full transition-all duration-300 ease-out
      ${
        isScrolled
          ? "max-w-4xl mx-auto mt-4 px-6 py-3 glass rounded-full shadow-neon"
          : "px-0 py-0"
      }
      ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
    `}
    >
      {/* Desktop Navigation */}
      <div className='flex justify-between items-center'>
        {/* Logo/Home Link */}
        <Link
          href={isConnected ? "/dashboard" : "/"}
          className={`flex items-center gap-3 font-bold text-white hover:text-cyan-300 hover:scale-105 transition-all duration-300 ${
            isScrolled ? "text-lg" : "text-xl"
          }`}
          onClick={() => navigate(isConnected ? "/dashboard" : "/")}
        >
          <div
            className={`gradient-purple-cyan rounded-lg flex items-center justify-center transition-all duration-300 shadow-glow ${
              isScrolled ? "w-7 h-7" : "w-8 h-8"
            }`}
          >
            <BookOpen
              className={`text-white transition-all duration-300 ${
                isScrolled ? "h-4 w-4" : "h-5 w-5"
              }`}
            />
          </div>
          <span className={isScrolled ? "hidden sm:block" : ""}>Resonance</span>
        </Link>

        {/* Desktop Navigation Links - Hidden on Mobile */}
        <div
          className={`hidden md:flex items-center transition-all duration-300 ${
            isScrolled ? "gap-3" : "gap-6"
          }`}
        >
          {isConnected && (
            <div
              className={`flex items-center transition-all duration-300 ${
                isScrolled ? "gap-2" : "gap-4"
              }`}
            >
              <Link href='/stories' onClick={() => navigate("/stories")}>
                <Button
                  variant='ghost'
                  size={isScrolled ? "sm" : "sm"}
                  className={`flex items-center cursor-pointer gap-2 text-white hover:text-cyan-300 hover:bg-white/10 transition-all duration-300 ${
                    isScrolled ? "px-3 py-2" : ""
                  }`}
                >
                  <BookOpen className='h-4 w-4' />
                  <span className={isScrolled ? "hidden lg:block" : ""}>
                    Stories
                  </span>
                </Button>
              </Link>
              <Link href='/dashboard' onClick={() => navigate("/dashboard")}>
                <Button
                  variant='ghost'
                  size={isScrolled ? "sm" : "sm"}
                  className={`flex items-center cursor-pointer gap-2 text-white hover:text-cyan-300 hover:bg-white/10 transition-all duration-300 ${
                    isScrolled ? "px-3 py-2" : ""
                  }`}
                >
                  <LayoutDashboard className='h-4 w-4' />
                  <span className={isScrolled ? "hidden lg:block" : ""}>
                    Dashboard
                  </span>
                </Button>
              </Link>
              <Link
                href='/publish-form'
                onClick={() => navigate("/publish-form")}
              >
                <Button
                  variant='default'
                  size={isScrolled ? "sm" : "sm"}
                  className={`gradient-purple-cyan cursor-pointer hover:shadow-glow text-white font-semibold transition-all duration-300 ${
                    isScrolled ? "px-3 py-2" : ""
                  }`}
                >
                  <Sparkles className='h-4 w-4 mr-2' />
                  <span className={isScrolled ? "hidden xl:block" : ""}>
                    Publish Story
                  </span>
                </Button>
              </Link>
            </div>
          )}

          {/* Action Buttons */}
          <div className='flex items-center gap-3'>
            {/* Login/User Dropdown */}
            <UserDropdown size={isScrolled ? "sm" : "default"} />
          </div>
        </div>

        {/* Mobile Menu Button and Action Buttons */}
        <div className='md:hidden flex items-center gap-2'>
          {/* Mobile Action Buttons */}
          <div className='flex items-center gap-2'>
            {/* Login/User Dropdown */}
            <UserDropdown size='sm' />
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
            <Link
              href='/publish-form'
              onClick={() => navigate("/publish-form")}
            >
              <Button variant='ghost' size='sm'>
                Publish a Story
              </Button>
            </Link>
            <Link href='/stories' onClick={() => navigate("/stories")}>
              <Button
                variant='ghost'
                size='sm'
                className='flex items-center gap-2'
              >
                <BookOpen className='h-4 w-4' />
                Stories
              </Button>
            </Link>
            <Link href='/dashboard' onClick={() => navigate("/dashboard")}>
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
