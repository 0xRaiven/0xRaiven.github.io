import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { KnowledgeBaseLayout } from "@/components/layout/KnowledgeBaseLayout";
import { DocumentContent } from "@/components/content/DocumentRenderer";
import { reader } from "@/lib/keystatic-reader";
import {
  Shield,
  Terminal,
  ArrowRight,
  FileText,
  Workflow,
  Server,
  Code2,
  CheckCircle2,
  Compass,
  BookOpen,
  Layers,
  Cpu,
  GitBranch,
  ExternalLink,
} from "lucide-react";
import { ScrambleText } from "@/components/animation/ScrambleText";

export const metadata: Metadata = {
  title: "About // r41n",
  description: "Background overview, technical focus, research areas, and engineering approach.",
};

export default async function AboutPage() {
  const about = await reader.singletons.about.read();
  const body = about ? await about.body() : null;

  const technicalFocus = [
    { name: "Web Security", desc: "Manual OWASP Top 10 exploitation, payload crafting, root cause analysis" },
    { name: "Linux Security", desc: "Internals, process lifecycle, permissions, endpoint telemetry, auditing" },
    { name: "Windows / Active Directory", desc: "AD architecture, domain enumeration, attack paths, credential defense" },
    { name: "Offensive Security", desc: "Controlled exploitation, privilege escalation, persistence, adversary emulation" },
    { name: "Detection Engineering", desc: "Wazuh FIM/SCA, auditd event rules, process genealogy, attack-to-detection" },
    { name: "Cloud Security", desc: "AWS IAM least-privilege scoping, cloud attack surfaces, misconfiguration analysis" },
    { name: "Security Automation", desc: "Custom Python/TypeScript tooling, repeatable assessment workflows" },
  ];

  const selectedWork = [
    {
      name: "Persistence Hunter",
      type: "Endpoint Security Tooling",
      status: "In Progress",
      desc: "Defensive and endpoint security tool focused on identifying persistence mechanisms across operating systems.",
      href: "/projects/persisthunt",
      githubUrl: "https://github.com/0xraiven/persistHunt",
    },
    {
      name: "PhishGuard",
      type: "Open Source // Browser Security",
      status: "In Progress",
      desc: "Privacy-first ML phishing detection extension (Chrome MV3, Edge) & Flask backend evaluating Random Forest/CNN with explainability (Apache 2.0).",
      href: "/projects/phishguard",
      githubUrl: "https://github.com/0xraiven/phishGuard",
    },
    {
      name: "OWT Bandit",
      type: "Linux Security Fundamentals",
      status: "Active",
      desc: "Hands-on Linux command-line security exercises, shell scripting, permission escalation analysis, and terminal problem solving.",
      href: "/projects/owt-bandit",
      githubUrl: "https://github.com/0xraiven/OWT-bandit",
    },
  ];

  const practicalWork = [
    {
      title: "OverTheWire — Bandit",
      badge: "Levels 0 → 33 Completed",
      desc: "Practical foundational training covering Linux CLI navigation, multi-tier filesystem permissions, SSH configurations, shell pipes, process inspection, and text processing.",
    },
    {
      title: "DVWA (Damn Vulnerable Web Application)",
      badge: "Manual OWASP Top 10",
      desc: "Manual exploitation against intentionally vulnerable web application behaviors: SQL Injection, XSS, CSRF, Command Injection, File Inclusion, File Upload, and Broken Authentication.",
    },
    {
      title: "PortSwigger Web Security Academy",
      badge: "Hands-on Labs Completed",
      desc: "Practiced manual vulnerability exploitation: Path Traversal, Unprotected Admin Functionality, Cookie Tampering, Privilege Escalation, Authentication Vulnerabilities, and Basic SSRF.",
    },
    {
      title: "Controlled Security Tooling",
      badge: "Security Utilities",
      desc: "Hands-on usage of Burp Suite, Wazuh (Manager, Indexer, Dashboard, Agent), Auditd, Kali Linux, and Metasploitable in dedicated lab environments.",
    },
  ];

  const workflowSteps = [
    { step: "BUILD", desc: "Deploy repeatable environments, services, and software architectures." },
    { step: "BREAK", desc: "Perform controlled manual exploitation to identify attack vectors and system failure modes." },
    { step: "OBSERVE", desc: "Capture endpoint activity, process lineage, system calls, and network traffic." },
    { step: "DETECT", desc: "Ingest telemetry into detection platforms (Wazuh, auditd) and author tuned rules." },
    { step: "DOCUMENT", desc: "Record root causes, reproduction steps, and defensive implications." },
    { step: "IMPROVE", desc: "Harden configurations, remediate vulnerabilities, and automate repeatable checks." },
  ];

  const learningProgression = [
    "Linux / Systems",
    "Networking",
    "Web Security",
    "Privilege Escalation",
    "Security Tooling",
    "Offensive Security",
    "Detection Engineering",
    "Windows / AD",
    "Cloud Security",
  ];

  return (
    <KnowledgeBaseLayout>
      <article className="space-y-8">
        {/* Navigation & Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-3 text-xs text-text-secondary border-b border-border pb-3 font-mono">
          <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
            <span className="text-text-secondary">profile</span>
            <span className="shrink-0">/</span>
            <span className="text-text-primary font-semibold">about</span>
          </div>

          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-surface-2 border border-border text-accent font-semibold whitespace-nowrap shrink-0">
            profile
          </span>
        </div>

        {/* Profile Header */}
        <header className="p-5 rounded border border-border bg-surface space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* GitHub Profile Picture - Circular Cyber Badge */}
              <div className="relative group shrink-0 p-1 w-fit">
                <div className="relative p-1 rounded-full border border-border/80 bg-surface-2 transition-all duration-300 group-hover:border-accent/60 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-accent/40 bg-surface transition-all duration-300 group-hover:border-accent shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://github.com/0xraiven.png"
                      alt="0xraiven profile"
                      width={56}
                      height={56}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </div>
                <span
                  className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-bg shadow-sm z-10"
                  title="Status: Active"
                >
                  <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-70" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <ScrambleText
                    text="r41n"
                    as="h1"
                    className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary font-mono"
                  />
                  <span className="text-text-secondary text-xs">•</span>
                  <span className="text-xs text-text-secondary font-mono">Profile</span>
                  <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.2 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono ml-1">
                    active
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <a
                    href="https://github.com/0xraiven"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-accent/15 border border-accent/35 text-accent hover:bg-accent/25 transition-colors font-mono text-xs font-semibold"
                  >
                    <span>@0xraiven</span>
                  </a>
                  <span className="text-xs text-text-secondary font-mono">
                    Computer Science Engineering Student
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/resume"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-border bg-surface-2 hover:bg-surface text-text-primary text-xs font-mono transition-colors shrink-0 self-start sm:self-auto"
            >
              <FileText className="w-3.5 h-3.5 text-accent" />
              <span>View Resume</span>
              <ArrowRight className="w-3 h-3 text-text-secondary" />
            </Link>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed font-mono">
            Offensive security, web application security, Linux internals, detection engineering (Wazuh / auditd), and cloud security. Driven by the Build ➔ Break ➔ Observe ➔ Detect ➔ Document ➔ Improve methodology.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-text-secondary pt-3 border-t border-border/60">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-accent" />
              <span>Focus: Offensive Security &amp; Detection Engineering</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-text-secondary" />
              <span>Environment: Arch Linux · KVM / libvirt</span>
            </div>
          </div>
        </header>

        {/* Narrative / Operational Overview from CMS */}
        {body && (
          <section className="p-5 rounded border border-border bg-surface/80 space-y-3 font-mono text-xs">
            <DocumentContent document={body as unknown as Parameters<typeof DocumentContent>[0]["document"]} />
          </section>
        )}

        {/* Core Technical Workflow */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <div className="flex items-center gap-2">
              <Workflow className="w-4 h-4 text-accent" />
              <h2 className="text-xs font-semibold tracking-wider text-text-primary font-mono uppercase">
                <ScrambleText text="Core Engineering Approach" as="span" />
              </h2>
            </div>
            <span className="text-[10px] font-mono text-text-secondary">Iterative Cycle</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {workflowSteps.map((item, idx) => (
              <div
                key={item.step}
                className="p-3.5 rounded border border-border bg-surface space-y-1.5 font-mono"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-2 border border-border/60 text-accent font-bold">
                    0{idx + 1}
                  </span>
                  <h3 className="text-xs font-bold text-text-primary">
                    {item.step}
                  </h3>
                </div>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Focus & Research Domains */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-accent" />
              <h2 className="text-xs font-semibold tracking-wider text-text-primary font-mono uppercase">
                <ScrambleText text="Technical Focus & Research Areas" as="span" />
              </h2>
            </div>
            <span className="text-[10px] font-mono text-text-secondary">7 focus areas</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {technicalFocus.map((domain) => (
              <div
                key={domain.name}
                className="p-3.5 rounded border border-border bg-surface space-y-1 font-mono"
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  <h3 className="text-xs font-bold text-text-primary">
                    {domain.name}
                  </h3>
                </div>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  {domain.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Selected Projects */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-accent" />
              <h2 className="text-xs font-semibold tracking-wider text-text-primary font-mono uppercase">
                <ScrambleText text="Selected Projects" as="span" />
              </h2>
            </div>
            <span className="text-[10px] font-mono text-text-secondary">Open Source Repositories</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {selectedWork.map((work) => (
              <Link
                key={work.name}
                href={work.href}
                className="p-4 rounded border border-border bg-surface hover:bg-surface-2/70 transition-colors space-y-2.5 flex flex-col justify-between font-mono group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-text-primary group-hover:text-accent transition-colors">
                        {work.name}
                      </h3>
                      <span className="text-[10px] text-accent">›</span>
                    </div>
                    <span
                      className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                        work.status === "Active"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {work.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-accent block">
                    {work.type}
                  </span>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {work.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/40 text-[11px] text-accent flex items-center gap-1 group-hover:underline">
                  <span>View Project Details</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Practical Security Work */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <h2 className="text-xs font-semibold tracking-wider text-text-primary font-mono uppercase">
                <ScrambleText text="Practical Security Work" as="span" />
              </h2>
            </div>
            <span className="text-[10px] font-mono text-text-secondary">Hands-On Practice</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {practicalWork.map((item) => (
              <div
                key={item.title}
                className="p-4 rounded border border-border bg-surface space-y-2 font-mono"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs font-bold text-text-primary">
                    {item.title}
                  </h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-2 border border-border/60 text-accent font-semibold">
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Lab & Infrastructure */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-accent" />
              <h2 className="text-xs font-semibold tracking-wider text-text-primary font-mono uppercase">
                <ScrambleText text="Lab & Homelab Infrastructure" as="span" />
              </h2>
            </div>
            <span className="text-[10px] font-mono text-text-secondary">Arch Linux Homelab</span>
          </div>

          <div className="p-4 rounded border border-border bg-surface space-y-3 font-mono text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-border/40 pb-2">
              <span className="font-bold text-text-primary">Host: Arch Linux · KVM / libvirt Hypervisor</span>
              <span className="text-text-secondary text-[11px]">Personal Security Testing &amp; Homelab Environment</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
              <div className="p-2.5 rounded bg-surface-2/60 border border-border/60 space-y-1">
                <span className="text-accent font-semibold text-[11px] block">Virtual Machines</span>
                <p className="text-[11px] text-text-secondary">
                  Kali Linux (attack node) &amp; Metasploitable (target node).
                </p>
              </div>

              <div className="p-2.5 rounded bg-surface-2/60 border border-border/60 space-y-1">
                <span className="text-accent font-semibold text-[11px] block">Detection Engine</span>
                <p className="text-[11px] text-text-secondary">
                  Wazuh Stack (Manager, Indexer, Dashboard, Agent) + auditd telemetry.
                </p>
              </div>

              <div className="p-2.5 rounded bg-surface-2/60 border border-border/60 space-y-1">
                <span className="text-accent font-semibold text-[11px] block">Network &amp; Access</span>
                <p className="text-[11px] text-text-secondary">
                  Tailscale encrypted mesh overlay &amp; Nginx Proxy Manager.
                </p>
              </div>

              <div className="p-2.5 rounded bg-surface-2/60 border border-border/60 space-y-1">
                <span className="text-accent font-semibold text-[11px] block">Management</span>
                <p className="text-[11px] text-text-secondary">
                  Portainer for Docker orchestration &amp; Netdata for live metrics.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Software & Systems Engineering Stack */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent" />
              <h2 className="text-xs font-semibold tracking-wider text-text-primary font-mono uppercase">
                <ScrambleText text="Software & Systems Engineering Stack" as="span" />
              </h2>
            </div>
            <span className="text-[10px] font-mono text-text-secondary">Engineering Tools</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3.5 rounded border border-border bg-surface space-y-1.5">
              <span className="text-accent font-semibold text-[11px] block uppercase">Languages</span>
              <p className="text-text-secondary text-[11px]">Python, TypeScript, JavaScript, Bash, SQL</p>
            </div>
            <div className="p-3.5 rounded border border-border bg-surface space-y-1.5">
              <span className="text-accent font-semibold text-[11px] block uppercase">Frameworks</span>
              <p className="text-text-secondary text-[11px]">Next.js, React, React Native, Flask</p>
            </div>
            <div className="p-3.5 rounded border border-border bg-surface space-y-1.5">
              <span className="text-accent font-semibold text-[11px] block uppercase">Data &amp; APIs</span>
              <p className="text-text-secondary text-[11px]">Supabase, PostgreSQL, REST APIs</p>
            </div>
            <div className="p-3.5 rounded border border-border bg-surface space-y-1.5">
              <span className="text-accent font-semibold text-[11px] block uppercase">Platforms</span>
              <p className="text-text-secondary text-[11px]">Docker, Git, GitHub, Vercel, Render, AWS</p>
            </div>
          </div>
        </section>

        {/* Practical Learning Progression */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-accent" />
              <h2 className="text-xs font-semibold tracking-wider text-text-primary font-mono uppercase">
                <ScrambleText text="Practical Learning Progression" as="span" />
              </h2>
            </div>
            <span className="text-[10px] font-mono text-text-secondary">Path Taken</span>
          </div>

          <div className="p-4 rounded border border-border bg-surface font-mono">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {learningProgression.map((stage, idx) => (
                <React.Fragment key={stage}>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-2 border border-border/70 text-text-primary font-medium">
                    <span className="text-accent text-[10px]">{idx + 1}.</span>
                    <span>{stage}</span>
                  </div>
                  {idx < learningProgression.length - 1 && (
                    <span className="text-text-secondary/60 text-xs">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* Documentation & Knowledge Base */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-accent" />
              <h2 className="text-xs font-semibold tracking-wider text-text-primary font-mono uppercase">
                <ScrambleText text="Documentation & Projects" as="span" />
              </h2>
            </div>
            <span className="text-[10px] font-mono text-text-secondary">Knowledge Base</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <Link
              href="/projects"
              className="p-3 rounded border border-border bg-surface hover:bg-surface-2 transition-colors space-y-1 block group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-text-primary group-hover:text-accent transition-colors">Projects</span>
                <ArrowRight className="w-3.5 h-3.5 text-text-secondary group-hover:text-accent transition-colors" />
              </div>
              <p className="text-[11px] text-text-secondary">Security tools &amp; labs</p>
            </Link>

            <Link
              href="/writeups"
              className="p-3 rounded border border-border bg-surface hover:bg-surface-2 transition-colors space-y-1 block group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-text-primary group-hover:text-accent transition-colors">Writeups</span>
                <ArrowRight className="w-3.5 h-3.5 text-text-secondary group-hover:text-accent transition-colors" />
              </div>
              <p className="text-[11px] text-text-secondary">Walkthroughs &amp; CTF solutions</p>
            </Link>

            <Link
              href="/notes"
              className="p-3 rounded border border-border bg-surface hover:bg-surface-2 transition-colors space-y-1 block group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-text-primary group-hover:text-accent transition-colors">Notes</span>
                <ArrowRight className="w-3.5 h-3.5 text-text-secondary group-hover:text-accent transition-colors" />
              </div>
              <p className="text-[11px] text-text-secondary">Cheatsheets &amp; internals</p>
            </Link>

            <Link
              href="/research"
              className="p-3 rounded border border-border bg-surface hover:bg-surface-2 transition-colors space-y-1 block group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-text-primary group-hover:text-accent transition-colors">Research</span>
                <ArrowRight className="w-3.5 h-3.5 text-text-secondary group-hover:text-accent transition-colors" />
              </div>
              <p className="text-[11px] text-text-secondary">Papers &amp; deep investigations</p>
            </Link>
          </div>
        </section>

        {/* Contact & Links */}
        <section className="p-4 rounded border border-border bg-surface-2/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div>
            <p className="font-semibold text-text-primary">Links &amp; Profiles</p>
            <p className="text-text-secondary text-[11px] mt-0.5">
              Browse public repositories, research writeups, and resume.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href="https://github.com/0xraiven"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded border border-border bg-surface hover:bg-surface-2 text-text-primary flex items-center gap-1.5 transition-colors"
            >
              <GitBranch className="w-3.5 h-3.5 text-accent" />
              <span>GitHub</span>
            </a>
            <a
              href="https://x.com/0xraiven"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded border border-border bg-surface hover:bg-surface-2 text-text-primary flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-accent" />
              <span>X (@0xraiven)</span>
            </a>
            <Link
              href="/resume"
              className="px-3 py-1.5 rounded border border-border bg-surface hover:bg-surface-2 text-text-primary flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-accent" />
              <span>Resume</span>
              <ArrowRight className="w-3 h-3 text-text-secondary" />
            </Link>
          </div>
        </section>
      </article>
    </KnowledgeBaseLayout>
  );
}
