'use client';

import React from 'react';

export function ProfileReadmeView() {
  return (
    <div className="space-y-6 font-mono text-sm">
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
          alt="Live Status Stream"
          className="w-full h-auto block"
        />
      </div>

      {/* Bio Statement */}
      <div className="text-center py-2 space-y-1.5 max-w-3xl mx-auto">
        <p className="text-text-primary text-sm font-sans sm:text-base leading-relaxed">
          <strong className="font-semibold text-text-primary">Security researcher &amp; software engineer</strong>{' '}
          focused on <strong className="text-accent font-semibold">Linux systems</strong>,{' '}
          <strong className="text-accent font-semibold">threat detection</strong>, and{' '}
          <strong className="text-accent font-semibold">practical security tooling</strong>.
        </p>
        <p className="text-text-secondary text-xs font-sans leading-relaxed">
          Exploring how systems break, building tools to defend them, and keeping software reliable.
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

      {/* ─[ SKILLS & TECHNOLOGIES ]─ Section */}
      <section className="space-y-4">
        <h3 className="text-xs uppercase tracking-wider text-text-secondary font-mono border-b border-border/60 pb-1">
          ─[ SKILLS &amp; TECHNOLOGIES ]─────────────────────────────────────────
        </h3>

        <div className="w-full overflow-hidden rounded border border-border/80 bg-surface">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/projects/0xraiven/skills.svg"
            alt="Core Skills and Tech Stack: Languages, Security and Systems, Tools and Ecosystem"
            className="w-full h-auto block"
          />
        </div>

        <p className="text-center text-xs text-text-secondary font-sans">
          Comfortable with systems programming, automation, host security auditing, and cloud environments.
        </p>
      </section>

      {/* Cyber Divider */}
      <div className="w-full overflow-hidden py-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/projects/0xraiven/divider.svg"
          alt="divider"
          className="w-full h-auto block opacity-80"
        />
      </div>

      {/* ─[ ACTIVITY & LANGUAGE METRICS ]─ Section */}
      <section className="space-y-4 pt-2">
        <h3 className="text-xs uppercase tracking-wider text-text-secondary font-mono border-b border-border/60 pb-1">
          ─[ ACTIVITY &amp; LANGUAGE METRICS ]───────────────────────────────────
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* Top Languages */}
          <a
            href="https://github.com/0xraiven"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-2 rounded border border-border bg-surface hover:border-accent/40 transition-colors overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://github-readme-stats.vercel.app/api/top-langs/?username=0xraiven&layout=compact&card_width=467&langs_count=6&bg_color=09090B&border_color=292329&title_color=B8325A&text_color=E8E6E8"
              alt="Most Used Languages"
              className="w-full h-auto block"
            />
          </a>

          {/* GitHub Profile Stats */}
          <a
            href="https://github.com/0xraiven"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-2 rounded border border-border bg-surface hover:border-accent/40 transition-colors overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://github-readme-stats.vercel.app/api?username=0xraiven&show_icons=true&bg_color=09090B&border_color=292329&title_color=B8325A&text_color=E8E6E8&icon_color=8B1E3F&hide_border=false"
              alt="GitHub Profile Stats"
              className="w-full h-auto block"
            />
          </a>

          {/* Contribution Chart */}
          <a
            href="https://github.com/0xraiven"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 rounded border border-border bg-surface hover:border-accent/40 transition-colors overflow-hidden"
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
            className="block p-3 rounded border border-border bg-surface hover:border-accent/40 transition-colors overflow-hidden"
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
              src="https://img.shields.io/badge/Email-0xraiven%40proton.me-8B1E3F?style=flat-square&logo=protonmail&logoColor=white&labelColor=09090B"
              alt="Email"
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

