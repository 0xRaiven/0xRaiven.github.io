import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { KnowledgeBaseLayout } from '@/components/layout/KnowledgeBaseLayout';
import { getProjects } from '@/lib/projects';
import {
  FolderGit2,
  Star,
  GitFork,
  ArrowRight,
} from 'lucide-react';
import { ScrambleText } from '@/components/animation/ScrambleText';

export const metadata: Metadata = {
  title: 'Projects // r41n',
  description: 'Open source tools, security software, detection frameworks, and personal projects.',
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  const statusStyles = {
    active: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    building: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    archived: 'text-text-secondary bg-surface-2 border-border',
    planned: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  };

  const quickNavItems = projects.slice(0, 5).map((p) => ({
    title: p.title,
    href: `/projects/${p.slug}`,
    category: p.category,
  }));

  return (
    <KnowledgeBaseLayout relatedItems={quickNavItems}>
      <div className="space-y-8 font-mono">
        {/* Header Breadcrumb & Identity */}
        <header className="space-y-2 border-b border-border pb-4">
          <div className="text-xs text-text-secondary flex items-center gap-1.5">
            <span className="text-accent">~</span>
            <span>/</span>
            <span className="text-text-primary">projects</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <ScrambleText
              text="Projects & Tools"
              as="h1"
              className="text-xl font-bold tracking-tight text-text-primary uppercase"
            />
            <span className="text-xs text-text-secondary">
              [{projects.length} projects loaded]
            </span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Security tooling, persistence analyzers, detection models, and system utilities. Backed by source code on GitHub.
          </p>
        </header>

        {/* Projects Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => {
            const pillStyle =
              statusStyles[project.status as keyof typeof statusStyles] || statusStyles.active;

            return (
              <div
                key={project.slug}
                className="p-4 rounded border border-border bg-surface flex flex-col justify-between space-y-3 hover:border-accent/40 transition-colors group"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-surface-2 border border-border text-text-secondary font-semibold whitespace-nowrap">
                      {project.category}
                    </span>
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border font-semibold whitespace-nowrap ${pillStyle}`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <div>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors flex items-center gap-1.5"
                    >
                      <span>{project.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed mt-1">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-border/60">
                  {/* Tech stack tags */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-surface-2/60 border border-border/70 text-text-secondary"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="text-[10px] px-1.5 py-0.5 text-text-secondary">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Telemetry & Links */}
                  <div className="flex items-center justify-between text-[11px] text-text-secondary pt-1">
                    <div className="flex items-center gap-3">
                      {project.githubData && (
                        <>
                          <span className="flex items-center gap-1 hover:text-text-primary">
                            <Star className="w-3 h-3 text-amber-400" />
                            <span>{project.githubData.stars}</span>
                          </span>
                          <span className="flex items-center gap-1 hover:text-text-primary">
                            <GitFork className="w-3 h-3 text-text-secondary" />
                            <span>{project.githubData.forks}</span>
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-accent flex items-center gap-1 transition-colors"
                          title="Open GitHub Repository"
                        >
                          <FolderGit2 className="w-3.5 h-3.5" />
                          <span>repo</span>
                        </a>
                      )}
                      <Link
                        href={`/projects/${project.slug}`}
                        className="text-accent hover:underline flex items-center gap-1"
                      >
                        <span>view</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </KnowledgeBaseLayout>
  );
}
