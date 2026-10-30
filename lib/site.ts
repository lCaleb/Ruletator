const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
export const siteUrl = configuredUrl ? new URL(configuredUrl).origin : productionHost ? `https://${productionHost}` : undefined;
export const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? "";
