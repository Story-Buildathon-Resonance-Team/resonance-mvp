"use client";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDisconnect } from "wagmi";
import { useUser } from "./Web3Providers";
import { useAppStore } from "@/stores";
import { useSidebar } from "./SidebarContext";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  BookOpen,
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Sparkles,
  Menu,
  X,
  FileText,
  Library,
  GitBranch,
  Home,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect } from "react";

export default function Sidebar() {
  const { disconnect } = useDisconnect();
  const { address, isConnected, userName } = useUser();
  const { navigate } = useAppStore();
  const { isCollapsed, isMobile, isOpen, toggleSidebar, closeSidebar } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    disconnect?.();
    router.push("/");
  };

  const handleNavigation = (href: string) => {
    navigate(href);
    // Close sidebar on mobile after navigation
    if (isMobile) {
      closeSidebar();
    }
  };

  // Navigation items
  const navigationItems = [
    {
      href: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      description: "Your story overview",
    },
    {
      href: "/stories",
      icon: BookOpen,
      label: "Stories",
      description: "Browse all stories",
    },
    {
      href: "/publish-form",
      icon: Sparkles,
      label: "Publish Story",
      description: "Create new story",
      primary: true,
    },
    {
      href: "/library",
      icon: Library,
      label: "Library",
      description: "Your collection",
    },
  ];

  // Check if current path matches navigation item
  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  // Handle swipe gestures for mobile
  useEffect(() => {
    if (!isMobile) return;

    let startX = 0;
    let startY = 0;
    let isSwipeGesture = false;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isSwipeGesture = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!startX || !startY) return;

      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = currentX - startX;
      const diffY = currentY - startY;

      // Check if it's a horizontal swipe (more horizontal than vertical)
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        isSwipeGesture = true;
        
        // Swipe right from left edge to open sidebar
        if (diffX > 0 && startX < 50 && !isOpen) {
          e.preventDefault();
          toggleSidebar();
        }
        // Swipe left to close sidebar when open
        else if (diffX < -50 && isOpen) {
          e.preventDefault();
          closeSidebar();
        }
      }
    };

    const handleTouchEnd = () => {
      startX = 0;
      startY = 0;
      isSwipeGesture = false;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, isOpen, toggleSidebar, closeSidebar]);

  if (!isConnected) {
    return null;
  }

  // Mobile sidebar width is 200px, desktop is 250px when expanded
  const sidebarWidth = isMobile ? (isOpen ? "w-[200px]" : "w-0") : (isCollapsed ? "w-16" : "w-[250px]");
  const sidebarTransform = isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0";

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={closeSidebar}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-slate-900 border-r border-slate-800 shadow-2xl z-50 transition-all duration-300 ease-in-out overflow-y-auto ${sidebarWidth} ${sidebarTransform}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`border-b border-slate-800 transition-all duration-300 ${
            isCollapsed && !isMobile ? "p-2" : "p-4"
          }`}>
            <div className="flex items-center justify-between">
              <Link
                href="/dashboard"
                className={`flex items-center font-bold text-white hover:text-cyan-300 transition-colors ${
                  isCollapsed && !isMobile ? "justify-center w-full" : "gap-3"
                }`}
                onClick={() => handleNavigation("/dashboard")}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                {(!isCollapsed || isMobile) && (
                  <span className="text-lg whitespace-nowrap overflow-hidden">Resonance</span>
                )}
              </Link>
              
              {/* Close button for mobile, collapse button for desktop */}
              {isMobile ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeSidebar}
                  className="text-slate-400 hover:text-white hover:bg-slate-800 p-1.5 flex-shrink-0"
                  aria-label="Close sidebar"
                >
                  <X className="h-4 w-4" />
                </Button>
              ) : (
                !isCollapsed && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleSidebar}
                    className="text-slate-400 hover:text-white hover:bg-slate-800 p-1.5 flex-shrink-0"
                    aria-label="Collapse sidebar"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                )
              )}
            </div>
            
            {/* Expand button for collapsed desktop state */}
            {isCollapsed && !isMobile && (
              <div className="mt-2 flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSidebar}
                  className="text-slate-400 hover:text-white hover:bg-slate-800 p-1.5 w-8 h-8"
                  aria-label="Expand sidebar"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className={`flex-1 space-y-2 transition-all duration-300 ${
            isCollapsed && !isMobile ? "px-2 py-4" : "px-4 py-4"
          }`}>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => handleNavigation(item.href)}
                  className={`group relative flex items-center rounded-lg transition-all duration-300 ${
                    isCollapsed && !isMobile
                      ? "justify-center p-2.5 mx-1" 
                      : "gap-3 px-3 py-2.5"
                  } ${
                    active
                      ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg"
                      : "text-slate-300 hover:text-white hover:bg-slate-800"
                  } ${item.primary ? "mt-4" : ""}`}
                  role="menuitem"
                >
                  {/* Active indicator */}
                  {active && (!isCollapsed || isMobile) && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 rounded-r-full" />
                  )}
                  
                  <Icon className={`h-5 w-5 flex-shrink-0 transition-all duration-300 ${
                    active ? "text-white" : ""
                  } ${isCollapsed && !isMobile ? "mx-auto" : ""}`} />
                  
                  {(!isCollapsed || isMobile) && (
                    <div className="flex-1 min-w-0 transition-all duration-300">
                      <div className={`font-medium whitespace-nowrap overflow-hidden ${
                        active ? "text-white" : ""
                      }`}>
                        {item.label}
                      </div>
                      {!active && (
                        <div className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors whitespace-nowrap overflow-hidden">
                          {item.description}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tooltip for collapsed desktop state */}
                  {isCollapsed && !isMobile && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-slate-700">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-slate-400">{item.description}</div>
                      {/* Arrow */}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 border-l border-b border-slate-700 rotate-45"></div>
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className={`border-t border-slate-800 transition-all duration-300 ${
            isCollapsed && !isMobile ? "p-2 mb-12" : "p-4 mb-12"
          }`}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`w-full text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-300 ${
                    isCollapsed && !isMobile ? "p-2 justify-center" : "p-3 justify-start"
                  }`}
                  aria-label="User menu"
                >
                  {isCollapsed && !isMobile ? (
                    <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="font-medium truncate">{userName}</div>
                        <div className="text-xs text-slate-500 truncate">
                          {address?.slice(0, 6)}...{address?.slice(-4)}
                        </div>
                      </div>
                      <ChevronDown className="h-4 w-4 text-slate-500 flex-shrink-0" />
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 ml-4">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>
    </>
  );
}