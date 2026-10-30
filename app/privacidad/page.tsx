import type { Metadata } from "next";
import Link from "next/link";
import { adsEnabled, demoAdsEnabled } from "@/lib/ads";
import { contactEmail } from "@/lib/site";

export const metadata: Metadata = { title: "Privacidad" };

export default function PrivacyPage() {
  return (
    <main className="mx-auto min-h-[75vh] max-w-3xl space-y-6 px-5 py-12 leading-7 text-slate-800">
      <Link className="text-blue-700 hover:underline" href="/">← Volver a la ruleta</Link>
      <h1 className="text-3xl font-bold">Privacidad</h1>
      <h2 className="text-xl font-bold">Información de la ruleta</h2>
      <p>Los participantes, la configuración y los resultados se guardan en el almacenamiento local de tu navegador. La aplicación no envía esa lista a un servidor propio. No necesitas crear una cuenta para usar la ruleta.</p>
      <p>Puedes borrar esta información desde los controles del sitio o eliminando los datos de Ruletator en la configuración de tu navegador. El almacenamiento local permanece en ese navegador hasta que lo elimines.</p>
      <h2 className="text-xl font-bold">Alojamiento</h2>
      <p>Al visitar la web, el proveedor de alojamiento procesa los datos técnicos necesarios para entregarla, como la dirección IP y las solicitudes de páginas. Consulta la <a className="text-blue-700 underline" href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">política de privacidad de Cloudflare</a>.</p>
      <h2 className="text-xl font-bold">Publicidad</h2>
      {adsEnabled ? (
        <>
          <p>Este sitio utiliza Google AdSense. Google y sus colaboradores pueden utilizar cookies, direcciones IP e identificadores para servir y medir anuncios, y, según el consentimiento y la región del visitante, personalizarlos.</p>
          <p>Puedes gestionar las opciones disponibles en el mensaje de privacidad de Google que se muestra donde corresponde y consultar <a className="text-blue-700 underline" href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">cómo usa Google los datos de los sitios asociados</a> y los controles de <a className="text-blue-700 underline" href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer">Mi centro de anuncios</a>.</p>
        </>
      ) : <p>La publicidad de terceros está desactivada en esta versión. {demoAdsEnabled ? "Los banners son campañas ficticias de demostración, dibujadas dentro de la aplicación. " : "Los espacios están reservados para publicidad. "}No se cargan anuncios ni código publicitario de Google.</p>}
      {contactEmail && <><h2 className="text-xl font-bold">Contacto</h2><p>Para consultas sobre privacidad: <a className="text-blue-700 underline" href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p></>}
    </main>
  );
}
