"use client";

import React from "react";

export interface GlassSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /**
   * Surface preset variant:
   * - 'card': Clean content cards
   * - 'panel': Chrome panels (TopBar, Modals, Palette)
   * - 'pill': Full rounded badge or pill surface
   * - 'minimal': Lightweight subtle glass
   */
  variant?: "card" | "panel" | "pill" | "minimal";
  as?: React.ElementType;
}

export const GlassSurface = React.forwardRef<HTMLDivElement, GlassSurfaceProps>(
  function GlassSurface(
    {
      children,
      className = "",
      style,
      variant = "panel",
      as: Component = "div",
      ...props
    },
    ref
  ) {
    const variantClasses = {
      card: "rounded-lg border border-border bg-surface/85 backdrop-blur-md transition-colors duration-150",
      panel: "rounded border border-border bg-surface/90 backdrop-blur-md",
      pill: "rounded-full border border-border bg-surface/85 backdrop-blur-md",
      minimal: "rounded border border-border/60 bg-surface/75 backdrop-blur-sm",
    }[variant];

    return (
      <Component
        ref={ref}
        className={`glass-surface ${variantClasses} ${className}`}
        style={style}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

GlassSurface.displayName = "GlassSurface";

/**
 * Convenient semantic wrapper for glass cards
 */
export const GlassCard = React.forwardRef<HTMLDivElement, GlassSurfaceProps>(
  function GlassCard(props, ref) {
    return <GlassSurface ref={ref} variant="card" {...props} />;
  }
);

GlassCard.displayName = "GlassCard";
