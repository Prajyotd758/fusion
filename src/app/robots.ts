import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/orders"] },
    sitemap: "https://arceus.ind.in/sitemap.xml",
  };
}
