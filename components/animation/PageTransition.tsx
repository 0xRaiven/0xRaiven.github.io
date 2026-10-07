"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export interface PageTransitionProps {
  children: React.ReactNode;
}

function getSectorIndex(pathname: string): string {
  if (!pathname || pathname === "/") return "00";
  if (pathname.startsWith("/projects")) return "01";
  if (pathname.startsWith("/writeups")) return "02";
  if (pathname.startsWith("/notes")) return "03";
  if (pathname.startsWith("/research")) return "04";
  if (pathname.startsWith("/about")) return "05";
  if (pathname.startsWith("/resume")) return "06";
  if (pathname.startsWith("/contact")) return "07";
  return "08";
}

function formatSectorName(pathname: string): string {
  if (!pathname || pathname === "/") return "HOME";
  return pathname.replace(/^\//, "").replace(/-/g, "_").toUpperCase();
}

/**
 * Nothing OS Inspired Glyph Page Transition
 * 
 * Replaces the edgy cyber braille bar with an authentic Nothing OS
 * Glyph matrix telemetry bar:
 * - 7-dot micro LED array with smooth ripple animation
 * - Dotted index tags ( 01 ) and Nothing OS industrial typography
 * - Signature red recording LED indicator
 * - Asset & font awareness to eliminate image pop-in
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [tick, setTick] = useState(0);
  const [routeChecksum, setRouteChecksum] = useState("0x4A1F");

  useEffect(() => {
    // Generate simulated dynamic checksum for this route
    const hash = Array.from(pathname || "root").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    setRouteChecksum("0x" + (hash * 31).toString(16).toUpperCase().slice(-4));

    setIsTransitioning(true);

    // Preload critical images & wait for fonts
    const avatarImg = new Image();
    avatarImg.src = "https://github.com/0xraiven.png";

    const fontPromise = typeof document !== "undefined" && document.fonts ? document.fonts.ready : Promise.resolve();
    const minDelay = new Promise((res) => setTimeout(res, 280));

    Promise.all([fontPromise, minDelay]).then(() => {
      setIsTransitioning(false);
    });
  }, [pathname]);

  // Dot matrix ripple interval while transitioning
  useEffect(() => {
    if (!isTransitioning) return;

    const interval = setInterval(() => {
      setTick((t) => (t + 1) % 7);
    }, 45);

    return () => clearInterval(interval);
  }, [isTransitioning]);

  const sectorIndex = getSectorIndex(pathname || "/");
  const sectorName = formatSectorName(pathname || "/");

  return (
    <div className="relative min-w-0 w-full">
      {/* Nothing OS Glyph Route Telemetry Bar */}
      <div
        className={`transition-all duration-300 font-mono text-[11px] select-none flex items-center justify-between px-3.5 py-2 mb-5 rounded-xl border backdrop-blur-md ${
          isTransitioning
            ? "border-accent/40 bg-surface/95 shadow-[0_4px_20px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] opacity-100 translate-y-0"
            : "border-border/60 bg-surface-2/40 opacity-70 hover:opacity-100 transition-opacity -translate-y-0.5"
        }`}
      >
        {/* Left: Sector Index + Glyph Dot-Matrix Micro Array */}
        <div className="flex items-center gap-3 truncate">
          <span className="font-pixel text-[10px] text-text-secondary tracking-widest">
            ( {sectorIndex} )
          </span>

          {/* 7-Dot Micro LED Array */}
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 border border-border/80 shadow-inner"
            aria-hidden="true"
          >
            {Array.from({ length: 7 }).map((_, i) => {
              const isActive = isTransitioning ? i === tick : true;
              return (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-150 ${
                    isTransitioning
                      ? isActive
                        ? "bg-white shadow-[0_0_6px_rgba(255,255,255,0.95)] scale-125"
                        : "bg-white/15"
                      : "bg-emerald-400/80 shadow-[0_0_4px_rgba(52,211,153,0.6)]"
                  }`}
                />
              );
            })}
          </div>

          <span className="font-mono text-xs font-semibold text-text-primary tracking-wide truncate">
            {sectorName}
          </span>
        </div>

        {/* Right: Status & Coordinates */}
        <div className="flex items-center gap-2.5 shrink-0">
          <span
            className={`font-pixel text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full transition-colors duration-200 ${
              isTransitioning
                ? "bg-accent/15 text-accent border border-accent/30 animate-pulse"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium"
            }`}
          >
            {isTransitioning ? "SYNC" : "READY"}
          </span>

          <span className="text-[10px] px-2 py-0.5 rounded bg-surface border border-border text-text-secondary font-mono">
            {routeChecksum}
          </span>
        </div>

        {/* Animated Light Sweep on bottom border when transitioning */}
        {isTransitioning && (
          <div className="absolute bottom-0 left-0 right-0 h-[1.5px] overflow-hidden rounded-b-xl pointer-events-none">
            <div className="h-full w-28 bg-gradient-to-r from-transparent via-white to-accent shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-glyph-sweep" />
          </div>
        )}
      </div>

      {/* Progressive Page Content Container with Silky Smooth Reveal */}
      <div
        key={pathname}
        className={`transition-all duration-500 ease-out w-full ${
          isTransitioning
            ? "opacity-50 filter blur-[0.75px] translate-y-1 pointer-events-none"
            : "opacity-100 filter blur-0 translate-y-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default PageTransition;
