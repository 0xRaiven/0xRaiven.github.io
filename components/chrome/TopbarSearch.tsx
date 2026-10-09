"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  FolderGit2,
  FlaskConical,
  FileCode2,
  FileText,
  Box,
  CornerDownLeft,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import type { SearchItem } from "@/lib/search-index";

function getItemIcon(item: SearchItem) {
  if (item.category === "htb" || item.category?.startsWith("htb-") || item.tags?.includes("htb")) {
    return Box;
  }
  switch (item.kind) {
    case "project":
      return FolderGit2;
    case "writeup":
      return FileCode2;
    case "research":
      return FlaskConical;
    case "note":
      return FileText;
    default:
      return FileText;
  }
}

function getItemBadge(item: SearchItem) {
  if (item.category === "htb" || item.category?.startsWith("htb-") || item.tags?.includes("htb")) {
    return { text: "HTB", cls: "border-accent/40 bg-accent/10 text-accent" };
  }
  switch (item.kind) {
    case "project":
      return { text: "PROJECT", cls: "border-border bg-surface-2 text-text-primary" };
    case "writeup":
      return { text: "WRITEUP", cls: "border-border bg-surface-2 text-text-secondary" };
    case "research":
      return { text: "RESEARCH", cls: "border-accent/30 bg-accent/5 text-accent" };
    case "note":
      return { text: "NOTE", cls: "border-border bg-surface-2 text-text-secondary" };
    case "page":
      return { text: "PAGE", cls: "border-border bg-surface-2 text-text-secondary" };
    default:
      return { text: "DOC", cls: "border-border bg-surface-2 text-text-secondary" };
  }
}

export function TopbarSearch() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [items, setItems] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Lazy-load static search index
  const loadIndex = useCallback(() => {
    if (hasLoaded) return;
    fetch("/search-index.json")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: SearchItem[]) => {
        setItems(data);
        setHasLoaded(true);
      })
      .catch(() => {
        setItems([]);
        setHasLoaded(true);
      });
  }, [hasLoaded]);

  // Load index when focused or typing
  useEffect(() => {
    if (isOpen || isFocused) {
      loadIndex();
    }
  }, [isOpen, isFocused, loadIndex]);

  // Filter items based on query
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Return curated quick navigation suggestions when query is empty
      if (items.length === 0) return [];
      const quickIds = [
        "page-readme",
        "page-projects",
        "page-writeups-htb",
        "page-writeups",
        "page-research",
        "page-about",
      ];
      const found: SearchItem[] = [];
      for (const id of quickIds) {
        const item = items.find((i) => i.id === id);
        if (item) found.push(item);
      }
      return found.length > 0 ? found : items.slice(0, 5);
    }

    const scored = items.map((item) => {
      let score = 0;
      const titleLower = item.title.toLowerCase();
      const descLower = (item.description || "").toLowerCase();
      const tags = (item.tags || []).map((t) => t.toLowerCase());
      const catLower = (item.category || "").toLowerCase();

      if (titleLower === q) score += 100;
      else if (titleLower.startsWith(q)) score += 60;
      else if (titleLower.includes(q)) score += 40;

      if (tags.some((t) => t === q)) score += 30;
      else if (tags.some((t) => t.includes(q))) score += 15;

      if (catLower.includes(q)) score += 20;
      if (descLower.includes(q)) score += 10;

      return { item, score };
    });

    return scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((s) => s.item)
      .slice(0, 8);
  }, [items, query]);

  // Reset selected index when query or filteredItems change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Auto-scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return;
    const selectedEl = listRef.current.querySelector<HTMLElement>(
      `[data-search-index="${selectedIndex}"]`
    );
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  // Select an item and navigate
  const handleSelect = useCallback(
    (item: SearchItem) => {
      setIsOpen(false);
      setIsFocused(false);
      setQuery("");
      inputRef.current?.blur();
      if (item.id === "action-reboot" || item.url === "#reboot") {
        try {
          sessionStorage.removeItem("r41n_booted");
        } catch {}
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("r41n:boot"));
        }
        return;
      }
      router.push(item.url);
    },
    [router]
  );

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Global shortcut (⌘K, Ctrl+K, or '/') and CustomEvent listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // ⌘K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
        setIsFocused(true);
        return;
      }

      // '/' when not in input/textarea
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes((document.activeElement?.tagName || "").toUpperCase())
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
        setIsFocused(true);
        return;
      }

      // Escape closes search
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
        setIsFocused(false);
        inputRef.current?.blur();
      }
    }

    function handleCustomFocus() {
      inputRef.current?.focus();
      setIsOpen(true);
      setIsFocused(true);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("focus-topbar-search", handleCustomFocus);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("focus-topbar-search", handleCustomFocus);
    };
  }, [isOpen]);

  // Keyboard navigation within the input
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      setIsOpen(true);
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (filteredItems.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
      }
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filteredItems.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      }
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems.length > 0 && filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      setIsFocused(false);
      inputRef.current?.blur();
      return;
    }
  };

  const showDropdown = isOpen && (isFocused || query.trim().length > 0);

  return (
    <div ref={containerRef} className="relative">
      {/* Mobile Backdrop Overlay */}
      {showDropdown && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-40 sm:hidden animate-fade-in"
          onClick={() => {
            setIsOpen(false);
            setIsFocused(false);
            inputRef.current?.blur();
          }}
          aria-hidden="true"
        />
      )}

      {/* Search Input Field */}
      <div
        className={`relative flex items-center transition-all duration-300 ease-out z-50 ${
          isFocused
            ? "w-40 xs:w-56 sm:w-80 md:w-96 lg:w-[420px]"
            : "w-32 xs:w-44 sm:w-64 md:w-80 lg:w-88"
        }`}
      >
        <Search
          className={`absolute left-2.5 w-3.5 h-3.5 pointer-events-none transition-colors duration-200 ${
            isFocused ? "text-accent" : "text-text-secondary"
          }`}
        />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            setIsFocused(true);
            setIsOpen(true);
          }}
          onKeyDown={handleInputKeyDown}
          placeholder="Search knowledge base..."
          aria-label="Search knowledge base"
          aria-expanded={showDropdown}
          role="combobox"
          aria-autocomplete="list"
          className={`w-full h-8 pl-8 pr-8 sm:pr-14 rounded font-mono text-xs text-text-primary placeholder:text-text-secondary/70 transition-all duration-200 outline-none ${
            isFocused
              ? "bg-surface border border-accent/60 ring-1 ring-accent/30 shadow-[0_0_15px_rgba(239,68,68,0.12)]"
              : "bg-surface-2/60 border border-border hover:border-accent/40 hover:bg-surface-2"
          }`}
        />

        {/* Right side controls: Clear button or shortcut badge */}
        <div className="absolute right-2 flex items-center gap-1">
          {query ? (
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                setQuery("");
                inputRef.current?.focus();
              }}
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="p-1 rounded text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center text-[10px] px-1.5 py-0.5 rounded bg-surface border border-border/80 text-text-secondary font-mono select-none">
              ⌘K
            </kbd>
          )}
        </div>
      </div>

      {/* Attached Search Dropdown: Perfectly anchored on mobile and desktop */}
      {showDropdown && (
        <div
          className="fixed left-3 right-3 top-[52px] sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 w-auto sm:w-[480px] md:w-[540px] max-w-[calc(100vw-1.5rem)] rounded-lg border border-border bg-surface/98 backdrop-blur-xl shadow-2xl overflow-hidden font-mono z-50 animate-search-reveal"
          role="listbox"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-border/70 text-[10px] uppercase tracking-wider text-text-secondary bg-surface-2/50">
            <span className="flex items-center gap-1.5 font-semibold">
              {query.trim() ? (
                <>
                  <Search className="w-3 h-3 text-accent" />
                  <span>Matches ({filteredItems.length})</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 text-accent" />
                  <span>Quick Navigation</span>
                </>
              )}
            </span>
            <span className="text-[9px] text-accent/80 font-mono">
              search
            </span>
          </div>

          {/* Results List */}
          <div
            ref={listRef}
            className="max-h-[340px] overflow-y-auto terminal-scrollbar p-1.5 space-y-1"
          >
            {filteredItems.length === 0 ? (
              <div className="py-8 px-4 text-center space-y-2 animate-search-item">
                <ShieldAlert className="w-5 h-5 text-accent/60 mx-auto" />
                <p className="text-xs text-text-primary">
                  No matching entries found for &ldquo;<span className="text-accent">{query}</span>&rdquo;
                </p>
                <p className="text-[11px] text-text-secondary font-sans">
                  Try searching by machine name, CVE, technology, or category.
                </p>
              </div>
            ) : (
              filteredItems.map((item, index) => {
                const isSelected = index === selectedIndex;
                const Icon = getItemIcon(item);
                const badge = getItemBadge(item);

                return (
                  <button
                    key={item.id}
                    type="button"
                    data-search-index={index}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(item);
                    }}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`group w-full flex items-center justify-between px-3 py-2.5 rounded text-left transition-all duration-150 animate-search-item ${
                      isSelected
                        ? "bg-surface-2 border-l-2 border-accent text-text-primary pl-3.5 shadow-sm"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface-2/60 border-l-2 border-transparent"
                    }`}
                    style={{ animationDelay: `${Math.min(index * 25, 200)}ms` }}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div
                        className={`p-1.5 rounded border shrink-0 transition-colors ${
                          isSelected
                            ? "bg-accent/10 border-accent/40 text-accent"
                            : "bg-surface-2 border-border/80 text-text-secondary group-hover:text-text-primary"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-text-primary truncate group-hover:text-accent transition-colors">
                            {item.title}
                          </span>
                          <span
                            className={`text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded border font-semibold shrink-0 ${badge.cls}`}
                          >
                            {badge.text}
                          </span>
                        </div>

                        {item.description && (
                          <p className="text-[11px] text-text-secondary font-sans truncate leading-relaxed mt-0.5 max-w-[320px] sm:max-w-[400px]">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center">
                      <CornerDownLeft
                        className={`w-3.5 h-3.5 transition-opacity duration-150 text-accent ${
                          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                        }`}
                      />
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Legend */}
          <div className="flex items-center justify-between px-3 py-1.5 border-t border-border/70 text-[10px] text-text-secondary bg-surface-2/40">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded bg-surface border border-border/80 text-[9px]">↑↓</kbd>
                <span>navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded bg-surface border border-border/80 text-[9px]">↵</kbd>
                <span>select</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded bg-surface border border-border/80 text-[9px]">esc</kbd>
                <span>close</span>
              </span>
            </div>

            <span className="text-[9px] text-text-secondary/70 hidden sm:inline">
              Instant Topbar Search
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
