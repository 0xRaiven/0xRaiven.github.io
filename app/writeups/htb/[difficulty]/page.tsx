import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { KnowledgeBaseLayout } from "@/components/layout/KnowledgeBaseLayout";
import { getArticles } from "@/lib/articles";
import { StayTuned } from "@/components/content/StayTuned";
import { ArrowLeft, ArrowRight, Box, Shield, Terminal, Zap, Skull, Calendar, Clock } from "lucide-react";
import { ScrambleText } from "@/components/animation/ScrambleText";

const VALID_DIFFICULTIES = ["low", "medium", "hard", "insane"] as const;
type Difficulty = (typeof VALID_DIFFICULTIES)[number];

interface DifficultyPageProps {
  params: Promise<{ difficulty: string }>;
}

const TIER_META: Record<
  Difficulty,
  {
    title: string;
    badge: string;
    badgeClass: string;
    colorClass: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
  }
> = {
  low: {
    title: "Low Difficulty",
    badge: "LOW / EASY",
    badgeClass: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
    colorClass: "text-emerald-400",
    icon: Shield,
    description:
      "Reconnaissance fundamentals, common CVE exploitation, default configurations, and foundational Linux/Windows privilege escalation vectors.",
  },
  medium: {
    title: "Medium Difficulty",
    badge: "MEDIUM",
    badgeClass: "bg-amber-500/15 border-amber-500/30 text-amber-400",
    colorClass: "text-amber-400",
    icon: Zap,
    description:
      "Multi-step attack paths, web application vulnerabilities, network pivoting, and Active Directory initial footholds.",
  },
  hard: {
    title: "Hard Difficulty",
    badge: "HARD",
    badgeClass: "bg-rose-500/15 border-rose-500/30 text-rose-400",
    colorClass: "text-rose-400",
    icon: Terminal,
    description:
      "Chained exploits, source code review, binary reverse engineering, and domain privilege escalation.",
  },
  insane: {
    title: "Insane Difficulty",
    badge: "INSANE",
    badgeClass: "bg-purple-500/15 border-purple-500/30 text-purple-400",
    colorClass: "text-purple-400",
    icon: Skull,
    description:
      "Complex cryptography, advanced exploitation techniques, and multi-forest Active Directory environments.",
  },
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return VALID_DIFFICULTIES.map((difficulty) => ({ difficulty }));
}

export async function generateMetadata({ params }: DifficultyPageProps): Promise<Metadata> {
  const { difficulty } = await params;
  if (!VALID_DIFFICULTIES.includes(difficulty as Difficulty)) {
    return { title: "Not Found" };
  }

  const meta = TIER_META[difficulty as Difficulty];
  return {
    title: `HTB ${meta.title} Machines`,
    description: meta.description,
  };
}

export default async function HTBDifficultyPage({ params }: DifficultyPageProps) {
  const { difficulty } = await params;

  if (!VALID_DIFFICULTIES.includes(difficulty as Difficulty)) {
    notFound();
  }

  const tier = TIER_META[difficulty as Difficulty];
  const TierIcon = tier.icon;

  const allWriteups = await getArticles("writeup");
  const matchingWriteups = allWriteups.filter((w) => {
    const isHtb =
      Boolean(w.htbDifficulty) ||
      w.category === "htb" ||
      w.category?.startsWith("htb-") ||
      w.tags?.some((t) => t.toLowerCase() === "htb");

    if (!isHtb) return false;

    const matchesDiff =
      w.htbDifficulty === difficulty ||
      w.category === `htb-${difficulty}` ||
      w.tags?.some((t) => t.toLowerCase() === difficulty || (difficulty === "low" && t.toLowerCase() === "easy"));

    return matchesDiff;
  });

  const otherTiers = VALID_DIFFICULTIES.filter((d) => d !== difficulty).map((d) => ({
    title: `HTB ${TIER_META[d].title}`,
    href: `/writeups/htb/${d}`,
    category: "htb",
  }));

  return (
    <KnowledgeBaseLayout relatedItems={otherTiers}>
      <div className="space-y-8 font-mono">
        {/* Navigation & Breadcrumb */}
        <header className="space-y-3 border-b border-border pb-5">
          <div className="text-xs text-text-secondary flex items-center gap-1.5">
            <Link href="/writeups" className="hover:text-accent flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>writeups</span>
            </Link>
            <span>/</span>
            <Link href="/writeups/htb" className="hover:text-accent transition-colors">
              htb
            </Link>
            <span>/</span>
            <span className="text-text-primary">{difficulty}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary uppercase flex items-center gap-2">
              <TierIcon className={`w-6 h-6 ${tier.colorClass}`} />
              <ScrambleText text={`HTB ${tier.title} Machines`} as="span" />
            </h1>
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${tier.badgeClass}`}>
              {tier.badge}
            </span>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed font-sans max-w-2xl">
            {tier.description}
          </p>

          {/* Quick Filter Bar for other tiers */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 text-xs">
            <span className="text-[10px] uppercase tracking-wider text-text-secondary mr-1 font-semibold">
              Tiers:
            </span>
            {VALID_DIFFICULTIES.map((d) => {
              const isCurrent = d === difficulty;
              return (
                <Link
                  key={d}
                  href={`/writeups/htb/${d}`}
                  className={`px-2.5 py-1 rounded text-[11px] uppercase transition-all ${
                    isCurrent
                      ? `${TIER_META[d].badgeClass} font-bold shadow-xs`
                      : "border border-border bg-surface hover:bg-surface-2 text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {d}
                </Link>
              );
            })}
          </div>
        </header>

        {/* Machine Writeups */}
        {matchingWriteups.length === 0 ? (
          <StayTuned
            sector={`Writeups · HTB ${tier.title}`}
            category={`htb-${difficulty}`}
            description={`No published writeups currently exist in the ${tier.title} HTB tier. Machine walkthroughs are actively being prepared following retired machine disclosure guidelines.`}
            returnUrl="/writeups/htb"
            returnLabel="Back to All HTB Tiers"
          />
        ) : (
          <section className="space-y-3">
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span>
                {matchingWriteups.length} {matchingWriteups.length === 1 ? "Machine" : "Machines"} in {tier.title}
              </span>
            </div>

            <div className="space-y-3">
              {matchingWriteups.map((machine) => (
                <article
                  key={machine.slug}
                  className="group p-4 rounded-lg border border-border bg-surface hover:border-accent/50 hover:bg-surface-2 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <Link
                      href={`/writeups/${machine.slug}`}
                      className="font-bold text-base text-text-primary group-hover:text-accent transition-colors flex items-center gap-2"
                    >
                      <Box className="w-4 h-4 text-accent shrink-0" />
                      <span>{machine.title}</span>
                    </Link>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${tier.badgeClass}`}>
                        {tier.badge}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-text-secondary font-sans leading-relaxed">
                    {machine.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-text-secondary pt-2 border-t border-border/50 font-mono">
                    <div className="flex items-center gap-4">
                      {machine.date && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-text-secondary" />
                          <span>{machine.date}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-accent" />
                        <span>{machine.readingTime}m read</span>
                      </div>
                    </div>

                    <Link
                      href={`/writeups/${machine.slug}`}
                      className="inline-flex items-center gap-1 text-accent hover:underline font-semibold"
                    >
                      <span>Read Writeup</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </KnowledgeBaseLayout>
  );
}
