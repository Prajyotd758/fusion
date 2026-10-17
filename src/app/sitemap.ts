import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://arceus.ind.in";
  const routes = ["", "/buy", "/arceus" , "/orders"]; // replace with your real routes
  return routes.map((p) => ({
    url: base + p,
    lastModified: new Date(),
  }));
}