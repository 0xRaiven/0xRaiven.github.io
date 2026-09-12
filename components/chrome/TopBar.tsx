"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { GlassSurface } from "./GlassSurface";
import { TopbarSearch } from "./TopbarSearch";
import { Sun, Moon, Monitor, MoreVertical, Menu } from "lucide-react";
import { useUI } from "@/providers";

export interface TopBarProps {
  githubUrl?: string;
  xUrl?: string;
  linkedinUrl?: string;
}

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function XIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function TopBar({
  githubUrl = "https://github.com/0xraiven",
  xUrl = "https://x.com/0xraiven",
  linkedinUrl,
}: TopBarProps) {
  const finalXUrl = xUrl || linkedinUrl || "https://x.com/0xraiven";
  const { openMobileSidebar, theme, resolvedTheme, cycleTheme, setTheme } = useUI();
  const [overflowOpen, setOverflowOpen] = useState(false);
  const overflowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!overflowOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (overflowRef.current && !overflowRef.current.contains(e.target as Node)) {
        setOverflowOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOverflowOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [overflowOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-12">
      <GlassSurface
        className="w-full h-full rounded-none border-t-0 border-x-0 border-b px-3 sm:px-4 flex items-center justify-between"
        style={{ borderRadius: 0 }}
      >
        {/* LEFT: Mobile hamburger + r41n • Security Knowledge Base */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={openMobileSidebar}
            aria-label="Open mobile navigation menu"
            className="p-1.5 rounded text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors md:hidden focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            <Menu className="w-4 h-4" />
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 text-sm tracking-tight focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded px-1 py-0.5 group"
          >
            <div className="relative w-6 h-6 rounded-md overflow-hidden border border-border/80 group-hover:border-accent/60 transition-colors shrink-0 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/icon.svg"
                alt="Logo"
                width={24}
                height={24}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-mono font-bold text-text-primary group-hover:text-accent tracking-wide transition-colors">
              r41n
            </span>
            <span className="text-text-secondary text-xs select-none">•</span>
            <span className="font-sans text-xs text-text-secondary hidden sm:inline truncate max-w-[200px] md:max-w-none">
              Portfolio / Knowledge Base
            </span>
          </Link>
        </div>

        {/* RIGHT: Search bar, GitHub, LinkedIn, Theme toggle, overflow menu */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Topbar Search Box */}
          <TopbarSearch />

          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="p-1.5 rounded text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            <GithubIcon className="w-4 h-4" />
          </a>

          <a
            href={finalXUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (formerly Twitter) profile"
            className="p-1.5 rounded text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            <XIcon className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={cycleTheme}
            aria-label={`Theme: ${theme} (currently ${resolvedTheme}). Click to cycle Dark, Light, System.`}
            title={`Theme: ${theme.toUpperCase()} ${theme === "system" ? `(OS: ${resolvedTheme})` : ""} — Click to switch`}
            className="p-1.5 rounded text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent flex items-center justify-center group"
          >
            {theme === "dark" ? (
              <Moon className="w-4 h-4 text-accent transition-transform group-hover:-rotate-12" />
            ) : theme === "light" ? (
              <Sun className="w-4 h-4 text-accent transition-transform group-hover:rotate-45" />
            ) : (
              <Monitor className="w-4 h-4 text-accent transition-transform group-hover:scale-110" />
            )}
          </button>

          <div ref={overflowRef} className="relative sm:hidden">
            <button
              type="button"
              onClick={() => setOverflowOpen(!overflowOpen)}
              aria-label="More options"
              aria-expanded={overflowOpen}
              className="p-1.5 rounded text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {overflowOpen && (
              <div className="absolute right-0 mt-1 w-48 py-1 rounded bg-surface border border-border shadow-lg z-50 text-xs font-mono animate-dropdown-slide-down">
                <div className="px-3 py-1.5 text-text-secondary border-b border-border">
                  r41n knowledge base
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOverflowOpen(false);
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(new CustomEvent("focus-topbar-search"));
                    }
                  }}
                  className="w-full text-left px-3 py-1.5 text-text-secondary hover:text-text-primary hover:bg-surface-2 flex items-center justify-between"
                >
                  <span>Search</span>
                  <span className="text-[10px] text-accent">⌘K</span>
                </button>
                <Link
                  href="/"
                  onClick={() => setOverflowOpen(false)}
                  className="block px-3 py-1.5 text-text-secondary hover:text-text-primary hover:bg-surface-2"
                >
                  README
                </Link>
                <Link
                  href="/projects"
                  onClick={() => setOverflowOpen(false)}
                  className="block px-3 py-1.5 text-text-secondary hover:text-text-primary hover:bg-surface-2"
                >
                  Projects
                </Link>
                <Link
                  href="/writeups"
                  onClick={() => setOverflowOpen(false)}
                  className="block px-3 py-1.5 text-text-secondary hover:text-text-primary hover:bg-surface-2"
                >
                  Writeups
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setOverflowOpen(false);
                    try {
                      sessionStorage.removeItem("r41n_booted");
                    } catch {}
                    window.dispatchEvent(new CustomEvent("r41n:boot"));
                  }}
                  className="w-full text-left px-3 py-1.5 text-text-secondary hover:text-accent hover:bg-surface-2 flex items-center justify-between font-mono"
                >
                  <span>Reboot System</span>
                  <span className="text-[10px] text-accent font-bold">[BOOT]</span>
                </button>

                {/* Theme Selector in Mobile Overflow */}
                <div className="border-t border-border mt-1 pt-1.5 px-3">
                  <div className="text-[10px] text-text-secondary uppercase tracking-wider mb-1.5">
                    Theme: <span className="text-accent font-semibold">{theme}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 pb-1">
                    <button
                      type="button"
                      onClick={() => {
                        setTheme("dark");
                        setOverflowOpen(false);
                      }}
                      className={`py-1 rounded text-center text-[10px] font-bold uppercase transition-colors ${theme === "dark"
                          ? "bg-accent text-white"
                          : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
                        }`}
                    >
                      Dark
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTheme("light");
                        setOverflowOpen(false);
                      }}
                      className={`py-1 rounded text-center text-[10px] font-bold uppercase transition-colors ${theme === "light"
                          ? "bg-accent text-white"
                          : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
                        }`}
                    >
                      Light
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTheme("system");
                        setOverflowOpen(false);
                      }}
                      className={`py-1 rounded text-center text-[10px] font-bold uppercase transition-colors ${theme === "system"
                          ? "bg-accent text-white"
                          : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
                        }`}
                    >
                      Auto
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </GlassSurface>
    </header>
  );
}
