import React from 'react';
import { Info } from 'lucide-react';

export interface NoteBlockProps {
  text?: string;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

export function NoteBlock({
  text,
  title = 'Note',
  children,
  className = '',
}: NoteBlockProps) {
  const content = children ?? text;

  return (
    <aside
      role="note"
      className={`my-4 p-3.5 rounded border border-accent/40 bg-accent/10 text-accent text-xs font-mono space-y-1.5 ${className}`}
    >
      <div className="flex items-center gap-2 font-semibold tracking-wide uppercase text-[11px] text-accent">
        <Info className="w-4 h-4 shrink-0" />
        <span>{title}</span>
      </div>
      <div className="text-text-secondary leading-relaxed pl-6 whitespace-pre-wrap">
        {content}
      </div>
    </aside>
  );
}
