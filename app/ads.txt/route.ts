import { adsenseClient } from "@/lib/ads";
export const dynamic = "force-static";
export function GET() {
  const body = adsenseClient
    ? `google.com, ${adsenseClient.replace("ca-pub-", "pub-")}, DIRECT, f08c47fec0942fa0\n`
    : "# No hay vendedores publicitarios autorizados configurados.\n";
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
