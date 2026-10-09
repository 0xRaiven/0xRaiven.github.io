import React from 'react';
import { renderInlineHtmlToReact } from '@/lib/ast-transform';

export interface ParagraphBlockProps {
  text?: string;
  children?: React.ReactNode;
  className?: string;
}

export function ParagraphBlock({ text, children, className = '' }: ParagraphBlockProps) {
  const content = children ?? text;
  return (
    <p className={`text-sm text-text-secondary leading-relaxed my-3.5 ${className}`}>
      {typeof content === 'string' ? renderInlineHtmlToReact(content) : content}
    </p>
  );
}
