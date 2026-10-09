"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";

export const BOOT_STORAGE_KEY = "r41n_booted";

interface LightNeedle {
  x: number;
  speed: number;
  height: number;
  width: number;
  alpha: number;
  phase: number;
}

interface WaveNode {
  waveIndex: number;
  xRatio: number;
  speed: number;
  radius: number;
  pulsePhase: number;
}


export function MinimalBootLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissing, setIsDismissing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const targetProgressRef = useRef(15);
  const allAssetsReadyRef = useRef(false);
  const hasDismissedRef = useRef(false);

  // Synchronous theme detection & live theme mutation observer
  useEffect(() => {
    const detectTheme = () => {
      if (typeof document === "undefined") return;
      const isLight =
        document.documentElement.classList.contains("light") ||
        document.documentElement.getAttribute("data-theme") === "light";
      setTheme(isLight ? "light" : "dark");
    };

    detectTheme();

    const observer = new MutationObserver(detectTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const dismiss = useCallback(() => {
    if (hasDismissedRef.current) return;
    hasDismissedRef.current = true;
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
    }, 700);
  }, []);

  // Check sessionStorage on mount & support ?boot=true / ?reboot=true
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

    // Support system reload event (e.g. from Command Palette, Sidebar, or TopBar)
    const handleReboot = () => {
      try {
        sessionStorage.removeItem(BOOT_STORAGE_KEY);
      } catch { }
      hasDismissedRef.current = false;
      allAssetsReadyRef.current = false;
      targetProgressRef.current = 15;
      setProgress(0);
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

  // Living Generative Ambient Canvas Background (High-DPI Retina + Mobile-Adaptive Frequency)
  useEffect(() => {
    if (!isVisible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Retina High-DPI support to ensure crystal-sharp curves on mobile screens
    const setupCanvasResolution = () => {
      if (!canvas || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    setupCanvasResolution();

    mouseRef.current = {
      x: width * 0.5,
      y: height * 0.5,
      targetX: width * 0.5,
      targetY: height * 0.5,
    };

    const handleResize = () => {
      setupCanvasResolution();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        mouseRef.current.targetX = e.touches[0].clientX;
        mouseRef.current.targetY = e.touches[0].clientY;
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    // 1. Kinetic Vertical Diffraction Needles (Scanning light slivers across expanded height)
    const needles: LightNeedle[] = Array.from({ length: 16 }, () => ({
      x: Math.random() * width,
      speed: (Math.random() - 0.5) * 0.45 + (Math.random() > 0.5 ? 0.25 : -0.25),
      height: 80 + Math.random() * 100,
      width: 1.0 + Math.random() * 1.4,
      alpha: 0.15 + Math.random() * 0.35,
      phase: Math.random() * Math.PI * 2,
    }));

    // 2. Harmonic Wave Crest Nodes
    const waveNodes: WaveNode[] = Array.from({ length: 18 }, (_, i) => ({
      waveIndex: i % 8,
      xRatio: Math.random(),
      speed: 0.0006 + Math.random() * 0.0012,
      radius: 0.9 + Math.random() * 0.6,
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    let time = 0;

    const render = () => {
      time += 0.015;

      // Smooth inertia on cursor / touch coordinates
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      ctx.clearRect(0, 0, width, height);

      const isLight = theme === "light";
      const isMobile = width < 640;

      // Viewport-adaptive wave frequency and amplitude multipliers:
      const freqMultiplier = isMobile ? Math.min(1.8, 750 / Math.max(width, 320)) : 1;
      // Harmonic wave packet amplitude: balanced so the waves tightly resonate without sprawling vertically
      const ampMultiplier = isMobile ? 0.85 : 1.0;

      // Base Canvas Background
      ctx.fillStyle = isLight ? "#fbf9f4" : "#08080b";
      ctx.fillRect(0, 0, width, height);

      // Breathing Central Caustic Light Aura (Centered with the harmonic packet)
      const breath = Math.sin(time * 0.8);
      const auraRadius = isMobile
        ? Math.max(width * 0.65, height * 0.35) * (1 + breath * 0.05)
        : Math.max(width * 0.45, height * 0.40) * (1 + breath * 0.04);
      const auraX = width * 0.5 + (mouse.x - width * 0.5) * 0.04;
      const auraY = height * 0.50 + (mouse.y - height * 0.5) * 0.04;

      const aura = ctx.createRadialGradient(auraX, auraY, 0, auraX, auraY, auraRadius);
      if (isLight) {
        aura.addColorStop(0, "rgba(158, 27, 50, 0.20)");
        aura.addColorStop(0.55, "rgba(184, 35, 61, 0.07)");
        aura.addColorStop(1, "rgba(251, 249, 244, 0)");
      } else {
        aura.addColorStop(0, "rgba(209, 44, 75, 0.28)");
        aura.addColorStop(0.55, "rgba(230, 57, 86, 0.09)");
        aura.addColorStop(1, "rgba(8, 8, 11, 0)");
      }
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, width, height);

      // 8 Intertwined Harmonic Wave Modes: Sharing a central equilibrium axis (~0.50)
      // Natural frequency ratios (f0, 1.5f0, 2f0, 2.5f0, 3f0, 4f0, 5f0, 6f0) for true resonant nodal crossings
      const waveConfigs = isLight
        ? [
          { amp: 48 * ampMultiplier, freq: 0.0016 * freqMultiplier, speed: 0.55, yOffset: 0.500, color: "rgba(158, 27, 50, 0.32)", fill: "rgba(158, 27, 50, 0.020)", width: 2.2 },
          { amp: 38 * ampMultiplier, freq: 0.0024 * freqMultiplier, speed: -0.65, yOffset: 0.506, color: "rgba(184, 35, 61, 0.26)", fill: null, width: 1.8 },
          { amp: 30 * ampMultiplier, freq: 0.0032 * freqMultiplier, speed: 0.75, yOffset: 0.494, color: "rgba(158, 27, 50, 0.24)", fill: null, width: 1.5 },
          { amp: 24 * ampMultiplier, freq: 0.0040 * freqMultiplier, speed: -0.85, yOffset: 0.510, color: "rgba(184, 35, 61, 0.22)", fill: null, width: 1.3 },
          { amp: 19 * ampMultiplier, freq: 0.0048 * freqMultiplier, speed: 0.95, yOffset: 0.490, color: "rgba(158, 27, 50, 0.20)", fill: null, width: 1.2 },
          { amp: 15 * ampMultiplier, freq: 0.0064 * freqMultiplier, speed: -1.10, yOffset: 0.504, color: "rgba(184, 35, 61, 0.18)", fill: null, width: 1.0 },
          { amp: 11 * ampMultiplier, freq: 0.0080 * freqMultiplier, speed: 1.25, yOffset: 0.496, color: "rgba(158, 27, 50, 0.16)", fill: null, width: 0.9 },
          { amp: 8 * ampMultiplier, freq: 0.0096 * freqMultiplier, speed: -1.40, yOffset: 0.500, color: "rgba(184, 35, 61, 0.14)", fill: null, width: 0.8 },
        ]
        : [
          { amp: 54 * ampMultiplier, freq: 0.0016 * freqMultiplier, speed: 0.55, yOffset: 0.500, color: "rgba(209, 44, 75, 0.40)", fill: "rgba(209, 44, 75, 0.030)", width: 2.2 },
          { amp: 42 * ampMultiplier, freq: 0.0024 * freqMultiplier, speed: -0.65, yOffset: 0.506, color: "rgba(230, 57, 86, 0.34)", fill: null, width: 1.8 },
          { amp: 33 * ampMultiplier, freq: 0.0032 * freqMultiplier, speed: 0.75, yOffset: 0.494, color: "rgba(209, 44, 75, 0.30)", fill: null, width: 1.5 },
          { amp: 26 * ampMultiplier, freq: 0.0040 * freqMultiplier, speed: -0.85, yOffset: 0.510, color: "rgba(230, 57, 86, 0.26)", fill: null, width: 1.3 },
          { amp: 20 * ampMultiplier, freq: 0.0048 * freqMultiplier, speed: 0.95, yOffset: 0.490, color: "rgba(209, 44, 75, 0.24)", fill: null, width: 1.2 },
          { amp: 16 * ampMultiplier, freq: 0.0064 * freqMultiplier, speed: -1.10, yOffset: 0.504, color: "rgba(230, 57, 86, 0.22)", fill: null, width: 1.0 },
          { amp: 12 * ampMultiplier, freq: 0.0080 * freqMultiplier, speed: 1.25, yOffset: 0.496, color: "rgba(209, 44, 75, 0.20)", fill: null, width: 0.9 },
          { amp: 9 * ampMultiplier, freq: 0.0096 * freqMultiplier, speed: -1.40, yOffset: 0.500, color: "rgba(255, 255, 255, 0.22)", fill: null, width: 0.8 },
        ];

      // Helper to compute Y coordinate for a wave equation at position X
      const getWaveY = (x: number, w: (typeof waveConfigs)[0]) => {
        const baseY = height * w.yOffset;
        const wave1 = Math.sin(x * w.freq + time * w.speed) * w.amp;
        const wave2 = Math.cos(x * (w.freq * 0.75) + time * (w.speed * 0.5)) * (w.amp * 0.28);
        return baseY + wave1 + wave2;
      };

      // Draw all 8 waves
      waveConfigs.forEach((w) => {
        ctx.beginPath();
        const baseY = height * w.yOffset;
        ctx.moveTo(0, baseY);

        const stepX = isMobile ? 6 : 8;
        for (let x = 0; x <= width; x += stepX) {
          ctx.lineTo(x, getWaveY(x, w));
        }

        ctx.strokeStyle = w.color;
        ctx.lineWidth = w.width;
        ctx.stroke();

        if (w.fill) {
          ctx.lineTo(width, height);
          ctx.lineTo(0, height);
          ctx.closePath();
          ctx.fillStyle = w.fill;
          ctx.fill();
        }
      });

      // Draw Kinetic Vertical Diffraction Needles
      needles.forEach((needle) => {
        needle.x += needle.speed;
        needle.phase += 0.03;

        if (needle.x < -10) needle.x = width + 10;
        if (needle.x > width + 10) needle.x = -10;

        const currentAlpha = needle.alpha * (0.65 + 0.35 * Math.sin(needle.phase));
        const centerY = height * 0.50 + Math.sin(needle.x * 0.003 + time * 0.4) * (height * 0.12);
        const halfH = needle.height * (isMobile ? 0.7 : 0.85) * 0.5;

        const grad = ctx.createLinearGradient(needle.x, centerY - halfH, needle.x, centerY + halfH);
        if (isLight) {
          grad.addColorStop(0, "rgba(158, 27, 50, 0)");
          grad.addColorStop(0.5, `rgba(158, 27, 50, ${currentAlpha * 0.65})`);
          grad.addColorStop(1, "rgba(158, 27, 50, 0)");
        } else {
          grad.addColorStop(0, "rgba(209, 44, 75, 0)");
          grad.addColorStop(0.5, `rgba(230, 57, 86, ${currentAlpha * 0.85})`);
          grad.addColorStop(1, "rgba(209, 44, 75, 0)");
        }

        ctx.beginPath();
        ctx.moveTo(needle.x, centerY - halfH);
        ctx.lineTo(needle.x, centerY + halfH);
        ctx.strokeStyle = grad;
        ctx.lineWidth = needle.width;
        ctx.stroke();
      });

      // Draw Harmonic Wave Crest Nodes (Delicate micro-sparks on wave crests)
      const nodesCount = isMobile ? 10 : waveNodes.length;
      for (let i = 0; i < nodesCount; i++) {
        const node = waveNodes[i];
        node.xRatio += node.speed;
        if (node.xRatio > 1) node.xRatio = 0;
        node.pulsePhase += 0.04;

        const targetWave = waveConfigs[node.waveIndex % waveConfigs.length];
        const posX = node.xRatio * width;
        const posY = getWaveY(posX, targetWave);
        const pulse = 0.55 + 0.45 * Math.sin(node.pulsePhase);

        // Calibrated micro-radius: subtle pinpoint on mobile (~0.7px - 1.0px), crisp on desktop
        const coreRadius = (isMobile ? 0.75 : 1.3) * (0.8 + pulse * 0.25);

        ctx.beginPath();
        ctx.arc(posX, posY, coreRadius, 0, Math.PI * 2);

        if (isLight) {
          ctx.fillStyle = `rgba(158, 27, 50, ${pulse * 0.75})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${pulse * 0.85})`;
        }
        ctx.fill();

        // Subtle soft whisper halo
        ctx.beginPath();
        ctx.arc(posX, posY, coreRadius * (isMobile ? 1.5 : 2.0), 0, Math.PI * 2);
        if (isLight) {
          ctx.fillStyle = `rgba(184, 35, 61, ${pulse * 0.14})`;
        } else {
          ctx.fillStyle = `rgba(209, 44, 75, ${pulse * 0.18})`;
        }
        ctx.fill();
      }

      // Vignette framing
      const vignette = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        Math.min(width, height) * 0.32,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.75
      );
      if (isLight) {
        vignette.addColorStop(0, "rgba(251, 249, 244, 0)");
        vignette.addColorStop(1, "rgba(240, 235, 224, 0.75)");
      } else {
        vignette.addColorStop(0, "rgba(8, 8, 11, 0)");
        vignette.addColorStop(1, "rgba(5, 5, 7, 0.92)");
      }
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isVisible, theme]);

  // Asset Gating + Calibrated Cinematic Pacing (~2.8s - 3.2s)
  useEffect(() => {
    if (!isVisible) return;

    let isCancelled = false;
    const startTime = Date.now();
    const MIN_CINEMATIC_DURATION_MS = 2800; // ~2.8 seconds minimum display time

    targetProgressRef.current = 15;
    allAssetsReadyRef.current = false;

    // 1. Monitor DOM ReadyState
    const checkDocumentReady = () => {
      if (typeof document !== "undefined" && document.readyState === "complete") {
        return Promise.resolve();
      }
      return new Promise<void>((resolve) => {
        const onComplete = () => {
          window.removeEventListener("load", onComplete);
          resolve();
        };
        window.addEventListener("load", onComplete);
      });
    };

    // 2. Monitor Font Face Loading
    const checkFontsReady = () => {
      if (typeof document !== "undefined" && document.fonts) {
        return document.fonts.ready.catch(() => { });
      }
      return Promise.resolve();
    };

    // 3. Monitor Media & Image Assets
    const checkMediaReady = () => {
      if (typeof document === "undefined") return Promise.resolve();

      const domImgs = Array.from(document.querySelectorAll<HTMLImageElement>("img"));
      const criticalUrls = ["https://github.com/0xraiven.png", "/icon.svg"];

      const assetImages: HTMLImageElement[] = [...domImgs];
      criticalUrls.forEach((url) => {
        if (!assetImages.some((img) => img.src === url)) {
          const img = new Image();
          img.src = url;
          assetImages.push(img);
        }
      });

      if (assetImages.length === 0) return Promise.resolve();

      let loadedCount = 0;
      const total = assetImages.length;

      return new Promise<void>((resolve) => {
        const onAssetDone = () => {
          loadedCount++;
          if (!isCancelled) {
            // Scale progress from 55% to 95% as images decode
            const imgProgress = 55 + Math.round((loadedCount / total) * 40);
            targetProgressRef.current = Math.max(targetProgressRef.current, imgProgress);
          }
          if (loadedCount >= total) {
            resolve();
          }
        };

        assetImages.forEach((img) => {
          if (img.complete && img.naturalWidth !== 0) {
            onAssetDone();
          } else {
            img.addEventListener("load", onAssetDone, { once: true });
            img.addEventListener("error", onAssetDone, { once: true });
          }
        });

        // Safety fallback for media assets: max 2.5s
        setTimeout(resolve, 2500);
      });
    };

    // Execute asset-gated sequence
    (async () => {
      targetProgressRef.current = 30;
      await checkDocumentReady();
      if (isCancelled) return;

      targetProgressRef.current = 60;
      await checkFontsReady();
      if (isCancelled) return;

      await checkMediaReady();
      if (isCancelled) return;

      allAssetsReadyRef.current = true;
      targetProgressRef.current = 100;
    })();

    // Smooth ticker: interpolates displayed progress toward targetProgressRef with calibrated timing
    const ticker = setInterval(() => {
      if (isCancelled) return;

      const elapsed = Date.now() - startTime;
      const timeRatio = Math.min(1, elapsed / MIN_CINEMATIC_DURATION_MS);
      const timeTarget = Math.round(timeRatio * 100);

      // Real asset gating constraint
      const maxAllowed = allAssetsReadyRef.current ? 100 : Math.min(targetProgressRef.current, 92);
      const effectiveTarget = Math.min(maxAllowed, Math.max(targetProgressRef.current, timeTarget));

      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(ticker);
          return 100;
        }

        const diff = effectiveTarget - prev;
        if (diff <= 0) return prev;

        // Controlled cinematic progression step
        const step = Math.max(1, Math.ceil(diff * 0.12));
        const next = Math.min(effectiveTarget, prev + step);

        if (next >= 100) {
          clearInterval(ticker);
          // Satisfying 350ms pause at 100% so the user enjoys the complete state before smooth cross-dissolve
          setTimeout(() => {
            if (!isCancelled) {
              dismiss();
            }
          }, 350);
        }

        return next;
      });
    }, 25);

    // Global safety timer: ensure loader resolves within 4.0s even on disconnected networks
    const safetyTimer = setTimeout(() => {
      if (!isCancelled) {
        allAssetsReadyRef.current = true;
        targetProgressRef.current = 100;
        setProgress(100);
        setTimeout(dismiss, 300);
      }
    }, 4000);

    return () => {
      isCancelled = true;
      clearInterval(ticker);
      clearTimeout(safetyTimer);
    };
  }, [isVisible, dismiss]);

  if (!isVisible) return null;

  const currentPercent = Math.min(100, Math.round(progress));
  const isLight = theme === "light";

  return (
    <div
      id="system-boot-loader"
      role="dialog"
      aria-modal="true"
      aria-label="Loading"
      suppressHydrationWarning
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none cursor-default transition-all duration-700 ease-out overflow-hidden ${isDismissing ? "opacity-0 pointer-events-none scale-[1.015] blur-[4px]" : "opacity-100"
        } ${isLight ? "bg-[#fbf9f4] text-[#120e10]" : "bg-[#08080b] text-[#f2eeea]"}`}
    >
      {/* Living Generative Background Canvas (8 Harmonic Waves + Diffraction Needles + Crest Nodes) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Subtle fine dot grid overlay for tactile physical grounding */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(${isLight ? "rgba(55, 30, 36, 0.15)" : "rgba(255, 255, 255, 0.10)"} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Discreet corner aesthetic watermark with safe-area spacing */}
      <div
        className={`absolute top-4 sm:top-6 left-4 sm:left-6 pt-[env(safe-area-inset-top)] text-[9px] sm:text-[10px] font-mono tracking-[0.2em] sm:tracking-[0.25em] uppercase pointer-events-none select-none transition-colors ${isLight ? "text-text-secondary/40" : "text-text-secondary/30"
          }`}
      >
        0xraiven // portfolio
      </div>

      {/* Responsive Center Screen: Typography & Progress Indicator Line */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-3 sm:space-y-4 w-full max-w-[280px] xs:max-w-xs sm:max-w-sm md:max-w-md px-2 sm:px-6">
        {/* Typographic Title: Responsive LOADING %d (never wraps or squeezes on mobile) */}
        <div className="flex items-baseline justify-center gap-2 sm:gap-2.5 font-mono text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extralight tracking-[0.14em] sm:tracking-[0.2em] select-none text-text-primary whitespace-nowrap">
          <span className="font-light">LOADING</span>
          <span className="font-semibold text-accent tabular-nums tracking-tight">
            {currentPercent}%
          </span>
        </div>

        {/* Minimal Progress Indicator Line Directly Underneath (Fluid Responsive Width) */}
        <div
          className={`w-full max-w-[240px] xs:max-w-[270px] sm:max-w-full h-[2px] rounded-full overflow-hidden relative shadow-inner ${isLight ? "bg-black/10" : "bg-white/10"
            }`}
        >
          {/* Luminous accent bar matching theme accent */}
          <div
            className="h-full bg-accent rounded-full transition-all duration-100 ease-out relative shadow-[0_0_12px_var(--accent)]"
            style={{ width: `${progress}%` }}
          >
            {/* Glowing beacon at leading edge tip */}
            <div
              className={`absolute right-0 top-1/2 -translate-y-1/2 w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full ${isLight
                ? "bg-accent shadow-[0_0_8px_var(--accent),0_0_14px_rgba(158,27,50,0.6)]"
                : "bg-white shadow-[0_0_8px_#ffffff,0_0_16px_var(--accent)]"
                }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Re-exports for compatibility across the codebase
export const AsciiBootLoader = MinimalBootLoader;
export const SystemMatrixBootLoader = MinimalBootLoader;
export const GlyphBootLoader = MinimalBootLoader;
export default MinimalBootLoader;
