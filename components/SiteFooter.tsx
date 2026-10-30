import Link from "next/link";
import { contactEmail } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white px-5 py-7 text-sm text-slate-600">
      <nav aria-label="Información del sitio" className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-3">
        <Link className="hover:underline" href="/">Ruletator</Link>
        <Link className="hover:underline" href="/como-usar">Cómo usar</Link>
        <Link className="hover:underline" href="/privacidad">Privacidad</Link>
        {contactEmail && <a className="hover:underline" href={`mailto:${contactEmail}`}>Contacto</a>}
      </nav>
    </footer>
  );
}
