import React from 'react';
import { ShieldAlert } from 'lucide-react';

export interface FindingBlockProps {
  text?: string;
  severity?: 'critical' | 'high' | 'medium' | 'low' | 'informational' | 'none' | string;
  cvss?: string;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

export function FindingBlock({
  text,
  severity = 'none',
  cvss,
  title = 'Findings',
  children,
  className = '',
}: FindingBlockProps) {
  const normSeverity = (severity || 'none').toLowerCase();

  const sevStyles: Record<string, string> = {
    critical: 'border-rose-500/50 bg-rose-500/10 text-rose-300',
    high: 'border-orange-500/50 bg-orange-500/10 text-orange-300',
    medium: 'border-amber-500/50 bg-amber-500/10 text-amber-300',
    low: 'border-blue-500/50 bg-blue-500/10 text-blue-300',
    informational: 'border-slate-500/50 bg-slate-500/10 text-slate-300',
    none: 'border-orange-500/40 bg-orange-500/10 text-orange-300',
  };

  const pillStyles: Record<string, string> = {
    critical: 'bg-rose-950/60 border-rose-500/40 text-rose-300',
    high: 'bg-orange-950/60 border-orange-500/40 text-orange-300',
    medium: 'bg-amber-950/60 border-amber-500/40 text-amber-300',
    low: 'bg-blue-950/60 border-blue-500/40 text-blue-300',
    informational: 'bg-slate-950/60 border-slate-500/40 text-slate-300',
  };

  const containerStyle = sevStyles[normSeverity] || sevStyles.none;
  const showBadge = normSeverity !== 'none' && Boolean(pillStyles[normSeverity]);
  const pillStyle = pillStyles[normSeverity];
  const content = children ?? text;

  return (
    <div className={`my-4 p-4 rounded border text-xs font-mono space-y-2.5 ${containerStyle} ${className}`}>
      <div className="flex items-center justify-between border-b border-border/40 pb-2">
        <div className="flex items-center gap-2 font-semibold tracking-wide uppercase text-[11px]">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {cvss && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface border border-border text-text-secondary">
              CVSS {cvss}
            </span>
          )}
          {showBadge && (
            <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border font-bold ${pillStyle}`}>
              {normSeverity === 'informational' ? 'INFO' : normSeverity}
            </span>
          )}
        </div>
      </div>

      <div className="text-text-secondary leading-relaxed pt-1 whitespace-pre-wrap">
        {content}
      </div>
    </div>
  );
}
