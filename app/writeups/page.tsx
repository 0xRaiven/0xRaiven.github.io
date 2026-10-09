import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { KnowledgeBaseLayout } from '@/components/layout/KnowledgeBaseLayout';
import { getArticles } from '@/lib/articles';
import { ArrowRight, Clock, Calendar, Tag } from 'lucide-react';
import { ScrambleText } from '@/components/animation/ScrambleText';

export const metadata: Metadata = {
  title: 'Writeups',
  description: 'Walkthroughs, CTF challenges, machine writeups, and security lab guides.',
};

export default async function WriteupsPage() {
  const writeups = await getArticles('writeup');

  const quickNav = writeups.slice(0, 5).map((w) => ({
    title: w.title,
    href: `/writeups/${w.slug}`,
    category: w.category,
  }));

  return (
    <KnowledgeBaseLayout relatedItems={quickNav}>
      <div className="space-y-8 font-mono">
        {/* Header Breadcrumb */}
        <header className="space-y-2 border-b border-border pb-4">
          <div className="text-xs text-text-secondary flex items-center gap-1.5">
            <span className="text-accent">~</span>
            <span>/</span>
            <span className="text-text-primary">writeups</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <ScrambleText
              text="Security Writeups & Walkthroughs"
              as="h1"
              className="text-xl font-bold tracking-tight text-text-primary uppercase"
            />
            <span className="text-xs text-text-secondary">
              [{writeups.length} writeups published]
            </span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Detailed walkthroughs, challenge solutions, and security analysis.
          </p>
        </header>

        {/* Writeups List */}
        <div className="space-y-3">
          {writeups.map((item) => (
            <article
              key={item.slug}
              className="p-4 rounded border border-border bg-surface hover:border-accent/40 transition-colors group space-y-2.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-text-secondary">
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-surface-2 border border-border font-semibold text-text-primary whitespace-nowrap shrink-0">
                  {item.category}
                </span>

                <div className="flex items-center gap-3">
                  {item.date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-text-secondary" />
                      <span>{item.date}</span>
                    </span>
                  )}
                  {item.readingTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-accent" />
                      <span>{item.readingTime} min read</span>
                    </span>
                  )}
                </div>
              </div>

              <div>
                <Link
                  href={`/writeups/${item.slug}`}
                  className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors flex items-center justify-between"
                >
                  <span>{item.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed mt-1">
                  {item.description}
                </p>
              </div>

              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <Tag className="w-3 h-3 text-text-secondary/60" />
                  {item.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-surface-2/60 border border-border/70 text-text-secondary"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </KnowledgeBaseLayout>
  );
}
