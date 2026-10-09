import React from 'react';
import { ExternalLink } from 'lucide-react';

export const SUPPORTED_INLINE_TAGS = new Set([
  'kbd',
  'code',
  'b',
  'strong',
  'i',
  'em',
  's',
  'del',
  'strike',
  'u',
  'sub',
  'sup',
  'mark',
  'a',
  'span',
  'br',
  'wbr',
]);

export interface AstTextNode {
  text: string;
  [key: string]: unknown;
}

export interface AstElementNode {
  type?: string;
  children?: (AstTextNode | AstElementNode)[];
  [key: string]: unknown;
}

export type AstNode = AstTextNode | AstElementNode;

/**
 * Parses inline HTML tags inside a plain text string into structured Keystatic AST nodes.
 */
export function parseInlineHtmlToAstNodes(
  text: string,
  inheritedNode?: Record<string, unknown>
): AstNode[] {
  if (!text || typeof text !== 'string') return [];
  if (!text.includes('<')) {
    return [{ ...(inheritedNode || {}), text }];
  }

  const inheritedMarks: Record<string, unknown> = { ...(inheritedNode || {}) };
  delete inheritedMarks.text;

  const tagRegex = /<([a-zA-Z0-9]+)(\s+[^>]*)?>([\s\S]*?)<\/\1>|<(br|wbr)\s*\/?>/gi;
  const nodes: AstNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(text)) !== null) {
    const rawTag = (match[1] || match[4] || '').toLowerCase();
    if (!SUPPORTED_INLINE_TAGS.has(rawTag)) {
      continue;
    }

    if (match.index > lastIndex) {
      nodes.push({
        text: text.slice(lastIndex, match.index),
        ...inheritedMarks,
      });
    }

    const attrs = match[2] || '';
    const inner = match[3] || '';

    if (rawTag === 'br' || rawTag === 'wbr') {
      nodes.push({ text: '\n', ...inheritedMarks });
    } else if (rawTag === 'a') {
      const hrefMatch = attrs.match(/href=["']([^"']*)["']/i);
      const href = hrefMatch ? hrefMatch[1] : '';
      nodes.push({
        type: 'link',
        href,
        children: parseInlineHtmlToAstNodes(inner, inheritedMarks),
      });
    } else {
      const marks: Record<string, unknown> = { ...inheritedMarks };
      if (rawTag === 'kbd') marks.keyboard = true;
      else if (rawTag === 'code') marks.code = true;
      else if (rawTag === 'b' || rawTag === 'strong') marks.bold = true;
      else if (rawTag === 'i' || rawTag === 'em') marks.italic = true;
      else if (rawTag === 's' || rawTag === 'del' || rawTag === 'strike') marks.strikethrough = true;
      else if (rawTag === 'u') marks.underline = true;
      else if (rawTag === 'sub') marks.subscript = true;
      else if (rawTag === 'sup') marks.superscript = true;
      else if (rawTag === 'mark') marks.mark = true;

      const innerNodes = parseInlineHtmlToAstNodes(inner, marks);
      if (innerNodes.length > 0) {
        nodes.push(...innerNodes);
      } else {
        nodes.push({ text: '', ...marks });
      }
    }

    lastIndex = tagRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push({
      text: text.slice(lastIndex),
      ...inheritedMarks,
    });
  }

  return nodes.length > 0 ? nodes : [{ text, ...inheritedMarks }];
}

/**
 * Recursively walks a Keystatic document AST and parses raw HTML tags (e.g. <kbd>, <a>, <code>)
 * found inside text nodes into proper inline nodes with marks or link types.
 */
export function transformDocumentAst(nodes: unknown): unknown {
  if (!Array.isArray(nodes)) return nodes;

  const result: unknown[] = [];

  for (const node of nodes) {
    if (!node || typeof node !== 'object') {
      result.push(node);
      continue;
    }

    // Text node
    if (typeof (node as { text?: unknown }).text === 'string') {
      const textNode = node as { text: string; [k: string]: unknown };
      if (textNode.text.includes('<')) {
        const parsed = parseInlineHtmlToAstNodes(textNode.text, textNode);
        result.push(...parsed);
      } else {
        result.push(node);
      }
      continue;
    }

    // Node with children (table, row, cell, paragraph, heading, list, etc.)
    if (Array.isArray((node as { children?: unknown }).children)) {
      const elementNode = node as { children: unknown[]; [k: string]: unknown };
      result.push({
        ...elementNode,
        children: transformDocumentAst(elementNode.children),
      });
      continue;
    }

    result.push(node);
  }

  return result;
}

/**
 * Utility to convert raw text containing inline HTML tags directly into formatted React nodes.
 * Used as a fallback for components that receive plain text props instead of AST.
 */
export function renderInlineHtmlToReact(content: React.ReactNode): React.ReactNode {
  if (typeof content !== 'string') return content;
  if (!content.includes('<')) return content;

  const astNodes = parseInlineHtmlToAstNodes(content);

  function renderNodes(nodes: AstNode[]): React.ReactNode {
    return nodes.map((node, idx) => {
      if (node.type === 'link') {
        const href = String(node.href || '');
        const isExternal = href.startsWith('http');
        return (
          <a
            key={idx}
            href={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="text-accent hover:underline inline-flex items-center gap-0.5"
          >
            <span>{node.children ? renderNodes(node.children as AstNode[]) : href}</span>
            {isExternal && <ExternalLink className="w-3 h-3 inline shrink-0" />}
          </a>
        );
      }

      let el: React.ReactNode = (node as AstTextNode).text;

      if (node.keyboard) {
        el = (
          <kbd
            key={`kbd-${idx}`}
            className="inline-flex items-center justify-center px-1.5 py-0.5 mx-0.5 text-[11px] font-mono font-medium text-text-primary bg-surface-2 border border-border/80 rounded shadow-xs select-none align-baseline"
          >
            {el}
          </kbd>
        );
      }
      if (node.code) {
        el = (
          <code
            key={`code-${idx}`}
            className="px-1.5 py-0.5 rounded bg-surface-2 border border-border text-accent text-xs font-mono"
          >
            {el}
          </code>
        );
      }
      if (node.bold) {
        el = (
          <strong key={`b-${idx}`} className="font-semibold text-text-primary">
            {el}
          </strong>
        );
      }
      if (node.italic) {
        el = (
          <em key={`i-${idx}`} className="italic text-text-primary/90">
            {el}
          </em>
        );
      }
      if (node.strikethrough) {
        el = (
          <s key={`s-${idx}`} className="line-through text-text-secondary/70">
            {el}
          </s>
        );
      }
      if (node.underline) {
        el = (
          <u key={`u-${idx}`} className="underline underline-offset-2">
            {el}
          </u>
        );
      }
      if (node.subscript) {
        el = (
          <sub key={`sub-${idx}`} className="text-[10px] align-sub text-text-secondary">
            {el}
          </sub>
        );
      }
      if (node.superscript) {
        el = (
          <sup key={`sup-${idx}`} className="text-[10px] align-super text-text-secondary">
            {el}
          </sup>
        );
      }
      if (node.mark) {
        el = (
          <mark
            key={`mark-${idx}`}
            className="bg-accent/20 text-accent px-1 py-0.5 rounded border border-accent/30 font-medium"
          >
            {el}
          </mark>
        );
      }

      return <React.Fragment key={idx}>{el}</React.Fragment>;
    });
  }

  return renderNodes(astNodes);
}
