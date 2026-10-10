"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { MobileSidebar } from "@/components/navigation/MobileSidebar";

export type ThemeMode = "dark" | "light" | "system";
export type ResolvedTheme = "dark" | "light";

interface UIContextType {
  commandPaletteOpen: boolean;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleCommandPalette: () => void;
  mobileSidebarOpen: boolean;
  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  toggleMobileSidebar: () => void;
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
  cycleTheme: () => void;
}

const UIContext = createContext<UIContextType | null>(null);

const DEFAULT_UI_CONTEXT: UIContextType = {
  commandPaletteOpen: false,
  openCommandPalette: () => { },
  closeCommandPalette: () => { },
  toggleCommandPalette: () => { },
  mobileSidebarOpen: false,
  openMobileSidebar: () => { },
  closeMobileSidebar: () => { },
  toggleMobileSidebar: () => { },
  theme: "dark",
  resolvedTheme: "dark",
  setTheme: () => { },
  cycleTheme: () => { },
};

export function useUI(): UIContextType {
  const context = useContext(UIContext);
  return context || DEFAULT_UI_CONTEXT;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [theme, setThemeState] = useState<ThemeMode>("dark");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("dark");

  const applyTheme = useCallback((mode: ThemeMode) => {
    if (typeof window === "undefined") return;

    let resolved: ResolvedTheme = "dark";
    if (mode === "system") {
      resolved = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    } else {
      resolved = mode;
    }

    setResolvedTheme(resolved);
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(resolved);
    root.setAttribute("data-theme", resolved);
    root.setAttribute("data-mode", mode);
  }, []);

  // Initialize theme from localStorage or default to dark
  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme") as ThemeMode | null;
      const initialTheme: ThemeMode =
        saved === "light" || saved === "dark" || saved === "system" ? saved : "dark";
      setThemeState(initialTheme);
      applyTheme(initialTheme);
    } catch {
      applyTheme("system");
    }
  }, [applyTheme]);

  // Listen to system theme changes when in "system" mode
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    const handleChange = () => {
      applyTheme("system");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, applyTheme]);

  const setTheme = useCallback(
    (newTheme: ThemeMode) => {
      setThemeState(newTheme);
      try {
        localStorage.setItem("theme", newTheme);
      } catch {
        // ignore
      }
      applyTheme(newTheme);
    },
    [applyTheme]
  );

  const cycleTheme = useCallback(() => {
    const nextTheme: ThemeMode =
      theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
    setTheme(nextTheme);
  }, [theme, setTheme]);

  const openCommandPalette = useCallback(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("focus-topbar-search"));
    }
  }, []);
  const closeCommandPalette = useCallback(() => setCommandPaletteOpen(false), []);
  const toggleCommandPalette = useCallback(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("focus-topbar-search"));
    }
  }, []);

  const openMobileSidebar = useCallback(() => setMobileSidebarOpen(true), []);
  const closeMobileSidebar = useCallback(() => setMobileSidebarOpen(false), []);
  const toggleMobileSidebar = useCallback(
    () => setMobileSidebarOpen((prev) => !prev),
    []
  );

  // Global keyboard shortcuts (Escape for mobile sidebar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close overlays on Escape if any are open
      if (e.key === "Escape") {
        if (mobileSidebarOpen) {
          e.preventDefault();
          setMobileSidebarOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileSidebarOpen]);

  const value: UIContextType = {
    commandPaletteOpen,
    openCommandPalette,
    closeCommandPalette,
    toggleCommandPalette,
    mobileSidebarOpen,
    openMobileSidebar,
    closeMobileSidebar,
    toggleMobileSidebar,
    theme,
    resolvedTheme,
    setTheme,
    cycleTheme,
  };

  return (
    <UIContext.Provider value={value}>
      {children}
      <MobileSidebar
        isOpen={mobileSidebarOpen}
        onClose={closeMobileSidebar}
        onOpenSearch={openCommandPalette}
      />
    </UIContext.Provider>
  );
}
