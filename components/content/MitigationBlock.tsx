import React from 'react';
import { ShieldCheck } from 'lucide-react';

export interface MitigationBlockProps {
  text?: string;
  status?: string;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

export function MitigationBlock({
  text,
  status = 'Remediation',
  title = 'Mitigation & Defense',
  children,
  className = '',
}: MitigationBlockProps) {
  const content = children ?? text;

  return (
    <div className={`my-4 p-4 rounded border border-emerald-500/40 bg-emerald-500/10 text-xs font-mono space-y-2.5 ${className}`}>
      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
        <div className="flex items-center gap-2 text-emerald-300 font-semibold tracking-wide uppercase text-[11px]">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>{title}</span>
        </div>
        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-semibold">
          {status}
        </span>
      </div>

      <div className="text-text-secondary leading-relaxed pt-1 whitespace-pre-wrap">
        {content}
      </div>
    </div>
  );
}
