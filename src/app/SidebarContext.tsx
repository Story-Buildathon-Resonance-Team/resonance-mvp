"use client";

import { createContext, useContext, useState, useEffect, PropsWithChildren, useCallback } from "react";

interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  sidebarWidth: number;
  isMobile: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: PropsWithChildren) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize mobile state
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      if (mobile) {
        setIsCollapsed(true);
        setSidebarWidth(0);
        setIsOpen(false);
      } else {
        setIsCollapsed(false);
        setSidebarWidth(250);
        setIsOpen(true);
      }
      
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Handle responsive behavior with debouncing
  useEffect(() => {
    if (!isInitialized) return;

    let timeoutId: NodeJS.Timeout;
    let previousMobile = isMobile;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        const mobile = window.innerWidth < 768;
        
        // Only update if mobile state actually changed
        if (mobile !== previousMobile) {
          setIsMobile(mobile);
          previousMobile = mobile;
          
          if (mobile) {
            setIsCollapsed(true);
            setSidebarWidth(0);
            setIsOpen(false);
          } else {
            setIsCollapsed(false);
            setSidebarWidth(250);
            setIsOpen(true);
          }
        }
      }, 150); // Debounce resize events
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [isInitialized, isMobile]);

  // Toggle function for mobile and desktop
  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setIsOpen(prev => !prev);
    } else {
      setIsCollapsed(prev => {
        const newCollapsed = !prev;
        setSidebarWidth(newCollapsed ? 64 : 250);
        return newCollapsed;
      });
    }
  }, [isMobile]);

  // Close sidebar function
  const closeSidebar = useCallback(() => {
    if (isMobile) {
      setIsOpen(false);
    } else {
      setIsCollapsed(true);
      setSidebarWidth(64);
    }
  }, [isMobile]);

  // Handle escape key to close sidebar on mobile
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobile && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobile, isOpen]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, isOpen]);

  return (
    <SidebarContext.Provider value={{ 
      isCollapsed, 
      setIsCollapsed, 
      sidebarWidth, 
      isMobile, 
      isOpen, 
      setIsOpen, 
      toggleSidebar,
      closeSidebar
    }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}