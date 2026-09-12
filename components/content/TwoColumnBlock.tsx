import React from 'react';
import type { ContentBlock } from '@/types';
import { ContentRenderer } from './ContentRenderer';

export interface TwoColumnBlockProps {
  left: ContentBlock[] | React.ReactNode;
  right: ContentBlock[] | React.ReactNode;
  depth?: number;
  className?: string;
}

export function TwoColumnBlock({
  left,
  right,
  depth = 0,
  className = '',
}: TwoColumnBlockProps) {
  // Guard against excessive nesting/infinite recursion
  if (depth > 3) {
    return (
      <div className="p-3 text-xs font-mono text-rose-400 border border-rose-500/40 bg-rose-500/10 rounded">
        [Maximum column nesting depth exceeded]
      </div>
    );
  }

  const renderSide = (content: ContentBlock[] | React.ReactNode) => {
    if (Array.isArray(content)) {
      return <ContentRenderer blocks={content as ContentBlock[]} depth={depth + 1} />;
    }
    return content;
  };

  return (
    <div className={`my-4 grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      <div className="p-3.5 rounded border border-border bg-surface text-xs font-mono min-w-0 whitespace-pre-wrap leading-relaxed">
        {renderSide(left)}
      </div>
      <div className="p-3.5 rounded border border-border bg-surface text-xs font-mono min-w-0 whitespace-pre-wrap leading-relaxed">
        {renderSide(right)}
      </div>
    </div>
  );
}
