import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://arceus.ind.in";
  return ["", "/arceus", "/buy"].map((p) => ({
    url: base + p,
    lastModified: new Date(),
  }));
}