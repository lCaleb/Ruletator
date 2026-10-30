import type { Metadata } from "next";
import { AdProvider } from "@/components/AdProvider";
import { SiteFooter } from "@/components/SiteFooter";
import { adsenseClient } from "@/lib/ads";
import { siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: { default: "Ruletator | Ruleta de nombres online", template: "%s | Ruletator" },
  description: "Crea tu ruleta de nombres, añade participantes y gira para elegir. Una herramienta online para juegos, clases y decisiones cotidianas.",
  openGraph: {
    title: "Ruletator | Ruleta de nombres online",
    description: "Añade tus participantes, gira la ruleta y descubre el resultado.",
    locale: "es_CO", type: "website", siteName: "Ruletator"
  },
  ...(adsenseClient ? { other: { "google-adsense-account": adsenseClient } } : {})
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body><AdProvider>{children}</AdProvider><SiteFooter /></body>
    </html>
  );
}
