"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  Terminal,
  Copy,
  Check,
  RotateCcw,
  CornerDownLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useUI } from "@/providers";

export interface TerminalCommand {
  cmd: string;
  output?: string;
}

export interface TerminalPreset {
  label: string;
  cmd: string;
  output: string;
}

export interface TerminalBlockProps {
  title?: string;
  commands?: TerminalCommand[];
  presets?: TerminalPreset[];
  interactive?: boolean;
  className?: string;
}

const DEFAULT_PRESETS: TerminalPreset[] = [
  {
    label: "r41n.conf",
    cmd: "cat /etc/profile/r41n.conf",
    output: `handle      :: r41n
focus       :: Offensive Security
               Red Team Tooling
               Cloud Security
               Detection Engineering

environment :: Linux (Arch / Debian)
               Windows Active Directory
               AWS / Cloud Security
               Docker / Podman Containers
               KVM / Proxmox Virtualization

status      :: building
               breaking
               documenting`,
  },
  {
    label: "neofetch",
    cmd: "neofetch",
    output: `  /\\_/\\       r41n@0xraiven
 ( o.o )      ----------------
  > ^ <       OS: Arch Linux x86_64
0xraiven::lab Host: Proxmox VE 8.2 (Homelab)
              Kernel: 6.10.10-hardened
              Uptime: 42d, 13h, 37m
              Shell: zsh 5.9 (x86_64)
              Terminal: alacritty + tmux
              Editor: Neovim (lua)
              Focus: OffSec // Tooling
              Status: Active Research (AD & Cloud)
              Memory: 3.4GiB / 64.0GiB (5%)`,
  },
  {
    label: "tools",
    cmd: "cat /etc/security/tools.conf",
    output: `[+] SECURITY TOOLING   :: Burp Suite Pro, Metasploit, Impacket, BloodHound, CrackMapExec, Chisel
[+] CLOUD & INFRA      :: AWS IAM Scoping, Terraform, Docker, Podman, Proxmox, WireGuard
[+] DETECTION & LOGS   :: Wazuh SIEM, auditd, Sysmon, Zeek, Suricata, Sigma Rules
[+] SYSTEMS & LANGS    :: Python, Go, Bash, TypeScript, C/C++ (Linux Internals)`,
  },
  {
    label: "whoami",
    cmd: "whoami",
    output: `uid=1000(r41n) gid=1000(security) groups=1000(security),27(sudo),998(wheel),999(docker)
identity   :: r41n (Neil)
profile    :: https://github.com/0xraiven
pgp-id     :: 0x4A1F9B3C2D8E00FA
role       :: Security Engineering & Research
status     :: active / defensive evasion & tooling`,
  },
  {
    label: "theme",
    cmd: "theme toggle",
    output: `[+] Toggled theme mode.`,
  },
  {
    label: "help",
    cmd: "help",
    output: `Available operational commands:
  [PORTFOLIO & FOCUS]
    cat /etc/profile      - View profile configuration & technical focus
    neofetch              - Display system specs & research environment
    tools                 - View security toolchain & software stack
    whoami                - Display user identity, role & PGP key

  [SITE EXPLORATION]
    ls [dir]              - List files & sections (e.g. 'ls', 'ls projects', 'ls notes')
    cat <file>            - View file contents (e.g. 'cat README.md', 'cat r41n.conf')
    cd <section>          - Navigate to section (e.g. 'cd projects', 'cd writeups', 'cd notes', 'cd contact')
    goto <page>           - Alias for navigation (e.g. 'goto projects', 'goto home')

  [PAGE CONTROLS]
    theme <mode>          - Control theme ('theme dark', 'theme light', 'theme toggle')
    scroll <target>       - Scroll page ('scroll top', 'scroll bottom', 'scroll projects')
    search / palette      - Open command palette search modal
    sidebar               - Toggle mobile navigation drawer

  [SESSION]
    clear                 - Clear terminal buffer
    reset                 - Reset terminal to default configuration
    copy                  - Copy terminal buffer to clipboard
    history               - View session command history
    help                  - Show this manual`,
  },
];

const README_CONTENT = `# 0xraiven // r41n
--------------------------------------------------
Offensive Security • Red Team • Cloud Security
Specialized in adversary simulation, Active Directory labs,
cloud security architecture, and custom tooling development.

[+] DIRECTORY STRUCTURE:
    projects/   :: Offensive tools, security scripts & automation
    writeups/   :: CTF walkthroughs, vuln research & lab analyses
    notes/      :: Red team tradecraft, methodology & cheat sheets
    research/   :: Deep dive threat analysis & security architecture

[+] QUICK CONTROLS:
    • Type 'cd <section>' or 'goto <page>' to navigate
    • Type 'theme <dark|light|system|toggle>' to change page theme
    • Type 'scroll <top|bottom|section>' to control page scroll
    • Type 'help' for full operational command reference`;

const AUTOCOMPLETE_LIST = [
  "help",
  "cat /etc/profile/r41n.conf",
  "cat /etc/profile",
  "cat /etc/security/tools.conf",
  "cat /etc/tools",
  "cat README.md",
  "cat r41n.conf",
  "cat tools.conf",
  "neofetch",
  "tools",
  "whoami",
  "theme dark",
  "theme light",
  "theme system",
  "theme toggle",
  "scroll top",
  "scroll bottom",
  "scroll projects",
  "scroll profile",
  "scroll index",
  "scroll philosophy",
  "cd projects",
  "cd writeups",
  "cd notes",
  "cd research",
  "cd about",
  "cd contact",
  "cd resume",
  "cd ~",
  "goto projects",
  "goto writeups",
  "goto notes",
  "goto research",
  "goto about",
  "goto contact",
  "goto resume",
  "goto home",
  "ls",
  "ls projects",
  "ls writeups",
  "ls notes",
  "ls research",
  "history",
  "palette",
  "search",
  "sidebar",
  "socials",
  "clear",
  "reset",
  "copy",
];

function FormattedOutputLine({ line, isLight }: { line: string; isLight: boolean }) {
  if (line.trim().startsWith("#")) {
    return (
      <span
        className={`italic font-mono ${
          isLight ? "text-[#70646b]" : "text-[#8a8388]"
        }`}
      >
        {line}
      </span>
    );
  }

  if (line.includes("::")) {
    const parts = line.split("::");
    const key = parts[0];
    const val = parts.slice(1).join("::");
    return (
      <span className="font-mono">
        <span
          className={`font-bold ${
            isLight ? "text-[#120e10]" : "text-[#f2eeea]"
          }`}
        >
          {key}
        </span>
        <span className="text-accent font-bold select-none">::</span>
        <span className={isLight ? "text-[#3b3237]" : "text-[#9b949a]"}>
          {val}
        </span>
      </span>
    );
  }

  if (line.trim().startsWith("[+]")) {
    const content = line.replace("[+]", "");
    return (
      <span className="font-mono">
        <span
          className={`font-bold select-none ${
            isLight ? "text-emerald-700" : "text-emerald-400"
          }`}
        >
          [+]
        </span>
        <span
          className={`font-medium ${
            isLight ? "text-[#120e10]" : "text-[#f2eeea]"
          }`}
        >
          {content}
        </span>
      </span>
    );
  }

  if (line.trim().startsWith("[-]")) {
    return (
      <span className="font-mono">
        <span className="text-accent font-bold select-none">[-]</span>
        <span className={isLight ? "text-[#3b3237]" : "text-[#9b949a]"}>
          {line.replace("[-]", "")}
        </span>
      </span>
    );
  }

  if (line.trim().startsWith("[!]")) {
    return (
      <span className="font-mono">
        <span
          className={`font-bold select-none ${
            isLight ? "text-rose-700" : "text-rose-400"
          }`}
        >
          [!]
        </span>
        <span
          className={`font-medium ${
            isLight ? "text-rose-800" : "text-rose-300"
          }`}
        >
          {line.replace("[!]", "")}
        </span>
      </span>
    );
  }

  if (line.startsWith("drwx")) {
    const parts = line.split(/\s+/);
    const dirName = parts[parts.length - 1];
    const prefix = line.substring(0, line.lastIndexOf(dirName));
    return (
      <span className="font-mono">
        <span className={isLight ? "text-[#70646b]" : "text-[#8a8388]"}>
          {prefix}
        </span>
        <span className="text-accent font-semibold">{dirName}</span>
      </span>
    );
  }

  if (line.startsWith("-rw-")) {
    const parts = line.split(/\s+/);
    const fileName = parts[parts.length - 1];
    const prefix = line.substring(0, line.lastIndexOf(fileName));
    return (
      <span className="font-mono">
        <span className={isLight ? "text-[#70646b]" : "text-[#8a8388]"}>
          {prefix}
        </span>
        <span
          className={`font-medium ${
            isLight ? "text-[#120e10]" : "text-[#f2eeea]"
          }`}
        >
          {fileName}
        </span>
      </span>
    );
  }

  // Detect and format URLs
  if (line.includes("https://") || line.includes("http://")) {
    const tokens = line.split(/(https?:\/\/[^\s]+)/g);
    return (
      <span
        className={`font-mono ${
          isLight ? "text-[#3b3237]" : "text-[#9b949a]"
        }`}
      >
        {tokens.map((token, i) =>
          token.startsWith("http") ? (
            <a
              key={i}
              href={token}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              {token}
            </a>
          ) : (
            <span key={i}>{token}</span>
          )
        )}
      </span>
    );
  }

  return (
    <span
      className={`font-mono ${
        isLight ? "text-[#3b3237]" : "text-[#c2bdc2]"
      }`}
    >
      {line}
    </span>
  );
}

export function TerminalBlock({
  title = "r41n.conf — /etc/profile",
  commands,
  presets,
  interactive = false,
  className = "",
}: TerminalBlockProps) {
  const router = useRouter();
  const { theme, resolvedTheme, setTheme, openCommandPalette, toggleMobileSidebar } =
    useUI();

  // Directly check whether light theme is currently active
  const isLight = resolvedTheme === "light";

  const activePresets = presets || DEFAULT_PRESETS;
  const initialCommandList = commands || [
    {
      cmd: activePresets[0]?.cmd || "cat /etc/profile/r41n.conf",
      output: activePresets[0]?.output || "",
    },
  ];

  const [sessionCommands, setSessionCommands] = useState<TerminalCommand[]>(initialCommandList);
  const [activePreset, setActivePreset] = useState<string>(activePresets[0]?.label || "");
  const [inputVal, setInputVal] = useState("");
  const [copied, setCopied] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const terminalScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleTheme = useCallback(() => {
    const next = isLight ? "dark" : "light";
    setTheme(next);
    return next;
  }, [isLight, setTheme]);

  const handleCopy = useCallback(async () => {
    try {
      const copyText = sessionCommands
        .map((c) => `$ ${c.cmd}\n${c.output || ""}`)
        .join("\n\n");
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  }, [sessionCommands]);

  const executeCommand = useCallback(
    (rawCmd: string) => {
      const cmd = rawCmd.trim();
      if (!cmd) return;

      // Add to command history
      setHistory((prev) => [...prev, cmd]);
      setHistoryIndex(-1);

      const lower = cmd.toLowerCase();
      const parts = cmd.split(/\s+/);
      const mainCmd = parts[0]?.toLowerCase() || "";
      const args = parts.slice(1);
      const argStr = args.join(" ").trim();
      const lowerArgStr = argStr.toLowerCase();

      let output = "";

      // 1. CLEAR / CLS
      if (lower === "clear" || lower === "cls") {
        setSessionCommands([]);
        setActivePreset("");
        return;
      }

      // 2. RESET
      if (lower === "reset") {
        setActivePreset(activePresets[0]?.label || "");
        setSessionCommands([
          {
            cmd: activePresets[0]?.cmd || "cat /etc/profile/r41n.conf",
            output: activePresets[0]?.output || "",
          },
        ]);
        if (terminalScrollRef.current) {
          terminalScrollRef.current.scrollTop = 0;
        }
        return;
      }

      // 3. THEME CONTROLS (Toggles terminal & page theme)
      else if (mainCmd === "theme") {
        if (lowerArgStr === "dark") {
          setTheme("dark");
          output = `[+] Switched to Dark Mode (Obsidian & Wine Red).`;
        } else if (lowerArgStr === "light") {
          setTheme("light");
          output = `[+] Switched to Light Mode (Vanilla White & Crimson).`;
        } else if (lowerArgStr === "system") {
          setTheme("system");
          output = `[+] Theme set to System preference (OS: ${resolvedTheme}).`;
        } else if (lowerArgStr === "toggle" || lowerArgStr === "cycle" || !argStr) {
          const next = toggleTheme();
          output = `[+] Toggled theme to: ${next.toUpperCase()} MODE.`;
        } else {
          output = `usage: theme <dark | light | system | toggle>`;
        }
        setActivePreset("theme");
      }

      // 5. PAGE NAVIGATION (cd, goto, open)
      else if (mainCmd === "cd" || mainCmd === "goto" || mainCmd === "open" || mainCmd === "nav") {
        if (!argStr || lowerArgStr === "~" || lowerArgStr === "/" || lowerArgStr === ".." || lowerArgStr === "home") {
          output = `[+] Navigating to / (Home)...`;
          router.push("/");
        } else if (lowerArgStr === "projects" || lowerArgStr === "/projects") {
          output = `[+] Navigating to /projects...`;
          router.push("/projects");
        } else if (lowerArgStr === "writeups" || lowerArgStr === "/writeups") {
          output = `[+] Navigating to /writeups...`;
          router.push("/writeups");
        } else if (lowerArgStr === "notes" || lowerArgStr === "/notes") {
          output = `[+] Navigating to /notes...`;
          router.push("/notes");
        } else if (lowerArgStr === "research" || lowerArgStr === "/research") {
          output = `[+] Navigating to /research...`;
          router.push("/research");
        } else if (lowerArgStr === "about" || lowerArgStr === "/about") {
          output = `[+] Navigating to /about...`;
          router.push("/about");
        } else if (lowerArgStr === "contact" || lowerArgStr === "/contact") {
          output = `[+] Navigating to /contact...`;
          router.push("/contact");
        } else if (lowerArgStr === "resume" || lowerArgStr === "/resume") {
          output = `[+] Navigating to /resume...`;
          router.push("/resume");
        } else if (lowerArgStr.includes("r41n.conf") || lowerArgStr.includes("readme")) {
          output = `cd: not a directory: ${argStr} (use 'cat ${argStr}' to view content)`;
        } else {
          output = `cd: no such file or directory: ${argStr}\nType 'ls' to see available directories.`;
        }
        setActivePreset("");
      }

      // 6. PAGE SCROLL CONTROLS
      else if (mainCmd === "scroll") {
        if (typeof window !== "undefined") {
          if (lowerArgStr === "top" || lowerArgStr === "up" || lowerArgStr === "0") {
            window.scrollTo({ top: 0, behavior: "smooth" });
            output = `[+] Smooth scrolled to top of page.`;
          } else if (lowerArgStr === "bottom" || lowerArgStr === "down") {
            window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
            output = `[+] Smooth scrolled to bottom of page.`;
          } else if (lowerArgStr === "profile" || lowerArgStr === "technical-profile") {
            const el = document.getElementById("technical-profile");
            if (el) el.scrollIntoView({ behavior: "smooth" });
            output = `[+] Scrolled to Technical Profile section.`;
          } else if (lowerArgStr === "index" || lowerArgStr === "repository-index") {
            const el = document.getElementById("repository-index");
            if (el) el.scrollIntoView({ behavior: "smooth" });
            output = `[+] Scrolled to Site Index section.`;
          } else if (lowerArgStr === "projects" || lowerArgStr === "featured-projects") {
            const el = document.getElementById("featured-projects");
            if (el) el.scrollIntoView({ behavior: "smooth" });
            output = `[+] Scrolled to Featured Projects section.`;
          } else if (lowerArgStr === "philosophy" || lowerArgStr === "operational-philosophy") {
            const el = document.getElementById("operational-philosophy");
            if (el) el.scrollIntoView({ behavior: "smooth" });
            output = `[+] Scrolled to Operational Philosophy section.`;
          } else {
            output = `usage: scroll <top | bottom | profile | index | projects | philosophy>`;
          }
        }
        setActivePreset("");
      }

      // 7. COMMAND PALETTE & SEARCH
      else if (mainCmd === "search" || mainCmd === "palette" || mainCmd === "cmd") {
        openCommandPalette();
        output = `[+] Opened command palette search.`;
        setActivePreset("");
      }

      // 8. SIDEBAR / MENU
      else if (mainCmd === "sidebar" || mainCmd === "menu") {
        toggleMobileSidebar();
        output = `[+] Toggled mobile navigation drawer.`;
        setActivePreset("");
      }

      // 9. COPY
      else if (mainCmd === "copy" || mainCmd === "clip") {
        handleCopy();
        output = `[+] Terminal session copied to system clipboard.`;
        setActivePreset("");
      }

      // 10. CAT COMMANDS & FILE READING
      else if (mainCmd === "cat") {
        if (!argStr) {
          output = `usage: cat <filename>\nAvailable files: r41n.conf, README.md, /etc/profile, /etc/tools`;
        } else if (
          lowerArgStr.includes("r41n.conf") ||
          lowerArgStr.includes("profile")
        ) {
          const p = activePresets.find((x) => x.label === "r41n.conf");
          output = p ? p.output : DEFAULT_PRESETS[0].output;
          setActivePreset("r41n.conf");
        } else if (
          lowerArgStr.includes("readme") ||
          lowerArgStr.includes("readme.md")
        ) {
          output = README_CONTENT;
          setActivePreset("");
        } else if (
          lowerArgStr.includes("tools") ||
          lowerArgStr.includes("security") ||
          lowerArgStr.includes("arsenal") ||
          lowerArgStr.includes("stack")
        ) {
          const p = activePresets.find((x) => x.label === "tools");
          output = p ? p.output : DEFAULT_PRESETS[2].output;
          setActivePreset("tools");
        } else if (
          lowerArgStr === "projects" ||
          lowerArgStr === "writeups" ||
          lowerArgStr === "notes" ||
          lowerArgStr === "research" ||
          lowerArgStr === "about" ||
          lowerArgStr === "contact"
        ) {
          output = `cat: ${argStr}: Is a directory (use 'ls ${argStr}' or 'cd ${argStr}')`;
        } else {
          output = `cat: ${argStr}: No such file or directory`;
        }
      }

      // 11. DIRECT PRESET ALIASES
      else if (lower === "r41n.conf" || lower === "profile") {
        const p = activePresets.find((x) => x.label === "r41n.conf");
        output = p ? p.output : DEFAULT_PRESETS[0].output;
        setActivePreset("r41n.conf");
      } else if (lower.includes("neofetch") || lower === "sysinfo" || lower === "fetch") {
        output = `  /\\_/\\       r41n@0xraiven
 ( o.o )      ----------------
  > ^ <       OS: Arch Linux x86_64
0xraiven::lab Host: Proxmox VE 8.2 (Homelab)
              Kernel: 6.10.10-hardened
              Uptime: 42d, 13h, 37m
              Shell: zsh 5.9 (x86_64)
              Terminal: alacritty + tmux
              Theme: ${theme} (active: ${resolvedTheme})
              Editor: Neovim (lua)
              Focus: OffSec // Tooling
              Status: Active Research (AD & Cloud)
              Memory: 3.4GiB / 64.0GiB (5%)`;
        setActivePreset("neofetch");
      } else if (
        lower === "tools" ||
        lower === "arsenal" ||
        lower === "stack"
      ) {
        const p = activePresets.find((x) => x.label === "tools" || x.label === "arsenal");
        output = p ? p.output : DEFAULT_PRESETS[2].output;
        setActivePreset("tools");
      } else if (lower === "whoami" || lower === "id") {
        const p = activePresets.find((x) => x.label === "whoami");
        output = p ? p.output : DEFAULT_PRESETS[3].output;
        setActivePreset("whoami");
      }

      // 12. LS / DIR COMMANDS
      else if (mainCmd === "ls" || mainCmd === "dir") {
        if (!argStr || argStr === "." || argStr === "./") {
          output = `drwxr-xr-x  r41n  staff   4096 Oct 10 01:28 projects/
drwxr-xr-x  r41n  staff   4096 Oct 10 01:28 writeups/
drwxr-xr-x  r41n  staff   4096 Oct 10 01:28 notes/
drwxr-xr-x  r41n  staff   4096 Oct 10 01:28 research/
drwxr-xr-x  r41n  staff   4096 Oct 10 01:28 about/
drwxr-xr-x  r41n  staff   4096 Oct 10 01:28 contact/
-rw-r--r--  r41n  staff   1024 Oct 10 01:28 r41n.conf
-rw-r--r--  r41n  staff   2048 Oct 10 01:28 README.md`;
        } else if (lowerArgStr === "projects") {
          output = `drwxr-xr-x  r41n  staff   4096 persisthunt/
drwxr-xr-x  r41n  staff   4096 phishguard/
drwxr-xr-x  r41n  staff   4096 owt-bandit/
drwxr-xr-x  r41n  staff   4096 veil/
drwxr-xr-x  r41n  staff   4096 gameoptimizer/
drwxr-xr-x  r41n  staff   4096 dotfiles/`;
        } else if (lowerArgStr === "writeups") {
          output = `-rw-r--r--  r41n  staff   4096 ssrf-lab.md
-rw-r--r--  r41n  staff   4096 authoring-verification.md`;
        } else if (lowerArgStr === "notes") {
          output = `-rw-r--r--  r41n  staff   4096 linux-persistence-fundamentals.md
-rw-r--r--  r41n  staff   4096 cron-persistence.md
-rw-r--r--  r41n  staff   4096 ssh-persistence.md
-rw-r--r--  r41n  staff   4096 systemd-persistence.md
-rw-r--r--  r41n  staff   4096 suid-sgid.md`;
        } else if (lowerArgStr === "research") {
          output = `drwxr-xr-x  r41n  staff   4096 ad-kerberos-relays/
drwxr-xr-x  r41n  staff   4096 cloud-iam-privesc/`;
        } else {
          output = `ls: cannot access '${argStr}': No such file or directory`;
        }
        setActivePreset("");
      }

      // 11. SESSION & UTILITIES
      else if (lower === "history") {
        output =
          history.length > 0
            ? history.map((h, i) => `  ${i + 1}  ${h}`).join("\n")
            : `  1  ${cmd}`;
        setActivePreset("");
      } else if (lower === "socials" || lower === "contact" || lower === "links") {
        output = `github     :: https://github.com/0xraiven
x/twitter  :: https://x.com/0xraiven
linkedin   :: https://linkedin.com/in/0xraiven
email      :: 0xraiven@proton.me
[+] Tip: Type 'cd contact' or 'goto contact' to open the contact page.`;
        setActivePreset("");
      } else if (lower === "help" || lower === "man" || lower === "?") {
        const p = activePresets.find((x) => x.label === "help");
        output = p ? p.output : DEFAULT_PRESETS[5].output;
        setActivePreset("help");
      } else {
        output = `zsh: command not found: ${cmd}\nType 'help' to see all operational commands.`;
        setActivePreset("");
      }

      setSessionCommands((prev) => [...prev, { cmd, output }]);

      // Auto-scroll terminal to bottom
      setTimeout(() => {
        if (terminalScrollRef.current) {
          terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
        }
      }, 50);
    },
    [
      activePresets,
      handleCopy,
      history,
      openCommandPalette,
      resolvedTheme,
      router,
      setTheme,
      theme,
      toggleMobileSidebar,
      toggleTheme,
    ]
  );

  const handleRunPreset = (preset: TerminalPreset) => {
    executeCommand(preset.cmd);
    if (
      inputRef.current &&
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches
    ) {
      inputRef.current.focus();
    }
  };

  const handleReset = () => {
    setActivePreset(activePresets[0]?.label || "");
    setSessionCommands([
      {
        cmd: activePresets[0]?.cmd || "cat /etc/profile/r41n.conf",
        output: activePresets[0]?.output || "",
      },
    ]);
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = 0;
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    executeCommand(inputVal);
    setInputVal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex =
        historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputVal(history[nextIndex] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (history.length === 0 || historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(-1);
        setInputVal("");
      } else {
        setHistoryIndex(nextIndex);
        setInputVal(history[nextIndex] || "");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const current = inputVal.trim().toLowerCase();
      if (!current) return;
      const match = AUTOCOMPLETE_LIST.find((c) => c.toLowerCase().startsWith(current));
      if (match) {
        setInputVal(match);
      }
    }
  };

  return (
    <div
      className={`rounded-lg border overflow-hidden text-xs font-mono shadow-xl transition-all duration-200 ${
        isLight
          ? "border-[#d8d0c2] bg-[#ffffff] shadow-neutral-900/8"
          : "border-border bg-surface shadow-black/40"
      } ${className}`}
    >
      {/* Terminal Header Bar */}
      <div
        className={`flex items-center justify-between px-3 py-2 sm:px-3.5 sm:py-2.5 border-b select-none gap-2 min-w-0 transition-colors duration-200 ${
          isLight
            ? "border-[#e0d8ca] bg-[#f2ede4] text-[#120e10]"
            : "border-border bg-surface-2/90 text-text-primary"
        }`}
      >
        {/* Left: Window Controls + Path Title */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <span
              onClick={handleReset}
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f56]/90 inline-block cursor-pointer hover:opacity-80 transition-opacity"
              title="Reset terminal session"
            />
            <span
              onClick={() => setMinimized((prev) => !prev)}
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e]/90 inline-block cursor-pointer hover:opacity-80 transition-opacity"
              title={minimized ? "Expand terminal" : "Minimize terminal"}
            />
            <span
              onClick={() => {
                if (minimized) setMinimized(false);
                if (inputRef.current) inputRef.current.focus();
              }}
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27c93f]/90 inline-block cursor-pointer hover:opacity-80 transition-opacity"
              title="Focus command input"
            />
          </div>

          <div
            className={`flex items-center gap-1.5 ml-1 sm:ml-1.5 min-w-0 ${
              isLight ? "text-[#4a4046]" : "text-text-secondary"
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-accent shrink-0" />
            <span
              className={`font-semibold tracking-tight truncate text-[11px] sm:text-xs ${
                isLight ? "text-[#120e10]" : "text-text-primary"
              }`}
            >
              {title}
            </span>
          </div>
        </div>

        {/* Right: Telemetry Badges, Theme Toggle + Copy Action */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] shrink-0">
          <div
            className={`hidden sm:flex items-center gap-1.5 ${
              isLight ? "text-[#5a5056]" : "text-text-secondary"
            }`}
          >
            <span
              className={`px-1.5 py-0.5 rounded border text-[9px] uppercase tracking-wider font-semibold ${
                isLight
                  ? "bg-[#ffffff] border-[#d8d0c2] text-[#4a4046]"
                  : "bg-surface border-border text-text-secondary"
              }`}
            >
              TTY1
            </span>
            <span
              className={`px-1.5 py-0.5 rounded border text-[9px] uppercase tracking-wider font-semibold text-accent ${
                isLight
                  ? "bg-[#ffffff] border-[#d8d0c2]"
                  : "bg-surface border-border"
              }`}
            >
              ZSH 5.9
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy terminal buffer"
            className={`flex items-center gap-1 text-[10px] sm:text-[11px] px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded border transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
              isLight
                ? "border-[#d8d0c2] bg-[#ffffff] hover:bg-[#eae4d8] text-[#3e343a] hover:text-[#120e10]"
                : "border-border bg-surface hover:bg-surface-2 text-text-secondary hover:text-text-primary"
            }`}
          >
            {copied ? (
              <>
                <Check
                  className={`w-3 h-3 ${
                    isLight ? "text-emerald-700" : "text-emerald-400"
                  }`}
                />
                <span
                  className={`font-medium ${
                    isLight ? "text-emerald-700" : "text-emerald-400"
                  }`}
                >
                  Copied
                </span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Terminal Viewport (Explicit Light & Dark Canvas) */}
      {!minimized && (
        <div
          ref={terminalScrollRef}
          className={`p-3 sm:p-4 md:p-5 space-y-3 sm:space-y-4 max-h-[380px] sm:max-h-[440px] overflow-y-auto terminal-scrollbar select-text transition-colors duration-200 ${
            isLight
              ? "bg-[#fcfaf5] text-[#120e10]"
              : "bg-[#08090d] text-[#f2eeea]"
          }`}
        >
          {sessionCommands.map((item, idx) => (
            <div key={idx} className="space-y-2">
              {/* Prompt execution line */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-accent font-bold select-none shrink-0 font-mono text-[11px] sm:text-xs">
                  <span className="hidden sm:inline">r41n@0xraiven:~$</span>
                  <span className="sm:hidden">&gt;</span>
                </span>
                <span
                  className={`font-semibold whitespace-pre font-mono text-[11px] sm:text-xs ${
                    isLight ? "text-[#120e10]" : "text-[#f2eeea]"
                  }`}
                >
                  {item.cmd}
                </span>
              </div>

              {/* Formatted output stream */}
              {item.output && (
                <pre
                  className={`whitespace-pre pl-2.5 sm:pl-3.5 leading-relaxed border-l-2 border-accent/50 font-mono text-[11px] sm:text-xs overflow-x-auto terminal-scrollbar py-0.5 ${
                    isLight ? "text-[#3b3237]" : "text-[#a59ea4]"
                  }`}
                >
                  {item.output.split("\n").map((line, lineIdx) => (
                    <div key={lineIdx}>
                      <FormattedOutputLine line={line} isLight={isLight} />
                    </div>
                  ))}
                </pre>
              )}
            </div>
          ))}

          {/* Live Interactive Prompt */}
          {interactive && (
            <form
              onSubmit={handleFormSubmit}
              className="flex items-center gap-1.5 sm:gap-2 pt-1 font-mono text-[11px] sm:text-xs"
            >
              <span className="text-accent font-bold select-none shrink-0">
                <span className="hidden sm:inline">r41n@0xraiven:~$</span>
                <span className="sm:hidden">&gt;</span>
              </span>
              <div className="relative flex-1 flex items-center min-w-0">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="type command (e.g. 'theme light', 'neofetch', 'cd projects', 'help')..."
                  className={`w-full bg-transparent outline-none font-mono text-[11px] sm:text-xs caret-accent ${
                    isLight
                      ? "text-[#120e10] placeholder:text-[#8a7f85]"
                      : "text-[#f2eeea] placeholder:text-[#6a6569]"
                  }`}
                />
              </div>
              <button
                type="submit"
                disabled={!inputVal.trim()}
                aria-label="Run command"
                className={`p-1 rounded border transition-colors shrink-0 disabled:opacity-30 ${
                  isLight
                    ? "bg-[#ffffff] border-[#d8d0c2] text-[#4a4046] hover:text-accent hover:border-accent"
                    : "bg-surface border-border text-text-secondary hover:text-accent hover:border-accent/40"
                }`}
              >
                <CornerDownLeft className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Blinking block cursor when not in interactive mode */}
          {!interactive && (
            <div className="flex items-center gap-1 pt-1 font-mono text-[11px] sm:text-xs">
              <span className="text-accent font-bold select-none shrink-0">
                <span className="hidden sm:inline">r41n@0xraiven:~$</span>
                <span className="sm:hidden">&gt;</span>
              </span>
              <span className="inline-block w-1.5 sm:w-2 h-3 sm:h-3.5 bg-accent animate-pulse" />
            </div>
          )}
        </div>
      )}

      {/* Interactive Quick-Run Preset Bar */}
      {interactive && !minimized && (
        <div
          className={`flex items-center justify-between gap-2 px-2.5 sm:px-4 py-2 border-t text-[11px] font-mono select-none transition-colors duration-200 ${
            isLight
              ? "border-[#e0d8ca] bg-[#f2ede4]"
              : "border-border bg-surface-2/90"
          }`}
        >
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto terminal-scrollbar flex-nowrap sm:flex-wrap flex-1 min-w-0 py-0.5 pr-1">
            <span
              className={`text-[10px] uppercase tracking-wider mr-1 hidden md:inline shrink-0 ${
                isLight ? "text-[#6b6066]" : "text-text-secondary/70"
              }`}
            >
              Quick Run:
            </span>
            {activePresets.map((preset) => {
              const isSelected = activePreset === preset.label;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleRunPreset(preset)}
                  className={`inline-flex items-center gap-1 px-2 py-1 sm:py-0.5 rounded border transition-all shrink-0 text-[10px] sm:text-[11px] touch-manipulation cursor-pointer ${
                    isSelected
                      ? "bg-accent/15 border-accent text-accent font-semibold shadow-xs"
                      : isLight
                      ? "border-[#d8d0c2] bg-[#ffffff] hover:bg-[#e8e2d6] text-[#3e343a] hover:text-[#120e10]"
                      : "border-border bg-surface hover:bg-surface-2 text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <span className="text-accent select-none font-bold text-[9px] sm:text-[10px]">
                    &gt;
                  </span>
                  <span>{preset.label}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleReset}
            title="Reset terminal session"
            aria-label="Reset terminal session"
            className={`flex items-center gap-1 text-[10px] sm:text-[11px] p-1 sm:px-2 rounded border border-transparent transition-colors shrink-0 touch-manipulation cursor-pointer ${
              isLight
                ? "text-[#4a4046] hover:text-accent hover:border-[#d8d0c2] hover:bg-[#ffffff]"
                : "text-text-secondary hover:text-accent hover:border-border hover:bg-surface"
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      )}
    </div>
  );
}
