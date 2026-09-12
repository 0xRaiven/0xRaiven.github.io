'use client';

import React from 'react';
import {
  DocumentRenderer as KeystaticDocumentRenderer,
  type DocumentRendererProps,
} from '@keystatic/core/renderer';
import { ExternalLink } from 'lucide-react';
import { ParagraphBlock } from './ParagraphBlock';
import { HeadingBlock } from './HeadingBlock';
import { OrderedListBlock } from './OrderedListBlock';
import { UnorderedListBlock } from './UnorderedListBlock';
import { QuoteBlock } from './QuoteBlock';
import { WarningBlock } from './WarningBlock';
import { NoteBlock } from './NoteBlock';
import { TipBlock } from './TipBlock';
import { LabBlock } from './LabBlock';
import { FindingBlock } from './FindingBlock';
import { MitigationBlock } from './MitigationBlock';
import { CodeBlock } from './CodeBlock';
import { TerminalBlock, type TerminalCommand } from './TerminalBlock';
import { FileTreeBlock } from './FileTreeBlock';
import { DividerBlock } from './DividerBlock';
import { CalloutBlock } from './CalloutBlock';
import { TwoColumnBlock } from './TwoColumnBlock';

// Custom Component Blocks mapping delegating to modular blocks
const componentBlocks = {
  warning: ({
    title,
    content,
    text,
    children,
  }: {
    title?: string;
    content?: React.ReactNode;
    text?: string;
    children?: React.ReactNode;
  }) => (
    <WarningBlock title={title} text={text}>
      {children ?? text ?? content}
    </WarningBlock>
  ),

  note: ({
    title,
    content,
    text,
    children,
  }: {
    title?: string;
    content?: React.ReactNode;
    text?: string;
    children?: React.ReactNode;
  }) => (
    <NoteBlock title={title} text={text}>
      {children ?? text ?? content}
    </NoteBlock>
  ),

  tip: ({
    title,
    content,
    text,
    children,
  }: {
    title?: string;
    content?: React.ReactNode;
    text?: string;
    children?: React.ReactNode;
  }) => (
    <TipBlock title={title} text={text}>
      {children ?? text ?? content}
    </TipBlock>
  ),

  lab: ({
    environment,
    target,
    difficulty,
    objective,
    content,
    children,
  }: {
    environment?: string;
    target?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    objective?: string;
    content?: React.ReactNode;
    children?: React.ReactNode;
  }) => (
    <LabBlock
      target={target || 'Local Lab'}
      difficulty={difficulty || 'medium'}
      environment={environment}
      objective={objective || (typeof content === 'string' ? content : undefined)}
    >
      {children ?? content}
    </LabBlock>
  ),

  finding: ({
    severity,
    cvss,
    title,
    content,
    text,
    children,
  }: {
    severity?: string;
    cvss?: string;
    title?: string;
    content?: React.ReactNode;
    text?: string;
    children?: React.ReactNode;
  }) => (
    <FindingBlock
      severity={severity || 'none'}
      cvss={cvss}
      title={title}
      text={text}
    >
      {children ?? text ?? content}
    </FindingBlock>
  ),

  mitigation: ({
    status,
    title,
    content,
    text,
    children,
  }: {
    status?: string;
    title?: string;
    content?: React.ReactNode;
    text?: string;
    children?: React.ReactNode;
  }) => (
    <MitigationBlock
      status={status || 'Remediation'}
      title={title}
      text={text}
    >
      {children ?? text ?? content}
    </MitigationBlock>
  ),

  terminal: ({
    title,
    commands,
    output,
  }: {
    title?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    commands?: any[];
    output?: string;
  }) => {
    const formattedCommands: TerminalCommand[] = (commands || []).map((item, idx) => {
      if (typeof item === 'string') {
        return {
          cmd: item,
          output: idx === (commands || []).length - 1 ? output : undefined,
        };
      }
      if (item && typeof item === 'object') {
        return {
          cmd: typeof item.cmd === 'string' ? item.cmd : String(item.text || ''),
          output: item.output || (idx === (commands || []).length - 1 ? output : undefined),
        };
      }
      return { cmd: String(item) };
    });

    return <TerminalBlock title={title} commands={formattedCommands} />;
  },

  fileTree: ({ tree }: { tree: string }) => <FileTreeBlock tree={tree} />,

  callout: ({
    content,
    text,
    children,
  }: {
    content?: React.ReactNode;
    text?: string;
    children?: React.ReactNode;
  }) => (
    <CalloutBlock text={text}>{children ?? text ?? content}</CalloutBlock>
  ),

  twoColumn: ({
    left,
    right,
  }: {
    left: React.ReactNode;
    right: React.ReactNode;
  }) => <TwoColumnBlock left={left} right={right} />,
};

interface DocumentContentProps {
  document: DocumentRendererProps['document'];
}

export function DocumentContent({ document }: DocumentContentProps) {
  if (!document || !Array.isArray(document)) {
    return null;
  }

  return (
    <div className="space-y-4 text-sm font-sans text-text-secondary leading-relaxed">
      <KeystaticDocumentRenderer
        document={document}
        componentBlocks={componentBlocks}
        renderers={{
          inline: {
            link: ({ children, href }) => (
              <a
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="text-accent hover:underline inline-flex items-center gap-0.5"
              >
                <span>{children}</span>
                {href.startsWith('http') && <ExternalLink className="w-3 h-3 inline shrink-0" />}
              </a>
            ),
            bold: ({ children }) => <strong className="font-semibold text-text-primary">{children}</strong>,
            code: ({ children }) => (
              <code className="px-1.5 py-0.5 rounded bg-surface-2 border border-border text-accent text-xs font-mono">
                {children}
              </code>
            ),
          },
          block: {
            heading: ({ level, children }) => {
              const lvl = level === 1 ? 1 : level === 2 ? 2 : 3;
              return <HeadingBlock level={lvl}>{children}</HeadingBlock>;
            },
            paragraph: ({ children }) => <ParagraphBlock>{children}</ParagraphBlock>,
            code: ({ children, language }) => <CodeBlock language={language} code={children} />,
            divider: () => <DividerBlock />,
            image: ({ src, alt, title }: { src: string; alt?: string; title?: string }) => (
              <figure className="my-4 max-w-full">
                <img
                  src={src}
                  alt={alt || ''}
                  title={title}
                  className="rounded max-w-full h-auto object-contain"
                  loading="lazy"
                />
                {title && (
                  <figcaption className="text-center text-xs text-text-secondary mt-1 font-mono">
                    {title}
                  </figcaption>
                )}
              </figure>
            ),
            list: ({ type, children }) => {
              const ListComponent = type === 'ordered' ? OrderedListBlock : UnorderedListBlock;
              return (
                <ListComponent>
                  {React.Children.map(children, (child, idx) => (
                    <li key={idx} className="leading-relaxed pl-1">
                      {child}
                    </li>
                  ))}
                </ListComponent>
              );
            },
            table: ({ head, body }) => (
              <div className="my-4 overflow-x-auto rounded border border-border bg-surface">
                <table className="w-full text-left font-mono text-xs">
                  {head && (
                    <thead className="bg-surface-2/70 border-b border-border text-text-secondary uppercase tracking-wider text-[11px]">
                      <tr>
                        {head.map((col, idx) => (
                          <th key={idx} className="py-2 px-3 font-medium">
                            {col.children}
                          </th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody className="divide-y divide-border/60">
                    {body.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-surface-2/40 transition-colors">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="py-2 px-3 text-text-primary">
                            {cell.children}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ),
          },
        }}
      />
    </div>
  );
}
