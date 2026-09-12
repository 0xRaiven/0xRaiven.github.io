import { config, fields, collection, singleton } from "@keystatic/core";
import {
  warningBlock,
  noteBlock,
  tipBlock,
  labBlock,
  findingBlock,
  mitigationBlock,
  terminalBlock,
  fileTreeBlock,
  calloutBlock,
  twoColumnBlock,
} from "./lib/keystatic-blocks";
import {
  ARTICLE_CATEGORY_OPTIONS,
  PROJECT_CATEGORY_OPTIONS,
  PROJECT_STATUS_OPTIONS,
  ARTICLE_KIND_OPTIONS,
  HTB_DIFFICULTY_OPTIONS,
} from "./lib/taxonomy";

const componentBlocks = {
  warning: warningBlock,
  note: noteBlock,
  tip: tipBlock,
  lab: labBlock,
  finding: findingBlock,
  mitigation: mitigationBlock,
  terminal: terminalBlock,
  fileTree: fileTreeBlock,
  callout: calloutBlock,
  twoColumn: twoColumnBlock,
};

function buildArticleCollection(path: "writeups" | "notes" | "research") {
  const defaultKind =
    path === "research" ? "research" : path === "notes" ? "note" : "writeup";

  return collection({
    label: path.charAt(0).toUpperCase() + path.slice(1),
    slugField: "title",
    path: `content/${path}/*/`,
    format: { contentField: "body" },
    schema: {
      title: fields.slug({ name: { label: "Title" } }),
      description: fields.text({ label: "Description", multiline: true }),
      kind: fields.select({
        label: "Kind",
        options: ARTICLE_KIND_OPTIONS,
        defaultValue: defaultKind,
      }),
      category: fields.select({
        label: "Category",
        options: ARTICLE_CATEGORY_OPTIONS,
        defaultValue: "web-security",
      }),
      ...(path === "writeups"
        ? {
            htbDifficulty: fields.select({
              label: "HTB Difficulty",
              description: "Machine difficulty tier (Low, Medium, Hard, Insane) if Hack The Box writeup",
              options: HTB_DIFFICULTY_OPTIONS,
              defaultValue: "none",
            }),
          }
        : {}),
      tags: fields.array(fields.text({ label: "Tag" }), {
        label: "Tags",
        itemLabel: (p) => p.value,
      }),
      date: fields.date({
        label: "Date",
        defaultValue: { kind: "today" },
      }),
      published: fields.checkbox({ label: "Published", defaultValue: false }),
      coverImage: fields.image({
        label: "Cover image",
        directory: `public/images/${path}`,
      }),
      relatedSlugs: fields.array(fields.text({ label: "Slug" }), {
        label: "Related Slugs",
        itemLabel: (p) => p.value,
      }),
      body: fields.document({
        label: "Body",
        formatting: true,
        dividers: true,
        links: true,
        images: { directory: `public/images/${path}` },
        componentBlocks,
      }),
    },
  });
}

export default config({
  storage: { kind: "local" },
  collections: {
    writeups: buildArticleCollection("writeups"),
    notes: buildArticleCollection("notes"),
    research: buildArticleCollection("research"),
    projects: collection({
      label: "Projects",
      slugField: "title",
      path: "content/projects/*/",
      format: { contentField: "body" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        description: fields.text({ label: "Description", multiline: true }),
        status: fields.select({
          label: "Status",
          options: PROJECT_STATUS_OPTIONS,
          defaultValue: "building",
        }),
        category: fields.select({
          label: "Category",
          options: PROJECT_CATEGORY_OPTIONS,
          defaultValue: "red-team-tooling",
        }),
        technologies: fields.array(fields.text({ label: "Technology" }), {
          label: "Technologies",
          itemLabel: (p) => p.value,
        }),
        githubUrl: fields.url({ label: "GitHub URL" }),
        screenshots: fields.array(
          fields.image({
            label: "Screenshot",
            directory: "public/images/projects",
          }),
          {
            label: "Screenshots",
          }
        ),
        relatedWriteupSlugs: fields.array(fields.text({ label: "Slug" }), {
          label: "Related Writeup Slugs",
          itemLabel: (p) => p.value,
        }),
        body: fields.document({
          label: "Body",
          formatting: true,
          dividers: true,
          links: true,
          images: { directory: "public/images/projects" },
          componentBlocks,
        }),
      },
    }),
  },
  singletons: {
    siteSettings: singleton({
      label: "Site Settings",
      path: "content/site-settings/",
      format: { data: "json" },
      schema: {
        siteTitle: fields.text({
          label: "Site Title",
          defaultValue: "r41n • Security Knowledge Base",
        }),
        siteDescription: fields.text({
          label: "Site Description",
          multiline: true,
        }),
        githubUrl: fields.url({ label: "GitHub URL" }),
        xUrl: fields.url({ label: "X (formerly Twitter) URL" }),
        ogImage: fields.image({
          label: "Default OG Image",
          directory: "public/images/og",
        }),
      },
    }),
    homepage: singleton({
      label: "Homepage",
      path: "content/homepage/",
      format: { data: "json" },
      schema: {
        name: fields.text({ label: "Handle", defaultValue: "r41n" }),
        tagline: fields.text({
          label: "Tagline",
          defaultValue: "Offensive Security • Red Team • Cloud Security",
        }),
        profileImage: fields.image({
          label: "Profile Image",
          directory: "public/images",
        }),
        profileTerminal: fields.array(
          fields.object({
            command: fields.text({ label: "Command" }),
            output: fields.text({ label: "Output", multiline: true }),
          }),
          {
            label: "Profile Terminal Lines",
            itemLabel: (p) => p.fields.command.value || "Command",
          }
        ),
        intro: fields.document({
          label: "Intro",
          formatting: true,
          links: true,
        }),
      },
    }),
    about: singleton({
      label: "About",
      path: "content/about/",
      format: { data: "json" },
      schema: {
        body: fields.document({
          label: "Body",
          formatting: true,
          dividers: true,
          links: true,
          images: true,
          componentBlocks,
        }),
      },
    }),
    resume: singleton({
      label: "Resume",
      path: "content/resume/",
      format: { data: "json" },
      schema: {
        pdfFile: fields.file({
          label: "Resume PDF",
          directory: "public/resume",
          publicPath: "/resume",
        }),
        summary: fields.document({
          label: "Summary",
          formatting: true,
          links: true,
        }),
      },
    }),
  },
});
