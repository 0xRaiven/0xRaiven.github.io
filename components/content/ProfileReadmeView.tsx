'use client';

import React from 'react';
import Link from 'next/link';

export function ProfileReadmeView() {
  return (
    <div className="space-y-6 font-mono text-sm">
      {/* Profile Ingress Telemetry Header */}
      <div className="flex justify-start">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/projects/0xraiven/profile-views.svg?v=71"
          alt="Profile Ingress Telemetry & Views"
          className="h-auto max-w-full"
        />
      </div>

      {/* Cyber Hero Banner */}
      <div className="w-full overflow-hidden rounded border border-border/80 bg-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/projects/0xraiven/hero.svg"
          alt="r41n // 0xraiven — Offensive Security · Security Engineering · Cloud"
          className="w-full h-auto block"
        />
      </div>

      {/* Animated Telemetry Stream */}
      <div className="w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/projects/0xraiven/status-ticker.svg"
          alt="Live Telemetry Stream"
          className="w-full h-auto block"
        />
      </div>

      {/* Bio Statement */}
      <div className="text-center py-2 space-y-1.5 max-w-3xl mx-auto">
        <p className="text-text-primary text-sm font-sans sm:text-base leading-relaxed">
          <strong className="font-semibold text-text-primary">Cybersecurity researcher &amp; systems engineer</strong>{' '}
          exploring <strong className="text-accent font-semibold">offensive primitives</strong>,{' '}
          <strong className="text-accent font-semibold">Linux host telemetry</strong>, and{' '}
          <strong className="text-accent font-semibold">explainable detection pipelines</strong>.
        </p>
        <p className="text-text-secondary text-xs font-sans leading-relaxed">
          Dissecting attack surfaces down to daemon and initialization vectors to engineer inspectable, high-resilience security systems.
        </p>
      </div>

      {/* Cyber Divider */}
      <div className="w-full overflow-hidden py-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/projects/0xraiven/divider.svg"
          alt="divider"
          className="w-full h-auto block opacity-80"
        />
      </div>

      {/* ─[ FEATURED WORK ]─ Section */}
      <section className="space-y-4">
        <h3 className="text-xs uppercase tracking-wider text-text-secondary font-mono border-b border-border/60 pb-1">
          ─[ FEATURED WORK ]───────────────────────────────────────────────────
        </h3>

        <div className="space-y-4">
          {/* Card 1: phishGuard */}
          <div className="p-4 rounded border border-border bg-surface space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href="/projects/phishguard"
                  className="text-base font-bold text-accent hover:underline font-mono"
                >
                  01 / phishGuard
                </Link>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/projects/0xraiven/badge-phishguard.svg"
                  alt="v1.0-rc.1 · Apache-2.0"
                  className="h-4 sm:h-4.5"
                />
              </div>
            </div>

            <p className="text-xs text-text-secondary font-sans leading-relaxed">
              Privacy-first ML phishing detection platform &amp; Chrome extension. Defense-in-depth pipeline decoupling URL canonicalization, heuristics, and CatBoost inference with SHAP explainability.
            </p>

            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/projects/0xraiven/phishguard-tags.svg"
                alt="Python · Flask · CatBoost ML · SHAP (XAI) · Chrome MV3"
                className="h-auto max-w-full"
              />
            </div>

            <div className="pt-1">
              <a
                href="https://github.com/0xraiven/phishGuard"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-text-primary hover:text-accent transition-colors"
              >
                <span>VIEW CODEBASE</span>
                <span className="text-accent">──▶</span>
              </a>
            </div>

            {/* Interactive Architecture Drawer */}
            <details className="group border border-border/80 rounded bg-surface-2/40 p-3 cursor-pointer">
              <summary className="text-xs font-mono font-bold text-text-primary flex items-center gap-2 select-none hover:text-accent">
                <span className="text-accent group-open:rotate-90 transition-transform">▶</span>
                <span className="text-accent">◈</span>
                <span>PIPELINE ARCHITECTURE</span>
                <span className="text-text-secondary text-[11px] font-normal">[INSPECT]</span>
              </summary>
              <div className="pt-3 border-t border-border/60 mt-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/projects/0xraiven/phishguard-pipeline.svg"
                  alt="phishGuard ML Pipeline Architecture"
                  className="w-full h-auto rounded border border-border/40"
                />
              </div>
            </details>
          </div>

          {/* Card 2: persistHunt */}
          <div className="p-4 rounded border border-border bg-surface space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href="/projects/persisthunt"
                  className="text-base font-bold text-accent hover:underline font-mono"
                >
                  02 / persistHunt
                </Link>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/projects/0xraiven/badge-persisthunt.svg"
                  alt="Stage 1 · Active Engine"
                  className="h-4 sm:h-4.5"
                />
              </div>
            </div>

            <p className="text-xs text-text-secondary font-sans leading-relaxed">
              Linux persistence detection framework. Standardizes host anomaly telemetry across cron schedules, systemd service units, and shell environment initialization vectors.
            </p>

            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/projects/0xraiven/persisthunt-tags.svg"
                alt="Python 3 · Linux Internals · Host Telemetry · Audit Engine"
                className="h-auto max-w-full"
              />
            </div>

            <div className="pt-1">
              <a
                href="https://github.com/0xraiven/persistHunt"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-text-primary hover:text-accent transition-colors"
              >
                <span>VIEW CODEBASE</span>
                <span className="text-accent">──▶</span>
              </a>
            </div>

            {/* Interactive Schema Drawer */}
            <details className="group border border-border/80 rounded bg-surface-2/40 p-3 cursor-pointer">
              <summary className="text-xs font-mono font-bold text-text-primary flex items-center gap-2 select-none hover:text-accent">
                <span className="text-accent group-open:rotate-90 transition-transform">▶</span>
                <span className="text-accent">◈</span>
                <span>DETECTION SCHEMA</span>
                <span className="text-text-secondary text-[11px] font-normal">[INSPECT]</span>
              </summary>
              <div className="pt-3 border-t border-border/60 mt-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/projects/0xraiven/persisthunt-schema.svg"
                  alt="persistHunt Finding Engine Schema"
                  className="w-full h-auto rounded border border-border/40"
                />
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* ─[ TELEMETRY ]─ Section */}
      <section className="space-y-4 pt-2">
        <h3 className="text-xs uppercase tracking-wider text-text-secondary font-mono border-b border-border/60 pb-1">
          ─[ TELEMETRY ]───────────────────────────────────────────────────────
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* Contribution Chart */}
          <a
            href="https://github.com/0xraiven"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 rounded border border-border bg-surface hover:border-accent/40 transition-colors"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://ghchart.rshah.org/8B1E3F/0xraiven"
              alt="0xraiven GitHub Contributions"
              className="w-full h-auto block"
            />
          </a>

          {/* GitHub Streak Stats */}
          <a
            href="https://github.com/0xraiven"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 rounded border border-border bg-surface hover:border-accent/40 transition-colors"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://streak-stats.demolab.com/?user=0xraiven&theme=dark&background=09090B&border=292329&stroke=8B1E3F&ring=B8325A&fire=B8325A&currStreakNum=E8E6E8&sideNums=E8E6E8&currStreakLabel=B8325A&sideLabels=8E8A90&dates=8E8A90"
              alt="GitHub Streak"
              className="w-full h-auto block"
            />
          </a>
        </div>
      </section>

      {/* Social Badges & Bottom Divider */}
      <div className="pt-4 space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <a
            href="mailto:0xraiven@proton.me"
            className="hover:opacity-85 transition-opacity"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://img.shields.io/badge/ProtonMail-0xraiven%40proton.me-8B1E3F?style=flat-square&logo=protonmail&logoColor=white&labelColor=09090B"
              alt="ProtonMail"
            />
          </a>
          <a
            href="https://github.com/0xraiven"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-85 transition-opacity"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://img.shields.io/badge/GitHub-0xraiven-8B1E3F?style=flat-square&logo=github&logoColor=white&labelColor=09090B"
              alt="GitHub"
            />
          </a>
        </div>

        <div className="w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/projects/0xraiven/divider.svg"
            alt="divider"
            className="w-full h-auto block opacity-80"
          />
        </div>
      </div>
    </div>
  );
}
