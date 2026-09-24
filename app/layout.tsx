import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ruletator",
  description: "Ruleta configurable con SVG, TypeScript y localStorage."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
