"use client";

import React, { useState } from "react";
import {
  FileQuestion,
  FolderGit2,
  ExternalLink,
  Copy,
  Check,
  Terminal,
  Info,
  GitBranch,
  Layers,
} from "lucide-react";

export interface NoReadmeViewProps {
  projectTitle: string;
  slug: string;
  githubUrl?: string;
  hasBio?: boolean;
  technologies?: string[];
}

export function NoReadmeView({
  projectTitle,
  slug,
  githubUrl = `https://github.com/0xRaiven/${slug}`,
  hasBio = true,
  technologies = [],
}: NoReadmeViewProps) {
  const [copied, setCopied] = useState(false);
  const cloneCmd = `git clone ${githubUrl}.git`;

  const handleCopy = () => {
    navigator.clipboard.writeText(cloneCmd).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-6 font-mono text-text-primary">
      {/* Primary Card */}
      <div className="p-5 sm:p-6 rounded-lg border border-border bg-surface relative overflow-hidden space-y-5 shadow-sm">
        {/* Ambient subtle glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        {/* Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xs text-text-secondary tracking-widest whitespace-nowrap shrink-0">
              ( 404 )
            </span>
            <div className="h-3 w-px bg-border shrink-0" />
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 border border-border/80 shadow-inner shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            </div>
            <span className="text-[11px] uppercase tracking-wider text-text-primary whitespace-nowrap truncate font-semibold">
              README.md // NOT_FOUND
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 whitespace-nowrap">
              NO README ON GITHUB
            </span>
            {!hasBio && (
              <span className="text-[10px] uppercase tracking-wider text-text-secondary px-2 py-0.5 rounded bg-surface-2 border border-border whitespace-nowrap">
                NO BIO PROVIDED
              </span>
            )}
          </div>
        </div>

        {/* Detail Description */}
        <div className="space-y-3 pt-1">
          <div className="flex items-start gap-3 p-3.5 rounded border border-border/80 bg-surface-2/40">
            <FileQuestion className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1.5 text-xs leading-relaxed">
              <div className="font-semibold text-text-primary flex items-center gap-2">
                <span>Repository Documentation Notice</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface-2 border border-border text-text-secondary">
                  {slug}
                </span>
              </div>
              <p className="text-text-secondary">
                {hasBio ? (
                  <>
                    No <code className="text-accent bg-surface px-1 py-0.5 rounded border border-border">README.md</code> documentation was found for this repository on GitHub.
                  </>
                ) : (
                  <>
                    No <code className="text-accent bg-surface px-1 py-0.5 rounded border border-border">README.md</code> documentation or repository bio was found for this page on GitHub.
                  </>
                )}
                {" "}The source code is hosted and accessible directly via GitHub.
              </p>
            </div>
          </div>

          {/* Quick Clone Terminal Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-accent" />
                <span>Clone repository locally</span>
              </div>
              <span className="text-[10px] text-text-secondary/70">git cli</span>
            </div>

            <div className="flex items-center justify-between gap-2 p-3 rounded bg-black/60 border border-border font-mono text-xs">
              <div className="flex items-center gap-2 min-w-0 overflow-x-auto text-text-primary scrollbar-none py-0.5">
                <span className="text-accent select-none">$</span>
                <span className="select-all text-emerald-400/90 whitespace-nowrap">{cloneCmd}</span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="p-1.5 rounded hover:bg-surface-2 border border-transparent hover:border-border text-text-secondary hover:text-text-primary transition-colors shrink-0 flex items-center gap-1 text-[11px]"
                title="Copy clone command"
                aria-label="Copy clone command"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 text-[10px]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[10px]">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons & Tech Footer */}
        <div className="pt-2 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-2 hover:bg-accent/15 border border-border hover:border-accent/40 text-text-primary hover:text-accent font-semibold transition-colors"
              >
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>Open {projectTitle} on GitHub</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            )}
          </div>

          {technologies.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 text-text-secondary text-[11px]">
              <span className="text-[10px] text-text-secondary/70 mr-1">Stack:</span>
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-1.5 py-0.5 rounded bg-surface-2/60 border border-border text-[10px] text-text-secondary"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
