"use client";

import React, { useState } from "react";
import {
  Mail,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Lock,
  Terminal,
  Send,
  MessageSquare,
  Sparkles,
  Globe,
  Box,
} from "lucide-react";
import { ScrambleText } from "@/components/animation/ScrambleText";

interface SocialChannel {
  id: string;
  name: string;
  handle: string;
  url?: string;
  actionType: "link" | "copy" | "both";
  badge: string;
  badgeClass: string;
  category: "primary" | "security" | "messaging";
  description: string;
  copyValue?: string;
}

const SOCIAL_CHANNELS: SocialChannel[] = [
  {
    id: "github",
    name: "GitHub",
    handle: "@0xraiven",
    url: "https://github.com/0xraiven",
    actionType: "link",
    badge: "PROJECTS",
    badgeClass: "border-border bg-surface-2 text-text-primary",
    category: "primary",
    description: "Personal projects, security tooling (persistHunt, phishGuard), malware analysis notes, and open-source contributions.",
  },
  {
    id: "x",
    name: "X / Twitter",
    handle: "@0xraiven",
    url: "https://x.com/0xraiven",
    actionType: "link",
    badge: "UPDATES",
    badgeClass: "border-accent/40 bg-accent/10 text-accent",
    category: "primary",
    description: "Vulnerability analysis, security research notes, exploit breakdowns, and technical discussions.",
  },
  {
    id: "email",
    name: "Email",
    handle: "nagasainanduri@gmail.com",
    url: "mailto:nagasainanduri@gmail.com",
    actionType: "both",
    copyValue: "nagasainanduri@gmail.com",
    badge: "DIRECT MAIL",
    badgeClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    category: "messaging",
    description: "General inquiries, opportunities, technical discussion, and research collaboration.",
  },
  {
    id: "proton",
    name: "ProtonMail",
    handle: "0xraiven@proton.me",
    url: "mailto:0xraiven@proton.me",
    actionType: "both",
    copyValue: "0xraiven@proton.me",
    badge: "ENCRYPTED EMAIL",
    badgeClass: "border-accent/40 bg-accent/10 text-accent",
    category: "security",
    description: "End-to-end encrypted email for secure communication or sensitive inquiries.",
  },
  {
    id: "htb",
    name: "Hack The Box",
    handle: "0xraiven",
    url: "/writeups/htb",
    actionType: "link",
    badge: "WRITEUPS",
    badgeClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    category: "security",
    description: "Machine writeups across all difficulty tiers, privilege escalation notes, and CTF challenge walkthroughs.",
  },
  {
    id: "discord",
    name: "Discord",
    handle: "0xraiven",
    actionType: "copy",
    copyValue: "0xraiven",
    badge: "COMMUNITY",
    badgeClass: "border-border bg-surface-2 text-text-secondary",
    category: "messaging",
    description: "Security discussions, CTF coordination, and community chat.",
  },
];

function ChannelIcon({ id }: { id: string }) {
  switch (id) {
    case "github":
      return (
        <svg role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      );
    case "x":
      return (
        <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "email":
      return <Mail className="w-4 h-4 text-emerald-400" />;
    case "proton":
      return <Shield className="w-4 h-4 text-accent" />;
    case "htb":
      return <Box className="w-4 h-4 text-emerald-400" />;
    case "discord":
      return <MessageSquare className="w-4 h-4 text-indigo-400" />;
    case "linkedin":
      return <Globe className="w-4 h-4 text-blue-400" />;
    default:
      return <Terminal className="w-4 h-4 text-accent" />;
  }
}

export function ContactClient() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Dispatch composer state
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [inquiryType, setInquiryType] = useState("vulnerability");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [transmissionSent, setTransmissionSent] = useState(false);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const targetEmail =
    inquiryType === "vulnerability" ? "0xraiven@proton.me" : "nagasainanduri@gmail.com";
  const fullSubject = `[${inquiryType.toUpperCase()}] ${subject || "Contact Inquiry"}`;
  const fullBody = `From: ${senderName || "Anonymous"} (${senderEmail || "N/A"})\nRegarding: ${inquiryType}\n\nMessage:\n${message}`;

  const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(fullSubject)}&body=${encodeURIComponent(fullBody)}`;
  const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetEmail)}&su=${encodeURIComponent(fullSubject)}&body=${encodeURIComponent(fullBody)}`;

  const handleTransmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Copy the drafted text to clipboard for safety
    navigator.clipboard.writeText(`To: ${targetEmail}\nSubject: ${fullSubject}\n\n${fullBody}`);
    setTransmissionSent(true);

    // Launch default OS mail client
    window.location.href = mailtoUrl;
  };

  return (
    <div className="space-y-10 font-mono text-text-primary">
      {/* Header Breadcrumb */}
      <header className="border-b border-border pb-6 space-y-4">
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <Globe className="w-3.5 h-3.5 text-accent" />
          <span>~/contact.md</span>
        </div>

        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary uppercase flex items-center gap-2">
              <Mail className="w-7 h-7 text-accent shrink-0" />
              <ScrambleText text="Contact & Channels" as="span" />
            </h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">
                AVAILABLE
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-sans max-w-3xl">
            Communication channels, social profiles, and email details for security research,
            coordinated vulnerability disclosure, and general inquiries.
          </p>
        </div>

        {/* Status Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/60 text-[11px] font-mono text-text-secondary">
          <div className="flex flex-col">
            <span className="text-text-muted text-[10px] uppercase">Name</span>
            <span className="text-text-primary font-semibold">0xraiven (r41n)</span>
          </div>
          <div className="flex flex-col">
            <span className="text-text-muted text-[10px] uppercase">Email Security</span>
            <span className="text-accent font-semibold">Proton E2EE / GPG</span>
          </div>
          <div className="flex flex-col">
            <span className="text-text-muted text-[10px] uppercase">Response Time</span>
            <span className="text-emerald-400 font-semibold">&lt; 24 Hours</span>
          </div>
          <div className="flex flex-col">
            <span className="text-text-muted text-[10px] uppercase">Status</span>
            <span className="text-text-primary font-semibold">Open to Inquiries</span>
          </div>
        </div>
      </header>

      {/* Social & Contact Channels Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border/70 pb-2">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-text-primary">
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Profiles & Channels</span>
          </div>
          <span className="text-[10px] text-text-secondary">
            [{SOCIAL_CHANNELS.length} channels available]
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {SOCIAL_CHANNELS.map((channel, idx) => {
            const isCopied = copiedId === channel.id;
            const isLastOdd = idx === SOCIAL_CHANNELS.length - 1 && SOCIAL_CHANNELS.length % 2 !== 0;

            return (
              <article
                key={channel.id}
                className={`group relative p-4 rounded-lg border border-border bg-surface hover:border-accent/40 hover:bg-surface-2 transition-all duration-200 flex flex-col justify-between space-y-3.5 ${isLastOdd ? "col-span-1 md:col-span-2" : ""
                  }`}
              >
                <div className="space-y-2.5">
                  {/* Row 1: Icon + Name & Badge (Never breaks into 2 lines) */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="p-1 rounded bg-surface-2 border border-border/80 text-text-primary group-hover:text-accent group-hover:border-accent/40 transition-colors shrink-0">
                        <ChannelIcon id={channel.id} />
                      </span>
                      <h2 className="font-bold text-sm text-text-primary group-hover:text-accent transition-colors truncate">
                        {channel.name}
                      </h2>
                    </div>

                    <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border font-semibold shrink-0 ${channel.badgeClass}`}>
                      {channel.badge}
                    </span>
                  </div>

                  {/* Row 2: Dedicated Coordinate / Handle Pill */}
                  <div className="flex items-center gap-1.5 text-xs font-mono text-text-secondary bg-surface-2/60 border border-border/60 px-2.5 py-1 rounded w-fit max-w-full">
                    <span className="text-accent text-[11px] font-bold">›</span>
                    <span className="text-text-primary select-all truncate text-[11px]">
                      {channel.handle}
                    </span>
                  </div>

                  {/* Row 3: Description */}
                  <p className="text-xs text-text-secondary font-sans leading-relaxed">
                    {channel.description}
                  </p>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-2.5 border-t border-border/50 text-xs mt-auto">
                  <span className="text-[10px] text-text-secondary font-mono">
                    id: {channel.id}
                  </span>

                  <div className="flex items-center gap-2">
                    {channel.copyValue && (
                      <button
                        type="button"
                        onClick={() => copyToClipboard(channel.copyValue!, channel.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-2 border border-border text-text-secondary hover:text-text-primary hover:border-accent/40 transition-colors text-[11px]"
                        title={`Copy ${channel.copyValue}`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}

                    {channel.url && (
                      <a
                        href={channel.url}
                        target={channel.url.startsWith("http") ? "_blank" : undefined}
                        rel={channel.url.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 transition-colors text-[11px] font-semibold"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* PGP / Cryptographic Policy Section */}
      <section className="space-y-3 p-5 rounded-lg border border-border bg-surface">
        <div className="flex items-center gap-2 border-b border-border/70 pb-3">
          <Lock className="w-4 h-4 text-accent" />
          <h2 className="font-bold text-sm text-text-primary uppercase tracking-wider">
            Encrypted Email & PGP
          </h2>
        </div>

        {/* Cryptographic Request Note */}
        <div className="flex items-start gap-3 p-3.5 rounded bg-surface-2/60 border border-border/80 text-xs text-text-secondary font-sans leading-relaxed">
          <Shield className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <div>
            <strong className="text-text-primary">Secure Email:</strong> Messages sent to{" "}
            <a href="mailto:0xraiven@proton.me" className="text-accent underline font-mono">0xraiven@proton.me</a>{" "}
            are automatically end-to-end encrypted via ProtonMail. If you need standard GPG keys for another email client, feel free to request them.
          </div>
        </div>
      </section>

      {/* Direct Transmission Dispatcher */}
      <section className="space-y-4 p-5 rounded-lg border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border/70 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-accent" />
            <span className="font-bold text-sm text-text-primary uppercase tracking-wider">
              Send a Message
            </span>
          </div>
          <span className="text-[10px] text-text-secondary">
            [to: {targetEmail}]
          </span>
        </div>

        <form onSubmit={handleTransmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="text-xs text-text-secondary block font-mono">
                Your Name / Organization
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Name or handle"
                className="w-full px-3 py-2 rounded bg-surface-2 border border-border text-xs font-mono text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-text-secondary block font-mono">
                Your Email Address
              </label>
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="your.email@domain.com"
                className="w-full px-3 py-2 rounded bg-surface-2 border border-border text-xs font-mono text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="text-xs text-text-secondary block font-mono">
                Reason for Message
              </label>
              <select
                value={inquiryType}
                onChange={(e) => setInquiryType(e.target.value)}
                className="w-full px-3 py-2 rounded bg-surface-2 border border-border text-xs font-mono text-text-primary focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30"
              >
                <option value="vulnerability">Coordinated Vulnerability Disclosure (via Proton)</option>
                <option value="research">Security Research & Collaboration (via Gmail)</option>
                <option value="opportunity">Work & Consulting Opportunities (via Gmail)</option>
                <option value="general">General Inquiry (via Gmail)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-text-secondary block font-mono">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief subject"
                className="w-full px-3 py-2 rounded bg-surface-2 border border-border text-xs font-mono text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-text-secondary block font-mono">
              Message
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your message, inquiry details, or project description..."
              className="w-full px-3 py-2 rounded bg-surface-2 border border-border text-xs font-mono text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 leading-relaxed"
            />
          </div>

          {transmissionSent && (
            <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <Check className="w-4 h-4" />
                <span>Mail client opened &amp; draft copied to your clipboard!</span>
              </div>
              <p className="text-[11px] text-text-secondary font-sans leading-relaxed">
                If your device does not have a default desktop mail app configured, you can launch webmail directly with one click below:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href={gmailWebUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded bg-surface-2 border border-border text-xs text-text-primary hover:text-accent hover:border-accent/40 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Open in Gmail Web</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://mail.proton.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded bg-surface-2 border border-border text-xs text-text-primary hover:text-accent hover:border-accent/40 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-accent" />
                  <span>Open in Proton Web</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <p className="text-[11px] text-text-secondary font-sans leading-relaxed">
              Opens a pre-filled draft to <span className="font-mono text-text-primary">{targetEmail}</span> and copies the message to your clipboard.
            </p>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded bg-accent text-bg text-xs font-mono font-bold hover:bg-accent/90 transition-colors shadow-sm shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
