"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUI } from "@/providers";
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
  Mail,
} from "lucide-react";

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

export function Sidebar() {
  const pathname = usePathname();
  const { openCommandPalette } = useUI();

  // Only open the section containing the active page by default
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const active = getActiveGroupForPath(pathname);
    return {
      PROJECTS: active === "PROJECTS",
      WRITEUPS: active === "WRITEUPS",
      NOTES: active === "NOTES",
      RESEARCH: active === "RESEARCH",
    };
  });

  // Track open nested subgroups like HTB
  const [openSubgroups, setOpenSubgroups] = useState<Record<string, boolean>>(() => {
    const isHtb = Boolean(pathname && pathname.startsWith("/writeups/htb"));
    return {
      "Hack The Box": isHtb,
    };
  });

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const toggleSubgroup = (label: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setOpenSubgroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  // When route changes, sync open state so only current section is open
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

  return (
    <aside
      aria-label="Sidebar navigation"
      className="w-64 shrink-0 bg-bg border-r border-border h-full flex flex-col justify-between text-xs select-none"
    >
      {/* Scrollable Documentation Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 terminal-scrollbar">
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
                    className={`w-3.5 h-3.5 text-text-secondary transition-transform duration-200 ease-out ${isOpen ? "rotate-0 text-text-primary" : "-rotate-90"
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
                              onClick={openCommandPalette}
                              className="w-full flex items-center gap-2 px-2 py-1.5 rounded font-mono transition-colors text-text-secondary hover:text-text-primary hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent text-left"
                            >
                              {Icon && <Icon className="w-3.5 h-3.5 shrink-0 text-accent" />}
                              <span className="truncate">{item.label}</span>
                              <kbd className="ml-auto text-[10px] px-1 rounded bg-surface border border-border text-text-secondary">
                                ⌘K / ctrl+K
                              </kbd>
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
                              className={`flex items-center justify-between rounded font-mono transition-colors ${isParentActive || hasActiveChild
                                  ? "bg-surface-2 text-text-primary font-medium text-accent border-l-2 border-accent pl-1.5"
                                  : "text-text-secondary hover:text-text-primary hover:bg-surface-2"
                                }`}
                            >
                              <Link
                                href={item.href}
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
                                onClick={(e) => toggleSubgroup(item.label, e)}
                                aria-label={`Toggle ${item.label} subsections`}
                                aria-expanded={isSubOpen}
                                className="p-1.5 hover:text-accent transition-colors rounded focus-visible:outline-none"
                              >
                                <ChevronDown
                                  className={`w-3 h-3 text-text-secondary transition-transform duration-200 ease-out ${isSubOpen ? "rotate-0 text-accent" : "-rotate-90"
                                    }`}
                                />
                              </button>
                            </div>

                            {/* Nested Subsections Accordion Slide-Down */}
                            <div className={isSubOpen ? "accordion-content-expand" : "accordion-content-collapse"}>
                              <div className="accordion-inner">
                                <ul className="pl-5 pr-1 py-0.5 space-y-0.5 border-l border-border/50 ml-3.5 my-0.5">
                                  {item.children.map((sub) => {
                                    const isSubActive = pathname === sub.href;
                                    return (
                                      <li key={sub.label}>
                                        <Link
                                          href={sub.href}
                                          className={`flex items-center justify-between px-2 py-1 rounded text-[11px] font-mono transition-colors ${isSubActive
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
                            className={`flex items-center gap-2 px-2 py-1.5 rounded font-mono transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${isActive
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

      {/* Pinned Bottom MISC Section - ALWAYS REACHABLE */}
      <div className="shrink-0 p-3 border-t border-border bg-surface/30 space-y-1">
        <div className="px-2 py-1 text-[11px] font-pixel uppercase tracking-wider text-text-secondary">
          MISC
        </div>
        <ul className="space-y-0.5">
          {MISC_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded font-mono transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${isActive
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
          <li className="pt-1 mt-1 border-t border-border/40">
            <button
              type="button"
              onClick={() => {
                try {
                  sessionStorage.removeItem("r41n_booted");
                } catch { }
                window.dispatchEvent(new CustomEvent("r41n:boot"));
              }}
              className="w-full flex items-center justify-between px-2 py-1.5 rounded font-mono text-text-secondary hover:text-accent hover:bg-surface-2 transition-colors group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent text-left"
              title="Reload"
            >
              <span className="flex items-center gap-2 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:bg-accent transition-colors" />
                <span className="truncate">reload</span>
              </span>
              <span className="text-[9px] font-pixel text-accent/70 group-hover:text-accent font-bold">
                [PLAY]
              </span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
}
