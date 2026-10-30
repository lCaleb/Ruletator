import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteUrl || process.env.VERCEL_ENV === "preview") return [];
  return ["/", "/como-usar", "/privacidad"].map((path) => ({ url: `${siteUrl}${path}` }));
}
