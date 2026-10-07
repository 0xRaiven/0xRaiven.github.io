import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { KnowledgeBaseLayout } from "@/components/layout/KnowledgeBaseLayout";
import { DocumentContent } from "@/components/content/DocumentRenderer";
import { StayTuned } from "@/components/content/StayTuned";
import { getArticleBySlug, getArticles } from "@/lib/articles";
import { ArrowLeft, ArrowRight, Calendar, Clock, Tag, ShieldAlert } from "lucide-react";

interface WriteupPageProps {
  params: Promise<{ slug: string }>;
}

function formatCategoryLabel(slug: string): string {
  if (slug.toLowerCase() === "ctf") return "CTF";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: WriteupPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug("writeups", slug);

  if (article) {
    return {
      title: `${article.meta.title} // r41n`,
      description: article.meta.description || "Security writeup and technical walkthrough.",
    };
  }

  const categoryLabel = formatCategoryLabel(slug);
  return {
    title: `${categoryLabel} Writeups // r41n`,
    description: `Security writeups, challenge breakdowns, and lab notes for ${categoryLabel}.`,
  };
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const writeups = await getArticles("writeup");
  const slugs = new Set(writeups.map((w) => w.slug));

  const sidebarCategories = [
    "web-security",
    "linux",
    "active-directory",
    "cloud-security",
    "detection-engineering",
    "red-team",
    "ctf",
  ];
  sidebarCategories.forEach((c) => slugs.add(c));

  return Array.from(slugs).map((slug) => ({ slug }));
}

export default async function WriteupDetailPage({ params }: WriteupPageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug("writeups", slug);

  // If specific article was found with content
  if (article) {
    const allWriteups = await getArticles("writeup");
    const relatedItems = allWriteups
      .filter((w) => w.slug !== article.meta.slug)
      .slice(0, 3)
      .map((w) => ({
        title: w.title,
        href: `/writeups/${w.slug}`,
        category: w.category,
        readingTime: `${w.readingTime}m read`,
      }));

    return (
      <KnowledgeBaseLayout relatedItems={relatedItems}>
        <article className="space-y-6 font-mono">
          {/* Navigation & Breadcrumb */}
          <div className="flex flex-wrap items-center justify-between gap-y-2.5 gap-x-3 text-xs text-text-secondary border-b border-border pb-3">
            <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
              <Link href="/writeups" className="hover:text-accent flex items-center gap-1 shrink-0">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>writeups</span>
              </Link>
              <span className="shrink-0">/</span>
              <span className="text-text-primary font-semibold break-all">{article.meta.slug}</span>
            </div>

            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-surface-2 border border-border text-text-primary font-semibold whitespace-nowrap shrink-0">
              {article.meta.category}
            </span>
          </div>

          {/* Article Header */}
          <header className="p-4 rounded border border-border bg-surface space-y-3">
            <h1 className="text-xl font-bold tracking-tight text-text-primary">
              {article.meta.title}
            </h1>

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
                      className="text-[10px] px-1.5 py-0.5 rounded bg-surface-2 border border-border/70 text-text-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </header>

          {/* Document Content Rendered from body.mdoc */}
          <div className="pt-2">
            {article.body ? (
              <DocumentContent document={article.body as unknown as Parameters<typeof DocumentContent>[0]["document"]} />
            ) : (
              <StayTuned
                sector={`Writeups // ${article.meta.title}`}
                category={article.meta.category}
                returnUrl="/writeups"
                returnLabel="Back to Writeups"
              />
            )}
          </div>

          {/* Footer Back Link */}
          <div className="pt-8 border-t border-border flex flex-wrap justify-between items-center gap-2 text-xs">
            <Link
              href="/writeups"
              className="text-text-secondary hover:text-accent flex items-center gap-1.5 shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Writeups</span>
            </Link>
            <span className="text-text-secondary text-[11px] font-mono">
              writeup: {article.meta.slug}
            </span>
          </div>
        </article>
      </KnowledgeBaseLayout>
    );
  }

  // If slug is a category or an empty route: check if articles exist in that category
  const allWriteups = await getArticles("writeup");
  const categoryArticles = allWriteups.filter((w) => w.category === slug);
  const categoryLabel = formatCategoryLabel(slug);

  return (
    <KnowledgeBaseLayout>
      <div className="space-y-8 font-mono">
        {/* Navigation & Breadcrumb */}
        <header className="space-y-2 border-b border-border pb-4">
          <div className="text-xs text-text-secondary flex items-center gap-1.5 min-w-0 flex-wrap">
            <Link href="/writeups" className="hover:text-accent flex items-center gap-1 shrink-0">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>writeups</span>
            </Link>
            <span className="shrink-0">/</span>
            <span className="text-text-primary font-semibold break-all">{slug}</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-xl font-bold tracking-tight text-text-primary uppercase flex items-center gap-2 min-w-0">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
              <span className="truncate">{categoryLabel} Writeups</span>
            </h1>
            <span className="text-xs text-text-secondary whitespace-nowrap shrink-0">
              [{categoryArticles.length} writeups]
            </span>
          </div>
        </header>

        {categoryArticles.length === 0 ? (
          <StayTuned
            sector={`Writeups // ${categoryLabel}`}
            category={slug}
            description={`No published writeups currently exist in the ${categoryLabel} category. Walkthroughs and lab notes are actively being prepared.`}
            returnUrl="/writeups"
            returnLabel="Back to Writeups"
          />
        ) : (
          <div className="space-y-3">
            {categoryArticles.map((item) => (
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
                    href={`/writeups/${item.slug}`}
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
