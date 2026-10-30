// Public environment values are embedded at build time; redeploy after changes.
const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() ?? "";
export const adsenseClient = /^ca-pub-\d{16}$/.test(client) ? client : "";
export const adsEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true" && Boolean(adsenseClient);
// Demo creatives are local artwork. Real AdSense always takes precedence.
export const demoAdsEnabled = !adsEnabled && process.env.NEXT_PUBLIC_DEMO_ADS !== "false";
export const adSlots = {
  sidebarTop: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR_TOP?.trim() ?? "",
  sidebarBottom: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR_BOTTOM?.trim() ?? "",
  panelTop: process.env.NEXT_PUBLIC_ADSENSE_SLOT_PANEL_TOP?.trim() ?? "",
  panelBottom: process.env.NEXT_PUBLIC_ADSENSE_SLOT_PANEL_BOTTOM?.trim() ?? ""
};
export function isAdSlotConfigured(slot: string) {
  return adsEnabled && /^\d+$/.test(slot);
}
