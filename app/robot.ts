import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: "/",
      },
      {
        userAgent: "Googlebot-Image",
        allow: "/",
      },
      {
        userAgent: "Bingbot",
        allow: "/",
      },
      {
        userAgent: "Slurp",
        allow: "/",
      },
      {
        userAgent: "DuckDuckBot",
        allow: "/",
      },
      {
        userAgent: "Yandex",
        allow: "/",
      },
      {
        userAgent: "Baiduspider",
        allow: "/",
      },
      // Training crawlers — blocked so future model training doesn't
      // scrape the site for free. Doesn't affect normal Google search
      // ranking (Googlebot above is separate and already allowed).
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        // CHANGED: allow: "/" — Google-Extended specifically controls
        // whether this site can surface in Google AI Overviews /
        // Gemini answers. Blocking it opts the site out of AI Overviews
        // citations, not just Gemini training. Allowed here for
        // visibility in AI Overviews search results.
        userAgent: "Google-Extended",
        allow: "/",
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
      {
        userAgent: "Bytespider",
        disallow: "/",
      },
      {
        userAgent: "Applebot-Extended",
        disallow: "/",
      },
      {
        userAgent: "Meta-ExternalAgent",
        disallow: "/",
      },
      {
        userAgent: "FacebookBot",
        disallow: "/",
      },
      {
        userAgent: "Diffbot",
        disallow: "/",
      },
      {
        userAgent: "cohere-ai",
        disallow: "/",
      },
      {
        userAgent: "Omgilibot",
        disallow: "/",
      },
      {
        userAgent: "Timpibot",
        disallow: "/",
      },
      {
        userAgent: "ImagesiftBot",
        disallow: "/",
      },
      // Live browsing / citation crawlers — these fetch pages in
      // response to a real user question and can cite the site in
      // their answers. Kept allowed for AI-answer visibility.
      {
        userAgent: "ChatGPT-User",
        allow: "/",
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
      },
      {
        userAgent: "Perplexity-User",
        allow: "/",
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
      },
      {
        userAgent: "Claude-User",
        allow: "/",
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
      },
      {
        userAgent: "Amazonbot",
        allow: "/",
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/data/",
          "/*?*utm_",
          "/*?*fbclid",
        ],
      },
    ],
    sitemap: "https://indianyoga.aymyogaschool.com/sitemap.xml",
  };
}