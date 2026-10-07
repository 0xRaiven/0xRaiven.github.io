import React from "react";
import Link from "next/link";
import { KnowledgeBaseLayout } from "@/components/layout/KnowledgeBaseLayout";
import { Terminal, Home, ArrowLeft, FolderGit2, ShieldAlert, Search } from "lucide-react";

export default function NotFound() {
  return (
    <KnowledgeBaseLayout>
      <div className="space-y-8 font-mono text-text-primary py-4">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-3 text-xs text-text-secondary border-b border-border pb-3">
          <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
            <Link href="/" className="hover:text-accent flex items-center gap-1 shrink-0">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>home</span>
            </Link>
            <span className="shrink-0">/</span>
            <span className="text-rose-400 font-semibold">404</span>
            <span className="shrink-0">/</span>
            <span className="text-text-secondary">PAGE_NOT_FOUND</span>
          </div>

          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 font-semibold whitespace-nowrap shrink-0">
            STATUS 404
          </span>
        </div>

        {/* Terminal Window */}
        <div className="rounded-lg border border-border bg-surface overflow-hidden shadow-lg">
          {/* Window Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-surface-2/80 border-b border-border text-xs text-text-secondary">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-[11px] text-text-secondary ml-1">terminal://0xraiven/404</span>
            </div>

            <span className="text-[10px] text-text-secondary">status: 404</span>
          </div>

          {/* Window Body */}
          <div className="p-5 sm:p-6 space-y-6">
            {/* ASCII Art 404 */}
            <pre className="text-xs sm:text-sm font-bold text-rose-400 overflow-x-auto select-none leading-none tracking-tighter py-2">
{`
  ██╗  ██╗ ██████╗ ██╗  ██╗
  ██║  ██║██╔═████╗██║  ██║
  ███████║██║██╔██║███████║
  ╚════██║████╔╝██║╚════██║
       ██║╚██████╔╝     ██║
       ╚═╝ ╚═════╝      ╚═╝
`}
            </pre>

            {/* Error Readout */}
            <div className="p-4 rounded border border-border/80 bg-surface-2/50 text-xs space-y-2">
              <div className="text-rose-400 font-semibold flex items-center gap-2">
                <Terminal className="w-4 h-4 text-rose-400" />
                <span>ERROR: PAGE_NOT_FOUND</span>
              </div>
              <p className="text-text-secondary font-sans leading-relaxed">
                The requested page could not be found. It may have been moved, renamed, or does not exist.
              </p>
              <div className="pt-2 text-[11px] text-text-secondary space-y-1 border-t border-border/40 font-mono">
                <div>status: <span className="text-text-primary">404</span></div>
                <div>host: <span className="text-accent">0xraiven.github.io</span></div>
                <div>action: <span className="text-emerald-400">return home or search site</span></div>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="space-y-3 pt-2">
              <div className="text-xs text-text-secondary font-semibold uppercase tracking-wider">
                Quick Navigation:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <Link
                  href="/"
                  className="flex items-center gap-2.5 p-2.5 rounded border border-border bg-surface-2/60 hover:bg-surface-2 hover:border-accent/40 transition-colors group"
                >
                  <Home className="w-4 h-4 text-accent group-hover:scale-105 transition-transform" />
                  <div>
                    <div className="text-text-primary font-semibold">$ cd /</div>
                    <div className="text-[11px] text-text-secondary font-sans">Return to homepage</div>
                  </div>
                </Link>

                <Link
                  href="/projects"
                  className="flex items-center gap-2.5 p-2.5 rounded border border-border bg-surface-2/60 hover:bg-surface-2 hover:border-accent/40 transition-colors group"
                >
                  <FolderGit2 className="w-4 h-4 text-blue-400 group-hover:scale-105 transition-transform" />
                  <div>
                    <div className="text-text-primary font-semibold">$ ls /projects</div>
                    <div className="text-[11px] text-text-secondary font-sans">Browse projects and tools</div>
                  </div>
                </Link>

                <Link
                  href="/writeups"
                  className="flex items-center gap-2.5 p-2.5 rounded border border-border bg-surface-2/60 hover:bg-surface-2 hover:border-accent/40 transition-colors group"
                >
                  <ShieldAlert className="w-4 h-4 text-rose-400 group-hover:scale-105 transition-transform" />
                  <div>
                    <div className="text-text-primary font-semibold">$ cat /writeups</div>
                    <div className="text-[11px] text-text-secondary font-sans">Read security writeups</div>
                  </div>
                </Link>

                <div className="flex items-center gap-2.5 p-2.5 rounded border border-border bg-surface-2/60 text-text-secondary">
                  <Search className="w-4 h-4 text-accent shrink-0" />
                  <div>
                    <div className="text-text-primary font-semibold">$ ⌘K / Ctrl+K</div>
                    <div className="text-[11px] text-text-secondary font-sans">Open search palette</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </KnowledgeBaseLayout>
  );
}
