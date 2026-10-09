import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { KnowledgeBaseLayout } from "@/components/layout/KnowledgeBaseLayout";
import { getArticles } from "@/lib/articles";
import { StayTuned } from "@/components/content/StayTuned";
import { ArrowRight, Clock, Calendar, Tag, FlaskConical } from "lucide-react";
import { ScrambleText } from "@/components/animation/ScrambleText";
import { GlassCard } from "@/components/chrome/GlassSurface";

export const metadata: Metadata = {
  title: "Security Research",
  description: "Security research, vulnerability analysis, technical papers, and lab experiments.",
};

export default async function ResearchPage() {
  const researchItems = await getArticles("research");

  const quickNav = researchItems.slice(0, 5).map((r) => ({
    title: r.title,
    href: `/research/${r.slug}`,
    category: r.category,
  }));

  return (
    <KnowledgeBaseLayout relatedItems={quickNav}>
      <div className="space-y-8 font-mono">
        {/* Header Breadcrumb */}
        <header className="space-y-2 border-b border-border pb-4">
          <div className="text-xs text-text-secondary flex items-center gap-1.5">
            <span className="text-accent">~</span>
            <span>/</span>
            <span className="text-text-primary">research</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h1 className="text-xl font-bold tracking-tight text-text-primary uppercase flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-accent" />
              <ScrambleText text="Security Research & Analysis" as="span" />
            </h1>
            <span className="text-xs text-text-secondary">
              [{researchItems.length} articles published]
            </span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed font-sans">
            In-depth security analysis, vulnerability research, protocol testing, and experimental lab studies.
          </p>
        </header>

        {/* Research List */}
        {researchItems.length === 0 ? (
          <StayTuned
            title="Research Articles Coming Soon"
            category="research"
            description="Vulnerability analysis, protocol research, and experimental lab writeups are actively being prepared and reviewed. Check back soon for new articles."
            returnUrl="/projects"
            returnLabel="Explore Projects"
          />
        ) : (
          <div className="space-y-3">
            {researchItems.map((item) => (
              <GlassCard
                as="article"
                key={item.slug}
                className="p-4 space-y-2.5 group"
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
                        <span>{item.readingTime} min</span>
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <Link
                    href={`/research/${item.slug}`}
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
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </KnowledgeBaseLayout>
  );
}
