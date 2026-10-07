import fs from "fs/promises";
import path from "path";
import { getProjects } from "./projects";
import { getArticles } from "./articles";

export interface SearchItem {
  id: string;
  title: string;
  description: string;
  url: string;
  kind: "project" | "writeup" | "note" | "research" | "lab-report" | "page";
  category?: string;
  tags?: string[];
}

const STATIC_PAGES: SearchItem[] = [
  {
    id: "page-readme",
    title: "Home",
    description: "Portfolio overview, background, technical focus areas, and featured projects.",
    url: "/",
    kind: "page",
    category: "home",
    tags: ["profile", "overview", "home"],
  },
  {
    id: "page-projects",
    title: "Projects",
    description: "Open-source security tools, detection systems, personal software, and GitHub repositories.",
    url: "/projects",
    kind: "page",
    category: "projects",
    tags: ["projects", "tools", "repositories"],
  },
  {
    id: "page-writeups",
    title: "Writeups",
    description: "Security writeups, challenge solutions, walkthroughs, and lab notes.",
    url: "/writeups",
    kind: "page",
    category: "writeups",
    tags: ["writeups", "walkthroughs", "security"],
  },
  {
    id: "page-writeups-htb",
    title: "Hack The Box Writeups",
    description: "Hack The Box machine walkthroughs, initial access footholds, and privilege escalation notes across all tiers.",
    url: "/writeups/htb",
    kind: "writeup",
    category: "writeups",
    tags: ["htb", "hackthebox", "machines", "writeups", "ctf"],
  },
  {
    id: "page-notes",
    title: "Notes & Cheatsheets",
    description: "Technical notes, syntax cheat sheets, command references, and practical guides.",
    url: "/notes",
    kind: "page",
    category: "notes",
    tags: ["notes", "cheatsheets", "commands"],
  },
  {
    id: "page-research",
    title: "Security Research",
    description: "Security research, vulnerability analysis, technical papers, and lab experiments.",
    url: "/research",
    kind: "page",
    category: "research",
    tags: ["research", "papers", "labs"],
  },
  {
    id: "page-about",
    title: "About",
    description: "Background, technical focus, homelab infrastructure, and engineering approach.",
    url: "/about",
    kind: "page",
    category: "profile",
    tags: ["bio", "about", "skills"],
  },
  {
    id: "page-resume",
    title: "Resume",
    description: "Resume, technical competencies, skills, and background.",
    url: "/resume",
    kind: "page",
    category: "profile",
    tags: ["resume", "experience", "skills"],
  },
  {
    id: "page-contact",
    title: "Contact",
    description: "Email, social profiles, and communication channels.",
    url: "/contact",
    kind: "page",
    category: "contact",
    tags: ["contact", "socials", "email", "pgp", "discord"],
  },
];

export async function generateSearchIndex(): Promise<SearchItem[]> {
  const items: SearchItem[] = [...STATIC_PAGES];

  // 1. Projects
  try {
    const projects = await getProjects();
    for (const project of projects) {
      items.push({
        id: `project-${project.slug}`,
        title: project.title,
        description: project.description || `Technical project: ${project.title}`,
        url: `/projects/${project.slug}`,
        kind: "project",
        category: project.category,
        tags: project.technologies,
      });
    }
  } catch (error) {
    console.warn("[search-index] Warning reading projects:", error);
  }

  // 2. Articles (writeups, notes, research)
  try {
    const articles = await getArticles();
    for (const article of articles) {
      const section =
        article.kind === "writeup"
          ? "writeups"
          : article.kind === "note"
          ? "notes"
          : "research";

      items.push({
        id: `${article.kind}-${article.slug}`,
        title: article.title,
        description: article.description || `${article.kind}: ${article.title}`,
        url: `/${section}/${article.slug}`,
        kind: article.kind,
        category: article.category,
        tags: article.tags,
      });
    }
  } catch (error) {
    console.warn("[search-index] Warning reading articles:", error);
  }

  // Write index to public/search-index.json
  const publicDir = path.resolve(process.cwd(), "public");
  await fs.mkdir(publicDir, { recursive: true });
  const outputPath = path.join(publicDir, "search-index.json");
  await fs.writeFile(outputPath, JSON.stringify(items, null, 2), "utf-8");

  return items;
}
