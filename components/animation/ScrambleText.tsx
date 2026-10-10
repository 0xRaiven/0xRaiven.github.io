"use client";

import React, { useEffect, useRef } from "react";

export interface ScrambleTextProps {
  text: string;
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "p" | "div";
  speed?: number;
  delay?: number;
  className?: string;
}

const CIPHER_GLYPHS = "01!@#$%&*<>[]{}~=+/\\λπΩΨΔ";

export function ScrambleText({
  text,
  as: Component = "span",
  speed = 30,
  delay = 0,
  className = "",
}: ScrambleTextProps) {
  const elementRef = useRef<HTMLElement | null>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const el = elementRef.current;
    if (!el || hasAnimatedRef.current) return;

    // Fast check for reduced motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      el.textContent = text;
      return;
    }

    let animFrame: number;
    let timeoutId: NodeJS.Timeout;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          observer.disconnect();

          timeoutId = setTimeout(() => {
            let frame = 0;
            const totalFrames = Math.min(18, Math.max(8, Math.floor(text.length * 1.2)));
            let lastTimestamp = 0;

            const step = (timestamp: number) => {
              if (!lastTimestamp) lastTimestamp = timestamp;
              const delta = timestamp - lastTimestamp;

              if (delta >= speed) {
                lastTimestamp = timestamp;
                frame++;
                const progress = frame / totalFrames;
                const revealedChars = Math.floor(progress * text.length);

                let scrambled = "";
                for (let i = 0; i < text.length; i++) {
                  const char = text[i];
                  if (char === " ") {
                    scrambled += " ";
                  } else if (i < revealedChars) {
                    scrambled += char;
                  } else {
                    scrambled += CIPHER_GLYPHS[Math.floor(Math.random() * CIPHER_GLYPHS.length)];
                  }
                }

                if (el) el.textContent = scrambled;

                if (frame >= totalFrames) {
                  if (el) el.textContent = text;
                  return;
                }
              }

              animFrame = requestAnimationFrame(step);
            };

            animFrame = requestAnimationFrame(step);
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
      if (animFrame) cancelAnimationFrame(animFrame);
      if (el) el.textContent = text;
    };
  }, [text, speed, delay]);

  return (
    // @ts-expect-error Component dynamic tag type
    <Component ref={elementRef} className={`font-mono inline-block ${className}`}>
      {text}
    </Component>
  );
}
