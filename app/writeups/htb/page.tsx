import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { KnowledgeBaseLayout } from "@/components/layout/KnowledgeBaseLayout";
import { getArticles } from "@/lib/articles";
import { StayTuned } from "@/components/content/StayTuned";
import { ArrowLeft, ArrowRight, Box, Shield, Terminal, Zap, Skull, Layers } from "lucide-react";
import { ScrambleText } from "@/components/animation/ScrambleText";

export const metadata: Metadata = {
  title: "HTB Writeups",
  description: "Hack The Box machine walkthroughs, initial access footholds, and privilege escalation notes across all difficulty tiers.",
};

interface DifficultyTier {
  id: "low" | "medium" | "hard" | "insane";
  title: "Low" | "Medium" | "Hard" | "Insane";
  href: string;
  badge: string;
  colorClass: string;
  borderClass: string;
  badgeClass: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const HTB_TIERS: DifficultyTier[] = [
  {
    id: "low",
    title: "Low",
    href: "/writeups/htb/low",
    badge: "LOW / EASY",
    colorClass: "text-emerald-400",
    borderClass: "border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-500/5",
    badgeClass: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
    icon: Shield,
    description: "Reconnaissance fundamentals, common CVE exploitation, misconfigurations, and standard Linux/Windows privilege escalation.",
  },
  {
    id: "medium",
    title: "Medium",
    href: "/writeups/htb/medium",
    badge: "MEDIUM",
    colorClass: "text-amber-400",
    borderClass: "border-amber-500/30 hover:border-amber-500/60 bg-amber-500/5",
    badgeClass: "bg-amber-500/15 border-amber-500/30 text-amber-400",
    icon: Zap,
    description: "Multi-step attack paths, custom web app exploits, network pivoting, and Active Directory initial footholds.",
  },
  {
    id: "hard",
    title: "Hard",
    href: "/writeups/htb/hard",
    badge: "HARD",
    colorClass: "text-rose-400",
    borderClass: "border-rose-500/30 hover:border-rose-500/60 bg-rose-500/5",
    badgeClass: "bg-rose-500/15 border-rose-500/30 text-rose-400",
    icon: Terminal,
    description: "Chained exploits, source code review, binary reverse engineering, and domain privilege escalation.",
  },
  {
    id: "insane",
    title: "Insane",
    href: "/writeups/htb/insane",
    badge: "INSANE",
    colorClass: "text-purple-400",
    borderClass: "border-purple-500/30 hover:border-purple-500/60 bg-purple-500/5",
    badgeClass: "bg-purple-500/15 border-purple-500/30 text-purple-400",
    icon: Skull,
    description: "Complex cryptography, advanced exploitation techniques, and multi-forest Active Directory environments.",
  },
];

export default async function HTBOverviewPage() {
  const allWriteups = await getArticles("writeup");
  const htbWriteups = allWriteups.filter(
    (w) =>
      Boolean(w.htbDifficulty) ||
      w.category === "htb" ||
      w.category?.startsWith("htb-") ||
      w.tags?.some((t) => t.toLowerCase() === "htb")
  );

  const quickNav = HTB_TIERS.map((tier) => ({
    title: `HTB ${tier.title}`,
    href: tier.href,
    category: "htb",
  }));

  return (
    <KnowledgeBaseLayout relatedItems={quickNav}>
      <div className="space-y-8 font-mono">
        {/* Navigation & Breadcrumb */}
        <header className="space-y-3 border-b border-border pb-5">
          <div className="text-xs text-text-secondary flex items-center gap-1.5">
            <Link href="/writeups" className="hover:text-accent flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>writeups</span>
            </Link>
            <span>/</span>
            <span className="text-text-primary">htb</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary uppercase flex items-center gap-2">
              <Box className="w-6 h-6 text-accent" />
              <ScrambleText text="Hack The Box Writeups" as="span" />
            </h1>
            <span className="text-xs text-text-secondary">
              [{htbWriteups.length} writeups published]
            </span>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed font-sans max-w-2xl">
            Walkthroughs, initial access footholds, and privilege escalation notes for retired Hack The Box machines categorized by difficulty tier.
          </p>
        </header>

        {/* Difficulty Tiers Grid */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-text-secondary font-semibold">
            <Layers className="w-4 h-4 text-accent" />
            <span>Difficulty Tiers</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {HTB_TIERS.map((tier) => {
              const TierIcon = tier.icon;
              const count = htbWriteups.filter(
                (w) =>
                  w.category === `htb-${tier.id}` ||
                  w.tags?.some((t) => t.toLowerCase() === tier.id)
              ).length;

              return (
                <Link
                  key={tier.id}
                  href={tier.href}
                  className={`group p-4 rounded-lg border transition-all duration-200 flex flex-col justify-between space-y-3 ${tier.borderClass}`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TierIcon className={`w-4 h-4 ${tier.colorClass}`} />
                        <span className="font-bold text-text-primary text-sm group-hover:text-accent transition-colors">
                          {tier.title} Machines
                        </span>
                      </div>
                      <span
                        className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${tier.badgeClass}`}
                      >
                        {tier.badge}
                      </span>
                    </div>

                    <p className="text-[11px] text-text-secondary font-sans leading-relaxed">
                      {tier.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-text-secondary pt-2 border-t border-border/40 font-mono">
                    <span className="text-[11px]">
                      {count} {count === 1 ? "machine" : "machines"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-accent text-xs group-hover:translate-x-0.5 transition-transform">
                      <span>Browse Tier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Published Writeups List */}
        {htbWriteups.length === 0 ? (
          <StayTuned
            sector="Writeups · Hack The Box"
            category="htb-machines"
            description="Hack The Box machine writeups are actively being prepared in accordance with HTB disclosure rules for retired machines. Check back soon for walkthroughs."
            returnUrl="/writeups"
            returnLabel="Back to All Writeups"
          />
        ) : (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
              All HTB Writeups
            </h2>
            <div className="space-y-2">
              {htbWriteups.map((item) => (
                <Link
                  key={item.slug}
                  href={`/writeups/${item.slug}`}
                  className="group block p-4 rounded border border-border bg-surface hover:border-accent/50 hover:bg-surface-2 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-text-primary group-hover:text-accent transition-colors">
                      {item.title}
                    </span>
                    <span className="text-xs text-text-secondary">
                      {item.readingTime}m read
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary font-sans line-clamp-2">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </KnowledgeBaseLayout>
  );
}
