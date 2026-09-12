import React from 'react';
import { AlertTriangle } from 'lucide-react';

export interface WarningBlockProps {
  text?: string;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

export function WarningBlock({
  text,
  title = 'Warning',
  children,
  className = '',
}: WarningBlockProps) {
  const content = children ?? text;

  return (
    <aside
      role="alert"
      className={`my-4 p-3.5 rounded border border-amber-500/40 bg-amber-500/10 text-amber-200 text-xs font-mono space-y-1.5 ${className}`}
    >
      <div className="flex items-center gap-2 font-semibold tracking-wide uppercase text-[11px] text-amber-400">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <span>{title}</span>
      </div>
      <div className="text-text-secondary leading-relaxed pl-6 whitespace-pre-wrap">
        {content}
      </div>
    </aside>
  );
}
