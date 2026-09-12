"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  FolderGit2,
  FileCode2,
  FileText,
  FlaskConical,
  User,
  FileDown,
  ChevronDown,
  ShieldAlert,
  Terminal,
  Box,
  X,
  Sun,
  Moon,
  Monitor,
  Mail,
} from "lucide-react";
import { useUI } from "@/providers";

interface NavSubItem {
  label: string;
  href: string;
  badge?: string;
}

interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
  isSearch?: boolean;
  children?: NavSubItem[];
}

interface NavGroup {
  title: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  items: NavItem[];
}

const MAIN_NAV_GROUPS: NavGroup[] = [
  {
    title: "START HERE",
    items: [{ label: "README", href: "/", icon: BookOpen }],
  },
  {
    title: "PROJECTS",
    collapsible: true,
    items: [
      { label: "PhishGuard", href: "/projects/phishguard", icon: ShieldAlert },
      { label: "persistHunt", href: "/projects/persisthunt", icon: Terminal },
      { label: "View all projects", href: "/projects", icon: FolderGit2 },
    ],
  },
  {
    title: "WRITEUPS",
    collapsible: true,
    items: [
      { label: "Web Security", href: "/writeups/web-security", icon: FileCode2 },
      { label: "Linux", href: "/writeups/linux", icon: FileCode2 },
      { label: "Active Directory", href: "/writeups/active-directory", icon: FileCode2 },
      { label: "Cloud Security", href: "/writeups/cloud-security", icon: FileCode2 },
      { label: "Detection Engineering", href: "/writeups/detection-engineering", icon: FileCode2 },
      { label: "Red Team", href: "/writeups/red-team", icon: FileCode2 },
      { label: "CTF", href: "/writeups/ctf", icon: FileCode2 },
      {
        label: "Hack The Box",
        href: "/writeups/htb",
        icon: Box,
        badge: "HTB",
        children: [
          { label: "Low", href: "/writeups/htb/low" },
          { label: "Medium", href: "/writeups/htb/medium" },
          { label: "Hard", href: "/writeups/htb/hard" },
          { label: "Insane", href: "/writeups/htb/insane" },
        ],
      },
    ],
  },
  {
    title: "NOTES",
    collapsible: true,
    items: [
      { label: "Web Security", href: "/notes/web-security", icon: FileText },
      { label: "Linux", href: "/notes/linux", icon: FileText },
      { label: "Active Directory", href: "/notes/active-directory", icon: FileText },
      { label: "Cloud Security", href: "/notes/cloud-security", icon: FileText },
      { label: "Detection Engineering", href: "/notes/detection-engineering", icon: FileText },
      { label: "Red Team", href: "/notes/red-team", icon: FileText },
      { label: "CTF", href: "/notes/ctf", icon: FileText },
    ],
  },
  {
    title: "RESEARCH",
    collapsible: true,
    items: [
      { label: "Security Research", href: "/research", icon: FlaskConical },
    ],
  },
];

const MISC_ITEMS: NavItem[] = [
  { label: "About", href: "/about", icon: User },
  { label: "Resume", href: "/resume", icon: FileDown },
  { label: "Contact", href: "/contact", icon: Mail },
];

function getActiveGroupForPath(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("/projects")) return "PROJECTS";
  if (path.startsWith("/writeups")) return "WRITEUPS";
  if (path.startsWith("/notes")) return "NOTES";
  if (path.startsWith("/research")) return "RESEARCH";
  return null;
}

export interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

function MalfunctioningBulbText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={`bulb-sign ${className || ""}`}>
      {text.split("").map((char, index) => {
        if (char === " ") {
          return <span key={index} className="inline-block w-2">&nbsp;</span>;
        }
        // Asynchronous loose-contact filaments simulating malfunctioning bulbs
        const isFaulty1 = index === 3 || index === 7;
        const isFaulty2 = index === 1 || index === 8;
        const faultyClass = isFaulty1 ? "bulb-flicker-faulty-1" : isFaulty2 ? "bulb-flicker-faulty-2" : "";

        return (
          <span key={index} className={`bulb-char ${faultyClass}`}>
            {char}
          </span>
        );
      })}
    </span>
  );
}

export function MobileSidebar({ isOpen, onClose, onOpenSearch }: MobileSidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useUI();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const active = getActiveGroupForPath(pathname);
    return {
      PROJECTS: active === "PROJECTS",
      WRITEUPS: active === "WRITEUPS",
      NOTES: active === "NOTES",
      RESEARCH: active === "RESEARCH",
    };
  });

  const [openSubgroups, setOpenSubgroups] = useState<Record<string, boolean>>(() => {
    const isHtb = Boolean(pathname && pathname.startsWith("/writeups/htb"));
    return {
      "Hack The Box": isHtb,
    };
  });

  // When route changes, sync open state
  useEffect(() => {
    const active = getActiveGroupForPath(pathname);
    setOpenGroups({
      PROJECTS: active === "PROJECTS",
      WRITEUPS: active === "WRITEUPS",
      NOTES: active === "NOTES",
      RESEARCH: active === "RESEARCH",
    });

    if (pathname && pathname.startsWith("/writeups/htb")) {
      setOpenSubgroups((prev) => ({ ...prev, "Hack The Box": true }));
    }
  }, [pathname]);

  // Automatically close on navigation
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = orig;
    };
  }, [isOpen]);

  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  // Orchestrate slide-in and slide-out transitions
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const frameId = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
      return () => cancelAnimationFrame(frameId);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  if (!shouldRender) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation drawer"
      className={`fixed inset-0 z-50 md:hidden overflow-hidden ${
        isVisible ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Dimmed backdrop with smooth fade */}
      <div
        className={`fixed inset-0 bg-black/60 transition-opacity duration-300 motion-reduce:transition-none ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-72 max-w-[85vw] h-full z-10 transform transition-transform duration-300 motion-reduce:transition-none will-change-transform bg-surface border-r border-border shadow-2xl flex flex-col ${
          isVisible ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-4 h-12 border-b border-border/70 shrink-0">
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center gap-2 font-mono text-sm tracking-tight"
            >
              <div className="relative w-5 h-5 rounded overflow-hidden border border-border/80 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/icon.svg"
                  alt="Logo"
                  width={20}
                  height={20}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-bold text-text-primary">r41n</span>
              <span className="text-text-secondary text-xs">•</span>
              <span className="text-xs text-text-secondary">Knowledge Base</span>
            </Link>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation"
              className="p-1.5 rounded text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Navigation List */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 text-xs font-mono select-none terminal-scrollbar">
            {MAIN_NAV_GROUPS.map((group) => {
              const isOpen = group.collapsible ? Boolean(openGroups[group.title]) : true;
              return (
                <div key={group.title} className="space-y-1">
                  {group.collapsible ? (
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.title)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-pixel uppercase tracking-wider text-text-secondary hover:text-text-primary rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent group transition-colors"
                    >
                      <span className="transition-colors group-hover:text-text-primary">{group.title}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-text-secondary transition-transform duration-200 ease-out ${
                          isOpen ? "rotate-0 text-text-primary" : "-rotate-90"
                        }`}
                      />
                    </button>
                  ) : (
                    <div className="px-2 pt-1 pb-1.5 select-none cursor-default">
                      <MalfunctioningBulbText
                        text={group.title}
                        className="text-[13px] sm:text-[14px] font-pixel uppercase tracking-wider text-text-primary font-normal"
                      />
                    </div>
                  )}

                  <div
                    className={
                      group.collapsible
                        ? isOpen
                          ? "accordion-content-expand"
                          : "accordion-content-collapse"
                        : "block"
                    }
                  >
                    <div className={group.collapsible ? "accordion-inner" : ""}>
                      <ul className="space-y-0.5 pt-0.5">
                        {group.items.map((item) => {
                          const isActive = pathname === item.href;
                          const Icon = item.icon;

                          if (item.isSearch) {
                            return (
                              <li key={item.label}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    onClose();
                                    onOpenSearch();
                                  }}
                                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors text-left"
                                >
                                  {Icon && <Icon className="w-3.5 h-3.5 shrink-0 text-accent" />}
                                  <span className="truncate">{item.label}</span>
                                </button>
                              </li>
                            );
                          }

                          if (item.children && item.children.length > 0) {
                            const isSubOpen = Boolean(openSubgroups[item.label]);
                            const isParentActive = pathname === item.href;
                            const hasActiveChild = item.children.some((c) => pathname === c.href);

                            return (
                              <li key={item.label} className="space-y-0.5">
                                <div
                                  className={`flex items-center justify-between rounded transition-colors ${
                                    isParentActive || hasActiveChild
                                      ? "bg-surface-2 text-text-primary font-medium text-accent border-l-2 border-accent pl-1.5"
                                      : "text-text-secondary hover:text-text-primary hover:bg-surface-2"
                                  }`}
                                >
                                  <Link
                                    href={item.href}
                                    onClick={onClose}
                                    className="flex items-center gap-2 px-2 py-1.5 flex-1 min-w-0"
                                  >
                                    {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
                                    <span className="truncate">{item.label}</span>
                                    {item.badge && (
                                      <span className="text-[10px] px-1 rounded bg-surface border border-border text-text-secondary">
                                        {item.badge}
                                      </span>
                                    )}
                                  </Link>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenSubgroups((prev) => ({
                                        ...prev,
                                        [item.label]: !prev[item.label],
                                      }));
                                    }}
                                    aria-label={`Toggle ${item.label} subsections`}
                                    aria-expanded={isSubOpen}
                                    className="p-1.5 hover:text-accent transition-colors rounded focus-visible:outline-none"
                                  >
                                    <ChevronDown
                                      className={`w-3 h-3 text-text-secondary transition-transform duration-200 ease-out ${
                                        isSubOpen ? "rotate-0 text-accent" : "-rotate-90"
                                      }`}
                                    />
                                  </button>
                                </div>

                                {/* Nested Subsections Accordion */}
                                <div className={isSubOpen ? "accordion-content-expand" : "accordion-content-collapse"}>
                                  <div className="accordion-inner">
                                    <ul className="pl-5 pr-1 py-0.5 space-y-0.5 border-l border-border/50 ml-3.5 my-0.5">
                                      {item.children.map((sub) => {
                                        const isSubActive = pathname === sub.href;
                                        return (
                                          <li key={sub.label}>
                                            <Link
                                              href={sub.href}
                                              onClick={onClose}
                                              className={`flex items-center justify-between px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                                                isSubActive
                                                  ? "bg-surface-2 text-accent font-semibold border-l-2 border-accent pl-1.5"
                                                  : "text-text-secondary hover:text-text-primary hover:bg-surface-2/60"
                                              }`}
                                            >
                                              <span>{sub.label}</span>
                                              {sub.badge && (
                                                <span className="text-[9px] px-1 rounded bg-surface border border-border text-text-secondary">
                                                  {sub.badge}
                                                </span>
                                              )}
                                            </Link>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  </div>
                                </div>
                              </li>
                            );
                          }

                          return (
                            <li key={item.label}>
                              <Link
                                href={item.href}
                                onClick={onClose}
                                className={`flex items-center gap-2 px-2 py-1.5 rounded transition-colors ${
                                  isActive
                                    ? "bg-surface-2 text-text-primary font-medium text-accent border-l-2 border-accent pl-1.5"
                                    : "text-text-secondary hover:text-text-primary hover:bg-surface-2"
                                }`}
                              >
                                {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
                                <span className="truncate">{item.label}</span>
                                {item.badge && (
                                  <span className="ml-auto text-[10px] px-1 rounded bg-surface border border-border text-text-secondary">
                                    {item.badge}
                                  </span>
                                )}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Drawer Footer: Pinned MISC + Theme Selector */}
          <div className="p-3 border-t border-border/70 shrink-0 bg-surface/50 space-y-3">
            {/* Pinned MISC */}
            <div>
              <div className="px-2 py-0.5 text-[11px] font-pixel uppercase tracking-wider text-text-secondary">
                MISC
              </div>
              <ul className="space-y-0.5 mt-1 font-mono">
                {MISC_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded transition-colors ${
                          isActive
                            ? "bg-surface-2 text-text-primary font-medium text-accent border-l-2 border-accent pl-1.5"
                            : "text-text-secondary hover:text-text-primary hover:bg-surface-2"
                        }`}
                      >
                        {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Theme Selector */}
            <div className="border-t border-border/60 pt-2.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-text-secondary mb-1.5">
                <span>Theme</span>
                <span className="text-accent uppercase font-bold text-[10px]">{theme}</span>
              </div>
              <div className="grid grid-cols-3 gap-1 p-0.5 rounded bg-surface-2 border border-border">
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`flex items-center justify-center gap-1 py-1 px-1.5 rounded text-[11px] font-mono transition-colors ${
                    theme === "dark"
                      ? "bg-accent text-white font-semibold"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <Moon className="w-3 h-3" />
                  <span>Dark</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`flex items-center justify-center gap-1 py-1 px-1.5 rounded text-[11px] font-mono transition-colors ${
                    theme === "light"
                      ? "bg-accent text-white font-semibold"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <Sun className="w-3 h-3" />
                  <span>Light</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("system")}
                  className={`flex items-center justify-center gap-1 py-1 px-1.5 rounded text-[11px] font-mono transition-colors ${
                    theme === "system"
                      ? "bg-accent text-white font-semibold"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <Monitor className="w-3 h-3" />
                  <span>Auto</span>
                </button>
              </div>
            </div>
          </div>
      </aside>
    </div>
  );
}
