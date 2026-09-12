import React from 'react';
import { CheckCircle } from 'lucide-react';

export interface TipBlockProps {
  text?: string;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

export function TipBlock({
  text,
  title = 'Tip / Best Practice',
  children,
  className = '',
}: TipBlockProps) {
  const content = children ?? text;

  return (
    <aside
      className={`my-4 p-3.5 rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-200 text-xs font-mono space-y-1.5 ${className}`}
    >
      <div className="flex items-center gap-2 font-semibold tracking-wide uppercase text-[11px] text-emerald-400">
        <CheckCircle className="w-4 h-4 shrink-0" />
        <span>{title}</span>
      </div>
      <div className="text-text-secondary leading-relaxed pl-6 whitespace-pre-wrap">
        {content}
      </div>
    </aside>
  );
}
