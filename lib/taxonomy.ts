export const ARTICLE_CATEGORY_OPTIONS = [
  { label: "Web Security", value: "web-security" },
  { label: "Linux", value: "linux" },
  { label: "Networking", value: "networking" },
  { label: "Active Directory", value: "active-directory" },
  { label: "Cloud Security", value: "cloud-security" },
  { label: "Detection Engineering", value: "detection-engineering" },
  { label: "Red Team", value: "red-team" },
  { label: "CTF", value: "ctf" },
  { label: "Hack The Box", value: "htb" },
  { label: "HTB Low", value: "htb-low" },
  { label: "HTB Medium", value: "htb-medium" },
  { label: "HTB Hard", value: "htb-hard" },
  { label: "HTB Insane", value: "htb-insane" },
  { label: "Tools", value: "tools" },
] as const;

export type ArticleCategory = (typeof ARTICLE_CATEGORY_OPTIONS)[number]["value"];

export const PROJECT_CATEGORY_OPTIONS = [
  { label: "Red Team Tooling", value: "red-team-tooling" },
  { label: "Browser Security", value: "browser-security" },
  { label: "Detection Engineering", value: "detection-engineering" },
  { label: "Lab Environment", value: "lab-environment" },
  { label: "Cloud Security", value: "cloud-security" },
  { label: "Basic Utility", value: "basic-utility" },
  { label: "Backend Services", value: "backend-services" },
  { label: "GitHub Pages", value: "github-pages" },
  { label: "Profile README", value: "profile-readme" },
  { label: "Assignment Repo", value: "assignment-repo" },
  { label: "Client-side Interface", value: "clientside-interface" },
  { label: "Blockchain Technology", value: "blockchain-technology" },
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORY_OPTIONS)[number]["value"];

export const PROJECT_STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Building", value: "building" },
  { label: "Archived", value: "archived" },
  { label: "Planned", value: "planned" },
] as const;

export type ProjectStatus = (typeof PROJECT_STATUS_OPTIONS)[number]["value"];

export const HTB_DIFFICULTY_OPTIONS = [
  { label: "None / Not HTB", value: "none" },
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "Hard", value: "hard" },
  { label: "Insane", value: "insane" },
] as const;

export type HTBDifficulty = (typeof HTB_DIFFICULTY_OPTIONS)[number]["value"];

export const ARTICLE_KIND_OPTIONS = [
  { label: "Writeup", value: "writeup" },
  { label: "Note", value: "note" },
  { label: "Security Research", value: "research" },
] as const;

export type ArticleKind = (typeof ARTICLE_KIND_OPTIONS)[number]["value"];

