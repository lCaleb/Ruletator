import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Cómo usar la ruleta" };

export default function HowToPage() {
  return (
    <main className="mx-auto min-h-[75vh] max-w-3xl space-y-7 px-5 py-12 text-slate-800">
      <Link className="text-blue-700 hover:underline" href="/">← Volver a la ruleta</Link>
      <h1 className="text-3xl font-bold">Cómo usar Ruletator</h1>
      <p className="leading-7">Ruletator te ayuda a elegir entre nombres, actividades o ideas. Puedes usarlo para repartir turnos en una clase, elegir un juego o decidir qué hacer con tus amigos.</p>
      <ol className="list-decimal space-y-4 pl-6 leading-7">
        <li>Escribe las opciones en el panel de participantes, una por línea.</li>
        <li>Cambia el título para identificar tu actividad.</li>
        <li>Pulsa Girar o toca la rueda y espera a que se detenga.</li>
        <li>Consulta el resultado. Puedes quitar al participante elegido antes del siguiente giro.</li>
      </ol>
      <h2 className="text-xl font-bold">Tus opciones se guardan en este navegador</h2>
      <p className="leading-7">Al volver desde el mismo navegador, puedes continuar con tu lista y configuración. Para empezar de nuevo, usa los controles de restablecer del panel de participantes. Si borras los datos del sitio en tu navegador, también se elimina la información guardada.</p>
      <h2 className="text-xl font-bold">Ideas para aprovechar la ruleta</h2>
      <p className="leading-7">Añade los nombres de un grupo para asignar turnos, escribe temas para una actividad creativa o crea una lista de retos para una reunión. Revisa la lista antes de girar: las entradas repetidas cuentan como opciones separadas.</p>
      <Link className="inline-block rounded bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-500" href="/">Crear mi ruleta</Link>
    </main>
  );
}
