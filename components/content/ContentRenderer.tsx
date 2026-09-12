import React from 'react';
import type { ContentBlock } from '@/types';
import { ParagraphBlock } from './ParagraphBlock';
import { HeadingBlock } from './HeadingBlock';
import { OrderedListBlock } from './OrderedListBlock';
import { UnorderedListBlock } from './UnorderedListBlock';
import { QuoteBlock } from './QuoteBlock';
import { ImageBlock } from './ImageBlock';
import { GalleryBlock } from './GalleryBlock';
import { WarningBlock } from './WarningBlock';
import { NoteBlock } from './NoteBlock';
import { TipBlock } from './TipBlock';
import { LabBlock } from './LabBlock';
import { FindingBlock } from './FindingBlock';
import { MitigationBlock } from './MitigationBlock';
import { CodeBlock } from './CodeBlock';
import { TerminalBlock } from './TerminalBlock';
import { FileTreeBlock } from './FileTreeBlock';
import { DividerBlock } from './DividerBlock';
import { CalloutBlock } from './CalloutBlock';
import { TwoColumnBlock } from './TwoColumnBlock';

export interface ContentRendererProps {
  blocks: ContentBlock[];
  depth?: number;
  className?: string;
}

export function ContentRenderer({ blocks, depth = 0, className = '' }: ContentRendererProps) {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 text-xs font-mono text-text-secondary leading-relaxed ${className}`}>
      {blocks.map((block, idx) => {
        const key = `block-${depth}-${idx}`;

        switch (block.type) {
          case 'paragraph':
            return <ParagraphBlock key={key} text={block.text} />;

          case 'heading':
            return <HeadingBlock key={key} level={block.level} text={block.text} />;

          case 'orderedList':
            return <OrderedListBlock key={key} items={block.items} />;

          case 'unorderedList':
            return <UnorderedListBlock key={key} items={block.items} />;

          case 'quote':
            return <QuoteBlock key={key} text={block.text} source={block.source} />;

          case 'image':
            return <ImageBlock key={key} src={block.src} alt={block.alt} caption={block.caption} />;

          case 'gallery':
            return <GalleryBlock key={key} images={block.images} />;

          case 'warning':
            return <WarningBlock key={key} text={block.text} />;

          case 'note':
            return <NoteBlock key={key} text={block.text} />;

          case 'tip':
            return <TipBlock key={key} text={block.text} />;

          case 'lab':
            return (
              <LabBlock
                key={key}
                target={block.target}
                difficulty={block.difficulty}
                objective={block.objective}
              />
            );

          case 'finding':
            return <FindingBlock key={key} text={block.text} severity={block.severity} />;

          case 'mitigation':
            return <MitigationBlock key={key} text={block.text} />;

          case 'code':
            return (
              <CodeBlock
                key={key}
                language={block.language}
                code={block.code}
                filename={block.filename}
              />
            );

          case 'terminal':
            return <TerminalBlock key={key} title={block.title} commands={block.commands} />;

          case 'fileTree':
            return <FileTreeBlock key={key} tree={block.tree} />;

          case 'divider':
            return <DividerBlock key={key} />;

          case 'callout':
            return <CalloutBlock key={key} text={block.text} />;

          case 'twoColumn':
            return <TwoColumnBlock key={key} left={block.left} right={block.right} depth={depth} />;

          default:
            return null;
        }
      })}
    </div>
  );
}
