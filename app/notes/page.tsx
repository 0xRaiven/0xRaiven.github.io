import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { KnowledgeBaseLayout } from "@/components/layout/KnowledgeBaseLayout";
import { getArticles } from "@/lib/articles";
import { StayTuned } from "@/components/content/StayTuned";
import { ArrowRight, Clock, Calendar, Tag, FileText } from "lucide-react";
import { ScrambleText } from "@/components/animation/ScrambleText";

export const metadata: Metadata = {
  title: "Notes",
  description: "Technical notes, cheat sheets, command references, and practical guides.",
};

export default async function NotesPage() {
  const notes = await getArticles("note");

  const quickNav = notes.slice(0, 5).map((n) => ({
    title: n.title,
    href: `/notes/${n.slug}`,
    category: n.category,
  }));

  return (
    <KnowledgeBaseLayout relatedItems={quickNav}>
      <div className="space-y-8 font-mono">
        {/* Header Breadcrumb */}
        <header className="space-y-2 border-b border-border pb-4">
          <div className="text-xs text-text-secondary flex items-center gap-1.5">
            <span className="text-accent">~</span>
            <span>/</span>
            <span className="text-text-primary">notes</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h1 className="text-xl font-bold tracking-tight text-text-primary uppercase flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              <ScrambleText text="Notes & Cheatsheets" as="span" />
            </h1>
            <span className="text-xs text-text-secondary">
              [{notes.length} notes available]
            </span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed font-sans">
            Short-form technical notes, syntax cheat sheets, and practical checklists across host, cloud, and network security.
          </p>
        </header>

        {/* Notes List */}
        {notes.length === 0 ? (
          <StayTuned
            title="Notes & Cheatsheets Coming Soon"
            category="notes"
            description="Command cheat sheets, queries, and security notes are actively being organized. Check back soon for new entries."
            returnUrl="/projects"
            returnLabel="Explore Projects"
          />
        ) : (
          <div className="space-y-3">
            {notes.map((item) => (
              <article
                key={item.slug}
                className="p-4 rounded border border-border bg-surface hover:border-accent/40 transition-colors group space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-text-secondary">
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-surface-2 border border-border font-semibold text-text-primary">
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
                        <span>{item.readingTime} min</span>
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <Link
                    href={`/notes/${item.slug}`}
                    className="text-base font-bold text-text-primary group-hover:text-accent transition-colors flex items-center justify-between"
                  >
                    <span>{item.title}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-accent shrink-0 ml-2" />
                  </Link>

                  {item.description && (
                    <p className="text-xs text-text-secondary leading-relaxed mt-1 font-sans">
                      {item.description}
                    </p>
                  )}
                </div>

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <Tag className="w-3 h-3 text-text-secondary/60 shrink-0" />
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-1.5 py-0.2 rounded bg-surface-2 border border-border/60 text-text-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </KnowledgeBaseLayout>
  );
}
