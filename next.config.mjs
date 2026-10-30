const staticExport = process.env.RULETATOR_STATIC_EXPORT === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  poweredByHeader: false,
  ...(staticExport ? { output: "export" } : {}),
  headers: staticExport ? undefined : async function headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }
      ]
    }];
  }
};

export default nextConfig;
