"use client";

import React, { useRef, useEffect, useCallback } from "react";

export interface GlassSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /**
   * Surface preset variant:
   * - 'card': Interactive content cards with fluid hover elevation and meniscus refraction
   * - 'panel': Sleek chrome panel (TopBar, Modals, Palette) with refined ambient liquid depth
   * - 'pill': Full rounded badge or pill surface
   * - 'minimal': Lightweight fluid glass with whisper caustics
   */
  variant?: "card" | "panel" | "pill" | "minimal";
  /**
   * Whether the liquid surface interactively responds to pointer movements (meniscus, specular glare, rim light)
   * Default: true
   */
  interactive?: boolean;
  /**
   * Viscosity / drag responsiveness of the fluid meniscus: 'subtle' | 'medium' | 'high'
   * Default: 'medium'
   */
  viscosity?: "subtle" | "medium" | "high";
  /**
   * Polymorphic element tag: 'div' | 'article' | 'section' | 'header' | 'aside'
   * Default: 'div'
   */
  as?: React.ElementType;
}

export const GlassSurface = React.forwardRef<HTMLDivElement, GlassSurfaceProps>(
  function GlassSurface(
    {
      children,
      className = "",
      style,
      variant = "panel",
      interactive = true,
      viscosity = "medium",
      as: Component = "div",
      ...props
    },
    forwardedRef
  ) {
    const localRef = useRef<HTMLDivElement | null>(null);

    // Combine forwarded ref and local ref
    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        localRef.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [forwardedRef]
    );

    // Liquid pointer state tracking with viscous lag
    const isHoveredRef = useRef(false);
    const targetPos = useRef({ x: 0, y: 0, angle: 135 });
    const currentPos = useRef({ x: 0, y: 0, angle: 135 });
    const rafId = useRef<number | null>(null);

    // Fluid viscosity damping factor (tuned for natural, calm liquid motion)
    const lerpSpeed =
      viscosity === "high" ? 0.06 : viscosity === "subtle" ? 0.12 : 0.09;

    const updateFluidPhysics = useCallback(() => {
      const el = localRef.current;
      if (!el) return;

      const dx = targetPos.current.x - currentPos.current.x;
      const dy = targetPos.current.y - currentPos.current.y;
      const dAngle = targetPos.current.angle - currentPos.current.angle;

      currentPos.current.x += dx * lerpSpeed;
      currentPos.current.y += dy * lerpSpeed;
      currentPos.current.angle += dAngle * lerpSpeed;

      el.style.setProperty("--liquid-x", `${currentPos.current.x.toFixed(1)}px`);
      el.style.setProperty("--liquid-y", `${currentPos.current.y.toFixed(1)}px`);
      el.style.setProperty(
        "--liquid-angle",
        `${currentPos.current.angle.toFixed(1)}deg`
      );

      // Keep RAF alive while hovering or while liquid meniscus is still settling
      const isSettled = Math.abs(dx) < 0.25 && Math.abs(dy) < 0.25;
      if (isHoveredRef.current || !isSettled) {
        rafId.current = requestAnimationFrame(updateFluidPhysics);
      } else {
        rafId.current = null;
      }
    }, [lerpSpeed]);

    const handlePointerEnter = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (!interactive || !localRef.current) return;
        const rect = localRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const angle =
          Math.atan2(y - centerY, x - centerX) * (180 / Math.PI) + 90;

        isHoveredRef.current = true;
        targetPos.current = { x, y, angle };
        currentPos.current = { x, y, angle };

        localRef.current.style.setProperty("--liquid-opacity", "1");

        if (rafId.current === null) {
          rafId.current = requestAnimationFrame(updateFluidPhysics);
        }
      },
      [interactive, updateFluidPhysics]
    );

    const handlePointerMove = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (!interactive || !localRef.current) return;
        const rect = localRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const angle =
          Math.atan2(y - centerY, x - centerX) * (180 / Math.PI) + 90;

        targetPos.current = { x, y, angle };

        if (rafId.current === null) {
          rafId.current = requestAnimationFrame(updateFluidPhysics);
        }
      },
      [interactive, updateFluidPhysics]
    );

    const handlePointerLeave = useCallback(() => {
      if (!interactive || !localRef.current) return;
      isHoveredRef.current = false;
      localRef.current.style.setProperty("--liquid-opacity", "0");
    }, [interactive]);

    useEffect(() => {
      return () => {
        if (rafId.current !== null) {
          cancelAnimationFrame(rafId.current);
          rafId.current = null;
        }
      };
    }, []);

    // Variant style classes
    const variantClasses = {
      card: "rounded-lg transition-colors duration-300",
      panel: "rounded",
      pill: "rounded-full",
      minimal: "rounded bg-opacity-40",
    }[variant];

    return (
      <Component
        ref={setRefs}
        className={`glass-surface-liquid ${variantClasses} ${className}`}
        style={style}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        {...props}
      >
        {/* Layer 1: Ambient Fluid Caustic Current (Subtle living flow) */}
        <div
          className="liquid-caustic-ambient pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden -z-10"
          aria-hidden="true"
        >
          <div className="liquid-caustic-drift absolute -inset-full opacity-25 dark:opacity-15" />
          <div className="liquid-caustic-mesh absolute -inset-full opacity-15 dark:opacity-10" />
        </div>

        {/* Layer 2: Interactive Viscous Meniscus & Specular Glide (Gentle satin reflection) */}
        {interactive && (
          <div
            className="liquid-meniscus-layer pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden -z-10 transition-opacity duration-500 ease-out"
            style={{ opacity: "var(--liquid-opacity, 0)" }}
            aria-hidden="true"
          >
            <div className="liquid-specular-glare absolute inset-0" />
          </div>
        )}

        {/* Layer 3: Liquid Refractive Rim Light (Delicate perimeter sheen) */}
        {interactive && (
          <div
            className="liquid-rim-border pointer-events-none absolute inset-0 rounded-[inherit] -z-10 transition-opacity duration-500 ease-out"
            style={{ opacity: "var(--liquid-opacity, 0)" }}
            aria-hidden="true"
          />
        )}

        {/* Layer 4: Content */}
        {children}
      </Component>
    );
  }
);

GlassSurface.displayName = "GlassSurface";

/**
 * Convenient semantic wrapper for fluid liquid glass cards
 */
export const GlassCard = React.forwardRef<HTMLDivElement, GlassSurfaceProps>(
  function GlassCard(props, ref) {
    return <GlassSurface ref={ref} variant="card" {...props} />;
  }
);

GlassCard.displayName = "GlassCard";
