import React from "react";
import type { Metadata } from "next";
import { KnowledgeBaseLayout } from "@/components/layout/KnowledgeBaseLayout";
import { ContactClient } from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact",
  description: "Communication channels, social profiles, and email details for 0xraiven.",
};

const RELATED_SECTIONS = [
  { title: "About & Profile", href: "/about", category: "profile" },
  { title: "Resume & Credentials", href: "/resume", category: "profile" },
  { title: "Projects & Tools", href: "/projects", category: "projects" },
  { title: "Hack The Box Writeups", href: "/writeups/htb", category: "writeups" },
];

export default function ContactPage() {
  return (
    <KnowledgeBaseLayout relatedItems={RELATED_SECTIONS}>
      <ContactClient />
    </KnowledgeBaseLayout>
  );
}
