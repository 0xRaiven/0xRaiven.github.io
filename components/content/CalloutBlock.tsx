import React from 'react';

export interface CalloutBlockProps {
  text?: string;
  children?: React.ReactNode;
  className?: string;
}

export function CalloutBlock({ text, children, className = '' }: CalloutBlockProps) {
  const content = children ?? text;

  return (
    <div
      className={`my-4 p-3.5 rounded border border-border bg-surface-2/70 text-text-secondary text-xs font-mono leading-relaxed whitespace-pre-wrap ${className}`}
    >
      {content}
    </div>
  );
}
