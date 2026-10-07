import React from "react";
import Link from "next/link";
import { KnowledgeBaseLayout } from "@/components/layout/KnowledgeBaseLayout";
import { TerminalBlock } from "@/components/content/TerminalBlock";
import { FileText, ArrowUpRight, FolderGit2, Shield, Terminal, Layers, ArrowRight } from "lucide-react";
import { ScrambleText } from "@/components/animation/ScrambleText";
import { RelatedItem } from "@/types";
import { getProjects } from "@/lib/projects";

export default async function Home() {
  const projects = await getProjects();

  const cyberSlugs = ["persisthunt", "phishguard", "owt-bandit"];
  const pinnedProjects = cyberSlugs
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is (typeof projects)[0] => Boolean(p));

  const pinnedRelated: RelatedItem[] = pinnedProjects.map((p) => ({
    title: p.title,
    href: `/projects/${p.slug}`,
    category: p.category,
  }));

  return (
    <KnowledgeBaseLayout relatedItems={pinnedRelated}>
      <article className="space-y-10 text-text-primary">
        {/* Document Header (Technical README) */}
        <header className="border-b border-border pb-6 space-y-4">
          <div className="flex items-center gap-2 text-xs text-text-secondary font-mono">
            <FileText className="w-3.5 h-3.5 text-accent" />
            <span>~/0xraiven/README.md</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
            {/* GitHub Profile Picture - Circular Cyber Badge */}
            <div className="relative group shrink-0 p-1 w-fit self-start sm:self-auto">
              <div className="relative p-1 rounded-full border border-border/80 bg-surface-2 transition-all duration-300 group-hover:border-accent/60 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-accent/40 bg-surface transition-all duration-300 group-hover:border-accent shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://github.com/0xraiven.png"
                    alt="0xraiven profile"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </div>
              <span
                className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-bg shadow-sm z-10"
                title="Status: Active"
              >
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-70" />
              </span>
            </div>

            {/* Profile Info */}
            <div className="space-y-1">
              <ScrambleText
                text="r41n"
                as="h1"
                className="text-2xl sm:text-3xl font-bold tracking-tight font-mono text-text-primary"
              />

              <p className="text-sm font-sans text-text-primary font-medium">
                Computer Science Engineering Student
              </p>

              <p className="text-xs text-text-secondary font-mono">
                Offensive Security · Red Team · Cloud Security
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono pt-1">
            <a
              href="https://github.com/0xraiven"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-border bg-surface hover:bg-surface-2 text-text-primary hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              <span>github.com/0xraiven</span>
              <ArrowUpRight className="w-3 h-3 text-text-secondary" />
            </a>

            <a
              href="https://x.com/0xraiven"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-border bg-surface hover:bg-surface-2 text-text-primary hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              <span>x.com/0xraiven</span>
              <ArrowUpRight className="w-3 h-3 text-text-secondary" />
            </a>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-border bg-surface text-text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Available</span>
            </span>
          </div>
        </header>

        {/* Section 1: Technical Profile */}
        <section id="technical-profile" className="space-y-3">
          <h2 id="technical-profile" className="text-base font-semibold tracking-tight font-mono text-text-primary flex items-center gap-2 border-b border-border pb-2">
            <Terminal className="w-4 h-4 text-accent" />
            <ScrambleText text="Background & Focus" as="span" />
          </h2>

          <p className="text-xs text-text-secondary font-mono">
            System configuration and primary focus areas:
          </p>

          <TerminalBlock
            title="r41n.conf — /etc/profile"
            interactive={true}
          />
        </section>

        {/* Section 2: Repository Index */}
        <section id="repository-index" className="space-y-4">
          <h2 className="text-base font-semibold tracking-tight font-mono text-text-primary flex items-center gap-2 border-b border-border pb-2">
            <FolderGit2 className="w-4 h-4 text-accent" />
            <ScrambleText text="Site Index" as="span" />
          </h2>

          <p className="text-xs text-text-secondary font-mono">
            Overview of writeups, repositories, notes, and research:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono border border-border rounded">
              <thead>
                <tr className="bg-surface-2 border-b border-border text-text-secondary text-left">
                  <th className="py-2 px-3 font-semibold">Section</th>
                  <th className="py-2 px-3 font-semibold">Category</th>
                  <th className="py-2 px-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                <tr className="hover:bg-surface-2/60 transition-colors">
                  <td className="py-2 px-3">
                    <Link href="/projects" className="text-accent hover:underline">
                      /projects
                    </Link>
                  </td>
                  <td className="py-2 px-3 text-text-secondary">Engineering</td>
                  <td className="py-2 px-3 text-text-primary">
                    Security tools, defensive monitoring, and lab architectures
                  </td>
                </tr>
                <tr className="hover:bg-surface-2/60 transition-colors">
                  <td className="py-2 px-3">
                    <Link href="/writeups" className="text-accent hover:underline">
                      /writeups
                    </Link>
                  </td>
                  <td className="py-2 px-3 text-text-secondary">Walkthroughs</td>
                  <td className="py-2 px-3 text-text-primary">
                    In-depth attack path walkthroughs, lab investigations, and CTF analyses
                  </td>
                </tr>
                <tr className="hover:bg-surface-2/60 transition-colors">
                  <td className="py-2 px-3">
                    <Link href="/notes" className="text-accent hover:underline">
                      /notes
                    </Link>
                  </td>
                  <td className="py-2 px-3 text-text-secondary">Reference</td>
                  <td className="py-2 px-3 text-text-primary">
                    Concise command cheatsheets, syntax references, and runbooks
                  </td>
                </tr>
                <tr className="hover:bg-surface-2/60 transition-colors">
                  <td className="py-2 px-3">
                    <Link href="/research" className="text-accent hover:underline">
                      /research
                    </Link>
                  </td>
                  <td className="py-2 px-3 text-text-secondary">Research</td>
                  <td className="py-2 px-3 text-text-primary">
                    Security vulnerability research, threat modeling, and exploit analysis
                  </td>
                </tr>
                <tr className="hover:bg-surface-2/60 transition-colors">
                  <td className="py-2 px-3">
                    <Link href="/about" className="text-accent hover:underline">
                      /about
                    </Link>
                  </td>
                  <td className="py-2 px-3 text-text-secondary">Profile</td>
                  <td className="py-2 px-3 text-text-primary">
                    Background overview, technical focus, and experience
                  </td>
                </tr>
                <tr className="hover:bg-surface-2/60 transition-colors">
                  <td className="py-2 px-3">
                    <Link href="/contact" className="text-accent hover:underline">
                      /contact
                    </Link>
                  </td>
                  <td className="py-2 px-3 text-text-secondary">Contact</td>
                  <td className="py-2 px-3 text-text-primary">
                    Email, verified social links, and secure communication channels
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Featured Projects */}
        <section id="featured-projects" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2">
            <h2 className="text-base font-semibold tracking-tight font-mono text-text-primary flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent shrink-0" />
              <ScrambleText text="Featured Projects" as="span" />
            </h2>
            <Link
              href="/projects"
              className="text-xs font-mono text-accent hover:underline flex items-center gap-1 shrink-0"
            >
              <span>View all ({projects.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <p className="text-xs text-text-secondary font-mono">
            Featured security tools, engineering projects, and software repositories:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
            {pinnedProjects.map((project, pIdx) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className={`p-3.5 rounded border border-border bg-surface space-y-2 hover:border-accent/40 transition-all hover:-translate-y-0.5 shadow-sm block group animate-page-reveal stagger-${pIdx + 1}`}
              >
                <div className="flex items-center justify-between text-text-secondary">
                  <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-surface-2 border border-border font-semibold">
                    {project.category}
                  </span>
                  <span
                    className={`text-[11px] font-semibold ${project.status === "active"
                      ? "text-emerald-400"
                      : project.status === "building"
                        ? "text-amber-400"
                        : "text-text-secondary"
                      }`}
                  >
                    {project.status}
                  </span>
                </div>
                <h3 className="font-semibold text-text-primary text-sm group-hover:text-accent transition-colors flex items-center justify-between">
                  <span>{project.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-text-secondary text-[11px] leading-relaxed line-clamp-2">
                  {project.description}
                </p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {project.technologies.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="text-[9px] px-1 py-0.5 rounded bg-surface-2 text-text-secondary border border-border/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* Section 4: Operational Philosophy */}
        <section id="operational-philosophy" className="space-y-4">
          <h2 className="text-base font-semibold tracking-tight font-mono text-text-primary flex items-center gap-2 border-b border-border pb-2">
            <Shield className="w-4 h-4 text-accent" />
            <ScrambleText text="Guiding Principles" as="span" />
          </h2>

          <div className="space-y-2 text-xs font-mono text-text-secondary leading-relaxed">
            <div className="p-3 rounded border border-border bg-surface space-y-1">
              <div className="text-text-primary font-semibold">1. Proof of Work Over Claims</div>
              <p>
                Capabilities are proven through reproducible lab walk-throughs, custom scripts, and architectural teardowns rather than lists of buzzwords or credentials.
              </p>
            </div>

            <div className="p-3 rounded border border-border bg-surface space-y-1">
              <div className="text-text-primary font-semibold">2. Documentation-First Architecture</div>
              <p>
                Designed as a high-density, fast-loading personal wiki and notebook. Clean typography, dark mode by default, keyboard-friendly navigation, and zero marketing clutter.
              </p>
            </div>

            <div className="p-3 rounded border border-border bg-surface space-y-1">
              <div className="text-text-primary font-semibold">3. Code-Free Publishing</div>
              <p>
                Content remains separate from presentation. All knowledge base entries are file-backed Markdown/MDX documents rendered statically without runtime overhead.
              </p>
            </div>
          </div>
        </section>
      </article>
    </KnowledgeBaseLayout>
  );
}
