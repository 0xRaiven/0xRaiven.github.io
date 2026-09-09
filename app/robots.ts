import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://0xraiven.github.io";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/keystatic/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}