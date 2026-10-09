import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { KnowledgeBaseLayout } from "@/components/layout/KnowledgeBaseLayout";
import { DocumentContent } from "@/components/content/DocumentRenderer";
import { StayTuned } from "@/components/content/StayTuned";
import { getArticleBySlug, getArticles } from "@/lib/articles";
import { ArrowLeft, ArrowRight, Calendar, Clock, Tag, Microscope, FlaskConical } from "lucide-react";

interface ResearchPageProps {
  params: Promise<{ slug: string }>;
}

function formatCategoryLabel(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: ResearchPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug("research", slug);

  if (article) {
    return {
      title: article.meta.title,
      description: article.meta.description || "Security research and analysis.",
    };
  }

  const label = formatCategoryLabel(slug);
  return {
    title: `${label} Research`,
    description: `Security research and technical papers for ${label}.`,
  };
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const research = await getArticles("research");
  const slugs = new Set(research.map((r) => r.slug));

  slugs.add("security-research");

  return Array.from(slugs).map((slug) => ({ slug }));
}

export default async function ResearchDetailPage({ params }: ResearchPageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug("research", slug);

  if (article) {
    const allResearch = await getArticles("research");
    const relatedItems = allResearch
      .filter((r) => r.slug !== article.meta.slug)
      .slice(0, 3)
      .map((r) => ({
        title: r.title,
        href: `/research/${r.slug}`,
        category: r.category,
        readingTime: `${r.readingTime}m read`,
      }));

    return (
      <KnowledgeBaseLayout relatedItems={relatedItems}>
        <article className="space-y-6 font-mono">
          {/* Navigation & Breadcrumb */}
          <div className="flex flex-wrap items-center justify-between gap-y-2.5 gap-x-3 text-xs text-text-secondary border-b border-border pb-3">
            <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
              <Link href="/research" className="hover:text-accent flex items-center gap-1 shrink-0">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>research</span>
              </Link>
              <span className="shrink-0">/</span>
              <span className="text-text-primary font-semibold break-all">{article.meta.slug}</span>
            </div>

            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-surface-2 border border-border text-text-primary font-semibold whitespace-nowrap shrink-0">
              {article.meta.category}
            </span>
          </div>

          {/* Research Header */}
          <header className="p-4 rounded border border-border bg-surface space-y-3">
            <div className="flex items-center gap-2">
              <Microscope className="w-5 h-5 text-accent" />
              <h1 className="text-xl font-bold tracking-tight text-text-primary">
                {article.meta.title}
              </h1>
            </div>

            <p className="text-sm text-text-secondary leading-relaxed font-sans">
              {article.meta.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary pt-2 border-t border-border/60">
              {article.meta.date && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-text-secondary" />
                  <span>{article.meta.date}</span>
                </div>
              )}
              {article.meta.readingTime && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-accent" />
                  <span>{article.meta.readingTime} min read</span>
                </div>
              )}

              {article.meta.tags && article.meta.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-text-secondary/60 shrink-0" />
                  {article.meta.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-surface-2 border border-border/70 text-text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </header>

          {/* Document Content */}
          <div className="pt-2">
            {article.body ? (
              <DocumentContent document={article.body as unknown as Parameters<typeof DocumentContent>[0]["document"]} />
            ) : (
              <StayTuned
                sector={`Research · ${article.meta.title}`}
                category={article.meta.category}
                returnUrl="/research"
                returnLabel="Back to Research"
              />
            )}
          </div>

          {/* Footer Back Link */}
          <div className="pt-8 border-t border-border flex flex-wrap justify-between items-center gap-2 text-xs">
            <Link
              href="/research"
              className="text-text-secondary hover:text-accent flex items-center gap-1.5 shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Research</span>
            </Link>
            <span className="text-text-secondary text-[11px] font-mono">
              research: {article.meta.slug}
            </span>
          </div>
        </article>
      </KnowledgeBaseLayout>
    );
  }

  // If slug is the category "security-research"
  if (slug === "security-research") {
    const allResearch = await getArticles("research");
    const label = "Security Research";

    return (
      <KnowledgeBaseLayout>
        <div className="space-y-8 font-mono">
          {/* Navigation & Breadcrumb */}
          <header className="space-y-2 border-b border-border pb-4">
            <div className="text-xs text-text-secondary flex items-center gap-1.5 min-w-0 flex-wrap">
              <Link href="/research" className="hover:text-accent flex items-center gap-1 shrink-0">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>research</span>
              </Link>
              <span className="shrink-0">/</span>
              <span className="text-text-primary font-semibold break-all">{slug}</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h1 className="text-xl font-bold tracking-tight text-text-primary uppercase flex items-center gap-2 min-w-0">
                <FlaskConical className="w-5 h-5 text-accent shrink-0" />
                <span className="truncate">{label}</span>
              </h1>
              <span className="text-xs text-text-secondary whitespace-nowrap shrink-0">
                [{allResearch.length} articles]
              </span>
            </div>
          </header>

          {allResearch.length === 0 ? (
            <StayTuned
              sector={`Research · ${label}`}
              category={slug}
              description="Security vulnerability research, protocol analysis, and lab studies are currently undergoing validation and review."
              returnUrl="/research"
              returnLabel="Back to Research"
            />
          ) : (
            <div className="space-y-3">
              {allResearch.map((item) => (
                <article
                  key={item.slug}
                  className="p-4 rounded border border-border bg-surface hover:border-accent/40 transition-colors group space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-text-secondary">
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-surface-2 border border-border font-semibold text-text-primary">
                      {item.category}
                    </span>
                    {item.date && <span>{item.date}</span>}
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
                </article>
              ))}
            </div>
          )}
        </div>
      </KnowledgeBaseLayout>
    );
  }

  notFound();
}
