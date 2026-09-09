"use client";

import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { X, ArrowRight } from "lucide-react";

/**
 * System Matrix Boot Loader
 * 
 * High-precision industrial LED dot matrix boot loader:
 * - Panoramic 25x9 LED micro-dot matrix (225 dots) occupying the full width of the card
 * - 4 distinct choreographed cyberpunk sequences, each showcased for >= 2.0 seconds:
 *     1. RADAR_SWEEP (0s - 2.2s): Bi-directional radar sweep with phosphor decay trails
 *     2. SPECTRUM_EQ (2.2s - 4.4s): 25-channel kinetic harmonic VU meter with peak hold diodes
 *     3. ORBITAL_LOCK (4.4s - 6.6s): Expanding concentric reticle & 64-bulb orbital perimeter tracer
 *     4. SYSTEM_READY (6.6s - 8.6s): Calibrated center core glyph lock & horizon axes at 100%
 * - Seamless automatic dismissal at completion with instant keyboard skip (Esc / Enter / Space)
 */
export const BOOT_STORAGE_KEY = "r41n_booted";

export interface BootPhaseConfig {
  id: number;
  tag: string;
  name: string;
  status: string;
  startProgress: number;
  endProgress: number;
  durationMs: number;
}

export const BOOT_SEQUENCE_PHASES: BootPhaseConfig[] = [
  {
    id: 0,
    tag: "( 01 )",
    name: "RADAR_SWEEP",
    status: "INITIALIZING RADAR KERNEL & SECTOR TELEMETRY...",
    startProgress: 0,
    endProgress: 28,
    durationMs: 1000,
  },
  {
    id: 1,
    tag: "( 02 )",
    name: "SPECTRUM_EQ",
    status: "CALIBRATING 25-CH SPECTRUM HARMONICS & ASSET PIPELINE...",
    startProgress: 29,
    endProgress: 60,
    durationMs: 1000,
  },
  {
    id: 2,
    tag: "( 03 )",
    name: "ORBITAL_LOCK",
    status: "SYNCHRONIZING ORBITAL REGISTERS & PERIMETER MESH...",
    startProgress: 61,
    endProgress: 88,
    durationMs: 1000,
  },
  {
    id: 3,
    tag: "( 04 )",
    name: "SYSTEM_READY",
    status: "ALL SUBSYSTEMS AUTHENTICATED & LOCKED [100%]",
    startProgress: 89,
    endProgress: 100,
    durationMs: 1000,
  },
];

export function SystemMatrixBootLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissing, setIsDismissing] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [tick, setTick] = useState(0);

  // Asset loading telemetry
  const [isAssetsLoaded, setIsAssetsLoaded] = useState(false);
  const [assetStatus, setAssetStatus] = useState("INITIALIZING SYSTEM CORE...");

  const startTimeRef = useRef<number>(Date.now());
  const hasAutoDismissedRef = useRef(false);

  const dismiss = useCallback(() => {
    setIsDismissing(true);
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("booting-active");
      document.body.classList.remove("booting-active");
      document.body.classList.add("booting-complete");
    }
    try {
      sessionStorage.setItem(BOOT_STORAGE_KEY, "true");
    } catch {
      // ignore
    }
    setTimeout(() => {
      setIsVisible(false);
      setIsDismissing(false);
      if (typeof document !== "undefined") {
        document.body.classList.remove("booting-complete");
      }
    }, 750);
  }, []);

  // Check session storage on mount + support URL force boot (?boot=true or ?reboot=true)
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.location.pathname.startsWith("/keystat")) {
        setIsVisible(false);
        if (typeof document !== "undefined") {
          document.documentElement.classList.remove("booting-active");
          document.body.classList.remove("booting-active");
        }
        return;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const forceBoot = urlParams.get("boot") === "true" || urlParams.get("reboot") === "true";
      const alreadyBooted = sessionStorage.getItem(BOOT_STORAGE_KEY);

      if (!forceBoot && alreadyBooted) {
        setIsVisible(false);
        if (typeof document !== "undefined") {
          document.documentElement.classList.remove("booting-active");
          document.body.classList.remove("booting-active");
        }
      } else {
        setIsVisible(true);
        if (typeof document !== "undefined") {
          document.documentElement.classList.add("booting-active");
          document.body.classList.add("booting-active");
        }
      }
    } catch {
      setIsVisible(true);
      if (typeof document !== "undefined") {
        document.documentElement.classList.add("booting-active");
        document.body.classList.add("booting-active");
      }
    }

    const handleReboot = () => {
      try {
        sessionStorage.removeItem(BOOT_STORAGE_KEY);
      } catch { }
      startTimeRef.current = Date.now();
      hasAutoDismissedRef.current = false;
      setPhaseIndex(0);
      setProgress(0);
      setIsAssetsLoaded(false);
      setTick(0);
      setIsDismissing(false);
      setIsVisible(true);
      if (typeof document !== "undefined") {
        document.body.classList.remove("booting-complete");
        document.documentElement.classList.add("booting-active");
        document.body.classList.add("booting-active");
      }
    };

    window.addEventListener("r41n:boot", handleReboot);
    return () => {
      window.removeEventListener("r41n:boot", handleReboot);
      if (typeof document !== "undefined") {
        document.documentElement.classList.remove("booting-active");
        document.body.classList.remove("booting-active", "booting-complete");
      }
    };
  }, []);

  // Asset readiness monitor: DOM readiness + fonts + page avatar
  useEffect(() => {
    if (!isVisible) return;

    let cancelled = false;

    async function monitorPageAssets() {
      // 1. Wait for document ready
      if (typeof document !== "undefined" && document.readyState !== "complete") {
        setAssetStatus("AWAITING DOM READY STATE...");
        await new Promise<void>((resolve) => {
          const onComplete = () => {
            window.removeEventListener("load", onComplete);
            resolve();
          };
          window.addEventListener("load", onComplete);
        });
      }
      if (cancelled) return;

      // 2. Wait for fonts
      setAssetStatus("VERIFYING SYSTEM FONTS [INTER + JETBRAINS]...");
      if (typeof document !== "undefined" && document.fonts) {
        try {
          await document.fonts.ready;
        } catch {
          // font fallback
        }
      }
      if (cancelled) return;

      // 3. Track DOM images + profile avatar specifically
      const avatarUrl = "https://github.com/0xraiven.png";
      const imageSources = new Set<string>();
      imageSources.add(avatarUrl);

      const domImgs = Array.from(document.querySelectorAll<HTMLImageElement>("img"));
      domImgs.forEach((img) => {
        if (img.src) imageSources.add(img.src);
      });

      const promises = Array.from(imageSources).map((src) => {
        return new Promise<void>((resolve) => {
          const domImg = domImgs.find((i) => i.src === src);
          if (domImg && domImg.complete && domImg.naturalWidth !== 0) {
            if (!cancelled) {
              setAssetStatus(`DECODED: ${src.split("/").pop() || "resource"}`);
            }
            resolve();
            return;
          }

          const loader = new Image();
          loader.src = src;
          const onDone = () => {
            if (!cancelled) {
              setAssetStatus(`DECODED: ${src.split("/").pop() || "resource"}`);
            }
            resolve();
          };

          if (loader.complete && loader.naturalWidth !== 0) {
            onDone();
          } else {
            loader.onload = onDone;
            loader.onerror = onDone; // Do not hang indefinitely if an image 404s
          }
        });
      });

      // Cap at 3.0s maximum so offline / slow connections never get stuck
      await Promise.race([
        Promise.all(promises),
        new Promise((resolve) => setTimeout(resolve, 3000)),
      ]);

      if (!cancelled) {
        setAssetStatus("ALL PAGE ASSETS DECODED & LOCKED");
        setIsAssetsLoaded(true);
      }
    }

    monitorPageAssets();

    return () => {
      cancelled = true;
    };
  }, [isVisible]);

  // Dot matrix animation timer
  useEffect(() => {
    if (!isVisible) return;

    const tickInterval = setInterval(() => {
      setTick((t) => (t + 1) % 300);
    }, 55);

    return () => clearInterval(tickInterval);
  }, [isVisible]);

  // Keyboard shortcut (Escape / Enter / Space) to skip
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        dismiss();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, dismiss]);

  // Sequential phase ticker: guarantees each sequence runs cleanly for exactly 1.0 second (1000ms)
  useEffect(() => {
    if (!isVisible || isDismissing) return;

    startTimeRef.current = Date.now();
    hasAutoDismissedRef.current = false;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;

      // Sequence 0: Radar Sweep (0ms - 1000ms)
      if (elapsed < 1000) {
        setPhaseIndex(0);
        const ratio = Math.min(1, elapsed / 1000);
        const p = Math.round(
          BOOT_SEQUENCE_PHASES[0].startProgress +
          (BOOT_SEQUENCE_PHASES[0].endProgress - BOOT_SEQUENCE_PHASES[0].startProgress) * ratio
        );
        setProgress(p);
      }
      // Sequence 1: 25-Channel VU Spectrum Equalizer (1000ms - 2000ms)
      else if (elapsed < 2000) {
        setPhaseIndex(1);
        const ratio = Math.min(1, (elapsed - 1000) / 1000);
        const p = Math.round(
          BOOT_SEQUENCE_PHASES[1].startProgress +
          (BOOT_SEQUENCE_PHASES[1].endProgress - BOOT_SEQUENCE_PHASES[1].startProgress) * ratio
        );
        setProgress(p);
      }
      // Sequence 2: Concentric Reticle & Orbital Perimeter Tracer (2000ms - 3000ms)
      else if (elapsed < 3000) {
        setPhaseIndex(2);
        const ratio = Math.min(1, (elapsed - 2000) / 1000);
        const p = Math.round(
          BOOT_SEQUENCE_PHASES[2].startProgress +
          (BOOT_SEQUENCE_PHASES[2].endProgress - BOOT_SEQUENCE_PHASES[2].startProgress) * ratio
        );
        setProgress(p);
      }
      // Sequence 3: System Core Lock & Authorization (3000ms - 4000ms)
      else if (elapsed < 4000) {
        setPhaseIndex(3);
        const ratio = Math.min(1, (elapsed - 3000) / 750);
        const p = Math.min(
          100,
          Math.round(
            BOOT_SEQUENCE_PHASES[3].startProgress +
            (100 - BOOT_SEQUENCE_PHASES[3].startProgress) * ratio
          )
        );
        setProgress(p);
      }
      // Sequence Complete (4000ms+): Auto-dismiss into main page
      else {
        setPhaseIndex(3);
        setProgress(100);
        if (!hasAutoDismissedRef.current) {
          hasAutoDismissedRef.current = true;
          dismiss();
        }
      }
    }, 25);

    return () => clearInterval(interval);
  }, [isVisible, isDismissing, dismiss]);

  // Panoramic 25x9 Dot Matrix Geometry (225 bulbs spanning full card width)
  const matrixDots = useMemo(() => {
    const dots: { r: number; c: number; intensity: number; isGlow: boolean }[] = [];
    const centerC = 12;
    const centerR = 4;

    // Ping-pong radar scanner column (0 to 24)
    const scanCol = Math.round(Math.abs(((tick * 0.95) % 48) - 24));

    // Outer perimeter sequence index for orbital tracer (64 bulbs around the border)
    const perimeterTick = (tick * 2) % 64;

    // Diagnostic sector coordinate ping
    const pingC = (tick * 7) % 25;
    const pingR = (tick * 11) % 9;

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 25; c++) {
        let intensity = 0.08;
        let isGlow = false;

        if (phaseIndex === 3) {
          // Phase 4: Calibrated System Lock & Harmonic Horizon Glyph
          const isCenterCore = Math.abs(r - centerR) + Math.abs((c - centerC) * 0.5) <= 1.8;
          const isHorizon = r === centerR && (c <= 4 || c >= 20);
          const isBracket =
            ((r === 1 || r === 7) && (c === 2 || c === 22)) ||
            ((r === 2 || r === 6) && (c === 1 || c === 23));

          if (isCenterCore) {
            intensity = 0.95 + 0.05 * Math.sin(tick * 0.3);
            isGlow = true;
          } else if (isHorizon) {
            intensity = 0.85;
            isGlow = true;
          } else if (isBracket) {
            intensity = 0.75;
          } else {
            intensity = 0.08;
          }
        } else if (phaseIndex === 0) {
          // Phase 1: High-Speed Bi-Directional Radar Beam with Phosphor Trails
          const distToScan = Math.abs(c - scanCol);
          const isHorizonAxis = r === centerR;

          if (distToScan === 0) {
            intensity = 1.0;
            isGlow = true;
          } else if (distToScan === 1) {
            intensity = 0.75;
          } else if (distToScan === 2) {
            intensity = 0.45;
          } else if (distToScan === 3) {
            intensity = 0.22;
          } else if (isHorizonAxis && (c % 2 === 0)) {
            // Faint telemetry guide line
            intensity = 0.28;
          }

          // Random sector coordinate ping
          if (c === pingC && r === pingR) {
            intensity = 1.0;
            isGlow = true;
          }
        } else if (phaseIndex === 1) {
          // Phase 2: 25-Channel Kinetic VU Spectrum Equalizer with Peak Hold Diodes
          const harmonic1 = Math.sin(c * 0.48 + tick * 0.3);
          const harmonic2 = Math.cos(c * 0.24 - tick * 0.2);
          const rawHeight = (harmonic1 * 0.65 + harmonic2 * 0.35 + 1) * 0.5;
          const barHeight = Math.max(1, Math.min(8, Math.round(rawHeight * 8)));

          // Distance from bottom row (r = 8 is bottom, r = 0 is top)
          const rowFromBottom = 8 - r;

          if (rowFromBottom === barHeight) {
            // Floating peak diode
            intensity = 1.0;
            isGlow = true;
          } else if (rowFromBottom < barHeight) {
            // Active column meter bar
            intensity = rowFromBottom > barHeight - 2 ? 0.88 : 0.6;
          } else {
            // Standby bulb
            intensity = 0.08;
          }
        } else {
          // Phase 3: Cybernetic Concentric Reticle & Traveling Perimeter Orbit (phaseIndex === 2)
          const boxRadius = Math.max(Math.abs(c - centerC), Math.abs((r - centerR) * 2.6));
          const wavePhase = (boxRadius * 0.85 - tick * 0.4) % 6;
          const isRing = Math.abs(wavePhase) < 1.1;

          // Perimeter orbital tracer
          let isOrbital = false;
          let perimeterIndex = -1;
          if (r === 0) perimeterIndex = c;
          else if (c === 24) perimeterIndex = 25 + (r - 1);
          else if (r === 8) perimeterIndex = 32 + (24 - c);
          else if (c === 0) perimeterIndex = 57 + (7 - r);

          if (perimeterIndex >= 0) {
            const orbitDist = Math.abs(perimeterIndex - perimeterTick);
            if (orbitDist === 0 || orbitDist === 64) {
              isOrbital = true;
            }
          }

          if (isOrbital) {
            intensity = 1.0;
            isGlow = true;
          } else if (isRing) {
            intensity = 0.85;
            isGlow = true;
          } else if (Math.abs(c - centerC) <= 1 && Math.abs(r - centerR) <= 1) {
            // Center reticle
            intensity = 0.7;
          } else {
            intensity = 0.08;
          }
        }

        dots.push({ r, c, intensity, isGlow });
      }
    }
    return dots;
  }, [phaseIndex, tick]);

  if (!isVisible) return null;

  const currentPhase = BOOT_SEQUENCE_PHASES[phaseIndex] || BOOT_SEQUENCE_PHASES[0];
  const currentStatus =
    isAssetsLoaded && phaseIndex === 3
      ? "ALL SUBSYSTEMS AUTHENTICATED & LOCKED [100%]"
      : currentPhase.status;

  // Segmented 16-bar progress indicator
  const totalSegments = 16;
  const filledSegments = Math.min(totalSegments, Math.floor((progress / 100) * totalSegments));

  return (
    <div
      id="system-boot-loader"
      role="dialog"
      aria-modal="true"
      aria-label="System Matrix Bootloader"
      suppressHydrationWarning
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#070709] select-none cursor-pointer transition-all duration-700 ease-out ${isDismissing ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      style={{
        backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px)`,
        backgroundSize: "22px 22px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0c0c10]/95 backdrop-blur-xl p-5 sm:p-7 font-mono text-xs shadow-[0_20px_60px_rgba(0,0,0,0.8)] space-y-5 overflow-hidden transition-all duration-700 ease-out ${isDismissing
          ? "opacity-0 scale-[1.025] -translate-y-2 filter blur-[4px]"
          : "opacity-100 scale-100 translate-y-0 filter blur-0"
          } ${progress >= 100 && !isDismissing ? "animate-glyph-flash" : ""}`}
      >
        {/* Hardware Corner Registration Marks */}
        <span className="absolute top-2.5 left-2.5 text-[10px] text-white/20 font-mono select-none">+</span>
        <span className="absolute top-2.5 right-2.5 text-[10px] text-white/20 font-mono select-none">+</span>
        <span className="absolute bottom-2.5 left-2.5 text-[10px] text-white/20 font-mono select-none">+</span>
        <span className="absolute bottom-2.5 right-2.5 text-[10px] text-white/20 font-mono select-none">+</span>

        {/* Top Hardware Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 text-[11px] text-text-secondary">
          <div className="flex items-center gap-2.5">
            <span className="font-pixel text-xs text-accent tracking-widest">{currentPhase.tag}</span>
            <span className="font-mono font-bold tracking-widest text-text-primary text-[11px] uppercase">
              SYSTEM // {currentPhase.name}
            </span>
          </div>

          <button
            type="button"
            onClick={dismiss}
            aria-label="Skip initialization"
            className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-surface-2 border border-border text-text-secondary hover:text-text-primary hover:border-accent/40 transition-colors"
          >
            <span className="font-pixel text-[9px]">ESC</span>
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* Center: Full Card Width Panoramic LED Dot Matrix (No Circles) */}
        <div className="space-y-3 py-1 w-full select-none">
          <div className="w-full p-3 sm:p-4 rounded-xl bg-black/60 border border-white/5 shadow-inner">
            <svg
              viewBox="0 0 380 130"
              className="w-full h-28 sm:h-36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="dotGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#ffffff" floodOpacity="0.95" />
                </filter>
              </defs>

              {/* 25x9 Micro Dot Matrix spanning full card width */}
              {matrixDots.map((dot, idx) => {
                const cx = 14 + dot.c * 14.65;
                const cy = 14 + dot.r * 12.75;
                const isPeak = dot.intensity >= 0.85;
                const isActive = dot.intensity >= 0.5;
                const isDim = dot.intensity >= 0.2;

                const radius = isPeak ? 3.05 : isActive ? 2.55 : isDim ? 2.05 : 1.75;
                const fill = isPeak
                  ? "#ffffff"
                  : isActive
                    ? "rgba(255, 255, 255, 0.85)"
                    : isDim
                      ? "rgba(255, 255, 255, 0.35)"
                      : "rgba(255, 255, 255, 0.08)";

                return (
                  <circle
                    key={idx}
                    cx={cx}
                    cy={cy}
                    r={radius}
                    fill={fill}
                    filter={dot.isGlow ? "url(#dotGlow)" : undefined}
                    style={{
                      transition: "r 50ms cubic-bezier(0.4, 0, 0.2, 1), fill 50ms cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />
                );
              })}
            </svg>
          </div>

          {/* Dotted Matrix Percentage Display */}
          <div className="text-center">
            <span className="font-pixel text-base sm:text-lg text-text-primary tracking-widest">
              [ {progress.toString().padStart(3, "0")}% ]
            </span>
          </div>
        </div>

        {/* Real-time Telemetry & Asset Decoding Status (No raw asset count) */}
        <div className="space-y-2 pt-1 border-t border-white/10">
          <div className="flex items-center justify-between text-[10px] text-text-secondary">
            <span className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${phaseIndex === 3 ? "bg-emerald-400" : "bg-accent animate-pulse"}`} />
              <span className="font-mono uppercase tracking-wider">
                PIPELINE: {phaseIndex === 3 ? "READY" : `SEQUENCE 0${phaseIndex + 1}/04`}
              </span>
            </span>
            <span className="font-pixel text-[10px] text-text-secondary tracking-wider">
              {progress >= 100 ? "LOCKED" : "CALIBRATING"}
            </span>
          </div>

          <div className="p-2 rounded bg-black/50 border border-white/5 text-[10px] text-text-secondary font-mono truncate flex items-center justify-between">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-accent mr-1.5">›</span>
              <span className="truncate">{currentStatus}</span>
            </div>
            <span className="font-pixel text-[9px] text-white/40 shrink-0 ml-2">
              [{phaseIndex + 1}/4]
            </span>
          </div>

          {/* 16-Segment Discrete Progress Bar */}
          <div className="flex items-center gap-1 pt-1">
            {Array.from({ length: totalSegments }).map((_, i) => {
              const isFilled = i < filledSegments;
              const isLeading = i === filledSegments - 1;
              return (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-[1px] transition-all duration-150 ${isLeading
                    ? "bg-accent shadow-[0_0_6px_rgba(209,44,75,0.9)]"
                    : isFilled
                      ? "bg-white shadow-[0_0_4px_rgba(255,255,255,0.8)]"
                      : "bg-white/10"
                    }`}
                />
              );
            })}
          </div>
        </div>

        {/* Footer Technical Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-text-secondary">
          <span className="font-pixel uppercase tracking-widest text-white/40">SYSTEM // MATRIX</span>
          <button
            type="button"
            onClick={dismiss}
            className="flex items-center gap-1 text-accent hover:text-accent-hover font-semibold transition-colors font-mono"
          >
            <span>{progress >= 100 ? "ENTER SYSTEM >>" : "SKIP [ESC]"}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Re-export for layout compatibility
export const AsciiBootLoader = SystemMatrixBootLoader;
export const GlyphBootLoader = SystemMatrixBootLoader;
export default SystemMatrixBootLoader;
