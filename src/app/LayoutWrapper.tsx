"use client";

import { useUser } from "./Web3Providers";
import { usePathname } from "next/navigation";
import Navigation from "./Navigation";
import Sidebar from "./Sidebar";
import { SidebarProvider, useSidebar } from "./SidebarContext";
import { PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

function LayoutContent({ children }: PropsWithChildren) {
  const { isConnected } = useUser();
  const { sidebarWidth, isMobile,toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const showSidebar = isConnected && pathname !== "/";
  const showTopNav = !isConnected || pathname === "/";

  if (showSidebar) {
    return (
      <div className="min-h-screen">
        {/* Mobile Hamburger Menu Button - Only show on mobile screens */}
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="fixed top-4 left-4 z-50 bg-slate-900/90 backdrop-blur-sm text-white hover:bg-slate-800 p-2 rounded-lg shadow-lg border border-slate-700 md:hidden block"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        {/* Sidebar - Always visible on desktop, overlay on mobile */}
        <Sidebar />
        
        {/* Main Content with dynamic sidebar space */}
        <div 
          className="transition-all duration-300 ease-in-out min-h-screen"
          style={{ 
            marginLeft: isMobile ? '0px' : `${sidebarWidth}px`,
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <main className={`min-h-screen ${isMobile ? 'pt-16' : ''}`}>
            {children}
          </main>
        </div>
      </div>
    );
  }

  if (showTopNav) {
    return (
      <>
        <header className="fixed top-0 left-0 right-0 z-50">
          <div className="container mx-auto px-6 py-6">
            <Navigation />
          </div>
        </header>
        <main className="w-full min-h-screen pt-24">
          {children}
        </main>
      </>
    );
  }

  // Fallback (shouldn't happen, but just in case)
  return (
    <main className="w-full min-h-screen">
      {children}
    </main>
  );
}

export default function LayoutWrapper({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}